from datetime import datetime, timezone
import random
import sqlite3

try:
    fallback_data = [
        {
            "kategori": "İtiraz Karşılama",
            "soru_baslik": "Müşteri 'Komisyon oranınız çok yüksek' derse?",
            "cevap_icerik": "Müşterinin bu itirazı fiyata odaklanmış gibi görünse de aslında 'Bu parayı neden vermeliyim, değeriniz ne?' sorusudur. \n\n'Beyefendi, komisyonumuz sadece kapı açma bedeli değil...'"
        }
    ]
    
    conn = sqlite3.connect(r'C:\Users\alifa\PusulaGayrimenkulV5_2\app_emlak_v5_2.db')
    cur = conn.cursor()
    inserted = 0
    now = datetime.now(timezone.utc).isoformat()
    
    tenant_id = 1
    
    for item in fallback_data:
        cur.execute(
            "INSERT INTO piyasa_hafizasi (kategori, soru_baslik, cevap_icerik, okunma_sayisi, tenant_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
            (item["kategori"], item["soru_baslik"], item["cevap_icerik"], random.randint(10, 500), tenant_id, now)
        )
        inserted += 1
            
    conn.commit()
    conn.close()
    
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
