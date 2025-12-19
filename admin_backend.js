// ORBYTE Admin Panel - Backend Integration Script
// Bu dosya admin.html'e eklenecek ve localStorage yerine API kullanacak

// API Base URL
const API_BASE = ''; // Aynı dizinde olduğu için boş bırakıyoruz

// ==================== AUTH FUNCTIONS ====================

async function checkAccess() {
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value;
    const msg = document.getElementById('accessMsg');

    if (!user || !pass) {
        msg.innerText = 'Lütfen kullanıcı adı ve parola girin!';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}api_auth.php?action=login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        if (result.success) {
            msg.style.color = 'var(--neon-green)';
            msg.innerText = 'ERİŞİM ONAYLANDI. YÜKLENİYOR...';

            // Session bilgisini sakla
            sessionStorage.setItem('admin_logged_in', 'true');
            sessionStorage.setItem('admin_username', result.data.username);

            setTimeout(() => {
                document.getElementById('loginScreen').style.display = 'none';
                document.getElementById('adminPanel').style.display = 'block';
                loadOffers();
                loadNewsAdmin();
                loadUsersList();
            }, 1000);
        } else {
            msg.innerText = result.message || 'Kullanıcı adı veya parola hatalı!';
        }
    } catch (error) {
        msg.innerText = 'Bağlantı hatası: ' + error.message;
    }
}

// Sayfa yüklendiğinde session kontrolü
document.addEventListener('DOMContentLoaded', function () {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');

    if (isLoggedIn === 'true') {
        // Session var, direkt admin paneli göster
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        loadOffers();
        loadNewsAdmin();
        loadUsersList();
    }
});

// ==================== OFFER FUNCTIONS ====================

async function loadOffers(filterText = '') {
    const tbody = document.getElementById('offerTableBody');
    const noData = document.getElementById('noDataMsg');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#666;">Yükleniyor...</td></tr>';

    try {
        const url = `${API_BASE}api_teklifler.php?action=list&search=${encodeURIComponent(filterText)}`;
        const response = await fetch(url);
        const result = await response.json();

        tbody.innerHTML = '';

        if (!result.success || !result.data || result.data.teklifler.length === 0) {
            noData.style.display = 'block';
            return;
        }

        noData.style.display = 'none';
        const teklifler = result.data.teklifler;

        teklifler.forEach((row) => {
            let tr = document.createElement('tr');
            tr.style.borderBottom = "1px solid #222";
            tr.innerHTML = `
                <td style="padding:10px; text-align:center;"><input type="checkbox" class="offer-select" data-id="${row.id}"></td>
                <td style="padding:10px; color:#888;">${row.tarih}</td>
                <td style="padding:10px; font-weight:bold;">${row.ad} <br> <span style="font-size:0.8rem; color:#fff;">${row.tel || 'Tel Yok'}</span></td>
                <td style="padding:10px; color:var(--neon-green);">${row.hizmet}</td>
                <td style="padding:10px; font-style:italic;">${row.not || ''}</td>
                <td style="padding:10px; text-align:center;">
                    <button onclick="deleteOffer(${row.id})" style="background:none; border:1px solid red; color:red; padding:4px 10px; border-radius:4px; cursor:pointer; font-size:0.9rem;">Sil</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#f00;">Hata: ' + error.message + '</td></tr>';
    }
}

async function deleteOffer(id) {
    if (!confirm('Bu teklifi silmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`${API_BASE}api_teklifler.php?action=delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.success) {
            loadOffers();
        } else {
            alert('Silme hatası: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function deleteSelectedOffers() {
    const checkboxes = document.querySelectorAll('.offer-select:checked');
    if (checkboxes.length === 0) {
        alert('Önce seçim yapın.');
        return;
    }

    if (!confirm('Seçili teklifleri kalıcı olarak silmek istiyor musunuz?')) return;

    const ids = Array.from(checkboxes).map(cb => parseInt(cb.getAttribute('data-id')));

    try {
        const response = await fetch(`${API_BASE}api_teklifler.php?action=delete_multiple`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: ids })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('selectAllOffers').checked = false;
            loadOffers();
        } else {
            alert('Silme hatası: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

function filterOffers() {
    const searchText = document.getElementById('offerSearch').value.trim();
    loadOffers(searchText);
}

async function clearOffers() {
    if (!confirm("DİKKAT: Tüm teklif kayıtları kalıcı olarak silinecek. Onaylıyor musun?")) return;

    try {
        // Tüm teklifleri çek ve sil
        const response = await fetch(`${API_BASE}api_teklifler.php?action=list`);
        const result = await response.json();

        if (result.success && result.data.teklifler.length > 0) {
            const ids = result.data.teklifler.map(t => t.id);

            const deleteResponse = await fetch(`${API_BASE}api_teklifler.php?action=delete_multiple`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: ids })
            });

            const deleteResult = await deleteResponse.json();

            if (deleteResult.success) {
                loadOffers();
            }
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

// Excel indirme - Backend'den CSV olarak indir
function downloadOffers() {
    window.location.href = `${API_BASE}api_teklifler.php?action=export`;
}

// ==================== NEWS FUNCTIONS ====================

async function loadNewsAdmin() {
    const list = document.getElementById('newsAdminList');
    list.innerHTML = '<div style="color:#666; padding:10px;">Yükleniyor...</div>';

    try {
        const response = await fetch(`${API_BASE}api_haberler.php?action=list&durum=aktif`);
        const result = await response.json();

        list.innerHTML = '';

        if (!result.success || !result.data || result.data.length === 0) {
            list.innerHTML = '<div style="color:#666; padding:10px;">Henüz haber yok.</div>';
            return;
        }

        result.data.forEach((item) => {
            const row = document.createElement('div');
            row.style.borderBottom = '1px solid #222';
            row.style.padding = '8px 6px';
            row.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                    ${item.image ? `<img src="${item.image}" style="width:120px; height:80px; object-fit:cover; border-radius:4px; margin-right:10px;">` : ''}
                    <div style="flex:1">
                        <strong style="color:var(--neon-green);">${item.title}</strong>
                        <div style="font-size:0.8rem; color:#999;">${item.tarih}</div>
                        <div style="font-size:0.9rem; color:#ccc; margin-top:6px;">${item.summary || ''}</div>
                    </div>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <button onclick="editNews(${item.id})" class="cyber-btn" style="font-size:0.8rem;">DÜZENLE</button>
                        <button onclick="deleteNews(${item.id})" class="cyber-btn" style="font-size:0.8rem; border-color:red; color:red;">SİL</button>
                    </div>
                </div>
            `;
            list.appendChild(row);
        });
    } catch (error) {
        list.innerHTML = '<div style="color:#f00; padding:10px;">Hata: ' + error.message + '</div>';
    }
}

async function saveNews() {
    const title = document.getElementById('newsTitle').value.trim();
    const summary = document.getElementById('newsSummary').value.trim();
    const content = document.getElementById('newsContent').value.trim();

    if (!title) {
        alert('Başlık gerekli.');
        return;
    }

    const fileInput = document.getElementById('newsImage');
    let imageData = '';

    // Resim varsa base64'e çevir
    if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        imageData = await fileToBase64(file);
    }

    try {
        const response = await fetch(`${API_BASE}api_haberler.php?action=create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                summary: summary,
                content: content,
                image: imageData,
                yazar: sessionStorage.getItem('admin_username') || 'Admin'
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Haber başarıyla yayınlandı!');
            clearNewsForm();
            loadNewsAdmin();
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function deleteNews(id) {
    if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`${API_BASE}api_haberler.php?action=delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        const result = await response.json();

        if (result.success) {
            loadNewsAdmin();
        } else {
            alert('Silme hatası: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

function clearNewsForm() {
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsSummary').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    const preview = document.getElementById('newsImagePreview');
    if (preview) {
        preview.style.display = 'none';
        preview.src = '';
    }
}

// Helper function: File to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ==================== USER MANAGEMENT ====================

async function loadUsersList() {
    const listEl = document.getElementById('usersList');
    const selectEl = document.getElementById('changeUserSelect');

    if (!listEl) return;

    try {
        const response = await fetch(`${API_BASE}api_auth.php?action=list_users`);
        const result = await response.json();

        if (!result.success) {
            listEl.innerHTML = '<div style="color:#f00;">Kullanıcılar yüklenemedi.</div>';
            return;
        }

        const users = result.data;
        listEl.innerHTML = '';

        if (selectEl) {
            selectEl.innerHTML = '<option value="">Kullanıcı seçin...</option>';
            users.forEach(u => {
                const option = document.createElement('option');
                option.value = u.id;
                option.textContent = u.username;
                selectEl.appendChild(option);
            });
        }

        users.forEach((u) => {
            const div = document.createElement('div');
            div.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:8px; border-bottom:1px solid #222; margin-bottom:6px;';
            div.innerHTML = `
                <span style="color:#0f0; font-weight:bold;">${u.username} <span style="color:#666; font-size:0.8rem;">(${u.role})</span></span>
                ${u.username !== 'root' ? `<button onclick="removeUser(${u.id}, '${u.username}')" class="cyber-btn" style="padding:4px 8px; font-size:0.75rem; border-color:red; color:red;">[ SİL ]</button>` : '<span style="color:#999; font-size:0.8rem;">[ ROOT ]</span>'}
            `;
            listEl.appendChild(div);
        });
    } catch (error) {
        listEl.innerHTML = '<div style="color:#f00;">Hata: ' + error.message + '</div>';
    }
}

async function addUser() {
    const username = document.getElementById('newUserName').value.trim();
    const password = document.getElementById('newUserPass').value.trim();

    if (!username || !password) {
        alert('Kullanıcı adı ve parola boş olamaz!');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}api_auth.php?action=create_user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password,
                role: 'editor'
            })
        });

        const result = await response.json();

        if (result.success) {
            alert(`Kullanıcı '${username}' eklendi.`);
            document.getElementById('newUserName').value = '';
            document.getElementById('newUserPass').value = '';
            loadUsersList();
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function removeUser(userId, username) {
    if (!confirm(`'${username}' kullanıcısı silinecek. Emin misiniz?`)) return;

    try {
        const response = await fetch(`${API_BASE}api_auth.php?action=delete_user`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId })
        });

        const result = await response.json();

        if (result.success) {
            alert(`Kullanıcı '${username}' silindi.`);
            loadUsersList();
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function changeUserPassword() {
    const userId = document.getElementById('changeUserSelect').value;
    const newPass = document.getElementById('changeUserNewPass').value.trim();

    if (!userId) {
        alert('Lütfen bir kullanıcı seçin!');
        return;
    }
    if (!newPass) {
        alert('Lütfen yeni parola girin!');
        return;
    }

    if (!confirm('Şifre değiştirilecek. Emin misiniz?')) return;

    try {
        const response = await fetch(`${API_BASE}api_auth.php?action=change_password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: parseInt(userId),
                new_password: newPass
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Şifre başarıyla değiştirildi.');
            document.getElementById('changeUserSelect').value = '';
            document.getElementById('changeUserNewPass').value = '';
        } else {
            alert('Hata: ' + result.message);
        }
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

// ==================== HELPER FUNCTIONS ====================

function toggleSelectAllOffers(cb) {
    document.querySelectorAll('.offer-select').forEach(i => i.checked = cb.checked);
}

// Resim önizleme
document.addEventListener('DOMContentLoaded', function () {
    const newsImageInput = document.getElementById('newsImage');
    const newsImagePreview = document.getElementById('newsImagePreview');

    if (newsImageInput && newsImagePreview) {
        newsImageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    newsImagePreview.src = e.target.result;
                    newsImagePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
