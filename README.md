# ORBYTE - Dijital ve Fiziksel Çözümler

Modern, dinamik ve tam fonksiyonel bir kurumsal web sitesi. PHP + MySQL backend ile güçlendirilmiş.

## 🚀 ÖZELLİKLER

### Frontend
- ✅ Modern, responsive tasarım
- ✅ Hacker/Cyber temalı arayüz
- ✅ Dinamik haber/forum sistemi
- ✅ AI chatbot entegrasyonu
- ✅ Teklif formu (WhatsApp entegrasyonu)
- ✅ Animasyonlu UI elementleri

### Backend
- ✅ PHP 7.4+ ile geliştirilmiş RESTful API
- ✅ MySQL veritabanı
- ✅ Güvenli admin paneli (session tabanlı)
- ✅ CRUD işlemleri (Create, Read, Update, Delete)
- ✅ SQL Injection koruması (PDO prepared statements)
- ✅ XSS koruması
- ✅ Dosya yükleme (resim) desteği
- ✅ CSV/Excel export özelliği

### Admin Paneli
- ✅ Kullanıcı yönetimi (ekleme, silme, şifre değiştirme)
- ✅ Haber yönetimi (yayınlama, düzenleme, silme)
- ✅ Teklif yönetimi (listeleme, filtreleme, silme)
- ✅ Site ayarları (telefon, duyuru, bakım modu)
- ✅ Excel export özelliği

## 📋 GEREKSİNİMLER

- PHP 7.4 veya üzeri
- MySQL 5.7 veya üzeri / MariaDB 10.2+
- Apache/Nginx web sunucusu
- mod_rewrite (Apache için)
- PDO PHP Extension
- GD Library (resim işleme için)

## 🛠️ KURULUM

### Yerel Geliştirme (XAMPP/WAMP/MAMP)

1. **Dosyaları kopyalayın**
   ```
   C:\xampp\htdocs\orbyte\  (Windows)
   /Applications/MAMP/htdocs/orbyte/  (Mac)
   ```

2. **Veritabanı oluşturun**
   - phpMyAdmin'i açın: `http://localhost/phpmyadmin`
   - Yeni veritabanı oluşturun: `orbyte_db`
   - Karakter seti: `utf8mb4_unicode_ci`

3. **config.php dosyasını düzenleyin**
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'orbyte_db');
   define('DB_USER', 'root');
   define('DB_PASS', '');  // XAMPP'de genellikle boş
   ```

4. **Kurulum scriptini çalıştırın**
   - Tarayıcıda açın: `http://localhost/orbyte/install.php`
   - Kurulum tamamlandıktan sonra `install.php` dosyasını SİLİN!

5. **Admin paneline giriş yapın**
   - URL: `http://localhost/orbyte/admin.html`
   - Kullanıcı: `root`
   - Şifre: `14022006yU+-.`
   - ⚠️ İlk girişten sonra şifrenizi DEĞİŞTİRİN!

### Canlı Sunucuya Yükleme (Hosting)

1. **Hosting hazırlığı**
   - cPanel veya hosting kontrol panelinize girin
   - MySQL veritabanı oluşturun
   - Veritabanı kullanıcısı oluşturun ve tüm yetkileri verin

2. **Dosyaları yükleyin**
   - FTP/SFTP ile tüm dosyaları `public_html` klasörüne yükleyin
   - Veya cPanel File Manager kullanın

3. **config.php'yi güncelleyin**
   ```php
   define('DB_HOST', 'localhost');  // Hosting sağlayıcınız farklı olabilir
   define('DB_NAME', 'kullanici_orbyte');  // cPanel'den aldığınız DB adı
   define('DB_USER', 'kullanici_admin');   // cPanel'den aldığınız kullanıcı
   define('DB_PASS', 'güçlü_şifre_123');   // cPanel'den aldığınız şifre
   ```

4. **Kurulumu çalıştırın**
   - Tarayıcıda: `http://yourdomain.com/install.php`
   - Kurulum tamamlandıktan sonra `install.php` ve `delete_install.php` dosyalarını SİLİN!

5. **Dosya izinlerini ayarlayın**
   ```
   uploads/ klasörü: 755 veya 775
   *.php dosyaları: 644
   ```

## 📁 DOSYA YAPISI

```
orbyte/
├── index.html              # Ana sayfa
├── admin.html              # Admin paneli
├── forum.html              # Haber/Forum sayfası
├── teklif.html             # Teklif formu
├── iletisim.html           # İletişim sayfası
├── hakkimizda.html         # Hakkımızda sayfası
├── style.css               # Ana stil dosyası
├── script.js               # Genel JavaScript
├── admin_backend.js        # Admin panel backend entegrasyonu
│
├── config.php              # Veritabanı yapılandırması
├── install.php             # Kurulum scripti (kurulum sonrası SİL!)
├── delete_install.php      # install.php silme yardımcısı
│
├── api_auth.php            # Kimlik doğrulama API
├── api_haberler.php        # Haberler API
├── api_teklifler.php       # Teklifler API
│
├── uploads/                # Yüklenen dosyalar (resimler)
│   └── .htaccess          # Güvenlik ayarları
│
└── README.md               # Bu dosya
```

## 🔐 GÜVENLİK

### Önemli Güvenlik Adımları

1. **Varsayılan şifreyi değiştirin!**
   - Admin paneline ilk girişte mutlaka şifrenizi değiştirin

2. **install.php'yi silin!**
   - Kurulum tamamlandıktan sonra bu dosya güvenlik riski oluşturur

3. **config.php'yi koruyun**
   - Dosya izinlerini 644 yapın
   - Hassas bilgileri (DB şifresi) güçlü tutun

4. **HTTPS kullanın**
   - Canlı sunucuda mutlaka SSL sertifikası kullanın
   - Let's Encrypt ücretsiz SSL sağlar

5. **Düzenli yedekleme**
   - Veritabanını ve dosyaları düzenli yedekleyin
   - cPanel'den otomatik yedekleme ayarlayın

### Güvenlik Özellikleri

- ✅ SQL Injection koruması (PDO Prepared Statements)
- ✅ XSS koruması (htmlspecialchars)
- ✅ CSRF token sistemi (gelecek güncellemede)
- ✅ Session timeout (1 saat)
- ✅ Şifre hashleme (bcrypt)
- ✅ Dosya yükleme güvenliği (.htaccess ile PHP çalıştırma engelleme)

## 📊 VERİTABANI YAPISI

### Tablolar

1. **haberler** - Haber/duyuru kayıtları
2. **teklifler** - Müşteri teklif talepleri
3. **admin_users** - Yönetici kullanıcılar
4. **site_settings** - Site ayarları
5. **forum_posts** - Forum mesajları (gelecek)
6. **activity_logs** - Aktivite logları

## 🔧 API KULLANIMI

### Kimlik Doğrulama

**Giriş Yap**
```javascript
POST /api_auth.php?action=login
Body: { "username": "root", "password": "şifre" }
```

**Çıkış Yap**
```javascript
POST /api_auth.php?action=logout
```

### Haberler

**Liste**
```javascript
GET /api_haberler.php?action=list&durum=aktif
```

**Yeni Haber**
```javascript
POST /api_haberler.php?action=create
Body: { "title": "Başlık", "content": "İçerik", "image": "base64..." }
```

**Haber Sil**
```javascript
DELETE /api_haberler.php?action=delete
Body: { "id": 1 }
```

### Teklifler

**Liste**
```javascript
GET /api_teklifler.php?action=list&search=arama
```

**Yeni Teklif**
```javascript
POST /api_teklifler.php?action=create
Body: { "ad": "İsim", "tel": "05xx", "hizmet": "Web", "not": "Detay" }
```

**Excel Export**
```javascript
GET /api_teklifler.php?action=export
```

## 🐛 SORUN GİDERME

### "Veritabanı bağlantı hatası"
- `config.php` dosyasındaki bilgileri kontrol edin
- MySQL servisinin çalıştığından emin olun
- Veritabanı kullanıcısının yetkileri olduğundan emin olun

### "Call to undefined function mysqli_connect"
- PHP MySQL extension'ı yüklü değil
- XAMPP: `php.ini` dosyasında `extension=mysqli` satırını aktif edin

### "Permission denied" hatası
- `uploads/` klasörünün yazma izni olmalı (755 veya 775)
- Linux/Mac: `chmod -R 755 uploads/`

### Resimler yüklenmiyor
- `uploads/` klasörünün var olduğundan emin olun
- Dosya boyutu limitini kontrol edin (config.php: MAX_UPLOAD_SIZE)
- PHP upload_max_filesize ve post_max_size ayarlarını kontrol edin

### Admin paneline giriş yapamıyorum
- Tarayıcı console'unu açın (F12) ve hata mesajlarını kontrol edin
- Session cookie'lerini temizleyin
- `install.php`'nin tekrar çalıştırılması gerekebilir

## 📞 DESTEK

- **Web:** https://orbyte.com
- **E-posta:** info@orbyte.com
- **Telefon:** 0549 167 90 67
- **WhatsApp:** +90 549 167 90 67

## 📝 LİSANS

Bu proje ORBYTE Teknoloji tarafından geliştirilmiştir.
Tüm hakları saklıdır © 2024

## 🔄 GÜNCELLEME GEÇMİŞİ

### v2.0.0 (2024-12-12)
- ✅ PHP + MySQL backend eklendi
- ✅ RESTful API sistemi
- ✅ Gerçek veritabanı entegrasyonu
- ✅ Güvenlik iyileştirmeleri
- ✅ Excel export özelliği

### v1.0.0 (2024-11-27)
- ✅ İlk sürüm (localStorage tabanlı)
- ✅ Frontend tasarımı
- ✅ Admin paneli
- ✅ AI chatbot

## 🚀 GELECEKTEKİ ÖZELLIKLER

- [ ] E-posta bildirimleri
- [ ] SMS entegrasyonu
- [ ] Gelişmiş raporlama
- [ ] Çoklu dil desteği
- [ ] PWA (Progressive Web App)
- [ ] REST API dokümantasyonu
- [ ] Unit testler

---

**Geliştirici Notu:** Bu sistem production-ready durumdadır. Hosting'e yükleyip kullanabilirsiniz. Herhangi bir sorun yaşarsanız yukarıdaki iletişim bilgilerinden bize ulaşabilirsiniz.

**Önemli:** İlk kurulumdan sonra mutlaka:
1. install.php dosyasını silin
2. Root şifresini değiştirin
3. config.php'deki SECRET_KEY'i değiştirin
4. Düzenli veritabanı yedeği alın
