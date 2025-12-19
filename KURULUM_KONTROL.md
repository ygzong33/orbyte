# ORBYTE KURULUM KONTROL LİSTESİ

## ✅ HOSTING'E YÜKLEMEDEN ÖNCE

### 1. Dosya Kontrolü
- [ ] Tüm HTML dosyaları mevcut (index.html, admin.html, forum.html, teklif.html, vb.)
- [ ] Tüm PHP dosyaları mevcut (config.php, api_*.php, install.php)
- [ ] CSS ve JS dosyaları mevcut (style.css, script.js, admin_backend.js)
- [ ] .htaccess dosyası mevcut
- [ ] README.md dosyası mevcut

### 2. config.php Düzenleme
- [ ] DB_HOST ayarlandı (genellikle 'localhost')
- [ ] DB_NAME ayarlandı (hosting'den aldığınız veritabanı adı)
- [ ] DB_USER ayarlandı (hosting'den aldığınız kullanıcı adı)
- [ ] DB_PASS ayarlandı (hosting'den aldığınız şifre)
- [ ] SECRET_KEY değiştirildi (güvenlik için)
- [ ] SITE_URL güncellendi (http://yourdomain.com)

### 3. Güvenlik Kontrolleri
- [ ] Varsayılan şifreler değiştirildi
- [ ] SECRET_KEY güçlü ve benzersiz
- [ ] error_reporting canlı sunucuda kapalı

## 📤 HOSTING'E YÜKLEME

### 1. FTP/SFTP ile Yükleme
- [ ] FileZilla veya benzeri FTP programı kuruldu
- [ ] Hosting FTP bilgileri alındı
- [ ] Tüm dosyalar public_html klasörüne yüklendi
- [ ] Dosya izinleri kontrol edildi:
  - [ ] uploads/ klasörü: 755 veya 775
  - [ ] *.php dosyaları: 644
  - [ ] .htaccess: 644

### 2. Veritabanı Oluşturma (cPanel)
- [ ] cPanel'e giriş yapıldı
- [ ] MySQL Databases bölümüne gidildi
- [ ] Yeni veritabanı oluşturuldu (örn: kullanici_orbyte)
- [ ] Yeni kullanıcı oluşturuldu (örn: kullanici_admin)
- [ ] Güçlü şifre belirlendi
- [ ] Kullanıcı veritabanına bağlandı (ALL PRIVILEGES)
- [ ] Veritabanı bilgileri config.php'ye yazıldı

### 3. Kurulum Scripti Çalıştırma
- [ ] Tarayıcıda http://yourdomain.com/install.php açıldı
- [ ] Tüm tablolar başarıyla oluşturuldu
- [ ] Root kullanıcısı oluşturuldu
- [ ] Varsayılan ayarlar eklendi
- [ ] uploads/ klasörü oluşturuldu
- [ ] Güvenlik ayarları yapılandırıldı

### 4. Kurulum Sonrası
- [ ] install.php dosyası SİLİNDİ (GÜVENLİK!)
- [ ] delete_install.php dosyası SİLİNDİ
- [ ] Admin paneline giriş yapıldı (admin.html)
- [ ] Root şifresi DEĞİŞTİRİLDİ
- [ ] Test haberi yayınlandı
- [ ] Test teklifi gönderildi
- [ ] Tüm sayfalar kontrol edildi

## 🔧 YAPILANDIRMA

### 1. Admin Paneli Ayarları
- [ ] Site telefon numarası güncellendi
- [ ] Ana sayfa duyurusu ayarlandı
- [ ] Yeni admin kullanıcıları eklendi (gerekirse)
- [ ] Test haberleri silindi

### 2. WhatsApp Entegrasyonu
- [ ] teklif.html içindeki telefon numarası güncellendi
- [ ] Test mesajı gönderildi ve alındı

### 3. E-posta Ayarları (Gelecek)
- [ ] SMTP ayarları yapılandırıldı
- [ ] Test e-postası gönderildi

## 🔒 GÜVENLİK KONTROLLERİ

### 1. Dosya Güvenliği
- [ ] install.php SİLİNDİ
- [ ] config.php dosya izinleri 644
- [ ] uploads/.htaccess mevcut (PHP çalıştırma engellendi)
- [ ] Hassas dosyalar .htaccess ile korundu

### 2. Veritabanı Güvenliği
- [ ] Veritabanı şifresi güçlü (en az 12 karakter, karışık)
- [ ] Root MySQL kullanıcısı kullanılmıyor
- [ ] Veritabanı kullanıcısı sadece gerekli yetkilere sahip

### 3. SSL/HTTPS
- [ ] SSL sertifikası yüklendi (Let's Encrypt önerilir)
- [ ] .htaccess'te HTTPS yönlendirmesi aktif edildi
- [ ] config.php'de session.cookie_secure = 1 yapıldı

### 4. Yedekleme
- [ ] cPanel'den otomatik yedekleme ayarlandı
- [ ] Manuel veritabanı yedeği alındı
- [ ] Manuel dosya yedeği alındı

## 🧪 TEST SENARYOLARI

### 1. Frontend Testleri
- [ ] Ana sayfa yükleniyor
- [ ] Hizmetler bölümü görünüyor
- [ ] Forum/Haberler sayfası çalışıyor
- [ ] Teklif formu gönderiliyor
- [ ] WhatsApp yönlendirmesi çalışıyor
- [ ] AI Chatbot yanıt veriyor
- [ ] Mobil uyumluluk kontrol edildi

### 2. Admin Paneli Testleri
- [ ] Giriş yapılabiliyor
- [ ] Haber eklenebiliyor
- [ ] Haber düzenlenebiliyor
- [ ] Haber silinebiliyor
- [ ] Resim yüklenebiliyor
- [ ] Teklifler listeleniyor
- [ ] Teklif silinebiliyor
- [ ] Excel export çalışıyor
- [ ] Kullanıcı eklenebiliyor
- [ ] Şifre değiştirilebiliyor

### 3. API Testleri
- [ ] api_haberler.php?action=list çalışıyor
- [ ] api_teklifler.php?action=list çalışıyor
- [ ] api_auth.php?action=login çalışıyor
- [ ] Hata mesajları düzgün dönüyor
- [ ] JSON formatı doğru

## 📊 PERFORMANS OPTİMİZASYONU

### 1. Sunucu Tarafı
- [ ] Gzip sıkıştırma aktif (.htaccess)
- [ ] Tarayıcı önbellekleme ayarlandı
- [ ] PHP opcache aktif (hosting ayarları)
- [ ] MySQL query cache aktif

### 2. Frontend
- [ ] Resimler optimize edildi (TinyPNG, ImageOptim)
- [ ] CSS/JS dosyaları minify edildi (gerekirse)
- [ ] Lazy loading uygulandı (gerekirse)

## 🐛 SORUN GİDERME

### Sık Karşılaşılan Hatalar

**"Veritabanı bağlantı hatası"**
- [ ] config.php bilgileri doğru mu?
- [ ] Veritabanı kullanıcısı oluşturuldu mu?
- [ ] Kullanıcı veritabanına bağlandı mı?

**"500 Internal Server Error"**
- [ ] .htaccess syntax hatası var mı?
- [ ] PHP hata loglarını kontrol et
- [ ] Dosya izinleri doğru mu?

**"Resimler yüklenmiyor"**
- [ ] uploads/ klasörü var mı?
- [ ] uploads/ yazma izni var mı? (755)
- [ ] PHP upload_max_filesize yeterli mi?

**"Admin paneline giriş yapamıyorum"**
- [ ] install.php çalıştırıldı mı?
- [ ] Tarayıcı console'da hata var mı?
- [ ] API dosyaları erişilebilir mi?

## 📞 DESTEK

Sorun yaşıyorsanız:
1. README.md dosyasını okuyun
2. Tarayıcı console'unu kontrol edin (F12)
3. PHP hata loglarını kontrol edin
4. Bizimle iletişime geçin:
   - E-posta: info@orbyte.com
   - Telefon: 0549 167 90 67
   - WhatsApp: +90 549 167 90 67

## ✅ KURULUM TAMAMLANDI!

Tüm adımları tamamladıysanız, siteniz artık canlıda!

**Son Kontroller:**
- [ ] https://yourdomain.com açılıyor
- [ ] Tüm sayfalar çalışıyor
- [ ] Admin paneli erişilebilir
- [ ] Haberler yayınlanabiliyor
- [ ] Teklifler kaydediliyor
- [ ] WhatsApp entegrasyonu çalışıyor

**Hayırlı olsun! 🎉**

---

**Not:** Bu kontrol listesini yazdırıp işaretleyerek ilerleyebilirsiniz.
Her adımı dikkatlice tamamlamak, sorunsuz bir kurulum sağlar.
