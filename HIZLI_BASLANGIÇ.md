# 🚀 ORBYTE PROJESİ - HIZLI BAŞLANGIÇ REHBERİ

## 📦 PROJE HAZIR!

Projeniz artık **tam fonksiyonel** bir backend sisteme sahip ve hosting'e yüklenmeye hazır!

## ⚡ HIZLI KURULUM (5 Dakika)

### 1️⃣ HOSTING HAZIRLIĞI

**cPanel'e girin ve:**

1. **MySQL Veritabanı Oluşturun**
   - MySQL Databases → Create New Database
   - İsim: `orbyte_db` (veya istediğiniz isim)
   - Karakter seti: `utf8mb4_unicode_ci`

2. **Veritabanı Kullanıcısı Oluşturun**
   - Add New User
   - Kullanıcı adı: `orbyte_admin`
   - Güçlü bir şifre belirleyin
   - Create User

3. **Kullanıcıyı Veritabanına Bağlayın**
   - Add User To Database
   - Tüm yetkileri verin (ALL PRIVILEGES)

### 2️⃣ DOSYALARI YÜKLEYIN

**FTP veya cPanel File Manager ile:**

```
Tüm dosyaları public_html klasörüne yükleyin
```

**Önemli:** Tüm dosyalar ve klasörler yüklenmelidir!

### 3️⃣ CONFIG.PHP'Yİ DÜZENLEYİN

cPanel File Manager'dan `config.php` dosyasını açın ve düzenleyin:

```php
define('DB_HOST', 'localhost');           // Genellikle localhost
define('DB_NAME', 'kullanici_orbyte_db'); // Oluşturduğunuz DB adı
define('DB_USER', 'kullanici_orbyte');    // Oluşturduğunuz kullanıcı
define('DB_PASS', 'güçlü_şifreniz');      // Belirlediğiniz şifre
```

**Ayrıca değiştirin:**
```php
define('SECRET_KEY', 'yeni_gizli_anahtar_123!@#'); // Rastgele bir şifre
define('SITE_URL', 'https://yourdomain.com');      // Kendi domain'iniz
```

### 4️⃣ KURULUMU ÇALIŞTIRIN

Tarayıcınızda açın:
```
https://yourdomain.com/install.php
```

✅ Tüm işlemler başarılı olduğunda:
- Tablolar oluşturuldu
- Root kullanıcısı eklendi
- Varsayılan ayarlar yapıldı

### 5️⃣ GÜVENLİK!

**ÇOK ÖNEMLİ:** Kurulum tamamlandıktan sonra:

1. `install.php` dosyasını **SİLİN**
2. `delete_install.php` dosyasını **SİLİN**

cPanel File Manager'dan bu dosyaları seçip Delete edin.

### 6️⃣ ADMİN PANELİNE GİRİN

```
https://yourdomain.com/admin.html
```

**Varsayılan Giriş Bilgileri:**
- Kullanıcı: `root`
- Şifre: `14022006yU+-.`

⚠️ **İlk girişten sonra mutlaka şifrenizi değiştirin!**

## 🎯 HEMEN TEST EDİN

### ✅ Frontend Test
1. Ana sayfayı açın: `https://yourdomain.com`
2. Forum sayfasını açın: `https://yourdomain.com/forum.html`
3. Teklif formu gönderin: `https://yourdomain.com/teklif.html`

### ✅ Admin Panel Test
1. Admin paneline girin
2. Yeni bir haber yayınlayın
3. Gelen teklifleri kontrol edin
4. Excel export deneyin

## 📋 DOSYA YAPISI

```
orbyte/
│
├── 🌐 FRONTEND (HTML/CSS/JS)
│   ├── index.html              # Ana sayfa
│   ├── admin.html              # Admin paneli
│   ├── forum.html              # Haberler
│   ├── teklif.html             # Teklif formu
│   ├── style.css               # Stil dosyası
│   └── script.js               # JavaScript
│
├── ⚙️ BACKEND (PHP/MySQL)
│   ├── config.php              # Veritabanı ayarları ⚠️ DÜZENLE
│   ├── install.php             # Kurulum scripti ⚠️ SİL
│   ├── api_auth.php            # Kimlik doğrulama
│   ├── api_haberler.php        # Haber API
│   ├── api_teklifler.php       # Teklif API
│   └── admin_backend.js        # Admin entegrasyonu
│
├── 📁 DİĞER
│   ├── .htaccess               # Apache ayarları
│   ├── README.md               # Detaylı dokümantasyon
│   └── KURULUM_KONTROL.md      # Kontrol listesi
│
└── 📤 uploads/                 # Yüklenen dosyalar (otomatik oluşur)
```

## 🔧 ÖNEMLİ AYARLAR

### WhatsApp Numarası Değiştirme

`teklif.html` dosyasını açın ve şu satırı bulun:

```javascript
var myPhone = "905491679067";  // ← Buraya kendi numaranızı yazın
```

### Site Telefon Numarası

Admin panelden değiştirilebilir:
- Admin Panel → SİSTEM TELEFONU → Numarayı girin

## 🆘 SORUN MU YAŞIYORSUNUZ?

### "Veritabanı bağlantı hatası"
→ `config.php` dosyasındaki bilgileri kontrol edin

### "500 Internal Server Error"
→ `.htaccess` dosyasını geçici olarak silin ve tekrar deneyin

### "Resimler yüklenmiyor"
→ `uploads/` klasörünün yazma izni olmalı (755)

### "Admin paneline giriş yapamıyorum"
→ Tarayıcı console'unu açın (F12) ve hataları kontrol edin

**Detaylı sorun giderme:** `README.md` dosyasına bakın

## 📞 DESTEK

- **Telefon:** 0549 167 90 67
- **WhatsApp:** +90 549 167 90 67
- **E-posta:** info@orbyte.com

## 🎉 TAMAMLANDI!

Artık siteniz canlıda ve çalışıyor!

### Yapılacaklar:
- ✅ Hosting'e yüklendi
- ✅ Veritabanı oluşturuldu
- ✅ Kurulum tamamlandı
- ✅ install.php silindi
- ✅ Admin şifresi değiştirildi
- ✅ Test haberi yayınlandı
- ✅ Teklif formu test edildi

### Sonraki Adımlar:
1. SSL sertifikası yükleyin (Let's Encrypt - Ücretsiz)
2. Google Analytics ekleyin
3. Site haritası (sitemap.xml) oluşturun
4. Google Search Console'a ekleyin
5. Düzenli yedekleme ayarlayın

---

**🚀 Başarılar dileriz!**

*ORBYTE Teknoloji © 2024*
