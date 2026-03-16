"""
MySQL database helper for Mobile Insights Hub scraper.
Requires: pip install mysql-connector-python
Configure connection via .env or edit DB_CONFIG below.
"""
import json
from typing import Dict, List, Optional
from loguru import logger

try:
    import mysql.connector
    from mysql.connector import Error as MySQLError
    MYSQL_AVAILABLE = True
except ImportError:
    MYSQL_AVAILABLE = False
    logger.warning("mysql-connector-python not installed — DB storage disabled. Run: pip install mysql-connector-python")

# ── Connection config — edit to match your XAMPP setup ───────────────────────
DB_CONFIG = {
    'host':     'localhost',
    'port':     3306,
    'user':     'root',
    'password': '',          # XAMPP default is empty
    'database': 'mobile_insights',
    'charset':  'utf8mb4',
    'autocommit': False,
}


def get_connection():
    """Return a new MySQL connection or None if unavailable."""
    if not MYSQL_AVAILABLE:
        return None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except MySQLError as e:
        logger.error(f"MySQL connection failed: {e}")
        return None


# ── Brand ─────────────────────────────────────────────────────────────────────

def upsert_brand(conn, name: str, gsmarena_url: str) -> Optional[int]:
    """Insert or update a brand, return its id."""
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO brands (name, gsmarena_url)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE gsmarena_url = VALUES(gsmarena_url), id = LAST_INSERT_ID(id)
        """, (name, gsmarena_url))
        conn.commit()
        brand_id = cur.lastrowid
        cur.close()
        return brand_id
    except MySQLError as e:
        logger.error(f"upsert_brand failed for '{name}': {e}")
        conn.rollback()
        return None


def update_brand_device_count(conn, brand_id: int, count: int):
    try:
        cur = conn.cursor()
        cur.execute("UPDATE brands SET device_count=%s WHERE id=%s", (count, brand_id))
        conn.commit()
        cur.close()
    except MySQLError as e:
        logger.error(f"update_brand_device_count failed: {e}")
        conn.rollback()


# ── Device ────────────────────────────────────────────────────────────────────

def upsert_device(conn, brand_id: int, name: str, gsmarena_url: str,
                  thumbnail_url: str = '', summary: str = '') -> Optional[int]:
    """Insert or update a device, return its id."""
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO devices (brand_id, name, gsmarena_url, thumbnail_url, summary)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                name          = VALUES(name),
                thumbnail_url = VALUES(thumbnail_url),
                summary       = VALUES(summary),
                id            = LAST_INSERT_ID(id)
        """, (brand_id, name, gsmarena_url, thumbnail_url or '', summary or ''))
        conn.commit()
        device_id = cur.lastrowid
        cur.close()
        return device_id
    except MySQLError as e:
        logger.error(f"upsert_device failed for '{name}': {e}")
        conn.rollback()
        return None


def get_device_id(conn, gsmarena_url: str) -> Optional[int]:
    """Look up device id by URL."""
    try:
        cur = conn.cursor()
        cur.execute("SELECT id FROM devices WHERE gsmarena_url=%s", (gsmarena_url,))
        row = cur.fetchone()
        cur.close()
        return row[0] if row else None
    except MySQLError as e:
        logger.error(f"get_device_id failed: {e}")
        return None


# ── Specs ─────────────────────────────────────────────────────────────────────

def upsert_specs(conn, device_id: int, specs: Dict):
    """Insert or replace full specs for a device."""
    s = specs
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO device_specs (
                device_id, announced, status, network, os, chipset, cpu, gpu,
                display_size, display_type, display_res, ram, storage,
                main_camera, selfie_camera, battery, charging,
                nfc, usb, bluetooth, wlan, colors, weight, dimensions,
                sim, sensors, popularity, fans, rating, full_specs_json
            ) VALUES (
                %s,%s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,
                %s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s,%s,
                %s,%s,%s,%s,%s,%s
            )
            ON DUPLICATE KEY UPDATE
                announced     = VALUES(announced),
                status        = VALUES(status),
                network       = VALUES(network),
                os            = VALUES(os),
                chipset       = VALUES(chipset),
                cpu           = VALUES(cpu),
                gpu           = VALUES(gpu),
                display_size  = VALUES(display_size),
                display_type  = VALUES(display_type),
                display_res   = VALUES(display_res),
                ram           = VALUES(ram),
                storage       = VALUES(storage),
                main_camera   = VALUES(main_camera),
                selfie_camera = VALUES(selfie_camera),
                battery       = VALUES(battery),
                charging      = VALUES(charging),
                nfc           = VALUES(nfc),
                usb           = VALUES(usb),
                bluetooth     = VALUES(bluetooth),
                wlan          = VALUES(wlan),
                colors        = VALUES(colors),
                weight        = VALUES(weight),
                dimensions    = VALUES(dimensions),
                sim           = VALUES(sim),
                sensors       = VALUES(sensors),
                popularity    = VALUES(popularity),
                fans          = VALUES(fans),
                rating        = VALUES(rating),
                full_specs_json = VALUES(full_specs_json)
        """, (
            device_id,
            _t(s.get('announced')),
            _t(s.get('status')),
            _t(s.get('network')),
            _t(s.get('os')),
            _t(s.get('chipset')),
            _t(s.get('cpu')),
            _t(s.get('gpu')),
            _t(s.get('display_size')),
            _t(s.get('display_type')),
            _t(s.get('display_res')),
            _t(s.get('ram')),
            _t(s.get('storage')),
            _t(s.get('main_camera')),
            _t(s.get('selfie_camera')),
            _t(s.get('battery')),
            _t(s.get('charging')),
            _t(s.get('nfc')),
            _t(s.get('usb')),
            _t(s.get('bluetooth')),
            _t(s.get('wlan')),
            _t(s.get('colors')),
            _t(s.get('weight')),
            _t(s.get('dimensions')),
            _t(s.get('sim')),
            _t(s.get('sensors')),
            _t(s.get('popularity')),
            _t(s.get('fans')),
            _t(s.get('rating')),
            json.dumps(s, ensure_ascii=False),
        ))
        conn.commit()
        cur.close()
    except MySQLError as e:
        logger.error(f"upsert_specs failed for device_id={device_id}: {e}")
        conn.rollback()


# ── Pictures ──────────────────────────────────────────────────────────────────

def upsert_pictures(conn, device_id: int, picture_urls: List[str]):
    """Insert all picture URLs for a device (skip duplicates)."""
    if not picture_urls:
        return
    try:
        cur = conn.cursor()
        for pos, url in enumerate(picture_urls):
            cur.execute("""
                INSERT IGNORE INTO device_pictures (device_id, url, position)
                VALUES (%s, %s, %s)
            """, (device_id, url, pos))
        conn.commit()
        cur.close()
    except MySQLError as e:
        logger.error(f"upsert_pictures failed for device_id={device_id}: {e}")
        conn.rollback()


# ── Utility ───────────────────────────────────────────────────────────────────

def _t(val) -> Optional[str]:
    """Truncate/clean a value for safe DB insertion."""
    if val is None:
        return None
    s = str(val).strip()
    return s[:500] if s else None
