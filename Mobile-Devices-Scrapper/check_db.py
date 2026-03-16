import mysql.connector
conn = mysql.connector.connect(host='localhost', port=3306, user='root', password='', database='mobile_insights', charset='utf8mb4')
cur = conn.cursor()

cur.execute('DESCRIBE users')
print('USERS TABLE:')
for r in cur.fetchall():
    print(r)

cur.execute('SELECT name, gsmarena_url, thumbnail_url, summary FROM devices LIMIT 5')
print('\nDEVICES SAMPLE:')
for r in cur.fetchall():
    print(r)

cur.execute('SELECT COUNT(*) FROM devices WHERE thumbnail_url IS NOT NULL AND thumbnail_url != ""')
print('\ndevices with thumbnail:', cur.fetchone())

cur.execute('SELECT b.name, COUNT(d.id) as cnt FROM brands b LEFT JOIN devices d ON d.brand_id=b.id GROUP BY b.id')
print('\nBRAND COUNTS:')
for r in cur.fetchall():
    print(r)

conn.close()
