// Data Management with JSONBin.io (online) + localStorage cache
const DataStore = {
    _cache: null,
    _saving: false,

    // Load all data from JSONBin.io
    async load() {
        try {
            const response = await fetch(JSONBIN_CONFIG.BASE_URL + '/' + JSONBIN_CONFIG.BIN_ID, {
                headers: { 'X-Master-Key': JSONBIN_CONFIG.API_KEY }
            });
            const result = await response.json();
            this._cache = result.record;
            localStorage.setItem('siteData', JSON.stringify(this._cache));
        } catch (e) {
            console.warn('JSONBin xatosi, localStorage ishlatilmoqda:', e);
            this._cache = JSON.parse(localStorage.getItem('siteData')) || this._getDefaults();
        }
    },

    // Save all data to JSONBin.io
    async save() {
        if (this._saving) return;
        this._saving = true;
        try {
            await fetch(JSONBIN_CONFIG.BASE_URL + '/' + JSONBIN_CONFIG.BIN_ID, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this._cache)
            });
            localStorage.setItem('siteData', JSON.stringify(this._cache));
        } catch (e) {
            console.warn('JSONBin ga saqlashda xato:', e);
            localStorage.setItem('siteData', JSON.stringify(this._cache));
        }
        this._saving = false;
    },

    // Get default data structure
    _getDefaults() {
        return {
            orgInfo: {
                name: "Asaka tumani MMTB",
                director: "Karimov Alisher Karimovich",
                address: "Andijon viloyati, Asaka tumani, Markaz mahalla",
                phone: "+998 74 123 45 67",
                email: "info@asaka-edu.uz",
                workHours: "Dushanba - Juma: 8:00 - 17:00",
                description: "Asaka tumani maktabgacha va maktab ta'limi bo'limi tashkil etilganidan buyon tuman aholisiga sifatli ta'lim xizmatini ko'rsatib kelmoqda.",
                mission: "Har bir bolaga sifatli ta'lim berish, ularning intellektual va ma'naviy rivojlanishini ta'minlash.",
                headerTitle: "Asaka tumani MMTB",
                headerSubtitle: "Maktabgacha va maktab ta'limi bo'limi",
                heroTitle: "Asaka tumani\nMaktabgacha va maktab ta'limi bo'limi",
                heroSubtitle: "Bolalarimizning yorug'lik kelajagi uchun birgamiz"
            },
            socialLinks: { telegram: '', facebook: '', instagram: '', youtube: '' },
            admins: [{ id: 1, login: 'admin', password: 'admin123', created: new Date().toISOString().split('T')[0] }],
            schools: [],
            kindergartens: [],
            departments: [],
            staff: [],
            news: []
        };
    },

    // Ensure cache exists
    _ensureCache() {
        if (!this._cache) this._cache = this._getDefaults();
        if (!this._cache.schools) this._cache.schools = [];
        if (!this._cache.kindergartens) this._cache.kindergartens = [];
        if (!this._cache.departments) this._cache.departments = [];
        if (!this._cache.staff) this._cache.staff = [];
        if (!this._cache.news) this._cache.news = [];
        if (!this._cache.socialLinks) this._cache.socialLinks = { telegram: '', facebook: '', instagram: '', youtube: '' };
        if (!this._cache.admins) this._cache.admins = [{ id: 1, login: 'admin', password: 'admin123', created: new Date().toISOString().split('T')[0] }];
        if (!this._cache.orgInfo) this._cache.orgInfo = this._getDefaults().orgInfo;
    },

    // Get all items of a type
    getAll(type) {
        this._ensureCache();
        return this._cache[type] || [];
    },

    getById(type, id) {
        return this.getAll(type).find(item => item.id === id);
    },

    add(type, item) {
        this._ensureCache();
        const data = this._cache[type] || [];
        item.id = data.length > 0 ? Math.max(...data.map(d => d.id || 0)) + 1 : 1;
        data.push(item);
        this._cache[type] = data;
        this.save();
        return item;
    },

    update(type, id, updates) {
        this._ensureCache();
        const data = this._cache[type] || [];
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this._cache[type] = data;
            this.save();
            return data[index];
        }
        return null;
    },

    delete(type, id) {
        this._ensureCache();
        this._cache[type] = (this._cache[type] || []).filter(item => item.id !== id);
        this.save();
        return this._cache[type];
    },

    // Statistics
    getStats() {
        const schools = this.getAll('schools');
        const kindergartens = this.getAll('kindergartens');
        const staff = this.getAll('staff');
        const news = this.getAll('news');
        const totalStudents = schools.reduce((sum, s) => sum + (s.students || 0), 0);
        const totalTeachers = staff.filter(s => s.position && s.position.toLowerCase().includes('o\'qituvchi')).length || Math.floor(staff.length * 25);
        return {
            schools: schools.length,
            kindergartens: kindergartens.length,
            staff: staff.length,
            news: news.length,
            students: totalStudents,
            teachers: totalTeachers
        };
    },

    getOrgInfo() {
        this._ensureCache();
        return this._cache.orgInfo || {};
    },

    updateOrgInfo(data) {
        this._ensureCache();
        this._cache.orgInfo = data;
        this.save();
    },

    getSocialLinks() {
        this._ensureCache();
        return this._cache.socialLinks || { telegram: '', facebook: '', instagram: '', youtube: '' };
    },

    updateSocialLinks(data) {
        this._ensureCache();
        this._cache.socialLinks = data;
        this.save();
    },

    getAdmins() {
        this._ensureCache();
        return this._cache.admins || [];
    },

    addAdmin(login, password) {
        this._ensureCache();
        const admins = this._cache.admins || [];
        const id = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
        admins.push({ id, login, password, created: new Date().toISOString().split('T')[0] });
        this._cache.admins = admins;
        this.save();
    },

    deleteAdmin(id) {
        this._ensureCache();
        this._cache.admins = (this._cache.admins || []).filter(a => a.id !== id);
        this.save();
    },

    checkAdmin(login, password) {
        return this.getAdmins().find(a => a.login === login && a.password === password);
    },

    updateAdminPassword(id, newPassword) {
        this._ensureCache();
        const admin = (this._cache.admins || []).find(a => a.id === id);
        if (admin) {
            admin.password = newPassword;
            this.save();
        }
    }
};
