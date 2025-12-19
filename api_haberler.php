<?php
/**
 * API Endpoint: Haberler
 * Haber ekleme, listeleme, güncelleme, silme işlemleri
 */

require_once 'config.php';

// Request metodunu al
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// HABER LİSTELE
if ($method === 'GET' && $action === 'list') {
    try {
        $durum = isset($_GET['durum']) ? sanitize($_GET['durum']) : 'aktif';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        $stmt = $pdo->prepare("SELECT * FROM haberler WHERE durum = ? ORDER BY tarih DESC LIMIT ? OFFSET ?");
        $stmt->execute([$durum, $limit, $offset]);
        $haberler = $stmt->fetchAll();
        
        jsonResponse(true, $haberler, 'Haberler başarıyla getirildi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// TEK HABER DETAY
elseif ($method === 'GET' && $action === 'detail') {
    try {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        
        if ($id <= 0) {
            jsonResponse(false, null, 'Geçersiz haber ID');
        }
        
        // Görüntüleme sayısını artır
        $pdo->prepare("UPDATE haberler SET goruntuleme = goruntuleme + 1 WHERE id = ?")->execute([$id]);
        
        $stmt = $pdo->prepare("SELECT * FROM haberler WHERE id = ?");
        $stmt->execute([$id]);
        $haber = $stmt->fetch();
        
        if ($haber) {
            jsonResponse(true, $haber, 'Haber detayı getirildi');
        } else {
            jsonResponse(false, null, 'Haber bulunamadı');
        }
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// YENİ HABER EKLE
elseif ($method === 'POST' && $action === 'create') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $title = isset($data['title']) ? sanitize($data['title']) : '';
        $summary = isset($data['summary']) ? sanitize($data['summary']) : '';
        $content = isset($data['content']) ? sanitize($data['content']) : '';
        $image = isset($data['image']) ? $data['image'] : ''; // Base64 veya URL
        $yazar = isset($data['yazar']) ? sanitize($data['yazar']) : 'Admin';
        
        if (empty($title) || empty($content)) {
            jsonResponse(false, null, 'Başlık ve içerik zorunludur');
        }
        
        // Resim varsa kaydet
        $imagePath = '';
        if (!empty($image)) {
            // Base64 ise dosyaya kaydet
            if (strpos($image, 'data:image') === 0) {
                $imagePath = saveBase64Image($image);
            } else {
                $imagePath = $image;
            }
        }
        
        $stmt = $pdo->prepare("INSERT INTO haberler (title, summary, content, image, yazar) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $summary, $content, $imagePath, $yazar]);
        
        $newId = $pdo->lastInsertId();
        
        jsonResponse(true, ['id' => $newId], 'Haber başarıyla eklendi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// HABER GÜNCELLE
elseif ($method === 'PUT' && $action === 'update') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $title = isset($data['title']) ? sanitize($data['title']) : '';
        $summary = isset($data['summary']) ? sanitize($data['summary']) : '';
        $content = isset($data['content']) ? sanitize($data['content']) : '';
        $image = isset($data['image']) ? $data['image'] : '';
        
        if ($id <= 0 || empty($title) || empty($content)) {
            jsonResponse(false, null, 'Geçersiz veri');
        }
        
        // Mevcut haberi kontrol et
        $stmt = $pdo->prepare("SELECT image FROM haberler WHERE id = ?");
        $stmt->execute([$id]);
        $existing = $stmt->fetch();
        
        if (!$existing) {
            jsonResponse(false, null, 'Haber bulunamadı');
        }
        
        $imagePath = $existing['image'];
        
        // Yeni resim varsa kaydet
        if (!empty($image) && strpos($image, 'data:image') === 0) {
            $imagePath = saveBase64Image($image);
        } elseif (!empty($image)) {
            $imagePath = $image;
        }
        
        $stmt = $pdo->prepare("UPDATE haberler SET title = ?, summary = ?, content = ?, image = ? WHERE id = ?");
        $stmt->execute([$title, $summary, $content, $imagePath, $id]);
        
        jsonResponse(true, null, 'Haber başarıyla güncellendi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// HABER SİL
elseif ($method === 'DELETE' && $action === 'delete') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        
        if ($id <= 0) {
            jsonResponse(false, null, 'Geçersiz haber ID');
        }
        
        // Resmi de sil
        $stmt = $pdo->prepare("SELECT image FROM haberler WHERE id = ?");
        $stmt->execute([$id]);
        $haber = $stmt->fetch();
        
        if ($haber && !empty($haber['image']) && file_exists($haber['image'])) {
            unlink($haber['image']);
        }
        
        $stmt = $pdo->prepare("DELETE FROM haberler WHERE id = ?");
        $stmt->execute([$id]);
        
        jsonResponse(true, null, 'Haber başarıyla silindi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

else {
    jsonResponse(false, null, 'Geçersiz istek');
}

// Base64 resmi dosyaya kaydetme fonksiyonu
function saveBase64Image($base64String) {
    // data:image/png;base64,iVBORw0KG... formatından ayır
    if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
        $data = substr($base64String, strpos($base64String, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif
        
        if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            return '';
        }
        
        $data = base64_decode($data);
        
        if ($data === false) {
            return '';
        }
        
        $filename = 'news_' . time() . '_' . uniqid() . '.' . $type;
        $filepath = UPLOAD_DIR . $filename;
        
        if (!file_exists(UPLOAD_DIR)) {
            mkdir(UPLOAD_DIR, 0755, true);
        }
        
        file_put_contents($filepath, $data);
        
        return $filepath;
    }
    
    return '';
}
?>
