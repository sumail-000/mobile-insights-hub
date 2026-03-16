from flask import Flask, render_template, jsonify, request, redirect, url_for, Response
from scraper import GSMArenaScraper
from brand_scanner import BrandScanner
import threading
import json
import os
import csv
from loguru import logger
from typing import Dict, List
from urllib.parse import urlparse
import db

app = Flask(__name__, static_folder='static', template_folder='templates')
scraper = GSMArenaScraper()
brand_scanner = BrandScanner()

# ── In-memory scrape state ───────────────────────────────────────────────────
scrape_status = {
    'running': False,
    'message': 'Idle',
    'progress': 0,
    'total': 0,
    'done': 0,
    'current': '',
    'errors': [],
}


# ── DB-first data helpers (fall back to CSV if DB unavailable) ──────────────

def _db_read_brands() -> List[Dict]:
    """Read brands from MySQL with live device count."""
    conn = db.get_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT b.name, b.gsmarena_url AS url,
                   COUNT(d.id) AS device_count
            FROM brands b
            LEFT JOIN devices d ON d.brand_id = b.id
            GROUP BY b.id, b.name, b.gsmarena_url
            ORDER BY b.name
        """)
        rows = cur.fetchall()
        cur.close()
        return rows
    except Exception as e:
        logger.warning(f"_db_read_brands failed: {e}")
        return []
    finally:
        conn.close()


def _db_read_devices(brand_name: str) -> List[Dict]:
    """Read devices for a brand from MySQL."""
    conn = db.get_connection()
    if not conn:
        return []
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT d.name AS device_name, d.gsmarena_url AS device_url,
                   d.thumbnail_url AS device_image, d.summary,
                   b.name AS brand_name
            FROM devices d
            JOIN brands b ON b.id = d.brand_id
            WHERE b.name = %s
            ORDER BY d.name
        """, (brand_name,))
        rows = cur.fetchall()
        cur.close()
        return rows
    except Exception as e:
        logger.warning(f"_db_read_devices failed: {e}")
        return []
    finally:
        conn.close()


def _db_read_specs(device_url: str) -> Dict:
    """Load full specs JSON for a device from MySQL."""
    conn = db.get_connection()
    if not conn:
        return {}
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT ds.full_specs_json,
                   GROUP_CONCAT(dp.url ORDER BY dp.position SEPARATOR '|||') AS pic_urls
            FROM devices d
            JOIN device_specs ds ON ds.device_id = d.id
            LEFT JOIN device_pictures dp ON dp.device_id = d.id
            WHERE d.gsmarena_url = %s
            GROUP BY ds.id
        """, (device_url,))
        row = cur.fetchone()
        cur.close()
        if not row:
            return {}
        specs = json.loads(row['full_specs_json'] or '{}')
        # Merge pictures from the pictures table (authoritative)
        if row['pic_urls']:
            specs['pictures'] = [u for u in row['pic_urls'].split('|||') if u]
        return specs
    except Exception as e:
        logger.warning(f"_db_read_specs failed: {e}")
        return {}
    finally:
        conn.close()


def _db_scraped_counts() -> Dict:
    """Return brand_name -> device_count from MySQL."""
    conn = db.get_connection()
    if not conn:
        return {}
    try:
        cur = conn.cursor()
        cur.execute("SELECT name, device_count FROM brands")
        result = {row[0]: row[1] for row in cur.fetchall()}
        cur.close()
        return result
    except Exception as e:
        logger.warning(f"_db_scraped_counts failed: {e}")
        return {}
    finally:
        conn.close()


# ── CSV fallbacks ─────────────────────────────────────────────────────────────

def _csv_read_brands() -> List[Dict]:
    brands: Dict[str, Dict] = {}
    path = scraper.brands_file
    if not os.path.exists(path):
        return []
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            name = row.get('brand_name', '')
            if name and name not in brands:
                brands[name] = {'name': name, 'device_count': 0, 'url': row.get('brand_url', '')}
            if name:
                brands[name]['device_count'] += 1
    return sorted(brands.values(), key=lambda x: x['name'])


def _csv_read_devices(brand_name: str) -> List[Dict]:
    path = scraper.brands_file
    if not os.path.exists(path):
        return []
    devices = []
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row.get('brand_name') != brand_name:
                continue
            devices.append(row)
    return devices


def _csv_read_specs(device_url: str) -> Dict:
    path = scraper.specs_file
    if not os.path.exists(path):
        return {}
    with open(path, newline='', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            if row.get('device_url') == device_url:
                try:
                    return json.loads(row.get('full_specs_json', '{}'))
                except Exception:
                    return row
    return {}


# ── Unified accessors (DB first, CSV fallback) ────────────────────────────────

def _read_csv_brands() -> List[Dict]:
    rows = _db_read_brands()
    return rows if rows else _csv_read_brands()


def _read_csv_devices(brand_name: str) -> List[Dict]:
    rows = _db_read_devices(brand_name)
    return rows if rows else _csv_read_devices(brand_name)


def _read_specs(device_url: str) -> Dict:
    specs = _db_read_specs(device_url)
    return specs if specs else _csv_read_specs(device_url)


# ── Routes ───────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    """Scraper control panel."""
    return render_template('index.html')

@app.route('/brands')
def brands_page():
    """Preview page — all scraped brands with device counts."""
    brands = _db_read_brands()
    data_source = 'MySQL'
    if not brands:
        brands = _csv_read_brands()
        data_source = 'CSV'
    if not brands:
        try:
            cached = brand_scanner.load_brands_from_cache()
            if cached:
                brands = cached
                data_source = 'Cache'
        except Exception:
            pass
    return render_template('brands.html', brands=brands,
                           has_data=bool(brands),
                           data_source=data_source,
                           brands_file=scraper.brands_file)


@app.route('/brand')
def brand_devices():
    """Preview all devices for a brand. Uses ?name= query param to safely handle & in brand names."""
    brand_name = request.args.get('name', '').strip()
    if not brand_name:
        return redirect(url_for('brands_page'))
    devices = _db_read_devices(brand_name)
    data_source = 'MySQL'
    if not devices:
        devices = _csv_read_devices(brand_name)
        data_source = 'CSV'
    return render_template('brands.html', brands=None, devices=devices,
                           brand_name=brand_name, has_data=True,
                           data_source=data_source,
                           brands_file=scraper.brands_file)


@app.route('/device')
def device_page():
    """Preview full specs for a single device. Pass ?url=<gsmarena_url>"""
    device_url = request.args.get('url', '').strip()
    specs = {}
    error = None
    if device_url:
        # Try CSV first
        specs = _read_specs(device_url)
        if not specs:
            # Live scrape
            try:
                specs = scraper.get_device_specs(device_url) or {}
            except Exception as e:
                error = str(e)
    return render_template('device.html', specs=specs, url=device_url, error=error)


@app.route('/api/scan-brands')
def api_scan_brands():
    """Fetch brand list from GSMArena and cache it."""
    try:
        brands = brand_scanner.scan_brands()
        return jsonify({'status': 'ok', 'count': len(brands), 'brands': brands})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/scrape-brand', methods=['POST'])
def api_scrape_brand():
    """Start background scrape for a single brand. POST {url, name}"""
    data = request.get_json() or {}
    brand_url = data.get('url', '').strip()
    brand_name = data.get('name', '').strip()
    if not brand_url or not brand_name:
        return jsonify({'status': 'error', 'message': 'url and name required'}), 400

    def _worker():
        global scrape_status
        scrape_status.update({'running': True, 'message': f'Scraping {brand_name}...', 'done': 0, 'errors': []})
        try:
            devices = scraper.get_devices_from_brand(brand_url)
            scrape_status['total'] = len(devices)
            # Save full device list first so device_count is correct
            scraper.save_devices_to_csv(brand_name, devices, brand_url=brand_url)
            conn = db.get_connection()
            for i, device in enumerate(devices, 1):
                scrape_status.update({'current': device['name'], 'done': i,
                                      'message': f'[{i}/{len(devices)}] {device["name"]}',
                                      'progress': int(i / len(devices) * 100)})
                specs = scraper.get_device_specs(device['url'])
                if specs:
                    scraper.save_specs_to_csv(specs, db_conn=conn)
            if conn:
                conn.close()
        except Exception as e:
            scrape_status['errors'].append(str(e))
            logger.error(f"Scrape error: {e}")
        finally:
            scrape_status.update({'running': False, 'message': 'Done', 'progress': 100})

    t = threading.Thread(target=_worker, daemon=True)
    t.start()
    return jsonify({'status': 'started', 'brand': brand_name})


@app.route('/api/status')
def api_status():
    """Live scrape progress."""
    return jsonify(scrape_status)


@app.route('/api/scraped-counts')
def api_scraped_counts():
    """Return dict of brand_name -> device count. DB first, CSV fallback."""
    counts = _db_scraped_counts()
    if not counts:
        # CSV fallback
        path = scraper.brands_file
        if os.path.exists(path):
            with open(path, newline='', encoding='utf-8') as f:
                for row in csv.DictReader(f):
                    name = row.get('brand_name', '')
                    if name:
                        counts[name] = counts.get(name, 0) + 1
    return jsonify({'counts': counts})


@app.route('/img')
def proxy_image():
    """Proxy GSMArena images to bypass hotlink protection.
    Usage: /img?url=https://fdn2.gsmarena.com/vv/bigpic/...
    """
    img_url = request.args.get('url', '').strip()
    if not img_url:
        return '', 400
    # Only allow gsmarena CDN domains
    parsed = urlparse(img_url)
    if not parsed.hostname or not parsed.hostname.endswith('gsmarena.com'):
        return 'Forbidden', 403
    try:
        import requests as _req
        resp = _req.get(img_url, headers={
            **scraper.headers,
            'Referer': 'https://www.gsmarena.com/',
        }, timeout=10)
        resp.raise_for_status()
        content_type = resp.headers.get('Content-Type', 'image/jpeg')
        return Response(resp.content, status=200, content_type=content_type)
    except Exception as e:
        logger.warning(f"Image proxy failed for {img_url}: {e}")
        return '', 502


@app.route('/api/db-status')
def api_db_status():
    """Check MySQL connection and return table row counts."""
    conn = db.get_connection()
    if not conn:
        return jsonify({'connected': False, 'message': 'Cannot connect to MySQL — check XAMPP and db.py config'})
    try:
        cur = conn.cursor()
        counts = {}
        for table in ('brands', 'devices', 'device_specs', 'device_pictures'):
            cur.execute(f"SELECT COUNT(*) FROM {table}")
            counts[table] = cur.fetchone()[0]
        cur.close()
        return jsonify({'connected': True, 'counts': counts})
    except Exception as e:
        return jsonify({'connected': False, 'message': str(e)})
    finally:
        conn.close()


@app.route('/api/clear-cache', methods=['POST'])
def api_clear_cache():
    try:
        if os.path.exists(brand_scanner.cache_file):
            os.remove(brand_scanner.cache_file)
        return jsonify({'status': 'ok'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000, use_reloader=False)
