"""
Quick script: scrape all brands from GSMArena and insert into mobile_insights DB.
Run: python populate_brands.py
"""
from scraper import GSMArenaScraper
import db
from loguru import logger

def main():
    scraper = GSMArenaScraper()
    conn = db.get_connection()
    if not conn:
        logger.error("Cannot connect to DB — is XAMPP MySQL running?")
        return

    logger.info("Fetching brands from GSMArena...")
    brands = scraper.get_brands()
    logger.info(f"Found {len(brands)} brands")

    cur = conn.cursor()
    inserted = 0
    for b in brands:
        try:
            cur.execute("""
                INSERT INTO brands (name, gsmarena_url, device_count)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    gsmarena_url = VALUES(gsmarena_url),
                    device_count = VALUES(device_count)
            """, (b['name'], b['url'], b.get('device_count', 0)))
            inserted += 1
        except Exception as e:
            logger.warning(f"  skip {b['name']}: {e}")
    conn.commit()
    cur.close()
    conn.close()
    logger.info(f"Done — inserted/updated {inserted} brands")

if __name__ == "__main__":
    main()
