# OmNexus - Akıllı Emlak Platformu

OmNexus, gayrimenkul veri analizi, dinamik fiyat tahmini ve hedefli pazar araştırması (lead) sunan kapsamlı yeni nesil bir akıllı emlak asistanıdır. Python (FastAPI) tabanlı gelişmiş bir API ve modern bir Next.js (React) yapısı ile geliştirilmiştir.

## ✨ Temel Özellikler

- **Gelişmiş Değerleme & Fiyat Tahmini:** Lokasyon bazlı analizler ve ağırlıklı benzerlik skorlarıyla (Alan, Mesafe, Yaş vb.) konut, arsa ve ticari gayrimenkuller için yüksek isabetle satılık ve kiralık fiyat tahmini yapar.
- **Danışman Zekası (AI Destekli Analiz):** Google Gemini yapay zekası ile entegre çalışarak sunulan fiyatı etkileyen temel faktörleri değerlendirir, risk durumunu belirler ve müşteriye/yatırımcıya özel raporlar oluşturur.
- **Sahibinden (FSBO) Müşteri Bulucu:** Özel scraper kurgusuyla internetteki sahibinden ilanları tarar, yatırım portföyü olabilecek adayları puanlar (FSBO Skoru) ve sisteme çeker.
- **Gelişmiş Tenant & Kullanıcı Yönetimi:** Çoklu ofis (tenant) desteği, rol tabanlı (admin, user) güvenli yetkilendirme (JWT & Bcrypt) ve yapılan her işlem için denetim günlüğü (audit log).
- **Detaylı Özellik Filtreleri:** Brüt/Net m²'den KAKS oranına, bina katından tapu/imar durumlarına kadar çok detaylı ilan özellikleri tanımlanabilir ve excel (OpenPyXL) dışa/içe aktarım yapılabilir.

## 🛠️ Teknolojiler

- **Backend:** Python 3, FastAPI, SQLite, Pydantic, APScheduler, Google GenAI
- **Frontend / Dashboard:** React 18, Next.js 14, Tailwind CSS, React Leaflet (Haritalar), Lucide React
- **Veri & Raporlama:** BeautifulSoup (Scraping), FPDF (PDF raporlar), OpenPyXL (Excel)

## 🚀 Kurulum ve Çalıştırma (Windows)

Proje dizininde yer alan, tüm frontend ve backend port çakışmalarını önleyip her iki servisi eşzamanlı başlatan bir powershell script'i bulunmaktadır.

1. Proje dizininde bir PowerShell penceresi açın.
2. `baslat.ps1` dosyasını çalıştırın:
   ```powershell
   .\baslat.ps1
   ```
   *(Eğer yetki hatası (Execution Policy) ile karşılaşırsanız `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` komutunu uygulayabilirsiniz.)*
3. Sistem çalıştığında tarayıcınızda otomatik olarak **http://localhost:3000** adresini (Dashboard) açacaktır. Backend ise arka planda **5555** portunda çalışacaktır.
4. **API Dökümantasyonu:** Swagger UI için sistem açıkken `http://localhost:5555/docs` adresini ziyaret edebilirsiniz.

> **💡 İlk Giriş:**
> Proje ilk ayağa kalktığında, `db.sqlite` içerisine otomatik veritabanı tabloları kurulur. Sistem varsayılan kullanıcı olarak bir admin atar: 
> - **Kullanıcı:** `admin` 
> - **Şifre:** `admin123`

## ⚙️ Çevresel Değişkenler (ENV)

Uygulamanın yapay zeka yeteneklerini tam kapasiteyle kullanabilmesi için sisteminizde tanımlı bir `GEMINI_API_KEY` sistem değişkenine (Environment Variable) veya üretim ortamında uygun gizli anahtarlara ihtiyacınız vardır. (Varsayılan olarak test anahtarı atanmıştır.)

---

## Proje Bakımı İçin İpuçları

* **Ortak konfigürasyon** – `config.py` dosyası, tüm sabitleri (DB_PATH, BASE_DIR, SECRET_KEY vb.) merkezi olarak barındırır. Yeni bir script oluştururken bu değerleri tekrar yazmayın, modülden import edin.
* **Detaylı docstringler** – fonksiyon başlarında açıklama yazmak, otomatik dokümantasyon üretimi ve IDE desteği için önemlidir. Özellikle `main.py` ve `scraper.py` gibi büyük dosyalarda kullanın.
* **Çevresel değerler** – gizli anahtar ve API token’ları kodda sabitlemek yerine `.env` veya ortam değişkenleri kullanın.
* **Veri deposu değişiklikleri** – veritabanı şemasına ekleme/silme işlemleri `init_db()` fonksiyonuna belgelendirilmiş olmalı; mümkünse migration araçlarıyla yönetilmeli.
* **Küçük modüller** – tek bir dosyada birkaç yüz satır kod varsa, fonksiyonları mantıksal modüllere ayırın (`utils.py`, `db.py`, `scraper.py` vb.) bu, test yazmayı da kolaylaştırır.

Bu adımlar, kodun büyümesini ve projeye yeni geliştiricilerin katılımını çok daha sorunsuz hale getirir.