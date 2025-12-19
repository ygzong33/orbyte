<?php
/**
 * API Endpoint: Admin Authentication
 * Giriş, çıkış, kullanıcı yönetimi
 */

require_once 'config.php';

session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// GİRİŞ YAP
if ($method === 'POST' && $action === 'login') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $username = isset($data['username']) ? sanitize($data['username']) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        
        if (empty($username) || empty($password)) {
            jsonResponse(false, null, 'Kullanıcı adı ve şifre gerekli');
        }
        
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user || !verifyPassword($password, $user['password'])) {
            jsonResponse(false, null, 'Kullanıcı adı veya şifre hatalı');
        }
        
        // Session oluştur
        $_SESSION['admin_id'] = $user['id'];
        $_SESSION['admin_username'] = $user['username'];
        $_SESSION['admin_role'] = $user['role'];
        $_SESSION['login_time'] = time();
        
        // Son giriş zamanını güncelle
        $pdo->prepare("UPDATE admin_users SET last_login = NOW() WHERE id = ?")->execute([$user['id']]);
        
        // Log kaydet
        $pdo->prepare("INSERT INTO activity_logs (user_id, action, ip_address) VALUES (?, ?, ?)")
            ->execute([$user['id'], 'login', $_SERVER['REMOTE_ADDR']]);
        
        jsonResponse(true, [
            'username' => $user['username'],
            'role' => $user['role'],
            'session_id' => session_id()
        ], 'Giriş başarılı');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// ÇIKIŞ YAP
elseif ($method === 'POST' && $action === 'logout') {
    if (isset($_SESSION['admin_id'])) {
        $pdo->prepare("INSERT INTO activity_logs (user_id, action, ip_address) VALUES (?, ?, ?)")
            ->execute([$_SESSION['admin_id'], 'logout', $_SERVER['REMOTE_ADDR']]);
    }
    
    session_destroy();
    jsonResponse(true, null, 'Çıkış başarılı');
}

// SESSION KONTROL
elseif ($method === 'GET' && $action === 'check') {
    if (isset($_SESSION['admin_id']) && isset($_SESSION['login_time'])) {
        // Session timeout kontrolü
        if (time() - $_SESSION['login_time'] > ADMIN_SESSION_TIMEOUT) {
            session_destroy();
            jsonResponse(false, null, 'Oturum süresi doldu');
        }
        
        jsonResponse(true, [
            'username' => $_SESSION['admin_username'],
            'role' => $_SESSION['admin_role']
        ], 'Oturum aktif');
    } else {
        jsonResponse(false, null, 'Oturum bulunamadı');
    }
}

// YENİ KULLANICI EKLE
elseif ($method === 'POST' && $action === 'create_user') {
    // Admin kontrolü
    if (!isset($_SESSION['admin_id']) || $_SESSION['admin_role'] !== 'admin') {
        jsonResponse(false, null, 'Yetkiniz yok');
    }
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $username = isset($data['username']) ? sanitize($data['username']) : '';
        $password = isset($data['password']) ? $data['password'] : '';
        $email = isset($data['email']) ? sanitize($data['email']) : '';
        $role = isset($data['role']) ? sanitize($data['role']) : 'editor';
        
        if (empty($username) || empty($password)) {
            jsonResponse(false, null, 'Kullanıcı adı ve şifre gerekli');
        }
        
        if (!in_array($role, ['admin', 'editor', 'viewer'])) {
            $role = 'editor';
        }
        
        // Kullanıcı var mı kontrol et
        $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            jsonResponse(false, null, 'Bu kullanıcı adı zaten kullanılıyor');
        }
        
        $hashedPassword = hashPassword($password);
        
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password, email, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $hashedPassword, $email, $role]);
        
        // Log kaydet
        $pdo->prepare("INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)")
            ->execute([$_SESSION['admin_id'], 'create_user', "Yeni kullanıcı: $username", $_SERVER['REMOTE_ADDR']]);
        
        jsonResponse(true, ['id' => $pdo->lastInsertId()], 'Kullanıcı başarıyla eklendi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// ŞİFRE DEĞİŞTİR
elseif ($method === 'PUT' && $action === 'change_password') {
    if (!isset($_SESSION['admin_id'])) {
        jsonResponse(false, null, 'Oturum bulunamadı');
    }
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;
        $newPassword = isset($data['new_password']) ? $data['new_password'] : '';
        
        if (empty($newPassword)) {
            jsonResponse(false, null, 'Yeni şifre gerekli');
        }
        
        // Sadece kendi şifresini veya admin ise başkasının şifresini değiştirebilir
        if ($userId !== $_SESSION['admin_id'] && $_SESSION['admin_role'] !== 'admin') {
            jsonResponse(false, null, 'Yetkiniz yok');
        }
        
        $hashedPassword = hashPassword($newPassword);
        
        $stmt = $pdo->prepare("UPDATE admin_users SET password = ? WHERE id = ?");
        $stmt->execute([$hashedPassword, $userId]);
        
        // Log kaydet
        $pdo->prepare("INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)")
            ->execute([$_SESSION['admin_id'], 'change_password', "Kullanıcı ID: $userId", $_SERVER['REMOTE_ADDR']]);
        
        jsonResponse(true, null, 'Şifre başarıyla değiştirildi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// KULLANICI SİL
elseif ($method === 'DELETE' && $action === 'delete_user') {
    if (!isset($_SESSION['admin_id']) || $_SESSION['admin_role'] !== 'admin') {
        jsonResponse(false, null, 'Yetkiniz yok');
    }
    
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = isset($data['user_id']) ? (int)$data['user_id'] : 0;
        
        if ($userId <= 0) {
            jsonResponse(false, null, 'Geçersiz kullanıcı ID');
        }
        
        // Root kullanıcısını silme
        $stmt = $pdo->prepare("SELECT username FROM admin_users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if ($user && $user['username'] === 'root') {
            jsonResponse(false, null, 'Root kullanıcısı silinemez');
        }
        
        $stmt = $pdo->prepare("DELETE FROM admin_users WHERE id = ?");
        $stmt->execute([$userId]);
        
        // Log kaydet
        $pdo->prepare("INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)")
            ->execute([$_SESSION['admin_id'], 'delete_user', "Silinen kullanıcı ID: $userId", $_SERVER['REMOTE_ADDR']]);
        
        jsonResponse(true, null, 'Kullanıcı başarıyla silindi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// KULLANICI LİSTESİ
elseif ($method === 'GET' && $action === 'list_users') {
    if (!isset($_SESSION['admin_id'])) {
        jsonResponse(false, null, 'Oturum bulunamadı');
    }
    
    try {
        $stmt = $pdo->query("SELECT id, username, email, role, last_login, created_at FROM admin_users ORDER BY created_at DESC");
        $users = $stmt->fetchAll();
        
        jsonResponse(true, $users, 'Kullanıcılar getirildi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

else {
    jsonResponse(false, null, 'Geçersiz istek');
}
?>
