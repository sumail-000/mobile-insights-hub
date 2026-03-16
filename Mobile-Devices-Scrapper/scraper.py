import requests
from bs4 import BeautifulSoup
import csv
from loguru import logger
import time
import json
import re
from typing import Dict, List, Optional
import os
import db


class GSMArenaScraper:
    def __init__(self):
        self.base_url = "https://www.gsmarena.com/"
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate",
            "Connection": "keep-alive",
        }
        self.brands_file = 'brands_devices.csv'
        self.specs_file = 'device_specifications.csv'
        self.last_request_time = 0
        self.min_request_interval = 3
        self.max_retries = 3
        logger.add("debug.log", rotation="100 MB", level="INFO", enqueue=True)

    def _make_request(self, url: str) -> Optional[requests.Response]:
        """Rate-limited request with retry and backoff."""
        for attempt in range(self.max_retries):
            elapsed = time.time() - self.last_request_time
            if elapsed < self.min_request_interval:
                time.sleep(self.min_request_interval - elapsed)
            try:
                resp = requests.get(url, headers=self.headers, timeout=15)
                self.last_request_time = time.time()
                if resp.status_code == 429:
                    wait = int(resp.headers.get('Retry-After', self.min_request_interval * (attempt + 2)))
                    logger.warning(f"Rate limited — waiting {wait}s (attempt {attempt+1})")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                return resp
            except requests.RequestException as e:
                wait = self.min_request_interval * (attempt + 1)
                logger.warning(f"Request failed: {e} — retry in {wait}s")
                time.sleep(wait)
        logger.error(f"Failed after {self.max_retries} retries: {url}")
        return None

    # ── Brands ──────────────────────────────────────────────────────────────

    def get_brands(self) -> List[Dict]:
        """Fetch all brands from GSMArena makers page."""
        resp = self._make_request(f"{self.base_url}makers.php3")
        if not resp:
            return []
        soup = BeautifulSoup(resp.text, 'html.parser')
        brands = []
        # Two possible selectors GSMArena uses
        for a in soup.select('div.st-text a, div.brandmenu-v2 li a'):
            full_text = a.get_text(strip=True)
            brand_name = re.sub(r'\d+.*$', '', full_text).strip()
            href = a.get('href', '')
            if not brand_name or not href:
                continue
            count_match = re.search(r'(\d+)', full_text)
            device_count = int(count_match.group(1)) if count_match else 0
            brands.append({
                'name': brand_name,
                'url': self.base_url + href,
                'device_count': device_count,
            })
        # Deduplicate by URL
        seen = set()
        unique = []
        for b in brands:
            if b['url'] not in seen:
                seen.add(b['url'])
                unique.append(b)
        logger.info(f"Found {len(unique)} brands")
        return sorted(unique, key=lambda x: x['name'])

    # ── Device list per brand ────────────────────────────────────────────────

    def get_devices_from_brand(self, brand_url: str) -> List[Dict]:
        """Get every device listing for a brand, following pagination."""
        devices = []
        current_url = brand_url
        page = 1
        while current_url:
            resp = self._make_request(current_url)
            if not resp:
                break
            soup = BeautifulSoup(resp.text, 'html.parser')
            items = soup.select('div.makers li')
            if not items:
                break
            for item in items:
                a = item.select_one('a')
                img = item.select_one('img')
                span = item.select_one('span')
                if not a:
                    continue
                # Short summary line under the device name (e.g. "6.8" 200MP 5000mAh")
                summary = span.get_text(' ', strip=True) if span else ''
                devices.append({
                    'name': a.get_text(strip=True),
                    'url': self.base_url + a['href'],
                    'image_url': img['src'] if img and img.get('src') else '',
                    'summary': summary,
                })
            # Pagination
            nav = soup.select_one('div.nav-pages')
            next_url = None
            if nav:
                strong = nav.select_one('strong')
                if strong:
                    nxt = strong.find_next_sibling('a')
                    if nxt and nxt.get('href') and nxt['href'] != '#':
                        next_url = self.base_url + nxt['href']
            current_url = next_url
            if next_url:
                page += 1
                time.sleep(1)
        logger.info(f"Brand scraped: {len(devices)} devices across {page} page(s)")
        return devices

    # ── Single device full specs ─────────────────────────────────────────────

    def get_device_specs(self, url: str) -> Optional[Dict]:
        """
        Scrape a full device spec page.
        Returns a structured dict with:
          - name, url, image, pictures[]
          - highlights: display_size, camera, ram, battery, chipset, os
          - popularity (hit %), fans count
          - announced, status (launch info)
          - specs: { Category: { label: value } }  — all tables
          - data_specs: { data-spec attr: value }   — machine-readable keys
        """
        resp = self._make_request(url)
        if not resp:
            return None
        soup = BeautifulSoup(resp.text, 'html.parser')

        result: Dict = {'url': url, 'specs': {}, 'data_specs': {}}

        # ── Name ──
        name_el = soup.select_one('h1.specs-phone-name-title')
        result['name'] = name_el.get_text(strip=True) if name_el else ''

        # ── Main image — extract from HISTORY_ITEM_IMAGE JS variable (most reliable) ──
        image_url = ''
        js_match = re.search(r'HISTORY_ITEM_IMAGE\s*=\s*["\']([^"\']+)["\']', resp.text)
        if js_match:
            image_url = js_match.group(1)
        if not image_url:
            main_img = soup.select_one('div.specs-photo-main img')
            image_url = main_img.get('src', '') if main_img else ''
        if image_url.startswith('//'):
            image_url = 'https:' + image_url
        result['image'] = image_url

        # ── Extra pictures link — build absolute URL in correct GSMArena format ──
        m = re.match(r'^(https?://[^/]+/)(.+?)-([0-9]+)\.php$', url)
        if m:
            result['pictures_url'] = f"{m.group(1)}{m.group(2)}-pictures-{m.group(3)}.php"
        else:
            result['pictures_url'] = ''

        # ── Highlights panel (the small icon boxes at top) ──
        highlights = {}
        for li in soup.select('ul.specs-highlights li, li.help.accented'):
            data_spec = li.select_one('[data-spec]')
            if data_spec:
                key = data_spec.get('data-spec', '').replace('-hl', '')
                val = data_spec.get_text(' ', strip=True)
                highlights[key] = val
        result['highlights'] = highlights

        # ── Popularity & fans ──
        pop_li = soup.select_one('li.help-popularity strong.accent')
        result['popularity'] = pop_li.get_text(strip=True) if pop_li else ''
        hits_span = soup.select_one('li.help-popularity span')
        result['hits'] = hits_span.get_text(strip=True) if hits_span else ''
        fans_el = soup.select_one('li.help-fans strong.accent')
        result['fans'] = fans_el.get_text(strip=True) if fans_el else ''

        # ── Rating ──
        rating_el = soup.select_one('span[itemprop="ratingValue"], div.rating-avg')
        result['rating'] = rating_el.get_text(strip=True) if rating_el else ''

        # ── All spec tables ──
        for table in soup.select('table'):
            th = table.select_one('th')
            if not th:
                continue
            category = th.get_text(strip=True)
            cat_data = {}
            for row in table.select('tr'):
                label_el = row.select_one('td.ttl')
                value_el = row.select_one('td.nfo')
                if not label_el or not value_el:
                    continue
                label = label_el.get_text(strip=True)
                # Clean up value: replace <br> with newline, strip tags
                for br in value_el.find_all('br'):
                    br.replace_with('\n')
                value = value_el.get_text(' ', strip=True)
                # Also capture data-spec machine-readable key
                data_spec_key = value_el.get('data-spec', '')
                if data_spec_key:
                    result['data_specs'][data_spec_key] = value
                if label and label != '\xa0':
                    # Merge multi-row same label
                    if label in cat_data:
                        cat_data[label] += ' | ' + value
                    else:
                        cat_data[label] = value
            if cat_data:
                result['specs'][category] = cat_data

        # ── Convenience flat fields from data_specs ──
        ds = result['data_specs']
        result['announced']    = ds.get('year', '')
        result['status']       = ds.get('status', '')
        result['display_size'] = ds.get('displaysize', '')
        result['display_type'] = ds.get('displaytype', '')
        result['display_res']  = ds.get('displayresolution', '')
        result['os']           = ds.get('os', '')
        result['chipset']      = ds.get('chipset', '')
        result['cpu']          = ds.get('cpu', '')
        result['gpu']          = ds.get('gpu', '')
        result['ram']          = ds.get('internalmemory', '')
        result['main_camera']  = ds.get('cam1modules', '')
        result['selfie_camera']= ds.get('cam2modules', '')
        result['battery']      = ds.get('batdescription1', ds.get('battype', ''))
        result['charging']     = ds.get('charging', '')
        result['network']      = ds.get('nettech', '')
        result['dimensions']   = ds.get('dimensions', '')
        result['weight']       = ds.get('weight', '')
        result['build']        = ds.get('build', '')
        result['sim']          = ds.get('sim', '')
        result['usb']          = ds.get('usb', '')
        result['nfc']          = ds.get('nfc', '')
        result['bluetooth']    = ds.get('bluetooth', '')
        result['wlan']         = ds.get('wlan', '')
        result['sensors']      = ds.get('sensors', '')
        result['colors']       = ds.get('colors', '')

        # ── Pictures gallery ──
        pictures = self.get_device_pictures(url, main_image_url=result['image'])
        # Fallback to main image if gallery is empty
        if not pictures and result['image']:
            pictures = [result['image']]
        result['pictures'] = pictures

        logger.info(f"Scraped: {result['name']} — {len(result['specs'])} spec categories, {len(pictures)} photo(s)")
        return result

    # ── Pictures page ────────────────────────────────────────────────────────

    def get_device_pictures(self, device_url: str, main_image_url: str = '') -> List[str]:
        """Fetch all official gallery images from the device pictures page."""
        m = re.match(r'^(https?://[^/]+/)(.+?)-([0-9]+)\.php$', device_url)
        if m:
            pics_url = f"{m.group(1)}{m.group(2)}-pictures-{m.group(3)}.php"
        else:
            pics_url = device_url.replace('.php', '-pictures.php')

        pictures = []
        resp = self._make_request(pics_url)
        if resp:
            soup = BeautifulSoup(resp.text, 'html.parser')
            for img in soup.select('#pictures-list img'):
                # GSMArena uses jQuery lazy-load: real URL is in data-original
                # Fall back through data-src then src
                src = (img.get('data-original', '') or
                       img.get('data-src', '') or
                       img.get('src', ''))
                if not src:
                    continue
                if src.startswith('//'):
                    src = 'https:' + src
                elif src.startswith('/'):
                    src = 'https://www.gsmarena.com' + src
                # Must be a CDN image URL
                if 'fdn' not in src:
                    continue
                if any(x in src.lower() for x in ['advertisement', 'logo', 'favicon', 'icon']):
                    continue
                if src not in pictures:
                    pictures.append(src)

        # Fallback: generate numbered gallery URLs from the main image slug
        # Main image: https://fdn2.gsmarena.com/vv/bigpic/SLUG--.jpg
        # Gallery:    https://fdn2.gsmarena.com/vv/bigpic/SLUG-00.jpg, -01.jpg ...
        if not pictures and main_image_url:
            clean = re.search(r'fdn2\.gsmarena\.com/vv/bigpic/(.+?)-+\.(jpg|gif)', main_image_url)
            if clean:
                slug = clean.group(1)
                ext  = clean.group(2)
                base = 'https://fdn2.gsmarena.com/vv/bigpic/'
                consecutive_misses = 0
                for i in range(30):
                    candidate = f"{base}{slug}-{i:02d}.{ext}"
                    try:
                        r = requests.head(candidate, headers={
                            'User-Agent': self.headers['User-Agent'],
                            'Referer': 'https://www.gsmarena.com/',
                        }, timeout=5)
                        if r.status_code == 200:
                            pictures.append(candidate)
                            consecutive_misses = 0
                        else:
                            consecutive_misses += 1
                            if consecutive_misses >= 2:
                                break
                    except Exception:
                        consecutive_misses += 1
                        if consecutive_misses >= 2:
                            break
        return pictures

    # ── CSV export ───────────────────────────────────────────────────────────

    def save_brands_to_csv(self, brands: List[Dict]):
        with open(self.brands_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['brand_name', 'device_count', 'brand_url'])
            for b in brands:
                writer.writerow([b['name'], b['device_count'], b['url']])
        logger.info(f"Saved {len(brands)} brands to {self.brands_file}")

    def save_devices_to_csv(self, brand_name: str, devices: List[Dict],
                             brand_url: str = '', db_conn=None):
        # ── CSV ──
        file_exists = os.path.exists(self.brands_file)
        with open(self.brands_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(['brand_name', 'device_name', 'device_url', 'device_image', 'summary'])
            for d in devices:
                writer.writerow([brand_name, d['name'], d['url'], d['image_url'], d.get('summary', '')])
        # ── MySQL ──
        conn = db_conn or db.get_connection()
        if conn:
            brand_id = db.upsert_brand(conn, brand_name, brand_url or '')
            if brand_id:
                for d in devices:
                    db.upsert_device(conn, brand_id, d['name'], d['url'],
                                     d.get('image_url', ''), d.get('summary', ''))
                db.update_brand_device_count(conn, brand_id, len(devices))
            if not db_conn:
                conn.close()

    def save_specs_to_csv(self, specs: Dict, db_conn=None):
        # ── CSV ──
        file_exists = os.path.exists(self.specs_file)
        with open(self.specs_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(['device_url', 'name', 'image', 'announced', 'status',
                                 'display_size', 'chipset', 'ram', 'main_camera',
                                 'battery', 'os', 'popularity', 'fans', 'full_specs_json'])
            writer.writerow([
                specs.get('url', ''),
                specs.get('name', ''),
                specs.get('image', ''),
                specs.get('announced', ''),
                specs.get('status', ''),
                specs.get('display_size', ''),
                specs.get('chipset', ''),
                specs.get('ram', ''),
                specs.get('main_camera', ''),
                specs.get('battery', ''),
                specs.get('os', ''),
                specs.get('popularity', ''),
                specs.get('fans', ''),
                json.dumps(specs, ensure_ascii=False),
            ])
        # ── MySQL ──
        conn = db_conn or db.get_connection()
        if conn:
            device_id = db.get_device_id(conn, specs.get('url', ''))
            if device_id:
                db.upsert_specs(conn, device_id, specs)
                db.upsert_pictures(conn, device_id, specs.get('pictures', []))
            else:
                logger.warning(f"DB: no device row for {specs.get('url')} — specs not stored in DB")
            if not db_conn:
                conn.close()
