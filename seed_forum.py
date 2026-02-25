import sqlite3
import random
from datetime import datetime, timezone

scenarios = [
    {
        "kategori": "İtiraz Karşılama",
        "soru_baslik": "'Evimi kendim satabilirim, size neden komisyon ödeyim?' İtirazı",
        "cevap_icerik": "Müşteriye hak vererek söze başlayın: 'Kesinlikle haklısınız, evinizi kendiniz de satabilirsiniz.' Sonrasında değer önerinizi sunun:\n\n1. Güvenlik: Kimleri evinize alacağınızı biliyor musunuz? Biz alıcı niteliği doğrulanmamış kimseyi mülke sokmuyoruz.\n2. Pazarlık Psikolojisi: Alıcılar doğrudan mal sahibiyle pazarlık yaparken çok daha acımasız ve duygusal olurlar. Biz bu süreci profesyonel bir şirket ciddiyetinde yönetiyoruz.\n3. Zaman Maliyeti: Günde 20 telefon aramasına ve randevulara gelmeyen insanlara ayıracak vaktiniz var mı?\n\nBiz komisyonu evinizi satmaktan öte, evinizi en yüksek fiyattan, en kısa sürede ve baş ağrısız satmak için alıyoruz."
    },
    {
        "kategori": "İtiraz Karşılama",
        "soru_baslik": "'Başka bir emlakçı %1 komisyonla çalışıyor' İtirazı",
        "cevap_icerik": "Bu itiraza kalite ve hizmet farkıyla yanıt verilmelidir:\n\n'Saygı duyuyorum, piyasada her fiyata hizmet veren firmalar var. Ancak ucuz komisyonla çalışan bir danışman, kendi komisyonunu savunamıyorken sizin evinizin değerini masada nasıl savunacak?'\n\nAyrıca, düşük komisyon alan ofislerin pazarlama (sponsorlu ilan, profesyonel çekim, drone) bütçesi ayıramayacağını ve mülkün internette kaybolacağını vurgulayın."
    },
    {
        "kategori": "Müzakere",
        "soru_baslik": "Alıcı fiyatı çok kırmaya çalışıyor (Ölücü Alıcı) stratejisi",
        "cevap_icerik": "Asla sinirlenmeyin veya mal sahibini kışkırtmayın. Fiyatı rasyonel zemine çekin.\n\nEğer alıcı mülkün değerinin %20 altına teklif veriyorsa:\n'Teklifiniz için teşekkürler. Ancak bölgedeki güncel satılmış emsallere (satılık değil, satılmış) baktığımızda bu rakamın çok altında kalıyor. Mal sahibine bu rakamı iletmem ticari olarak saygısızlık olur. Rakamı %X seviyesine çıkarabilirseniz masaya oturabiliriz.'\n\nAlıcıyı kaybetmemek için ona bütçesine uyan 'daha uygun' alternatif portföyler sunarak topu kendinize çevirin."
    },
    {
        "kategori": "Pazarlama Stratejisi",
        "soru_baslik": "Ölü portföy (Aylardır satılmayan ev) nasıl canlandırılır?",
        "cevap_icerik": "Piyasada 3 aydan uzun süre kalan mülk 'yanmış' (eski yüz) kabul edilir.\n\nStrateji:\n1. İlanı tamamen yayından kaldırın ve 15 gün dinlendirin.\n2. Evin fotoğraflarını tamamen değiştirin. Mümkünse eşyaların yerini minimal şekilde değiştirip yeniden profesyonel çekim yapın.\n3. İlan başlığını tamamen yenileyin (Fiyat odaklı değil, hikaye odaklı).\n4. Fiyatta mal sahibiyle %3-%5 arası stratejik bir indirim planlayın ve ilanı yepyeni bir mülk gibi 'YENİ' etiketiyle vizyona sokun."
    },
    {
        "kategori": "Hukuki",
        "soru_baslik": "Tapuda intikal (miras) sorunu varsa izlenecek yol",
        "cevap_icerik": "Satış sürecinde en çok vakit kaybettiren durumdur. Eğer mülk miras yoluyla kalmış ve henüz varisler üzerine intikal etmemişse, kapora almadan DİKKAT!\n\n1. Tüm varislerin satışa rızası olduğundan (Yazılı/Sözlü teyit) emin olun.\n2. İntikal işlemi için varislerin veraset ilamı çıkarmasını ve ilgili vergi dairesinden 'ilişik kesme' belgesini almasını sağlayın.\n3. Kapora sözleşmesine 'Tapu intikal problemlerinden dolayı satışın X gün gecikmesi halinde kaporanın durumu' şeklinde net bir hukuksal şerh 5. madde olarak eklenmelidir."
    }
]

conn = sqlite3.connect(r'C:\Users\alifa\PusulaGayrimenkulV5_2\db.sqlite')
cur = conn.cursor()

# Get target tenant (admin)
u_id = cur.execute("SELECT tenant_id FROM users WHERE username='admin'").fetchone()
tenant_id = u_id[0] if u_id else 1

cur.execute("DELETE FROM piyasa_hafizasi") # Clear old AI generated ones

now = datetime.now(timezone.utc).isoformat()
for s in scenarios:
    cur.execute(
        "INSERT INTO piyasa_hafizasi (kategori, soru_baslik, cevap_icerik, okunma_sayisi, tenant_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (s["kategori"], s["soru_baslik"], s["cevap_icerik"], random.randint(20, 250), tenant_id, now)
    )

conn.commit()
conn.close()
print("Scenarios loaded successfully!")
