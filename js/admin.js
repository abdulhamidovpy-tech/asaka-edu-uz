// Admin Panel JavaScript
let currentModalFile = null;

document.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('adminLoggedIn')) {
        showDashboard();
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const admin = DataStore.checkAdmin(username, password);
            if (admin) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminId', admin.id);
                sessionStorage.setItem('adminLogin', admin.login);
                showDashboard();
            } else {
                alert('Login yoki parol xato!');
            }
        });
    }

    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('adminLoggedIn');
        hideDashboard();
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.id === 'logoutBtn') return;
            e.preventDefault();
            const section = this.dataset.section;
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(`${section}Section`).classList.add('active');
            loadSectionData(section);
        });
    });

    document.getElementById('menuBtn')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });

    document.getElementById('sidebarToggle')?.addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('active');
    });

    document.getElementById('modalClose')?.addEventListener('click', closeModal);
    document.getElementById('modal')?.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });

    document.getElementById('addSchoolBtn')?.addEventListener('click', () => openSchoolModal());
    document.getElementById('addKindergartenBtn')?.addEventListener('click', () => openKindergartenModal());
    document.getElementById('addStaffBtn')?.addEventListener('click', () => openStaffModal());
    document.getElementById('addNewsBtn')?.addEventListener('click', () => openNewsModal());
    document.getElementById('addDepartmentBtn')?.addEventListener('click', () => openDepartmentModal());
    document.getElementById('orgInfoForm')?.addEventListener('submit', saveOrgInfo);
    document.getElementById('socialForm')?.addEventListener('submit', saveSocialLinks);
    document.getElementById('addAdminBtn')?.addEventListener('click', openAddAdminModal);

    loadDashboard();
});

function showDashboard() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadDashboard();
}

function hideDashboard() {
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function loadDashboard() {
    const stats = DataStore.getStats();
    document.getElementById('dashSchools').textContent = stats.schools;
    document.getElementById('dashKindergartens').textContent = stats.kindergartens;
    document.getElementById('dashStaff').textContent = stats.staff;
    document.getElementById('dashNews').textContent = stats.news;

    const news = DataStore.getAll('news');
    const recentNews = news.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const recentContainer = document.getElementById('recentNews');
    if (recentContainer) {
        recentContainer.innerHTML = recentNews.map(item => `
            <div class="recent-item">
                <div>
                    <h4>${item.title}</h4>
                    <p>${item.content.substring(0, 50)}...</p>
                </div>
                <span>${formatDate(item.date)}</span>
            </div>
        `).join('');
    }
}

function loadSectionData(section) {
    const loaders = {
        schools: loadSchoolsTable,
        kindergartens: loadKindergartensTable,
        staff: loadStaffTable,
        news: loadNewsTable,
        dashboard: loadDashboard,
        orginfo: loadOrgInfo,
        departments: loadDepartmentsTable,
        social: loadSocialLinks,
        admins: loadAdminsTable
    };
    if (loaders[section]) loaders[section]();
}

// Helper: File to DataURL
function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Image upload HTML template for modals
function imageUploadHTML(existingImage, id) {
    const preview = existingImage
        ? `<div class="modal-preview"><img src="${existingImage}" alt="Rasm"><button type="button" class="remove-modal-preview" onclick="removeModalImage()">&times;</button></div>`
        : '';
    return `
        <div class="form-group">
            <label>Rasm</label>
            <div class="modal-upload">
                <input type="file" id="${id}FileInput" accept="image/*" style="display:none">
                <label for="${id}FileInput" class="modal-upload-btn">
                    <i class="fas fa-camera"></i> Rasm tanlash
                </label>
                <span id="${id}FileName" class="file-name-text"></span>
            </div>
            <input type="hidden" id="${id}ImageValue" value="${existingImage || ''}">
            <div id="${id}Preview">${preview}</div>
        </div>
    `;
}

function setupModalFileInput(inputId, hiddenId, fileNameId, previewId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('change', async function() {
        const file = this.files[0];
        if (!file) return;
        document.getElementById(fileNameId).textContent = file.name;
        const dataURL = await fileToDataURL(file);
        document.getElementById(hiddenId).value = dataURL;
        document.getElementById(previewId).innerHTML = `
            <div class="modal-preview">
                <img src="${dataURL}" alt="Rasm">
                <button type="button" class="remove-modal-preview" onclick="removeModalImage('${inputId}','${hiddenId}','${fileNameId}','${previewId}')">&times;</button>
            </div>
        `;
    });
}

function removeModalImage(inputId, hiddenId, fileNameId, previewId) {
    if (inputId) document.getElementById(inputId).value = '';
    if (hiddenId) document.getElementById(hiddenId).value = '';
    if (fileNameId) document.getElementById(fileNameId).textContent = '';
    if (previewId) document.getElementById(previewId).innerHTML = '';
}

// ===================== SCHOOLS =====================
function loadSchoolsTable() {
    const schools = DataStore.getAll('schools');
    document.getElementById('schoolsTable').innerHTML = schools.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${s.image || ''}" alt="${s.name}" onerror="this.style.display='none'"></td>
            <td>${s.name}</td>
            <td>${s.address}</td>
            <td>${s.phone}</td>
            <td>${s.students}</td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editSchool(${s.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" onclick="deleteSchool(${s.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openSchoolModal(school = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = school ? 'Maktabni tahrirlash' : 'Yangi maktab qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <form id="schoolForm">
            <div class="form-group">
                <label>Maktab nomi</label>
                <input type="text" id="schoolName" value="${school?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Manzil</label>
                <input type="text" id="schoolAddress" value="${school?.address || ''}" required>
            </div>
            <div class="form-group">
                <label>Telefon</label>
                <input type="text" id="schoolPhone" value="${school?.phone || ''}" required>
            </div>
            <div class="form-group">
                <label>O'quvchilar soni</label>
                <input type="number" id="schoolStudents" value="${school?.students || ''}" required>
            </div>
            <div class="form-group">
                <label>Lokatsiya (Google Maps link)</label>
                <input type="url" id="schoolLocation" value="${school?.location || ''}" placeholder="https://maps.app.goo.gl/...">
            </div>
            ${imageUploadHTML(school?.image, 'school')}
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Saqlash</button>
            </div>
        </form>
    `;
    modal.classList.add('active');
    setupModalFileInput('schoolFileInput', 'schoolImageValue', 'schoolFileName', 'schoolPreview');

    document.getElementById('schoolForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('schoolName').value,
            address: document.getElementById('schoolAddress').value,
            phone: document.getElementById('schoolPhone').value,
            students: parseInt(document.getElementById('schoolStudents').value),
            location: document.getElementById('schoolLocation').value,
            image: document.getElementById('schoolImageValue').value
        };
        school ? DataStore.update('schools', school.id, data) : DataStore.add('schools', data);
        closeModal();
        loadSchoolsTable();
    });
}

function editSchool(id) {
    const school = DataStore.getById('schools', id);
    if (school) openSchoolModal(school);
}

function deleteSchool(id) {
    if (confirm('Maktabni o\'chirishni xohlaysizmi?')) {
        DataStore.delete('schools', id);
        loadSchoolsTable();
    }
}

// ===================== KINDERGARTENS =====================
function loadKindergartensTable() {
    const kgs = DataStore.getAll('kindergartens');
    document.getElementById('kindergartensTable').innerHTML = kgs.map((kg, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><img src="${kg.image || ''}" alt="${kg.name}" onerror="this.style.display='none'"></td>
            <td>${kg.name}</td>
            <td>${kg.address}</td>
            <td>${kg.phone}</td>
            <td>${kg.children}</td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editKindergarten(${kg.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" onclick="deleteKindergarten(${kg.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openKindergartenModal(kg = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = kg ? 'Bog\'chani tahrirlash' : 'Yangi bog\'cha qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <form id="kindergartenForm">
            <div class="form-group">
                <label>Bog'cha nomi</label>
                <input type="text" id="kgName" value="${kg?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Manzil</label>
                <input type="text" id="kgAddress" value="${kg?.address || ''}" required>
            </div>
            <div class="form-group">
                <label>Telefon</label>
                <input type="text" id="kgPhone" value="${kg?.phone || ''}" required>
            </div>
            <div class="form-group">
                <label>Tarbiyalanuvchilar soni</label>
                <input type="number" id="kgChildren" value="${kg?.children || ''}" required>
            </div>
            <div class="form-group">
                <label>Lokatsiya (Google Maps link)</label>
                <input type="url" id="kgLocation" value="${kg?.location || ''}" placeholder="https://maps.app.goo.gl/...">
            </div>
            ${imageUploadHTML(kg?.image, 'kg')}
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Saqlash</button>
            </div>
        </form>
    `;
    modal.classList.add('active');
    setupModalFileInput('kgFileInput', 'kgImageValue', 'kgFileName', 'kgPreview');

    document.getElementById('kindergartenForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('kgName').value,
            address: document.getElementById('kgAddress').value,
            phone: document.getElementById('kgPhone').value,
            children: parseInt(document.getElementById('kgChildren').value),
            location: document.getElementById('kgLocation').value,
            image: document.getElementById('kgImageValue').value
        };
        kg ? DataStore.update('kindergartens', kg.id, data) : DataStore.add('kindergartens', data);
        closeModal();
        loadKindergartensTable();
    });
}

function editKindergarten(id) {
    const kg = DataStore.getById('kindergartens', id);
    if (kg) openKindergartenModal(kg);
}

function deleteKindergarten(id) {
    if (confirm('Bog\'chani o\'chirishni xohlaysizmi?')) {
        DataStore.delete('kindergartens', id);
        loadKindergartensTable();
    }
}

// ===================== KINDERGARTEN EXCEL IMPORT =====================
document.getElementById('importKgExcelBtn')?.addEventListener('click', function() {
    document.getElementById('kgExcelInput').click();
});

document.getElementById('kgExcelInput')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const data = new Uint8Array(ev.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
            if (rows.length === 0) {
                alert('Faylda ma\'lumot topilmadi!');
                return;
            }
            showKgImportPreview(rows);
        } catch (err) {
            alert('Faylni o\'qishda xatolik: ' + err.message);
        }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
});

function showKgImportPreview(rows) {
    const fieldMap = {
        'name': ['nomi', 'name', 'bog\'cha nomi', 'bogcha nomi', 'tashkilot nomi', 'название'],
        'address': ['manzil', 'address', 'joylashuvi', 'ko\'cha', 'адрес'],
        'phone': ['telefon', 'phone', 'tel', 'raqam', 'телефон'],
        'children': ['bolalar soni', 'children', 'go\'shish', 'soni', 'tarbiyalanuvchi', 'count'],
        'location': ['lokatsiya', 'location', 'coords', 'koordinata', 'google maps', 'xarita']
    };
    const headers = Object.keys(rows[0]);
    const mapping = {};
    for (const [field, aliases] of Object.entries(fieldMap)) {
        for (const h of headers) {
            const hl = h.toLowerCase().trim();
            if (aliases.includes(hl) || hl.includes(aliases[0])) {
                mapping[field] = h;
                break;
            }
        }
    }

    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = 'Excel import - Bog\'chalar';
    let rowsPreview = rows.slice(0, 10).map((r, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${r[mapping.name] || '<span style="color:red">yo\'q</span>'}</td>
            <td>${r[mapping.address] || '-'}</td>
            <td>${r[mapping.phone] || '-'}</td>
            <td>${r[mapping.children] || '-'}</td>
            <td>${r[mapping.location] ? '<i class="fas fa-check" style="color:green"></i>' : '-'}</td>
        </tr>
    `).join('');

    document.getElementById('modalBody').innerHTML = `
        <div class="import-preview">
            <div class="import-info">
                <p><i class="fas fa-info-circle"></i> Topilgan ustunlar (avtomatik aniqlangan):</p>
                <div class="field-mapping">
                    <span class="mapped"><i class="fas fa-check-circle"></i> Nomi: <strong>${mapping.name || 'aniqlanmadi'}</strong></span>
                    <span class="mapped"><i class="fas fa-check-circle"></i> Manzil: <strong>${mapping.address || 'aniqlanmadi'}</strong></span>
                    <span class="mapped"><i class="fas fa-check-circle"></i> Telefon: <strong>${mapping.phone || 'aniqlanmadi'}</strong></span>
                    <span class="mapped"><i class="fas fa-check-circle"></i> Bolalar: <strong>${mapping.children || 'aniqlanmadi'}</strong></span>
                    <span class="mapped"><i class="fas fa-check-circle"></i> Lokatsiya: <strong>${mapping.location || 'aniqlanmadi'}</strong></span>
                </div>
                <p style="margin-top:10px"><strong>Jami: ${rows.length}</strong> ta bog'cha topildi. ${rows.length > 10 ? 'Pastda birinchi 10 tasi ko\'rsatilgan.' : ''}</p>
            </div>
            <table class="data-table" style="margin-top:15px">
                <thead>
                    <tr>
                        <th>#</th><th>Nomi</th><th>Manzil</th><th>Telefon</th><th>Bolalar</th><th>Lokatsiya</th>
                    </tr>
                </thead>
                <tbody>${rowsPreview}</tbody>
            </table>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
            <button type="button" class="btn btn-success" id="confirmKgImport">
                <i class="fas fa-upload"></i> Import qilish (${rows.length} ta bog'cha)
            </button>
        </div>
    `;
    modal.classList.add('active');

    document.getElementById('confirmKgImport').addEventListener('click', function() {
        importKindergartens(rows, mapping);
    });
}

function importKindergartens(rows, mapping) {
    let existing = DataStore.getAll('kindergartens');
    let maxId = existing.reduce((max, item) => Math.max(max, item.id || 0), 0);
    let added = 0;
    for (const row of rows) {
        const name = row[mapping.name];
        if (!name) continue;
        maxId++;
        DataStore.add('kindergartens', {
            id: maxId,
            name: String(name).trim(),
            address: row[mapping.address] ? String(row[mapping.address]).trim() : '',
            phone: row[mapping.phone] ? String(row[mapping.phone]).trim() : '',
            children: parseInt(row[mapping.children]) || 0,
            location: row[mapping.location] ? String(row[mapping.location]).trim() : '',
            image: ''
        });
        added++;
    }
    closeModal();
    loadKindergartensTable();
    loadDashboard();
    alert(added + ' ta bog\'cha muvaffaqiyatli import qilindi!');
}

// ===================== STAFF =====================
function loadStaffTable() {
    const staff = DataStore.getAll('staff');
    const departments = DataStore.getAll('departments');
    document.getElementById('staffTable').innerHTML = staff.map((m, i) => {
        const dept = departments.find(d => d.id === m.departmentId);
        return `<tr>
            <td>${i + 1}</td>
            <td><img src="${m.image || ''}" alt="${m.name}" onerror="this.style.display='none'"></td>
            <td>${m.name}</td>
            <td>${m.position}</td>
            <td>${dept ? dept.name : '-'}</td>
            <td>${m.phone}</td>
            <td>${m.email}</td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editStaff(${m.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" onclick="deleteStaff(${m.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
}

function openStaffModal(member = null) {
    const modal = document.getElementById('modal');
    const departments = DataStore.getAll('departments');
    const deptOptions = departments.map(d => '<option value="' + d.id + '"' + (member && member.departmentId == d.id ? ' selected' : '') + '>' + d.name + '</option>').join('');
    document.getElementById('modalTitle').textContent = member ? 'Xodimni tahrirlash' : 'Yangi xodim qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <form id="staffForm">
            <div class="form-group">
                <label>F.I.O</label>
                <input type="text" id="staffName" value="${member?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Lavozim</label>
                <input type="text" id="staffPosition" value="${member?.position || ''}" required>
            </div>
            <div class="form-group">
                <label>Bo'lim</label>
                <select id="staffDepartment"><option value="">Tanlang...</option>${deptOptions}</select>
            </div>
            <div class="form-group">
                <label>Telefon</label>
                <input type="text" id="staffPhone" value="${member?.phone || ''}" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="staffEmail" value="${member?.email || ''}" required>
            </div>
            ${imageUploadHTML(member?.image, 'staff')}
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Saqlash</button>
            </div>
        </form>
    `;
    modal.classList.add('active');
    setupModalFileInput('staffFileInput', 'staffImageValue', 'staffFileName', 'staffPreview');

    document.getElementById('staffForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('staffName').value,
            position: document.getElementById('staffPosition').value,
            departmentId: parseInt(document.getElementById('staffDepartment').value) || null,
            phone: document.getElementById('staffPhone').value,
            email: document.getElementById('staffEmail').value,
            image: document.getElementById('staffImageValue').value
        };
        member ? DataStore.update('staff', member.id, data) : DataStore.add('staff', data);
        closeModal();
        loadStaffTable();
    });
}

function editStaff(id) {
    const member = DataStore.getById('staff', id);
    if (member) openStaffModal(member);
}

function deleteStaff(id) {
    if (confirm('Xodimni o\'chirishni xohlaysizmi?')) {
        DataStore.delete('staff', id);
        loadStaffTable();
    }
}

// ===================== NEWS =====================
function loadNewsTable() {
    const news = DataStore.getAll('news');
    document.getElementById('newsTable').innerHTML = news.map((item, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${item.title}</td>
            <td>${item.content.substring(0, 50)}...</td>
            <td>${formatDate(item.date)}</td>
            <td><img src="${item.image || ''}" alt="${item.title}" onerror="this.style.display='none'"></td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="editNews(${item.id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" onclick="deleteNews(${item.id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function openNewsModal(newsItem = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = newsItem ? 'Yangilikni tahrirlash' : 'Yangi yangilik qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <form id="newsForm">
            <div class="form-group">
                <label>Sarlavha</label>
                <input type="text" id="newsTitle" value="${newsItem?.title || ''}" required>
            </div>
            <div class="form-group">
                <label>Mazmun</label>
                <textarea id="newsContent" required>${newsItem?.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label>Sana</label>
                <input type="date" id="newsDate" value="${newsItem?.date || new Date().toISOString().split('T')[0]}" required>
            </div>
            ${imageUploadHTML(newsItem?.image, 'news')}
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Saqlash</button>
            </div>
        </form>
    `;
    modal.classList.add('active');
    setupModalFileInput('newsFileInput', 'newsImageValue', 'newsFileName', 'newsPreview');

    document.getElementById('newsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            title: document.getElementById('newsTitle').value,
            content: document.getElementById('newsContent').value,
            date: document.getElementById('newsDate').value,
            image: document.getElementById('newsImageValue').value
        };
        newsItem ? DataStore.update('news', newsItem.id, data) : DataStore.add('news', data);
        closeModal();
        loadNewsTable();
    });
}

function editNews(id) {
    const item = DataStore.getById('news', id);
    if (item) openNewsModal(item);
}

function deleteNews(id) {
    if (confirm('Yangilikni o\'chirishni xohlaysizmi?')) {
        DataStore.delete('news', id);
        loadNewsTable();
    }
}

// ===================== ORG INFO =====================
function loadOrgInfo() {
    const info = DataStore.getOrgInfo();
    document.getElementById('orgName').value = info.name || '';
    document.getElementById('orgDirector').value = info.director || '';
    document.getElementById('orgAddress').value = info.address || '';
    document.getElementById('orgPhone').value = info.phone || '';
    document.getElementById('orgEmail').value = info.email || '';
    document.getElementById('orgWorkHours').value = info.workHours || '';
    document.getElementById('orgDescription').value = info.description || '';
    document.getElementById('orgMission').value = info.mission || '';
    document.getElementById('orgHeaderTitle').value = info.headerTitle || '';
    document.getElementById('orgHeaderSubtitle').value = info.headerSubtitle || '';
    document.getElementById('orgHeroTitle').value = (info.heroTitle || '').replace(/\\n/g, '\n');
    document.getElementById('orgHeroSubtitle').value = info.heroSubtitle || '';
}

function saveOrgInfo(e) {
    e.preventDefault();
    DataStore.updateOrgInfo({
        name: document.getElementById('orgName').value,
        director: document.getElementById('orgDirector').value,
        address: document.getElementById('orgAddress').value,
        phone: document.getElementById('orgPhone').value,
        email: document.getElementById('orgEmail').value,
        workHours: document.getElementById('orgWorkHours').value,
        description: document.getElementById('orgDescription').value,
        mission: document.getElementById('orgMission').value,
        headerTitle: document.getElementById('orgHeaderTitle').value,
        headerSubtitle: document.getElementById('orgHeaderSubtitle').value,
        heroTitle: document.getElementById('orgHeroTitle').value,
        heroSubtitle: document.getElementById('orgHeroSubtitle').value
    });
    alert('Tashkilot ma\'lumotlari saqlandi!');
}

// ===================== DEPARTMENTS =====================
function loadDepartmentsTable() {
    const departments = DataStore.getAll('departments');
    const staff = DataStore.getAll('staff');
    document.getElementById('departmentsGrid').innerHTML = departments.map(dept => {
        const members = staff.filter(s => s.departmentId === dept.id);
        return `<div class="dept-card">
            <div class="dept-header">
                <i class="fas ${dept.icon || 'fa-folder'}"></i>
                <h3>${dept.name}</h3>
            </div>
            <div class="dept-count">${members.length} nafar xodim</div>
            <div class="dept-actions">
                <button class="btn btn-primary" onclick="editDepartment(${dept.id})"><i class="fas fa-edit"></i> Tahrirlash</button>
                <button class="btn btn-danger" onclick="deleteDepartment(${dept.id})"><i class="fas fa-trash"></i> O'chirish</button>
            </div>
        </div>`;
    }).join('');
}

function openDepartmentModal(dept = null) {
    const modal = document.getElementById('modal');
    const icons = [
        'fa-user-tie', 'fa-users', 'fa-calculator', 'fa-laptop', 'fa-book', 'fa-building',
        'fa-medkit', 'fa-balance-scale', 'fa-cogs', 'fa-graduation-cap',
        'fa-child', 'fa-school', 'fa-wrench', 'fa-coins', 'fa-calculator',
        'fa-book-open', 'fa-chart-line', 'fa-clipboard-check', 'fa-gavel',
        'fa-mosque', 'fa-heart', 'fa-star', 'fa-shield-alt', 'fa-briefcase',
        'fa-file-alt', 'fa-search', 'fa-check-double', 'fa-tasks',
        'fa-desktop', 'fa-chalkboard-teacher', 'fa-users-cog', 'fa-user-graduate'
    ];
    document.getElementById('modalTitle').textContent = dept ? 'Bo\'limni tahrirlash' : 'Yangi bo\'lim qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <form id="departmentForm">
            <div class="form-group">
                <label>Bo'lim nomi</label>
                <input type="text" id="deptName" value="${dept?.name || ''}" required>
            </div>
            <div class="form-group">
                <label>Ikonka</label>
                <div class="icon-picker" id="iconPicker">
                    ${icons.map(ic => '<div class="icon-option' + (dept && dept.icon === ic ? ' selected' : '') + '" data-icon="' + ic + '"><i class="fas ' + ic + '"></i></div>').join('')}
                </div>
                <input type="hidden" id="deptIcon" value="${dept?.icon || 'fa-folder'}">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Saqlash</button>
            </div>
        </form>
    `;
    modal.classList.add('active');

    document.querySelectorAll('#iconPicker .icon-option').forEach(opt => {
        opt.addEventListener('click', function() {
            document.querySelectorAll('#iconPicker .icon-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('deptIcon').value = this.dataset.icon;
        });
    });

    document.getElementById('departmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            name: document.getElementById('deptName').value,
            icon: document.getElementById('deptIcon').value
        };
        dept ? DataStore.update('departments', dept.id, data) : DataStore.add('departments', data);
        closeModal();
        loadDepartmentsTable();
    });
}

function editDepartment(id) {
    const dept = DataStore.getById('departments', id);
    if (dept) openDepartmentModal(dept);
}

function deleteDepartment(id) {
    if (confirm('Bo\'limni o\'chirishni xohlaysizmi?')) {
        DataStore.delete('departments', id);
        loadDepartmentsTable();
    }
}

// ===================== UTILS =====================
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    currentModalFile = null;
}

function formatDate(dateString) {
    const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    const d = new Date(dateString);
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

// ===================== SOCIAL LINKS =====================
function loadSocialLinks() {
    const links = DataStore.getSocialLinks();
    document.getElementById('socialTelegram').value = links.telegram || '';
    document.getElementById('socialFacebook').value = links.facebook || '';
    document.getElementById('socialInstagram').value = links.instagram || '';
    document.getElementById('socialYoutube').value = links.youtube || '';
}

function saveSocialLinks(e) {
    e.preventDefault();
    DataStore.updateSocialLinks({
        telegram: document.getElementById('socialTelegram').value.trim(),
        facebook: document.getElementById('socialFacebook').value.trim(),
        instagram: document.getElementById('socialInstagram').value.trim(),
        youtube: document.getElementById('socialYoutube').value.trim()
    });
    alert('Ijtimoiy tarmoqlar havolalari saqlandi!');
}

// ===================== ADMINS =====================
function loadAdminsTable() {
    const admins = DataStore.getAdmins();
    document.getElementById('adminsTable').innerHTML = admins.map((a, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${a.login}</strong></td>
            <td>${a.created || '-'}</td>
            <td class="action-btns">
                <button class="btn btn-primary" onclick="openChangePasswordModal(${a.id}, '${a.login}')"><i class="fas fa-key"></i></button>
                ${a.login === 'admin' ? '' : `<button class="btn btn-danger" onclick="deleteAdmin(${a.id})"><i class="fas fa-trash"></i></button>`}
            </td>
        </tr>
    `).join('');
}

function openAddAdminModal() {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = 'Yangi admin qo\'shish';
    document.getElementById('modalBody').innerHTML = `
        <form id="adminForm">
            <div class="form-group">
                <label>Login (foydalanuvchi nomi)</label>
                <input type="text" id="newAdminLogin" required placeholder="admin2">
            </div>
            <div class="form-group">
                <label>Parol</label>
                <input type="text" id="newAdminPassword" required placeholder="parol">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Qo'shish</button>
            </div>
        </form>
    `;
    modal.classList.add('active');
    document.getElementById('adminForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const login = document.getElementById('newAdminLogin').value.trim();
        const password = document.getElementById('newAdminPassword').value.trim();
        if (!login || !password) return alert('Login va parol kiritilishi shart!');
        const existing = DataStore.getAdmins().find(a => a.login === login);
        if (existing) return alert('Bunday login allaqachon mavjud!');
        DataStore.addAdmin(login, password);
        closeModal();
        loadAdminsTable();
        alert('Admin muvaffaqiyatli qo\'shildi!');
    });
}

function openChangePasswordModal(id, login) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = login + ' — Parolni o\'zgartirish';
    document.getElementById('modalBody').innerHTML = `
        <form id="changePasswordForm">
            <div class="form-group">
                <label>Joriy parol</label>
                <input type="password" id="currentPassword" required>
            </div>
            <div class="form-group">
                <label>Yangi parol</label>
                <input type="password" id="newPassword" required>
            </div>
            <div class="form-group">
                <label>Yangi parolni tasdiqlash</label>
                <input type="password" id="confirmPassword" required>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" onclick="closeModal()">Bekor qilish</button>
                <button type="submit" class="btn btn-success">Saqlash</button>
            </div>
        </form>
    `;
    modal.classList.add('active');
    document.getElementById('changePasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        if (newPass !== confirm) return alert('Yangi parollar mos kelmaydi!');
        if (newPass.length < 4) return alert('Parol kamida 4 ta belgi bo\'lishi kerak!');
        const admin = DataStore.getAdmins().find(a => a.id === id);
        if (!admin || admin.password !== current) return alert('Joriy parol xato!');
        DataStore.updateAdminPassword(id, newPass);
        closeModal();
        alert('Parol muvaffaqiyatli o\'zgartirildi!');
    });
}

function deleteAdmin(id) {
    if (confirm('Adminni o\'chirishni xohlaysizmi?')) {
        DataStore.deleteAdmin(id);
        loadAdminsTable();
    }
}
