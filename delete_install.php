<?php
/**
 * install.php dosyasını silen yardımcı script
 * Güvenlik için kurulum tamamlandıktan sonra çalıştırılmalı
 */

$installFile = 'install.php';

if (file_exists($installFile)) {
    if (unlink($installFile)) {
        echo json_encode([
            'success' => true,
            'message' => 'install.php başarıyla silindi.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'install.php silinemedi. Dosya izinlerini kontrol edin.'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'install.php zaten silinmiş.'
    ]);
}

// Bu dosyayı da sil
if (file_exists('delete_install.php')) {
    @unlink('delete_install.php');
}
?>
