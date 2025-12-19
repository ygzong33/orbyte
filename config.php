<?php
// Veritabanı Bağlantı Ayarları
// HOSTING'E YÜKLEDİĞİNİZDE BU BİLGİLERİ GÜNCELLEYIN

define('DB_HOST', 'localhost');        // Veritabanı sunucusu (genellikle localhost)
define('DB_NAME', 'orbyte_db');        // Veritabanı adı
define('DB_USER', 'root');             // Veritabanı kullanıcı adı
define('DB_PASS', '');                 // Veritabanı şifresi
define('DB_CHARSET', 'utf8mb4');

// Güvenlik Ayarları
define('SECRET_KEY', 'orbyte_2024_secret_key_change_this'); // Şifreleme için gizli anahtar
define('ADMIN_SESSION_TIMEOUT', 3600); // Admin oturum süresi (saniye)

// Site Ayarları
define('SITE_URL', 'http://localhost/orbyte'); // Site URL'i
define('UPLOAD_DIR', 'uploads/');      // Yükleme klasörü
define('MAX_UPLOAD_SIZE', 5242880);    // Maksimum dosya boyutu (5MB)

// Hata Raporlama (Canlıya çıkarken kapatın)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('Europe/Istanbul');

// CORS Ayarları (Gerekirse)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Veritabanı Bağlantısı
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    die(json_encode([
        'success' => false,
        'error' => 'Veritabanı bağlantı hatası: ' . $e->getMessage()
    ]));
}

// Güvenlik Fonksiyonları
function sanitize($data) {
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validatePhone($phone) {
    return preg_match('/^[0-9+\s\-()]+$/', $phone);
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// JSON Response Helper
function jsonResponse($success, $data = null, $message = '') {
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
