/**
 * ORBYTE Admin Panel Core Logic V2.0
 * Handles Routing, State, and Data Management
 */

const APP = {
    // STATE
    state: {
        currentUser: null,
        activePage: 'dashboard',
        theme: 'default',
        lastActivity: Date.now(),
        currentLang: 'tr'
    },

    // DEFINITIONS
    roleDefinitions: {
        'Root': 'Tüm sistem ayarları, Kullanıcı ve Rol yönetimi, Sistem Silme/Reset.',
        'SysAdmin': 'Teknik ayarlar, API, Bakım Modu, Loglar. Root yetkileri hariç tam erişim.',
        'SiteManager': 'İçerik, Teklif ve Forum yönetimi. Kullanıcı ekleyemez/silemez.',
        'OpsManager': 'Teklif takibi, Durum güncelleme, Müşteri notları.',
        'Support': 'Ticket sistemi, İletişim formları, Kullanıcı geri dönüşleri.',
        'Editor': 'Haber oluşturma, düzenleme ve yayınlama yetkisi.',
        'Writer': 'İçerik oluşturur, yayınlayamaz (Onay gerektirir).',
        'SEO': 'Meta veriler, Etiket ve Kategori yönetimi.',
        'Moderator': 'Forum konu silme/kilitleme, Kullanıcı uyarma.',
        'Community': 'Forum ve yorumları yönetir, kullanıcı davranış analizi yapar.',
        'SalesRep': 'Teklif görüntüleme, Müşteri ile iletişim.',
        'SalesManager': 'Teklif raporları, Satış performansı inceleme.',
        'AITrainer': 'AI cevaplarını düzenleme, Soru-Cevap akışları.',
        'DataAnalyst': 'Gelişmiş raporlar, Kullanıcı davranış metrikleri.',
        'Observer': 'Sadece Görüntüleme (Read-Only). Değişiklik yapamaz.',
        'Auditor': 'Log ve geçmiş inceleme (Denetçi). Müdahale edemez.',
        'Guest': 'Demo ve sunum amaçlı, kısıtlı erişim.',
        'Customer': 'Müşteri Paneli: Kendi tekliflerini görür.',
        'Dealer': 'Bayi/Partner: Kendine ait müşteri ve teklifleri görür.',
        'Beta': 'Beta Tester: Yeni özellikleri test eder.'
    },

    lang: {
        tr: {
            title: 'ORBYTE // YÖNETİM V2.0',
            dashboard: 'Dashboard',
            offers: 'Teklifler',
            news: 'Haberler',
            users: 'Kullanıcılar',
            logs: 'Loglar',
            settings: 'Ayarlar',
            stats_total: 'Toplam Teklif',
            stats_today: 'Bugün Gelen',
            stats_system: 'Sistem Durumu',
            recent_activity: 'SON AKTİVİTELER',
            welcome: 'Hoşgeldin',
            logout: 'Çıkış',
            theme_title: 'GÖRÜNÜM & TEMA',
            lang_title: 'DİL SEÇİMİ',
            maintenance: 'SİTE BAKIM MODU'
        },
        en: {
            title: 'ORBYTE // ADMIN V2.0',
            dashboard: 'Dashboard',
            offers: 'Offers',
            news: 'News',
            users: 'Users',
            logs: 'Logs',
            settings: 'Settings',
            stats_total: 'Total Offers',
            stats_today: 'Today',
            stats_system: 'System Status',
            recent_activity: 'RECENT ACTIVITY',
            welcome: 'Welcome',
            logout: 'Logout',
            theme_title: 'APPEARANCE & THEME',
            lang_title: 'LANGUAGE SELECTION',
            maintenance: 'MAINTENANCE MODE'
        },
        de: {
            title: 'ORBYTE // VERWALTUNG V2.0',
            dashboard: 'Instrumententafel',
            offers: 'Angebote',
            news: 'Nachrichten',
            users: 'Benutzer',
            logs: 'Protokolle',
            settings: 'Einstellungen',
            stats_total: 'Gesamtangebote',
            stats_today: 'Heute',
            stats_system: 'Systemstatus',
            recent_activity: 'LETZTE AKTIVITÄT',
            welcome: 'Willkommen',
            logout: 'Abmelden',
            theme_title: 'AUSSEHEN & THEMA',
            lang_title: 'SPRACHAUSWAHL',
            maintenance: 'WARTUNGSMODUS'
        },
        es: {
            title: 'ORBYTE // ADMINISTRACIÓN V2.0',
            dashboard: 'Tablero',
            offers: 'Ofertas',
            news: 'Noticias',
            users: 'Usuarios',
            logs: 'Registros',
            settings: 'Ajustes',
            stats_total: 'Ofertas Totales',
            stats_today: 'Hoy',
            stats_system: 'Estado del Sistema',
            recent_activity: 'ACTIVIDAD RECIENTE',
            welcome: 'Bienvenido',
            logout: 'Cerrar Sesión',
            theme_title: 'APARIENCIA Y TEMA',
            lang_title: 'SELECCIÓN DE IDIOMA',
            maintenance: 'MODO DE MANTENIMIENTO'
        }
    },

    // VIRTUAL DB
    db: {
        get: (collection) => JSON.parse(localStorage.getItem(collection) || '[]'),
        set: (collection, data) => localStorage.setItem(collection, JSON.stringify(data)),
        add: (collection, item) => {
            const data = APP.db.get(collection);
            data.push(item);
            APP.db.set(collection, data);
        },
        update: (collection, id, updates) => {
            const data = APP.db.get(collection);
            const idx = data.findIndex(i => i.id === id);
            if (idx !== -1) {
                data[idx] = { ...data[idx], ...updates };
                APP.db.set(collection, data);
            }
        },
        remove: (collection, id) => {
            const data = APP.db.get(collection);
            const newData = data.filter(i => i.id !== id);
            APP.db.set(collection, newData);
        }
    },

    // CORE FUNCTIONS
    init: () => {
        APP.checkAuth();
        APP.setupNavigation();
        APP.ensureDummyData();
        APP.renderPage('dashboard');

        // Listeners
        document.getElementById('btnLogout').addEventListener('click', APP.logout);
        APP.updateClock();
        APP.applyTheme();

        // Init Language
        const savedLang = localStorage.getItem('admin_lang') || 'tr';
        APP.setLanguage(savedLang);

        const langSelect = document.getElementById('lang-select');
        if (langSelect) langSelect.value = savedLang;

        // Activity Monitor
        ['click', 'mousemove', 'keypress'].forEach(evt =>
            document.addEventListener(evt, () => APP.state.lastActivity = Date.now())
        );
        setInterval(APP.checkSession, 30000);
    },

    checkSession: () => {
        const timeout = 10 * 60 * 1000; // 10 Min
        if (APP.state.currentUser && (Date.now() - APP.state.lastActivity > timeout)) {
            alert('GÜVENLİK UYARISI: Oturum süreniz doldu.');
            APP.logout();
        }
    },

    setLanguage: (langCode) => {
        APP.state.currentLang = langCode;
        localStorage.setItem('admin_lang', langCode);
        const t = APP.lang[langCode];

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.innerText = t[key];
        });

        document.title = t.title;
        APP.logAction('Dil Değişimi', `Dil değiştirildi: ${langCode.toUpperCase()}`);
    },

    toggleTheme: (themeName) => {
        APP.state.theme = themeName;
        localStorage.setItem('admin_theme', themeName);
        APP.applyTheme();
    },

    applyTheme: () => {
        const theme = localStorage.getItem('admin_theme') || 'default';
        const body = document.body;
        body.classList.remove('theme-matrix', 'theme-crimson', 'theme-default');
        if (theme !== 'default') body.classList.add('theme-' + theme);
    },

    updateRoleDescription: () => {
        const role = document.getElementById('user-role').value;
        const desc = APP.roleDefinitions[role] || 'Rol açıklaması bulunamadı.';
        const el = document.getElementById('role-desc-text');
        if (el) el.innerText = '> ' + desc;
    },

    checkAuth: () => {
        const session = sessionStorage.getItem('orbyte_admin_session');
        const local = localStorage.getItem('orbyte_admin_token');

        if (session || local) {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('app').style.display = 'grid';
            APP.state.currentUser = JSON.parse(localStorage.getItem('admin_user_profile') || '{"name":"Admin", "role":"Root"}');
            APP.updateProfileUI();
        } else {
            const loginScreen = document.getElementById('loginScreen');
            const app = document.getElementById('app');
            if (loginScreen) loginScreen.style.display = 'flex';
            if (app) app.style.display = 'none';
        }
    },

    login: (u, p) => {
        if (u === 'root' && p === '14022006yU+-.') {
            localStorage.setItem('orbyte_admin_token', 'mock_token_' + Date.now());
            sessionStorage.setItem('orbyte_admin_session', 'active');
            localStorage.setItem('admin_user_profile', JSON.stringify({ name: 'Root Admin', role: 'System Owner' }));
            APP.logAction('Giriş', 'Root kullanıcısı giriş yaptı.');
            APP.checkAuth();
            APP.renderPage('dashboard');
        } else {
            alert('Erişim Reddedildi: Geçersiz Kimlik Bilgileri');
            APP.logAction('Hata', `Başarısız giriş denemesi: ${u}`);
        }
    },

    logout: () => {
        sessionStorage.removeItem('orbyte_admin_session');
        localStorage.removeItem('orbyte_admin_token');
        window.location.reload();
    },

    setupNavigation: () => {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const page = btn.getAttribute('data-page');
                APP.renderPage(page);
            });
        });
    },

    renderPage: (pageId) => {
        document.querySelectorAll('.page-section').forEach(el => el.classList.remove('active'));
        const pageEl = document.getElementById(`page-${pageId}`);
        if (pageEl) pageEl.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const navEl = document.querySelector(`.nav-item[data-page="${pageId}"]`);
        if (navEl) navEl.classList.add('active');

        if (pageId === 'dashboard') APP.renderDashboard();
        if (pageId === 'offers') APP.renderOffers();
        if (pageId === 'news') APP.renderNews();
        if (pageId === 'users') APP.renderUsers();
        if (pageId === 'logs') APP.renderLogs();
    },

    renderDashboard: () => {
        const offers = APP.db.get('gelenTeklifler'); // Using old key for compatibility
        const logs = APP.db.get('system_logs');

        // Stats
        const statTotal = document.getElementById('stat-total-offers');
        if (statTotal) statTotal.innerText = offers.length;

        const statToday = document.getElementById('stat-today-offers');
        if (statToday) statToday.innerText = offers.filter(o => o.tarih?.includes(new Date().toLocaleDateString())).length;

        const statSystem = document.getElementById('stat-system-status');
        if (statSystem) statSystem.innerText = 'AKTİF';

        // Recent Activity
        const list = document.getElementById('dashboard-activity-list');
        if (list) {
            list.innerHTML = logs.slice(-5).reverse().map(l => `
                <div style="padding:10px; border-bottom:1px solid #222; display:flex; justify-content:space-between;">
                    <span>${l.action}</span>
                    <span class="text-muted" style="font-size:0.8rem;">${l.time}</span>
                </div>
            `).join('');
        }
    },

    renderOffers: (filter = '') => {
        const offers = APP.db.get('gelenTeklifler');
        const tbody = document.getElementById('offers-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        offers.reverse().forEach((offer) => {
            if (offer.deleted) return; // Hide deleted
            if (filter && !JSON.stringify(offer).toLowerCase().includes(filter.toLowerCase())) return;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${offer.id || 'N/A'}</td>
                <td><div style="font-weight:bold;">${offer.ad}</div><small class="text-muted">${offer.tel}</small></td>
                <td><span style="color:var(--primary-color)">${offer.hizmet}</span></td>
                <td>${offer.tarih}</td>
                <td><span class="status ${offer.status || 'new'}">${offer.status || 'YENİ'}</span></td>
                <td>
                    <button onclick="APP.updateOfferStatus(${offer.id}, 'closed')" class="cyber-btn" style="padding:2px 8px; font-size:0.7rem;">KAPAT</button>
                    <button onclick="APP.softDelete('gelenTeklifler', ${offer.id})" class="cyber-btn danger" style="padding:2px 8px; font-size:0.7rem;">SİL</button>
                    <a href="https://wa.me/${(offer.tel || '').replace(/\D/g, '')}" target="_blank" class="cyber-btn" style="padding:2px 8px; font-size:0.7rem; color:#25D366; border-color:#25D366;"><i class="fab fa-whatsapp"></i></a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderNews: () => {
        const news = APP.db.get('haberler');
        const list = document.getElementById('news-list');
        if (!list) return;
        list.innerHTML = '';

        news.reverse().forEach(item => {
            if (item.deleted) return; // Hide deleted

            const div = document.createElement('div');
            div.className = 'news-item';
            div.style.cssText = 'background:#111; padding:15px; margin-bottom:10px; border:1px solid #333; border-radius:4px; display:flex; gap:15px;';
            div.innerHTML = `
                <div style="width:100px; height:70px; background:#222; background-image:url('${item.image}'); background-size:cover;"></div>
                <div style="flex:1;">
                    <h4 style="margin:0 0 5px 0;">${item.title}</h4>
                    <p style="margin:0; font-size:0.8rem; color:#888;">${item.summary || ''}</p>
                </div>
                <div>
                    <button onclick="APP.softDelete('haberler', ${item.id})" class="cyber-btn danger">SİL</button>
                </div>
            `;
            list.appendChild(div);
        });
    },

    renderUsers: () => {
        let users = APP.db.get('adminUsers');
        if (users.length === 0) {
            // Default user fallback
            users = [{ username: 'root', role: 'System Owner', lastLogin: 'Never' }];
            APP.db.set('adminUsers', users);
        }

        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;
        tbody.innerHTML = '';

        users.forEach((u, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span style="color:var(--primary-color); font-weight:bold;">${u.username}</span></td>
                <td>${u.role || 'Admin'}</td>
                <td style="color:#888;">${u.lastLogin || '-'}</td>
                <td>
                    ${u.username === 'root'
                    ? '<span style="color:#666;">[KORUMALI]</span>'
                    : `<button onclick="APP.deleteUser('${u.username}')" class="cyber-btn danger" style="padding:2px 8px; font-size:0.7rem;">SİL</button>`}
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    renderLogs: () => {
        // Logs are currently rendered in dashboard, can expand here if needed
    },

    // ACTIONS
    updateOfferStatus: (id, status) => {
        let offers = APP.db.get('gelenTeklifler');
        const idx = offers.findIndex(o => o.id === id);
        if (idx > -1) {
            offers[idx].status = status;
            APP.db.set('gelenTeklifler', offers);
            APP.renderOffers();
            APP.logAction('Teklif Güncelleme', `Teklif #${id} durumu: ${status}`);
        }
    },

    softDelete: (collection, id) => {
        if (!confirm('Kayıt Geri Dönüşüm Kutusuna taşınacak. Onaylıyor musunuz?')) return;
        APP.db.update(collection, id, { deleted: true, deletedAt: new Date().toLocaleString() });
        APP.renderOffers();
        APP.renderNews();
        APP.logAction('Silme (Soft)', `ID: ${id} çöp kutusuna atıldı.`);
    },

    restoreItem: (collection, id) => {
        if (!confirm('Kayıt geri yüklensin mi?')) return;
        APP.db.update(collection, id, { deleted: false });
        alert('Kayıt geri yüklendi.');
        location.reload();
    },

    saveNews: () => {
        const title = document.getElementById('news-title').value;
        const summary = document.getElementById('news-summary').value;
        if (!title) return alert('Başlık giriniz');

        APP.db.add('haberler', {
            id: Date.now(),
            title, summary,
            tarih: new Date().toLocaleDateString(),
            image: ''
        });

        document.getElementById('news-title').value = '';
        document.getElementById('news-summary').value = '';
        APP.renderNews();
        alert('Haber yayınlandı');
    },

    addUser: () => {
        const u = document.getElementById('user-name').value.trim();
        const p = document.getElementById('user-pass').value.trim();
        const r = document.getElementById('user-role').value;

        if (!u || !p) return alert('Kullanıcı adı ve şifre giriniz.');

        const users = APP.db.get('adminUsers');
        if (users.find(x => x.username === u)) return alert('Bu kullanıcı zaten var!');

        APP.db.add('adminUsers', {
            id: Date.now(),
            username: u,
            password: p,
            role: r,
            lastLogin: '-'
        });

        document.getElementById('user-name').value = '';
        document.getElementById('user-pass').value = '';
        APP.renderUsers();
        alert('Kullanıcı eklendi: ' + u);
        APP.logAction('Kullanıcı Ekleme', `${u} sisteme eklendi.`);
    },

    deleteUser: (username) => {
        if (username === 'root') return alert('Root silinemez!');
        if (!confirm(username + ' silinecek. Emin misiniz?')) return;

        let users = APP.db.get('adminUsers');
        users = users.filter(x => x.username !== username);
        APP.db.set('adminUsers', users);
        APP.renderUsers();
        APP.logAction('Kullanıcı Silme', `${username} silindi.`);
    },

    logAction: (action, detail) => {
        APP.db.add('system_logs', {
            id: Date.now(),
            action, detail,
            time: new Date().toLocaleString(),
            user: APP.state.currentUser?.name || 'Unknown'
        });
    },

    ensureDummyData: () => {
        if (APP.db.get('system_logs').length === 0) {
            APP.logAction('Sistem Başlatıldı', 'Orbyte Admin Paneli V2.0 aktif edildi.');
        }
    },

    updateClock: () => {
        const now = new Date();
        const el = document.getElementById('sys-time');
        if (el) el.innerText = now.toLocaleTimeString();
    },

    updateProfileUI: () => {
        const u = APP.state.currentUser;
        if (u) {
            const pName = document.getElementById('profile-name');
            const pRole = document.getElementById('profile-role');
            if (pName) pName.innerText = u.name;
            if (pRole) pRole.innerText = u.role;
        }
    }
};

window.APP = APP;
document.addEventListener('DOMContentLoaded', APP.init);
