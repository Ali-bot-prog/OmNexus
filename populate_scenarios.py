import sqlite3
import datetime

db_path = "C:\\Users\\alifa\\PusulaGayrimenkulV5_2\\db.sqlite"

scenarios = [
    ("Müzakere", "Müşteri fiyatın çok yüksek olduğunu söylüyor, nasıl ikna edebilirim?", "Fiyatın yüksekliği algısını kırmak için mülkün benzersiz özelliklerine ve bölgedeki benzer emsallerin son satış fiyatlarına odaklanın. Ortalama geri dönüş (amortisman) süresini hesaplayarak yatırım değerini kanıtlayın."),
    ("İtiraz Karşılama", "Alıcı adayı 'Eşimle görüşmem lazım' deyip süreci uzatıyor.", "Kararın ortak alınması gerektiğini onaylayın ve 'Eşinizin en çok dikkat edeceği 3 kriter nedir? İsterseniz ikinci gösterimi beraber yapalım veya o kriterlere özel bir sunum dosyası hazırlayayım' diyerek eşi sürece dahil edin."),
    ("Pazarlama Stratejisi", "1 aydır ilanda olan ancak hiç aranmayan bir portföy için ne yapılmalı?", "Öncelikle fiyat analizi (CMA) yenilenmeli. Fotoğraflar yetersiz olabilir, profesyonel çekim yapılmalı. İlan başlığı ve açıklaması güncel anahtar kelimelerle optimize edilerek ilan doping/öne çıkarma kullanılmalı."),
    ("Hukuki", "Kat irtifaklı tapudan kat mülkiyetine geçiş nasıl yapılır?", "Binanın iskanı (yapı kullanma izin belgesi) alındıktan sonra, tapu müdürlüğüne iskan belgesi, mimari proje ve yönetim planı ile başvurularak cins değişikliği işlemi yapılır. Bu süreç alıcıya güven verir."),
    ("Müzakere", "Satıcı, emsallerinden %20 daha yüksek fiyat istiyor.", "Satıcıya doğrudan 'Fiyatınız yüksek' demek yerine, piyasadaki son satılan 3 emsali ve şu an beklemede olan benzer 3 ilanı gösteren bir CMA raporu sunun. Doğru fiyatlanmayan mülklerin piyasada eskiyerek değer kaybettiğini nazikçe anlatın."),
    ("İtiraz Karşılama", "Alıcı 'Faizler çok yüksek, bekleyeceğim' diyor.", "Faizler düştüğünde gayrimenkul fiyatlarının mevcut talepten dolayı hızla arttığını tarihsel verilerle gösterin. 'Şimdi düşük fiyattan alıp, faizler düştüğünde krediyi yeniden yapılandırmak daha karlı' stratejisini anlatın."),
    ("Pazarlama Stratejisi", "Yatırımlık arsa satışı için nasıl bir kitle hedeflenmeli?", "Kısa vadeli değil, orta/uzun vadeli büyüme potansiyeli arayan, çocuklarının geleceği için yatırım yapan aileler veya bölgedeki imar planı değişikliklerini takip eden inşaat firmaları hedeflenmeli. Sosyal medyada 'Bölgesel Gelişim' vurgusu yapılmalı."),
    ("Hukuki", "Kiralık dairede tahliye taahhütnamesi ne zaman imzalatılmalı?", "Tahliye taahhütnamesi kesinlikle kira sözleşmesi ile aynı tarihli OLMAMALIDIR. Sözleşmeden en az 1 ay sonraki bir tarihte ve kiralanan yer teslim edildikten sonra imzalatılması geçerli olması için şarttır."),
    ("Müşteri İlişkileri", "İlk aramada müşteriyle nasıl bağ kurulur?", "Kendinizi ve kurumunuzu net tanıtın. Sadece ne aradığını değil, 'Neden' aradığını sorun (Okula yakınlık, yatırım, geniş aile vb.). İhtiyacı doğru anladığınızı hissettirmek güven bağını hızla kurar."),
    ("Müzakere", "Kiracı, satılık mülkün gösterilmesinde zorluk çıkarıyor.", "Kiracıyla empati kurun. Gösterim saatlerini tamamen onun programına göre kısıtlı ve düzenli hale getirin (Örn: Sadece Çarşamba ve Cumartesi 14:00-16:00). Gerekirse taşınma masrafları için satıcıdan küçük bir destek kopararak motive edin."),
    ("İtiraz Karşılama", "Komisyon oranını duyunca 'Çok fazla' tepkisi alıyorum.", "Komisyonu değil, sunduğunuz hizmetleri listeleyin: Profesyonel fotoğraf, drone çekimi, hukuki danışmanlık, hedefli dijital pazarlama... 'Eğer kendiniz satmaya çalışırsanız kaybedeceğiniz zaman ve yanlış pazarlık riskinin maliyeti, benim komisyonumdan çok daha yüksek' argümanını kullanın."),
    ("Pazarlama Stratejisi", "Açık Ev (Open House) etkinliği nasıl organize edilir?", "Sadece potansiyel alıcıları değil, bölgedeki diğer emlakçıları (network) ve komşuları davet edin. Sosyal medyada geri sayım başlatın. İçeride küçük ikramlar ve mülkün detaylı bilgi formlarını hazır bulundurun."),
    ("Hukuki", "Hisseli tapu satışında şufa (önalım) hakkı riski nasıl ortadan kalkar?", "Diğer tüm hissedarlardan noter onaylı 'Feragatname' alınmalıdır. Veya satıştan sonra noter aracılığıyla diğer hissedarlara bildirim yapılır, belirli bir süre içinde dava açılmazsa hak düşer."),
    ("Müzakere", "Teklif aldım ama satıcı 'Daha yükseği gelir' diye beklemek istiyor.", "Gelen ilk ve mantıklı tekliflerin genellikle en iyi teklifler olduğunu istatistiklerle anlatın. Masadaki somut paranın, gelecekteki ihtimalli bir paradan daha güvenli olduğunu vurgulayın."),
    ("Sosyal Medya", "Instagram'da hangi tür emlak gönderileri daha çok etkileşim alıyor?", "'Öncesi/Sonrası' tadilat hikayeleri, ev turları (Reels), yerel bölgeyle ilgili ilginç bilgiler ve yatırım ipuçları her zaman düz satılık ilanlarından daha fazla organik etkileşim (kaydetme/paylaşma) getirir."),
    ("İtiraz Karşılama", "Alıcı 'Bölgeyi pek beğenmedim' diyor ama bütçesi sadece oraya yetiyor.", "Bölgenin gelecekteki gelişim projeksiyonuna odaklanın (Yeni metro hattı, AVM, okul). Bölgeyi değil, mülkün kendisine ve yaşam kalitesine vurgu yapın. Gerekirse bir alt beklentide daha merkezi bir emsal göstererek gerçekliği hissettirin."),
    ("Pazarlama Stratejisi", "Cold Calling (Soğuk Arama) yaparken ilk cümle ne olmalı?", "Merhaba, adım [Adınız], OmNexus ofisinden arıyorum. Şu an [Bölge] mahallesinde yeni bir alıcı/satıcı ağımız var. Eğer evinizi satmayı düşündüyseniz, bölgedeki son 1 aylık değer artış raporunu sizinle paylaşmak isterim. Müsait misiniz?"),
    ("Hukuki", "Kiracı evi alt kiraya vermiş, ne yapabiliriz?", "Kira sözleşmesinde yazılı olarak açıkça 'alt kiraya verilemez' maddesi varsa (ki genelde matbu evraklarda vardır), kiracıya noterden ihtarname çekilerek sözleşme haklı nedenle feshedilebilir ve tahliye davası açılabilir."),
    ("Müzakere", "Satıcı evdeki eşyaları fiyata dahil etmemekte diretiyor, alıcı ise istiyor.", "Eşyaların ikinci el değerini hesaplayarak objektif bir liste çıkarın. Her iki tarafla da küçük tavizler isteyerek ('Ankastreler kalsın, perdeleri ve mobilyayı alıcı yenilesin') orta yol bir donanım paketi anlaşması sunun."),
    ("Müşteri İlişkileri", "Müşteri telefonda adres bilgisini istiyor ama ofise gelmek istemiyor.", "Kesin adresi vermek yerine, evin sokağını veya yakınındaki çok bilinen bir noktayı söyleyin. 'Gelin ofiste kahvemizi içerken size evin tüm detaylarını plan üzerinden göstereyim, öyle gidelim' diyerek yüz yüze mülakat için ısrarcı olun.")
]

def run():
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    cur.execute("CREATE TABLE IF NOT EXISTS piyasa_hafizasi (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT, kategori TEXT, soru_baslik TEXT, cevap_icerik TEXT, okunma_sayisi INTEGER DEFAULT 0, created_at TEXT)")
    
    # Check if we already added them to avoid duplicates
    cur.execute("SELECT COUNT(*) FROM piyasa_hafizasi WHERE tenant_id='1'")
    count = cur.fetchone()[0]
    
    if count < 10:
        for cat, q, a in scenarios:
            cur.execute("""
                INSERT INTO piyasa_hafizasi (tenant_id, kategori, soru_baslik, cevap_icerik, okunma_sayisi, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, ("1", cat, q, a, 0, datetime.datetime.now().isoformat()))
        conn.commit()
    conn.close()

if __name__ == "__main__":
    run()
    print("Scenarios inserted.")
