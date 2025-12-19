<?php
/**
 * API Endpoint: Teklifler
 * Teklif kaydetme, listeleme, güncelleme, silme işlemleri
 */

require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

// TEKLİF LİSTELE
if ($method === 'GET' && $action === 'list') {
    try {
        $durum = isset($_GET['durum']) ? sanitize($_GET['durum']) : '';
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 1000;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        $search = isset($_GET['search']) ? sanitize($_GET['search']) : '';
        
        $sql = "SELECT * FROM teklifler WHERE 1=1";
        $params = [];
        
        if (!empty($durum)) {
            $sql .= " AND durum = ?";
            $params[] = $durum;
        }
        
        if (!empty($search)) {
            $sql .= " AND (ad LIKE ? OR tel LIKE ? OR email LIKE ? OR hizmet LIKE ? OR not LIKE ?)";
            $searchTerm = "%$search%";
            $params = array_merge($params, [$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm]);
        }
        
        $sql .= " ORDER BY tarih DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $teklifler = $stmt->fetchAll();
        
        // Toplam sayıyı da gönder
        $countSql = "SELECT COUNT(*) as total FROM teklifler WHERE 1=1";
        $countParams = [];
        if (!empty($durum)) {
            $countSql .= " AND durum = ?";
            $countParams[] = $durum;
        }
        if (!empty($search)) {
            $countSql .= " AND (ad LIKE ? OR tel LIKE ? OR email LIKE ? OR hizmet LIKE ? OR not LIKE ?)";
            $countParams = array_merge($countParams, [$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm]);
        }
        
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($countParams);
        $total = $countStmt->fetch()['total'];
        
        jsonResponse(true, [
            'teklifler' => $teklifler,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ], 'Teklifler başarıyla getirildi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// YENİ TEKLİF EKLE (Müşteri tarafından)
elseif ($method === 'POST' && $action === 'create') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $ad = isset($data['ad']) ? sanitize($data['ad']) : '';
        $tel = isset($data['tel']) ? sanitize($data['tel']) : '';
        $email = isset($data['email']) ? sanitize($data['email']) : '';
        $hizmet = isset($data['hizmet']) ? sanitize($data['hizmet']) : '';
        $not = isset($data['not']) ? sanitize($data['not']) : '';
        
        // Validasyon
        if (empty($ad) || empty($tel) || empty($hizmet)) {
            jsonResponse(false, null, 'Ad, telefon ve hizmet alanları zorunludur');
        }
        
        if (!validatePhone($tel)) {
            jsonResponse(false, null, 'Geçersiz telefon numarası');
        }
        
        if (!empty($email) && !validateEmail($email)) {
            jsonResponse(false, null, 'Geçersiz e-posta adresi');
        }
        
        // IP ve User Agent bilgilerini al
        $ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        
        $stmt = $pdo->prepare("INSERT INTO teklifler (ad, tel, email, hizmet, not, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$ad, $tel, $email, $hizmet, $not, $ipAddress, $userAgent]);
        
        $newId = $pdo->lastInsertId();
        
        jsonResponse(true, ['id' => $newId], 'Teklifiniz başarıyla alındı. En kısa sürede size dönüş yapılacaktır.');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// TEKLİF DURUMU GÜNCELLE (Admin)
elseif ($method === 'PUT' && $action === 'update_status') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        $durum = isset($data['durum']) ? sanitize($data['durum']) : '';
        
        if ($id <= 0 || !in_array($durum, ['yeni', 'inceleniyor', 'tamamlandi', 'iptal'])) {
            jsonResponse(false, null, 'Geçersiz veri');
        }
        
        $stmt = $pdo->prepare("UPDATE teklifler SET durum = ? WHERE id = ?");
        $stmt->execute([$durum, $id]);
        
        jsonResponse(true, null, 'Teklif durumu güncellendi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// TEKLİF SİL (Admin)
elseif ($method === 'DELETE' && $action === 'delete') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = isset($data['id']) ? (int)$data['id'] : 0;
        
        if ($id <= 0) {
            jsonResponse(false, null, 'Geçersiz teklif ID');
        }
        
        $stmt = $pdo->prepare("DELETE FROM teklifler WHERE id = ?");
        $stmt->execute([$id]);
        
        jsonResponse(true, null, 'Teklif başarıyla silindi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// TOPLU SİLME (Admin)
elseif ($method === 'DELETE' && $action === 'delete_multiple') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $ids = isset($data['ids']) ? $data['ids'] : [];
        
        if (empty($ids) || !is_array($ids)) {
            jsonResponse(false, null, 'Geçersiz ID listesi');
        }
        
        $placeholders = str_repeat('?,', count($ids) - 1) . '?';
        $stmt = $pdo->prepare("DELETE FROM teklifler WHERE id IN ($placeholders)");
        $stmt->execute($ids);
        
        jsonResponse(true, null, count($ids) . ' teklif silindi');
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

// TEKLİFLERİ EXCEL OLARAK DIŞA AKTAR
elseif ($method === 'GET' && $action === 'export') {
    try {
        $stmt = $pdo->query("SELECT id, tarih, ad, tel, email, hizmet, not, durum FROM teklifler ORDER BY tarih DESC");
        $teklifler = $stmt->fetchAll();
        
        // CSV formatında döndür
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=teklifler_' . date('Y-m-d') . '.csv');
        
        $output = fopen('php://output', 'w');
        
        // UTF-8 BOM ekle (Excel için)
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Başlıklar
        fputcsv($output, ['ID', 'Tarih', 'Ad', 'Telefon', 'E-posta', 'Hizmet', 'Not', 'Durum']);
        
        // Veriler
        foreach ($teklifler as $row) {
            fputcsv($output, $row);
        }
        
        fclose($output);
        exit;
    } catch (PDOException $e) {
        jsonResponse(false, null, 'Hata: ' . $e->getMessage());
    }
}

else {
    jsonResponse(false, null, 'Geçersiz istek');
}
?>
