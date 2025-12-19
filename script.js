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

document.addEventListener('DOMContentLoaded', function () {

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
            if (link.innerText.includes('05')) {
                // İkonu korumak için innerHTML kullanabiliriz ama basit metin değişimi yapalım:
                link.innerHTML = '<i class="fa-solid fa-phone"></i> HEMEN ARA: ' + savedPhone;
            }
        });
    }

});

// Telefon input alanı - sadece rakam kontrolü ve otomatik biçimlendirme
document.addEventListener('DOMContentLoaded', function () {
    const phoneInput = document.getElementById('telefon');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
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
        phoneInput.addEventListener('paste', function (e) {
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

/**
 * PUBLIC SITE LANGUAGE MANAGER
 * Handles client-side translations (TR, EN, DE, ES)
 */
const APP_PUBLIC = {
    lang: {
        tr: {
            nav_services: '/HİZMETLER',
            nav_offer: '/TEKLİF_İSTE',
            nav_contact: '/İLETİŞİM',
            nav_about: '/HAKKIMIZDA',
            nav_admin: '/YÖNETİM',
            hero_title: 'DİJİTAL VE FİZİKSEL ÇÖZÜMLER',
            hero_subtitle: 'Kamera Montajı | Sunucu | Web | Güvenlik | Enerji',
            hero_btn: '>> PROJE TEKLİFİ AL',
            sec_modules: '/SİSTEM_MODÜLLERİ',
            srv_security_title: 'GÜVENLİK & RESTORAN',
            srv_security_1: 'Kamera Montajı',
            srv_security_2: 'Alarm Sistemleri',
            srv_security_3: 'Restoran Menü Sistemleri',
            srv_server_title: 'SUNUCU & SİSTEM',
            srv_server_1: 'Sunucu Kurulumu',
            srv_server_2: 'Bilgisayar Toplama',
            srv_server_3: 'Ağ Altyapısı',
            srv_web_title: 'WEB & HOSTING',
            srv_web_1: 'Web Tasarımı',
            srv_web_2: 'Hosting',
            srv_web_3: 'E-Ticaret',
            srv_energy_title: 'ENERJİ SİSTEMLERİ',
            srv_energy_1: 'Güneş Paneli',
            srv_energy_2: 'Enerji Yönetimi'
        },
        en: {
            nav_services: '/SERVICES',
            nav_offer: '/GET_QUOTE',
            nav_contact: '/CONTACT',
            nav_about: '/ABOUT_US',
            nav_admin: '/ADMIN_PANEL',
            hero_title: 'DIGITAL & PHYSICAL SOLUTIONS',
            hero_subtitle: 'CCTV Installation | Server | Web | Security | Energy',
            hero_btn: '>> GET PROJECT QUOTE',
            sec_modules: '/SYSTEM_MODULES',
            srv_security_title: 'SECURITY & RESTAURANT',
            srv_security_1: 'CCTV Installation',
            srv_security_2: 'Alarm Systems',
            srv_security_3: 'Restaurant Menu Systems',
            srv_server_title: 'SERVER & SYSTEM',
            srv_server_1: 'Server Setup',
            srv_server_2: 'PC Assembly',
            srv_server_3: 'Network Infrastructure',
            srv_web_title: 'WEB & HOSTING',
            srv_web_1: 'Web Design',
            srv_web_2: 'Hosting',
            srv_web_3: 'E-Commerce',
            srv_energy_title: 'ENERGY SYSTEMS',
            srv_energy_1: 'Solar Panels',
            srv_energy_2: 'Energy Management'
        },
        de: {
            nav_services: '/DIENSTLEISTUNGEN',
            nav_offer: '/ANGEBOT_ANFORDERN',
            nav_contact: '/KONTAKT',
            nav_about: '/ÜBER_UNS',
            nav_admin: '/VERWALTUNG',
            hero_title: 'DIGITALE & PHYSISCHE LÖSUNGEN',
            hero_subtitle: 'Kamerainstallation | Server | Web | Sicherheit | Energie',
            hero_btn: '>> PROJEKTANGEBOT ERHALTEN',
            sec_modules: '/SYSTEMMODULE',
            srv_security_title: 'SICHERHEIT & RESTAURANT',
            srv_security_1: 'Kamerainstallation',
            srv_security_2: 'Alarmanlagen',
            srv_security_3: 'Restaurant-Menüsysteme',
            srv_server_title: 'SERVER & SYSTEM',
            srv_server_1: 'Server-Einrichtung',
            srv_server_2: 'PC-Montage',
            srv_server_3: 'Netzwerkinfrastruktur',
            srv_web_title: 'WEB & HOSTING',
            srv_web_1: 'Webdesign',
            srv_web_2: 'Hosting',
            srv_web_3: 'E-Commerce',
            srv_energy_title: 'ENERGIESYSTEME',
            srv_energy_1: 'Solarpaneele',
            srv_energy_2: 'Energiemanagement'
        },
        es: {
            nav_services: '/SERVICIOS',
            nav_offer: '/SOLICITAR_OFERTA',
            nav_contact: '/CONTACTO',
            nav_about: '/SOBRE_NOSOTROS',
            nav_admin: '/ADMINISTRACIÓN',
            hero_title: 'SOLUCIONES DIGITALES Y FÍSICAS',
            hero_subtitle: 'Instalación de Cámaras | Servidor | Web | Seguridad | Energía',
            hero_btn: '>> OBTENER OFERTA',
            sec_modules: '/MÓDULOS_DEL_SISTEMA',
            srv_security_title: 'SEGURIDAD Y RESTAURANTE',
            srv_security_1: 'Instalación de Cámaras',
            srv_security_2: 'Sistemas de Alarma',
            srv_security_3: 'Sistemas de Menú para Restaurantes',
            srv_server_title: 'SERVIDOR Y SISTEMA',
            srv_server_1: 'Configuración de Servidor',
            srv_server_2: 'Ensamblaje de PC',
            srv_server_3: 'Infraestructura de Red',
            srv_web_title: 'WEB Y HOSTING',
            srv_web_1: 'Diseño Web',
            srv_web_2: 'Hosting',
            srv_web_3: 'Comercio Electrónico',
            srv_energy_title: 'SISTEMAS DE ENERGÍA',
            srv_energy_1: 'Paneles Solares',
            srv_energy_2: 'Gestión de Energía'
        }
    },

    setLanguage: (langCode) => {
        localStorage.setItem('user_lang', langCode);
        const t = APP_PUBLIC.lang[langCode];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

        // Update Select Option if needed (for initial load)
        const sel = document.getElementById('public-lang-select');
        if (sel) sel.value = langCode;
    },

    init: () => {
        const savedLang = localStorage.getItem('user_lang') || 'tr';
        APP_PUBLIC.setLanguage(savedLang);
    }
};

// Global Exposure
window.APP_PUBLIC = APP_PUBLIC;

// Auto Init
document.addEventListener('DOMContentLoaded', APP_PUBLIC.init);