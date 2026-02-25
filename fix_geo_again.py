import sqlite3
import random

db_path = "C:\\Users\\alifa\\PusulaGayrimenkulV5_2\\db.sqlite"

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

# Ünye bounding box
# Lat limit (North) is ~ 41.138 (sea limit)
# Lat limit (South) is ~ 40.900 (deep inland Unye limits)
# Lng limit (East) is ~ 37.400 (Fatsa direction)
# Lng limit (West) is ~ 37.100 (Terme/Samsun direction)

def run():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT id, mahalle, lat, lng FROM emsal")
    rows = cur.fetchall()
    
    fixed_count = 0
    for r in rows:
        eid, mahalle, lat, lng = r
        m_adi = (mahalle or "").lower()
        
        needs_fix = False
        
        if not lat or not lng:
            needs_fix = True
        elif lat > 41.138 or lat < 40.900: # Sea or too far south
            needs_fix = True
            print(f"fixing latitude out of bounds {lat}")
        elif lng > 37.400 or lng < 36.900: # Fatsa or Samsun
            needs_fix = True
            print(f"fixing longitude out of bounds {lng}")
            
        if needs_fix:
            base_lat, base_lng = (41.1210, 37.2910) # Varsayılan Karasal Merkez
            for k, v in locs.items():
                if k in m_adi:
                    base_lat, base_lng = v
                    break
                    
            # Denize doğru gitmemesi için lat jitter'ını eksi (güneye doğru) yapıyoruz
            new_lat = base_lat - random.uniform(0.001, 0.005)
            new_lng = base_lng + random.uniform(-0.005, 0.005)
            
            cur.execute("UPDATE emsal SET lat=?, lng=? WHERE id=?", (new_lat, new_lng, eid))
            fixed_count += 1
            
    conn.commit()
    conn.close()
    print(f"Sabitlenen (Denizden veya Samsun/Fatsa sınırından Çıkarılan) İğne Sayısı: {fixed_count}")

if __name__ == "__main__":
    run()
