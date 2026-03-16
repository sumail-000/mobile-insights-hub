"""
Scrape devices (listing only - no full specs) for top brands and insert into DB.
Run: python populate_devices.py
"""
from scraper import GSMArenaScraper
import db
from loguru import logger

TOP_BRANDS = [
    "Samsung", "Apple", "Xiaomi", "OnePlus", "Google",
    "Motorola", "Realme", "Oppo", "Vivo", "Sony",
    "Nokia", "Huawei", "Honor", "Nothing", "Asus"
]

def main():
    scraper = GSMArenaScraper()
    conn = db.get_connection()
    if not conn:
        logger.error("Cannot connect to DB")
        return

    cur = conn.cursor(dictionary=True)

    # Get brand IDs for top brands
    placeholders = ','.join(['%s'] * len(TOP_BRANDS))
    cur.execute(f"SELECT id, name, gsmarena_url FROM brands WHERE name IN ({placeholders})", TOP_BRANDS)
    brands = cur.fetchall()
    logger.info(f"Found {len(brands)} matching brands in DB")

    total_devices = 0
    for brand in brands:
        logger.info(f"Scraping devices for: {brand['name']} ...")
        devices = scraper.get_devices_from_brand(brand['gsmarena_url'])
        logger.info(f"  → {len(devices)} devices found")

        for d in devices:
            try:
                cur.execute("""
                    INSERT INTO devices (brand_id, name, gsmarena_url, thumbnail_url, summary)
                    VALUES (%s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        name = VALUES(name),
                        thumbnail_url = VALUES(thumbnail_url),
                        summary = VALUES(summary)
                """, (brand['id'], d['name'], d['url'], d.get('image_url', ''), d.get('summary', '')))
                total_devices += 1
            except Exception as e:
                logger.warning(f"    skip {d['name']}: {e}")

        conn.commit()
        logger.info(f"  {brand['name']} committed.")

    cur.close()
    conn.close()
    logger.info(f"Done — {total_devices} devices inserted/updated across {len(brands)} brands")

if __name__ == "__main__":
    main()
