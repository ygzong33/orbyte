document.addEventListener('DOMContentLoaded', function () {

    const typingElement = document.querySelector('.typing-effect');

    if (typingElement) {
        const text = typingElement.innerText;
        typingElement.innerText = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Hız (ms)
            }
        }

        setTimeout(typeWriter, 500);
    }

    const glitchTexts = document.querySelectorAll('.glitch-text');

    glitchTexts.forEach(text => {
        text.addEventListener('mouseover', () => {
            text.style.textShadow = `2px 2px 0px #ff00ff, -2px -2px 0px #00ffff`;
        });
        text.addEventListener('mouseout', () => {
            text.style.textShadow = `none`;
        });
    });

    const form = document.querySelector('.cyber-form');
    if (form) {
        form.addEventListener('submit', function (e) {
        
            alert('SİSTEM MESAJI: Teklif talebiniz şifrelenerek sunucuya iletiliyor...');
        });
    }
});
/* --- ADMIN PANEL BAĞLANTISI (LOCAL STORAGE) --- */
/* Bu kodlar sayfa yüklendiğinde çalışır ve Admin ayarlarını çeker */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. DUYURU METNİNİ GÜNCELLE
    // Admin panelinden "siteDuyuru" adıyla kaydedilen veriyi al
    const savedAnnouncement = localStorage.getItem('siteDuyuru');
    const typingElement = document.querySelector('.typing-effect');
    
    // Eğer admin panelinden bir şey yazıldıysa ve daktilo efekti varsa onu değiştir
    if (savedAnnouncement && typingElement) {
        // Daktilo efekti scripti çalışmadan önce metni değiştiriyoruz
        typingElement.innerText = savedAnnouncement;
    }

    // 2. TELEFON NUMARASINI GÜNCELLE
    // Admin panelinden "sitePhone" adıyla kaydedilen numarayı al
    const savedPhone = localStorage.getItem('sitePhone');
    
    if (savedPhone) {
        // Sitedeki tüm "tel:" ile başlayan linkleri bul (Arama butonları)
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            // Linkin gittiği yeri değiştir
            link.href = 'tel:' + savedPhone;
            
            // Eğer butonun içinde numara yazıyorsa onu da görsel olarak değiştir
            // Sadece içinde rakam olan kısımları değiştirmeye çalışırız ama
            // Basitçe içeriği güncellemek daha güvenli:
            if(link.innerText.includes('05')) { 
                // İkonu korumak için innerHTML kullanabiliriz ama basit metin değişimi yapalım:
                link.innerHTML = '<i class="fa-solid fa-phone"></i> HEMEN ARA: ' + savedPhone;
            }
        });
    }

});

// Telefon input alanı - sadece rakam kontrolü ve otomatik biçimlendirme
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('telefon');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Sadece rakamları tut
            let value = this.value.replace(/[^0-9]/g, '');
            
            // Maksimum 11 rakam (05xx xxx xxxx)
            if (value.length > 11) {
                value = value.slice(0, 11);
            }

            // Otomatik biçimlendirme: 05XX XXX XXXX (4-3-4)
            let formatted = '';
            if (value.length > 0) {
                formatted = value.slice(0, 4); // 05xx
                if (value.length > 4) {
                    formatted += ' ' + value.slice(4, 7); // xxx
                }
                if (value.length > 7) {
                    formatted += ' ' + value.slice(7); // xxxx (son 4 rakam)
                }
            }
            
            this.value = formatted;
        });
        
        // Yapıştırma işleminde de kontrol et
        phoneInput.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = pastedText.replace(/[^0-9]/g, '').slice(0, 11);
            
            // Biçimlendirme
            let formatted = '';
            if (numbersOnly.length > 0) {
                formatted = numbersOnly.slice(0, 4);
                if (numbersOnly.length > 4) {
                    formatted += ' ' + numbersOnly.slice(4, 7);
                }
                if (numbersOnly.length > 7) {
                    formatted += ' ' + numbersOnly.slice(7); // son 4 rakam
                }
            }
            
            this.value = formatted;
        });
    }
});