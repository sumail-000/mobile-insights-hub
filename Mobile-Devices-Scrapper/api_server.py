"""
Mobile Insights Hub — Full API Server
Endpoints:
  POST /api/auth/signup
  POST /api/auth/login
  GET  /api/auth/me          (requires Authorization: Bearer <token>)
  POST /api/auth/logout

  GET  /api/brands
  GET  /api/devices?brand=&search=&page=&limit=&ram=&battery=&chipset=&os=&network=&sort=
  GET  /api/devices/<slug>
  GET  /api/search?q=

  POST /api/wishlist          (requires auth)
  DELETE /api/wishlist/<slug> (requires auth)
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import json, os, re, hashlib, hmac, base64, time
from datetime import datetime, timezone
from loguru import logger
from typing import Optional, Dict

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

SECRET_KEY = os.environ.get("JWT_SECRET", "phonespecs-secret-2026-change-in-prod")

DB_CONFIG = {
    'host':     'localhost',
    'port':     3306,
    'user':     'root',
    'password': '',
    'database': 'mobile_insights',
    'charset':  'utf8mb4',
    'autocommit': False,
}

# ── DB ────────────────────────────────────────────────────────────────────────

def get_conn():
    try:
        return mysql.connector.connect(**DB_CONFIG)
    except Exception as e:
        logger.error(f"DB connect failed: {e}")
        return None

# ── Simple JWT (no external lib) ─────────────────────────────────────────────

def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

def _unb64(s: str) -> bytes:
    pad = 4 - len(s) % 4
    return base64.urlsafe_b64decode(s + '=' * (pad % 4))

def create_token(user_id: int, email: str) -> str:
    header = _b64(json.dumps({"alg": "HS256", "typ": "JWT"}).encode())
    payload = _b64(json.dumps({
        "sub": user_id, "email": email,
        "iat": int(time.time()), "exp": int(time.time()) + 86400 * 30  # 30 days
    }).encode())
    sig = _b64(hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
    return f"{header}.{payload}.{sig}"

def verify_token(token: str) -> Optional[Dict]:
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        header, payload, sig = parts
        expected = _b64(hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
        if not hmac.compare_digest(expected, sig):
            return None
        data = json.loads(_unb64(payload))
        if data.get('exp', 0) < time.time():
            return None
        return data
    except Exception:
        return None

def get_current_user():
    auth = request.headers.get('Authorization', '')
    if not auth.startswith('Bearer '):
        return None
    return verify_token(auth[7:])

def require_auth(f):
    from functools import wraps
    @wraps(f)
    def wrapper(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        request.user = user
        return f(*args, **kwargs)
    return wrapper

# ── Password hashing ──────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    salt = os.urandom(16).hex()
    h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100_000)
    return f"{salt}${h.hex()}"

def check_password(password: str, stored: str) -> bool:
    try:
        salt, h = stored.split('$', 1)
        return hmac.compare_digest(
            h, hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100_000).hex()
        )
    except Exception:
        return False

# ── Slug helpers ──────────────────────────────────────────────────────────────

def url_to_slug(gsmarena_url: str) -> str:
    """https://www.gsmarena.com/oneplus_13-12345.php  →  oneplus_13-12345"""
    m = re.search(r'/([^/]+)\.php$', gsmarena_url)
    return m.group(1) if m else gsmarena_url

def slug_to_url(slug: str) -> str:
    return f"https://www.gsmarena.com/{slug}.php"

# ── Device serializer ─────────────────────────────────────────────────────────

def serialize_device(row: dict, include_specs: bool = False) -> dict:
    slug = url_to_slug(row.get('gsmarena_url', ''))
    d = {
        "id": slug,
        "name": row.get('name') or row.get('device_name', ''),
        "brand": row.get('brand_name', ''),
        "slug": slug,
        "thumbnail": row.get('thumbnail_url', ''),
        "summary": row.get('summary', ''),
    }
    if include_specs:
        d.update({
            "chipset":      row.get('chipset', ''),
            "ram":          row.get('ram', ''),
            "main_camera":  row.get('main_camera', ''),
            "selfie_camera":row.get('selfie_camera', ''),
            "battery":      row.get('battery', ''),
            "display_size": row.get('display_size', ''),
            "display_type": row.get('display_type', ''),
            "display_res":  row.get('display_res', ''),
            "os":           row.get('os', ''),
            "network":      row.get('network', ''),
            "nfc":          row.get('nfc', ''),
            "usb":          row.get('usb', ''),
            "bluetooth":    row.get('bluetooth', ''),
            "wlan":         row.get('wlan', ''),
            "colors":       row.get('colors', ''),
            "weight":       row.get('weight', ''),
            "dimensions":   row.get('dimensions', ''),
            "sim":          row.get('sim', ''),
            "sensors":      row.get('sensors', ''),
            "announced":    row.get('announced', ''),
            "status":       row.get('status', ''),
            "popularity":   row.get('popularity', ''),
            "fans":         row.get('fans', ''),
            "rating":       row.get('rating', ''),
            "charging":     row.get('charging', ''),
            "storage":      row.get('storage', ''),
        })
        raw_json = row.get('full_specs_json', '')
        if raw_json:
            try:
                full = json.loads(raw_json)
                d['specs'] = full.get('specs', {})
                d['data_specs'] = full.get('data_specs', {})
                d['highlights'] = full.get('highlights', {})
                d['pictures'] = full.get('pictures', [])
                d['pictures_url'] = full.get('pictures_url', '')
            except Exception:
                d['specs'] = {}
    return d

# ── AUTH ENDPOINTS ────────────────────────────────────────────────────────────

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name     = (data.get('name') or '').strip()
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({"error": "name, email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
        return jsonify({"error": "Invalid email address"}), 400

    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id FROM users WHERE email=%s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already registered"}), 409
        ph = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s,%s,%s)",
            (name, email, ph)
        )
        conn.commit()
        user_id = cur.lastrowid
        token = create_token(user_id, email)
        return jsonify({"token": token, "user": {"id": user_id, "name": name, "email": email}}), 201
    except Exception as e:
        logger.error(f"signup error: {e}")
        return jsonify({"error": "Server error"}), 500
    finally:
        conn.close()


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email    = (data.get('email') or '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, email, password_hash, avatar_url, wishlist FROM users WHERE email=%s", (email,))
        user = cur.fetchone()
        if not user or not check_password(password, user['password_hash']):
            return jsonify({"error": "Invalid email or password"}), 401
        token = create_token(user['id'], user['email'])
        wishlist = []
        if user.get('wishlist'):
            try:
                wishlist = json.loads(user['wishlist']) if isinstance(user['wishlist'], str) else user['wishlist']
            except Exception:
                wishlist = []
        return jsonify({
            "token": token,
            "user": {
                "id":         user['id'],
                "name":       user['name'],
                "email":      user['email'],
                "avatar_url": user.get('avatar_url'),
                "wishlist":   wishlist or [],
            }
        })
    except Exception as e:
        logger.error(f"login error: {e}")
        return jsonify({"error": "Server error"}), 500
    finally:
        conn.close()


@app.route('/api/auth/me', methods=['GET'])
@require_auth
def me():
    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT id, name, email, avatar_url, wishlist, created_at FROM users WHERE id=%s", (request.user['sub'],))
        user = cur.fetchone()
        if not user:
            return jsonify({"error": "User not found"}), 404
        wishlist = []
        if user.get('wishlist'):
            try:
                wishlist = json.loads(user['wishlist']) if isinstance(user['wishlist'], str) else user['wishlist']
            except Exception:
                wishlist = []
        return jsonify({
            "id":         user['id'],
            "name":       user['name'],
            "email":      user['email'],
            "avatar_url": user.get('avatar_url'),
            "wishlist":   wishlist or [],
            "created_at": user['created_at'].isoformat() if user.get('created_at') else None,
        })
    finally:
        conn.close()

# ── BRANDS ────────────────────────────────────────────────────────────────────

@app.route('/api/brands', methods=['GET'])
def get_brands():
    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT b.name, b.gsmarena_url, COUNT(d.id) AS device_count
            FROM brands b
            LEFT JOIN devices d ON d.brand_id = b.id
            GROUP BY b.id, b.name, b.gsmarena_url
            ORDER BY b.name
        """)
        brands = cur.fetchall()
        return jsonify({"brands": brands})
    finally:
        conn.close()

# ── DEVICES LIST ──────────────────────────────────────────────────────────────

@app.route('/api/devices', methods=['GET'])
def get_devices():
    brand   = request.args.get('brand', '').strip()
    search  = request.args.get('search', '').strip()
    page    = max(1, int(request.args.get('page', 1)))
    limit   = min(100, max(1, int(request.args.get('limit', 24))))
    sort    = request.args.get('sort', 'name')  # name | rating | fans
    network = request.args.get('network', '')
    ram_filter = request.args.get('ram', '')
    os_filter  = request.args.get('os', '')

    offset = (page - 1) * limit

    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)

        where = ["1=1"]
        params = []

        if brand:
            where.append("b.name = %s")
            params.append(brand)
        if search:
            where.append("(d.name LIKE %s OR b.name LIKE %s)")
            params += [f"%{search}%", f"%{search}%"]
        if network:
            where.append("ds.network LIKE %s")
            params.append(f"%{network}%")
        if ram_filter:
            where.append("ds.ram LIKE %s")
            params.append(f"%{ram_filter}%")
        if os_filter:
            where.append("ds.os LIKE %s")
            params.append(f"%{os_filter}%")

        where_sql = " AND ".join(where)

        order_map = {
            "name":    "d.name ASC",
            "rating":  "CAST(ds.rating AS DECIMAL(4,2)) DESC",
            "fans":    "CAST(REPLACE(ds.fans, ',', '') AS UNSIGNED) DESC",
            "newest":  "d.scraped_at DESC",
        }
        order_sql = order_map.get(sort, "d.name ASC")

        count_sql = f"""
            SELECT COUNT(*) as total
            FROM devices d
            JOIN brands b ON b.id = d.brand_id
            LEFT JOIN device_specs ds ON ds.device_id = d.id
            WHERE {where_sql}
        """
        cur.execute(count_sql, params)
        total = cur.fetchone()['total']

        data_sql = f"""
            SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary,
                   b.name AS brand_name,
                   ds.chipset, ds.ram, ds.main_camera, ds.battery,
                   ds.display_size, ds.os, ds.rating, ds.fans
            FROM devices d
            JOIN brands b ON b.id = d.brand_id
            LEFT JOIN device_specs ds ON ds.device_id = d.id
            WHERE {where_sql}
            ORDER BY {order_sql}
            LIMIT %s OFFSET %s
        """
        cur.execute(data_sql, params + [limit, offset])
        rows = cur.fetchall()

        devices = [serialize_device(r) for r in rows]
        for i, r in enumerate(rows):
            devices[i]['chipset']     = r.get('chipset', '')
            devices[i]['ram']         = r.get('ram', '')
            devices[i]['main_camera'] = r.get('main_camera', '')
            devices[i]['battery']     = r.get('battery', '')
            devices[i]['display_size']= r.get('display_size', '')
            devices[i]['os']          = r.get('os', '')
            devices[i]['rating']      = r.get('rating', '')
            devices[i]['fans']        = r.get('fans', '')

        return jsonify({
            "devices": devices,
            "total":   total,
            "page":    page,
            "limit":   limit,
            "pages":   (total + limit - 1) // limit,
        })
    finally:
        conn.close()

# ── DEVICE DETAIL ─────────────────────────────────────────────────────────────

@app.route('/api/devices/<path:slug>', methods=['GET'])
def get_device(slug):
    gsmarena_url = slug_to_url(slug)
    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary,
                   b.name AS brand_name,
                   ds.chipset, ds.ram, ds.storage, ds.main_camera, ds.selfie_camera,
                   ds.battery, ds.charging, ds.display_size, ds.display_type, ds.display_res,
                   ds.os, ds.network, ds.nfc, ds.usb, ds.bluetooth, ds.wlan,
                   ds.colors, ds.weight, ds.dimensions, ds.sim, ds.sensors,
                   ds.announced, ds.status, ds.popularity, ds.fans, ds.rating,
                   ds.full_specs_json,
                   GROUP_CONCAT(dp.url ORDER BY dp.position SEPARATOR '|||') AS pic_urls
            FROM devices d
            JOIN brands b ON b.id = d.brand_id
            LEFT JOIN device_specs ds ON ds.device_id = d.id
            LEFT JOIN device_pictures dp ON dp.device_id = d.id
            WHERE d.gsmarena_url = %s
            GROUP BY d.id, ds.id
        """, (gsmarena_url,))
        row = cur.fetchone()
        if not row:
            return jsonify({"error": "Device not found"}), 404

        device = serialize_device(row, include_specs=True)

        # Override pictures with the pictures table (more reliable)
        if row.get('pic_urls'):
            device['pictures'] = [u for u in row['pic_urls'].split('|||') if u]

        # Related devices — same brand, excluding self
        cur.execute("""
            SELECT d.name, d.gsmarena_url, d.thumbnail_url, b.name AS brand_name
            FROM devices d
            JOIN brands b ON b.id = d.brand_id
            WHERE b.name = %s AND d.gsmarena_url != %s
            ORDER BY d.scraped_at DESC
            LIMIT 8
        """, (row['brand_name'], gsmarena_url))
        related = [serialize_device(r) for r in cur.fetchall()]
        device['related'] = related

        return jsonify(device)
    finally:
        conn.close()

# ── SEARCH ────────────────────────────────────────────────────────────────────

@app.route('/api/search', methods=['GET'])
def search():
    q = request.args.get('q', '').strip()
    if not q or len(q) < 2:
        return jsonify({"results": [], "total": 0})

    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("""
            SELECT d.name, d.gsmarena_url, d.thumbnail_url, d.summary,
                   b.name AS brand_name,
                   ds.chipset, ds.ram, ds.main_camera, ds.battery, ds.display_size, ds.os
            FROM devices d
            JOIN brands b ON b.id = d.brand_id
            LEFT JOIN device_specs ds ON ds.device_id = d.id
            WHERE d.name LIKE %s OR b.name LIKE %s
            ORDER BY d.name ASC
            LIMIT 20
        """, (f"%{q}%", f"%{q}%"))
        rows = cur.fetchall()
        results = []
        for r in rows:
            dev = serialize_device(r)
            dev['chipset']      = r.get('chipset', '')
            dev['ram']          = r.get('ram', '')
            dev['main_camera']  = r.get('main_camera', '')
            dev['battery']      = r.get('battery', '')
            dev['display_size'] = r.get('display_size', '')
            dev['os']           = r.get('os', '')
            results.append(dev)
        return jsonify({"results": results, "total": len(results)})
    finally:
        conn.close()

# ── WISHLIST ──────────────────────────────────────────────────────────────────

@app.route('/api/wishlist', methods=['POST'])
@require_auth
def add_to_wishlist():
    data = request.get_json() or {}
    slug = data.get('slug', '').strip()
    if not slug:
        return jsonify({"error": "slug required"}), 400

    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT wishlist FROM users WHERE id=%s", (request.user['sub'],))
        row = cur.fetchone()
        wishlist = []
        if row and row['wishlist']:
            try:
                wishlist = json.loads(row['wishlist']) if isinstance(row['wishlist'], str) else row['wishlist']
            except Exception:
                wishlist = []
        if slug not in wishlist:
            wishlist.append(slug)
        cur.execute("UPDATE users SET wishlist=%s WHERE id=%s", (json.dumps(wishlist), request.user['sub']))
        conn.commit()
        return jsonify({"wishlist": wishlist})
    finally:
        conn.close()


@app.route('/api/wishlist/<path:slug>', methods=['DELETE'])
@require_auth
def remove_from_wishlist(slug):
    conn = get_conn()
    if not conn:
        return jsonify({"error": "Database unavailable"}), 503
    try:
        cur = conn.cursor(dictionary=True)
        cur.execute("SELECT wishlist FROM users WHERE id=%s", (request.user['sub'],))
        row = cur.fetchone()
        wishlist = []
        if row and row['wishlist']:
            try:
                wishlist = json.loads(row['wishlist']) if isinstance(row['wishlist'], str) else row['wishlist']
            except Exception:
                wishlist = []
        wishlist = [s for s in wishlist if s != slug]
        cur.execute("UPDATE users SET wishlist=%s WHERE id=%s", (json.dumps(wishlist), request.user['sub']))
        conn.commit()
        return jsonify({"wishlist": wishlist})
    finally:
        conn.close()

# ── HEALTH ────────────────────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    conn = get_conn()
    if not conn:
        return jsonify({"status": "db_down"}), 503
    try:
        cur = conn.cursor()
        cur.execute("SELECT COUNT(*) FROM devices")
        count = cur.fetchone()[0]
        return jsonify({"status": "ok", "devices": count})
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(debug=True, port=8000, use_reloader=False)
