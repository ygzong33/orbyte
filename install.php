<?php
/**
 * ORBYTE Veritabanı Kurulum Scripti
 * Bu dosyayı tarayıcıda bir kez çalıştırın: http://yourdomain.com/install.php
 * Kurulum tamamlandıktan sonra bu dosyayı SİLİN!
 */

require_once 'config.php';

$errors = [];
$success = [];

// Veritabanı tablolarını oluştur
try {
    // 1. Haberler Tablosu
    $pdo->exec("CREATE TABLE IF NOT EXISTS haberler (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        summary TEXT,
        content TEXT NOT NULL,
        image VARCHAR(500),
        tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
        yazar VARCHAR(100),
        goruntuleme INT DEFAULT 0,
        durum ENUM('aktif', 'pasif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_tarih (tarih),
        INDEX idx_durum (durum)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $success[] = "✓ Haberler tablosu oluşturuldu";

    // 2. Teklifler Tablosu
    $pdo->exec("CREATE TABLE IF NOT EXISTS teklifler (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ad VARCHAR(100) NOT NULL,
        tel VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        hizmet VARCHAR(100) NOT NULL,
        not TEXT,
        tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
        durum ENUM('yeni', 'inceleniyor', 'tamamlandi', 'iptal') DEFAULT 'yeni',
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tarih (tarih),
        INDEX idx_durum (durum),
        INDEX idx_hizmet (hizmet)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $success[] = "✓ Teklifler tablosu oluşturuldu";

    // 3. Admin Kullanıcılar Tablosu
    $pdo->exec("CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
        last_login DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $success[] = "✓ Admin kullanıcılar tablosu oluşturuldu";

    // 4. Site Ayarları Tablosu
    $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type VARCHAR(50) DEFAULT 'text',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_key (setting_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $success[] = "✓ Site ayarları tablosu oluşturuldu";

    // 5. Forum Mesajları Tablosu
    $pdo->exec("CREATE TABLE IF NOT EXISTS forum_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        parent_id INT DEFAULT NULL,
        tarih DATETIME DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45),
        durum ENUM('aktif', 'pasif', 'spam') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
        INDEX idx_tarih (tarih),
        INDEX idx_parent (parent_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $success[] = "✓ Forum mesajları tablosu oluşturuldu";

    // 6. Aktivite Logları Tablosu
    $pdo->exec("CREATE TABLE IF NOT EXISTS activity_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_created (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci");
    $success[] = "✓ Aktivite logları tablosu oluşturuldu";

    // Varsayılan root kullanıcısını ekle
    $rootPassword = hashPassword('14022006yU+-.');
    $stmt = $pdo->prepare("INSERT IGNORE INTO admin_users (username, password, email, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['root', $rootPassword, 'admin@orbyte.com', 'admin']);
    $success[] = "✓ Root kullanıcısı oluşturuldu (Kullanıcı: root, Şifre: 14022006yU+-.)";

    // Varsayılan site ayarlarını ekle
    $defaultSettings = [
        ['siteTitle', 'ORBYTE - Dijital ve Fiziksel Çözümler', 'text'],
        ['sitePhone', '+905491679067', 'text'],
        ['siteDuyuru', 'Kamera Montajı | Sunucu | Web | Güvenlik | Enerji', 'text'],
        ['siteBakim', 'false', 'boolean'],
        ['showHero', 'true', 'boolean'],
        ['showServices', 'true', 'boolean']
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?)");
    foreach ($defaultSettings as $setting) {
        $stmt->execute($setting);
    }
    $success[] = "✓ Varsayılan site ayarları eklendi";

    // Uploads klasörünü oluştur
    if (!file_exists(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0755, true);
        $success[] = "✓ Uploads klasörü oluşturuldu";
    }

    // .htaccess dosyası oluştur (güvenlik için)
    $htaccess = "# ORBYTE Security Settings
RewriteEngine On

# PHP dosyalarını uploads klasöründe çalıştırma
<FilesMatch \"\.(php|php3|php4|php5|phtml)$\">
    Order Deny,Allow
    Deny from all
</FilesMatch>

# Sadece resim dosyalarına izin ver
<FilesMatch \"\.(jpg|jpeg|png|gif|webp)$\">
    Order Allow,Deny
    Allow from all
</FilesMatch>";

    file_put_contents(UPLOAD_DIR . '.htaccess', $htaccess);
    $success[] = "✓ Güvenlik ayarları yapılandırıldı";

} catch (PDOException $e) {
    $errors[] = "✗ Hata: " . $e->getMessage();
}

?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ORBYTE Kurulum</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #0f0;
            padding: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: #111;
            border: 2px solid #0f0;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }
        h1 {
            color: #0f0;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2rem;
            text-shadow: 0 0 10px #0f0;
        }
        .success {
            background: rgba(0, 255, 0, 0.1);
            border-left: 4px solid #0f0;
            padding: 10px 15px;
            margin: 10px 0;
            color: #0f0;
        }
        .error {
            background: rgba(255, 0, 0, 0.1);
            border-left: 4px solid #f00;
            padding: 10px 15px;
            margin: 10px 0;
            color: #f00;
        }
        .warning {
            background: rgba(255, 255, 0, 0.1);
            border-left: 4px solid #ff0;
            padding: 15px;
            margin: 20px 0;
            color: #ff0;
            font-weight: bold;
        }
        .info {
            background: rgba(0, 150, 255, 0.1);
            border: 1px solid #09f;
            padding: 15px;
            margin: 20px 0;
            color: #09f;
        }
        .btn {
            display: inline-block;
            background: none;
            border: 2px solid #0f0;
            color: #0f0;
            padding: 12px 30px;
            text-decoration: none;
            margin: 20px 10px 0 0;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            font-size: 1rem;
        }
        .btn:hover {
            background: #0f0;
            color: #000;
            box-shadow: 0 0 15px #0f0;
        }
        .btn-danger {
            border-color: #f00;
            color: #f00;
        }
        .btn-danger:hover {
            background: #f00;
            color: #fff;
            box-shadow: 0 0 15px #f00;
        }
        code {
            background: #000;
            padding: 2px 6px;
            border-radius: 3px;
            color: #0f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>&gt;_ ORBYTE KURULUM</h1>

        <?php if (!empty($errors)): ?>
            <h2 style="color: #f00; margin: 20px 0;">HATALAR:</h2>
            <?php foreach ($errors as $error): ?>
                <div class="error"><?php echo $error; ?></div>
            <?php endforeach; ?>
        <?php endif; ?>

        <?php if (!empty($success)): ?>
            <h2 style="color: #0f0; margin: 20px 0;">BAŞARILI İŞLEMLER:</h2>
            <?php foreach ($success as $msg): ?>
                <div class="success"><?php echo $msg; ?></div>
            <?php endforeach; ?>
        <?php endif; ?>

        <?php if (empty($errors)): ?>
            <div class="warning">
                ⚠️ GÜVENLİK UYARISI: Kurulum tamamlandı! Şimdi bu dosyayı (install.php) SİLİN!
            </div>

            <div class="info">
                <h3 style="margin-bottom: 10px;">📋 SONRAKİ ADIMLAR:</h3>
                <ol style="margin-left: 20px;">
                    <li><code>config.php</code> dosyasındaki veritabanı bilgilerini kontrol edin</li>
                    <li>Admin paneline giriş yapın: <code>admin.html</code></li>
                    <li>Varsayılan giriş bilgileri:
                        <ul style="margin-left: 20px; margin-top: 5px;">
                            <li>Kullanıcı: <code>root</code></li>
                            <li>Şifre: <code>14022006yU+-.</code></li>
                        </ul>
                    </li>
                    <li>⚠️ İlk girişten sonra şifrenizi DEĞİŞTİRİN!</li>
                    <li>HTML dosyalarındaki localStorage kodlarını kaldırın (artık veritabanı kullanılıyor)</li>
                </ol>
            </div>

            <div class="info">
                <h3 style="margin-bottom: 10px;">🔧 HOSTING AYARLARI:</h3>
                <p>Hosting'e yüklerken:</p>
                <ol style="margin-left: 20px; margin-top: 5px;">
                    <li><code>config.php</code> içindeki veritabanı bilgilerini güncelleyin</li>
                    <li>cPanel'den MySQL veritabanı oluşturun</li>
                    <li>Tüm dosyaları <code>public_html</code> klasörüne yükleyin</li>
                    <li>Tarayıcıdan <code>http://yourdomain.com/install.php</code> adresini açın</li>
                    <li>Kurulum tamamlandıktan sonra <code>install.php</code> dosyasını silin</li>
                </ol>
            </div>

            <a href="admin.html" class="btn">ADMIN PANELİNE GİT</a>
            <a href="index.html" class="btn">ANA SAYFAYA GİT</a>
            <button onclick="if(confirm('install.php dosyasını silmek istediğinize emin misiniz?')) window.location.href='delete_install.php'" class="btn btn-danger">KURULUM DOSYASINI SİL</button>
        <?php else: ?>
            <div class="error">
                <h3>Kurulum tamamlanamadı!</h3>
                <p>Lütfen <code>config.php</code> dosyasındaki veritabanı ayarlarını kontrol edin.</p>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
