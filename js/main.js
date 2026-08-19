// Main JavaScript for Homepage
let selectedFile = null;

const carousels = {};

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                nav.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
                }
                nav.classList.remove('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) link.classList.add('active');
                });
            }
        });
    });

    loadStatistics();
    loadOrgInfo();
    loadSocialLinks();
    loadSchools();
    loadKindergartens();
    loadStaff();
    loadNews();

    const contactForm = document.getElementById('contactForm');
    const imageInput = document.getElementById('imageInput');
    const imageFileName = document.getElementById('imageFileName');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            selectedFile = file;
            if (imageFileName) imageFileName.textContent = file.name;
            const reader = new FileReader();
            reader.onload = function(ev) {
                if (imagePreview) {
                    imagePreview.innerHTML = '<div class="preview-wrapper"><img src="' + ev.target.result + '" alt="Oldindan korish"><button type="button" class="remove-preview" onclick="removeSelectedImage()">&times;</button></div>';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const inputs = this.querySelectorAll('input[type="text"], input[type="email"], textarea');
            const name = inputs[0].value;
            const email = inputs[1].value;
            const message = inputs[2].value;
            const emailLine = email ? '\nEmail: ' + email : '';
            const telegramMessage = 'Yangi xabar saytdan!\n\nIsm: ' + name + emailLine + '\nXabar:\n' + message;
            const submitBtn = this.querySelector('.send-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
            try {
                let response;
                if (selectedFile) {
                    response = await sendPhotoToTelegram(telegramMessage, selectedFile);
                } else {
                    response = await sendToTelegram(telegramMessage);
                }
                if (response) {
                    alert('Xabaringiz muvaffaqiyatli yuborildi!');
                    this.reset();
                    selectedFile = null;
                    if (imageFileName) imageFileName.textContent = '';
                    if (imagePreview) imagePreview.innerHTML = '';
                } else {
                    alert("Xabar yuborishda xatolik. Qaytadan urinib ko'ring.");
                }
            } catch (error) {
                console.error('Telegram xatosi:', error);
                alert("Xabar yuborishda xatolik. Qaytadan urinib ko'ring.");
            }
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Yuborish';
        });
    }
});

// Statistics
function loadStatistics() {
    const stats = DataStore.getStats();
    animateNumber('totalSchools', stats.schools);
    animateNumber('totalKindergartens', stats.kindergartens);
    animateNumber('totalTeachers', stats.teachers);
    animateNumber('totalStudents', stats.students);
}

function animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString('uz-UZ');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString('uz-UZ');
        }
    }, 30);
}

// Load Org Info
function loadOrgInfo() {
    var info = DataStore.getOrgInfo();
    if (!info || !info.name) return;
    var el;
    el = document.getElementById('orgTitle'); if (el) el.textContent = info.name;
    el = document.getElementById('orgDesc'); if (el) el.textContent = info.description || '';
    el = document.getElementById('orgMissionText'); if (el) el.textContent = info.mission || '';
    el = document.getElementById('contactAddress'); if (el) el.textContent = info.address || '';
    el = document.getElementById('contactPhone'); if (el) el.textContent = info.phone || '';
    el = document.getElementById('contactEmail'); if (el) el.textContent = info.email || '';
    el = document.getElementById('contactWorkHours'); if (el) el.textContent = info.workHours || '';
    el = document.getElementById('contactDirector'); if (el) el.textContent = info.director || '';
    el = document.getElementById('footerOrgName'); if (el) el.textContent = info.name;
    el = document.getElementById('footerSubtitle'); if (el) el.textContent = info.headerSubtitle || 'Maktabgacha va maktab ta\'limi bo\'limi';
    el = document.getElementById('headerTitle'); if (el) el.textContent = info.headerTitle || info.name;
    el = document.getElementById('headerSubtitle'); if (el) el.textContent = info.headerSubtitle || 'Maktabgacha va maktab ta\'limi bo\'limi';
    el = document.getElementById('heroTitle'); if (el) el.innerHTML = (info.heroTitle || info.name).replace(/\n/g, '<br>');
    el = document.getElementById('heroSubtitle'); if (el) el.textContent = info.heroSubtitle || 'Bolalarimizning yorug\'lik kelajagi uchun birgamiz';
    document.title = (info.headerTitle || info.name) + ' - Maktabgacha va maktab ta\'limi bo\'limi';
}

// Load Social Links
function loadSocialLinks() {
    var links = DataStore.getSocialLinks();
    var socialLinks = document.querySelectorAll('.social-links a');
    if (socialLinks.length >= 1 && links.telegram) socialLinks[0].href = links.telegram;
    if (socialLinks.length >= 2 && links.facebook) socialLinks[1].href = links.facebook;
    if (socialLinks.length >= 3 && links.instagram) socialLinks[2].href = links.instagram;
}

// Carousel
function initCarousel(id, items, itemsPerPage) {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    carousels[id] = { items, itemsPerPage, currentPage: 0, totalPages };
    renderCarouselPage(id);
    renderCarouselDots(id);
    setupCarouselButtons(id);
}

function renderCarouselPage(id) {
    const c = carousels[id];
    const track = document.getElementById(id + 'List');
    if (!track) return;
    const start = c.currentPage * c.itemsPerPage;
    const pageItems = c.items.slice(start, start + c.itemsPerPage);
    track.innerHTML = pageItems.map(item => {
        if (id === 'schools') {
            return '<div class="school-card"><img src="' + (item.image || 'https://placehold.co/400x300/1e3a5f/ffffff?text=Maktab') + '" alt="' + item.name + '"><div class="card-content"><h3>' + item.name + '</h3><p><i class="fas fa-map-marker-alt"></i> ' + item.address + '</p><div class="card-info"><span><i class="fas fa-phone"></i> ' + item.phone + '</span><span><i class="fas fa-users"></i> ' + item.students + " o'quvchi</span></div>" + (item.location ? '<a href="' + item.location + '" target="_blank" class="location-btn"><i class="fas fa-map-marked-alt"></i> Xaritada ko\'rish</a>' : '') + '</div></div>';
        } else {
            return '<div class="kindergarten-card"><img src="' + (item.image || 'https://placehold.co/400x300/e74c3c/ffffff?text=Bogcha') + '" alt="' + item.name + '"><div class="card-content"><h3>' + item.name + '</h3><p><i class="fas fa-map-marker-alt"></i> ' + item.address + '</p><div class="card-info"><span><i class="fas fa-phone"></i> ' + item.phone + '</span><span><i class="fas fa-child"></i> ' + item.children + " go'shish</span></div>" + (item.location ? '<a href="' + item.location + '" target="_blank" class="location-btn"><i class="fas fa-map-marked-alt"></i> Xaritada ko\'rish</a>' : '') + '</div></div>';
        }
    }).join('');
    document.querySelectorAll('#' + id + 'Dots .carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === c.currentPage);
    });
}

function renderCarouselDots(id) {
    const c = carousels[id];
    const dotsContainer = document.getElementById(id + 'Dots');
    if (!dotsContainer || c.totalPages <= 1) {
        if (dotsContainer) dotsContainer.innerHTML = '';
        return;
    }
    dotsContainer.innerHTML = Array.from({ length: c.totalPages }, (_, i) =>
        '<button class="carousel-dot' + (i === 0 ? ' active' : '') + '" data-page="' + i + '"></button>'
    ).join('');
    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', function() {
            carousels[id].currentPage = parseInt(this.dataset.page);
            renderCarouselPage(id);
        });
    });
}

function setupCarouselButtons(id) {
    const c = carousels[id];
    const prevBtn = document.getElementById(id + 'Prev');
    const nextBtn = document.getElementById(id + 'Next');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (c.currentPage > 0) { c.currentPage--; renderCarouselPage(id); }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (c.currentPage < c.totalPages - 1) { c.currentPage++; renderCarouselPage(id); }
        });
    }
}

// Load Schools
function loadSchools() {
    const schools = DataStore.getAll('schools');
    if (schools.length === 0) {
        var container = document.getElementById('schoolsList');
        if (container) container.innerHTML = '<p class="no-data">Maktablar topilmadi</p>';
        return;
    }
    initCarousel('schools', schools, 6);
}

// Load Kindergartens
function loadKindergartens() {
    const kindergartens = DataStore.getAll('kindergartens');
    if (kindergartens.length === 0) {
        var container = document.getElementById('kindergartensList');
        if (container) container.innerHTML = '<p class="no-data">Bog\'chalar topilmadi</p>';
        return;
    }
    initCarousel('kindergartens', kindergartens, 6);
}

// Load Staff - Department Tabs
function loadStaff() {
    var departments = DataStore.getAll('departments');
    var staff = DataStore.getAll('staff');
    var tabsContainer = document.getElementById('deptTabs');
    var listContainer = document.getElementById('deptStaffList');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = departments.map(function(dept, i) {
        return '<button class="dept-tab' + (i === 0 ? ' active' : '') + '" data-dept="' + dept.id + '"><i class="fas ' + dept.icon + '"></i><span>' + dept.name + '</span></button>';
    }).join('');

    function showDept(deptId) {
        var members = staff.filter(function(s) { return s.departmentId === deptId; });
        var dept = departments.find(function(d) { return d.id === deptId; });
        if (!dept) return;

        if (members.length === 0) {
            listContainer.innerHTML = '<div class="dept-staff-header"><i class="fas ' + dept.icon + '"></i><h3>' + dept.name + '</h3></div><p class="no-data">Bu bo\'limda hozircha xodimlar yo\'q</p>';
            return;
        }

        var html = '<div class="dept-staff-header"><i class="fas ' + dept.icon + '"></i><h3>' + dept.name + '</h3><span>' + members.length + ' nafar xodim</span></div>';
        html += '<div class="staff-list">';
        members.forEach(function(m) {
            html += '<div class="staff-list-item">';
            html += '<img src="' + (m.image || 'https://placehold.co/80x80/2980b9/ffffff?text=XR') + '" alt="' + m.name + '">';
            html += '<div class="staff-list-info">';
            html += '<h4>' + m.name + '</h4>';
            html += '<p class="staff-list-position">' + m.position + '</p>';
            html += '<div class="staff-list-contacts">';
            html += '<span><i class="fas fa-phone"></i> ' + m.phone + '</span>';
            html += '<span><i class="fas fa-envelope"></i> ' + m.email + '</span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';
        listContainer.innerHTML = html;
    }

    tabsContainer.querySelectorAll('.dept-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabsContainer.querySelectorAll('.dept-tab').forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            showDept(parseInt(this.dataset.dept));
        });
    });

    if (departments.length > 0) {
        showDept(departments[0].id);
    }
}

// Load News
function loadNews() {
    const news = DataStore.getAll('news');
    const container = document.getElementById('newsList');
    if (!container) return;
    if (news.length === 0) {
        container.innerHTML = '<p class="no-data">Yangiliklar topilmadi</p>';
        return;
    }
    const sortedNews = news.sort((a, b) => new Date(b.date) - new Date(a.date));
    container.innerHTML = sortedNews.slice(0, 6).map(item => '<div class="news-card"><img src="' + (item.image || 'https://placehold.co/400x300/f39c12/ffffff?text=Yangilik') + '" alt="' + item.title + '"><div class="news-content"><span class="news-date"><i class="fas fa-calendar"></i> ' + formatDate(item.date) + '</span><h3>' + item.title + '</h3><p>' + item.content.substring(0, 100) + '...</p></div></div>').join('');
}

// Format Date
function formatDate(dateString) {
    const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    const d = new Date(dateString);
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

// Telegram
async function sendToTelegram(message) {
    const { BOT_TOKEN, CHAT_ID } = TELEGRAM_CONFIG;
    if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || CHAT_ID === 'YOUR_CHAT_ID_HERE') return false;
    try {
        const response = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message })
        });
        const data = await response.json();
        return data.ok;
    } catch (error) {
        return true;
    }
}

async function sendPhotoToTelegram(caption, file) {
    const { BOT_TOKEN, CHAT_ID } = TELEGRAM_CONFIG;
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('caption', caption);
    formData.append('photo', file);
    try {
        const response = await fetch('https://api.telegram.org/bot' + BOT_TOKEN + '/sendPhoto', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.ok;
    } catch (error) {
        return true;
    }
}

function removeSelectedImage() {
    const imageInput = document.getElementById('imageInput');
    const imageFileName = document.getElementById('imageFileName');
    const imagePreview = document.getElementById('imagePreview');
    if (imageInput) imageInput.value = '';
    if (imageFileName) imageFileName.textContent = '';
    if (imagePreview) imagePreview.innerHTML = '';
    selectedFile = null;
}
