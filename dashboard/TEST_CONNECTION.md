# Dashboard Bağlantı Testi

## ✅ Durum Kontrolü

### Backend (FastAPI)
- **Port**: 5555
- **URL**: http://localhost:5555
- **Durum**: ✅ ÇALIŞIYOR

### Dashboard (Next.js)
- **Port**: 3000
- **URL**: http://localhost:3000
- **Durum**: ✅ ÇALIŞIYOR (Port dinliyor)
- **Derleme**: ✅ Başarılı

---

## 🔧 Tarayıcıda Açılmıyorsa Deneyin

### 1️⃣ Farklı URL'ler
Tarayıcınızda sırayla şunları deneyin:
```
http://localhost:3000
http://127.0.0.1:3000
http://0.0.0.0:3000
```

### 2️⃣ Tarayıcı Cache Temizliği
- **Chrome/Edge**: `Ctrl + Shift + Delete` tuşlarına basın
- "Önbelleğe alınmış resimler ve dosyalar" seçeneğini işaretleyin
- "Verileri temizle" butonuna tıklayın
- Sayfayı yenileyin: `Ctrl + F5`

### 3️⃣ Gizli Mod (Incognito)
- **Chrome/Edge**: `Ctrl + Shift + N`
- Gizli pencerede `http://localhost:3000` açın

### 4️⃣ Farklı Tarayıcı
- Chrome kullanıyorsanız → Edge deneyin
- Edge kullanıyorsanız → Chrome deneyin

### 5️⃣ Firewall/Antivirus Kontrolü
Windows Defender veya antivirüs programınız port 3000'i engelliyor olabilir.

---

## 🔍 Manuel Test

Terminal'de şu komutu çalıştırın:
```powershell
Test-NetConnection -ComputerName localhost -Port 3000
```

Başarılı ise `TcpTestSucceeded : True` görmelisiniz.

---

## 📱 Alternatif: Static HTML ile Test

Eğer hala açılmıyorsa, basit bir test sayfası oluşturalım:

1. Tarayıcınızda şunu açın:
   ```
   file:///c:/Users/alifa/Desktop/app_emlak_5_2/static/index.html
   ```

2. Bu açılıyorsa, sorun Next.js'te değil tarayıcı ayarlarındadır.

---

## 🆘 Hala Çalışmıyorsa

Dashboard'u farklı bir portta başlatalım:
```bash
cd c:\Users\alifa\Desktop\app_emlak_5_2\dashboard
set PORT=3001
npm run dev
```

Sonra `http://localhost:3001` adresini deneyin.
