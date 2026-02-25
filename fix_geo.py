import sqlite3
import random

conn = sqlite3.connect(r'C:\Users\alifa\PusulaGayrimenkulV5_2\db.sqlite')
cur = conn.cursor()

records = cur.execute("SELECT id, mahalle FROM emsal WHERE kaynak LIKE '%emlakjet.com%'").fetchall()

locs = {
    "atatürk": (41.1250, 37.2930), 
    "kaledere": (41.1230, 37.2940),
    "fevzi çakmak": (41.1160, 37.3000), 
    "killik": (41.1140, 37.2800),
    "çamurlu": (41.1250, 37.2880),
    "burunucu": (41.1270, 37.2750),
    "gölevi": (41.1350, 37.2500),
    "liseler": (41.1210, 37.2950),
    "çınarlık": (41.1180, 37.2910),
    "ortayılmazlar": (41.1260, 37.2850),
    "saraçlı": (41.1170, 37.2850),
    "nuriye": (41.1300, 37.3100),
    "cevizdere": (41.1100, 37.3300)
}

updated = 0
for row in records:
    r_id = row[0]
    m_adi = (row[1] or "").lower()
    
    base_lat, base_lng = (41.1210, 37.2910)
    for k, v in locs.items():
        if k in m_adi:
            base_lat, base_lng = v
            break
            
    lat = base_lat + random.uniform(-0.003, 0.001) 
    lng = base_lng + random.uniform(-0.003, 0.003)
    
    cur.execute("UPDATE emsal SET lat=?, lng=? WHERE id=?", (lat, lng, r_id))
    updated += 1
    
conn.commit()
conn.close()
print(f"Başarıyla {updated} iğne denizin içinden karaya taşındı!")
