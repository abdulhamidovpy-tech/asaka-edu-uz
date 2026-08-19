// Data Management — localStorage asosiy + JSONBin online sync
const DataStore = {
    _cache: null,
    _syncing: false,

    async load() {
        // 1. LocalStorage dan o'qi (doimo ishonchli)
        const local = localStorage.getItem('siteData');
        if (local) {
            try { this._cache = JSON.parse(local); } catch(e) { this._cache = this._getDefaults(); }
        } else {
            this._cache = this._getDefaults();
        }
        this._ensureCache();
        this._saveLocal();

        // 2. JSONBin dan yangilash — FAQAT local bo'sh bo'lsa yoki yangi qurilma bo'lsa
        try {
            const response = await fetch(JSONBIN_CONFIG.BASE_URL + '/' + JSONBIN_CONFIG.BIN_ID, {
                headers: { 'X-Master-Key': JSONBIN_CONFIG.API_KEY }
            });
            if (response.ok) {
                const result = await response.json();
                const remote = result.record;
                if (remote && remote.schools) {
                    // Faqat local bo'sh bo'lsa, remote ni qo'lla
                    // Aks holda local ustunlik qiladi
                    const localIsEmpty = (this._cache.schools.length === 0 && this._cache.kindergartens.length === 0 && this._cache.staff.length === 0 && this._cache.news.length === 0);
                    if (localIsEmpty) {
                        this._cache = remote;
                        this._ensureCache();
                        this._saveLocal();
                    }
                    // Har doim remote dan faqat yangi bo'limlarni qo'shish (merge)
                    this._mergeRemote(remote);
                }
            }
        } catch (e) {
            // Offline — local ma'lumot ishlatiladi
        }
    },

    // Remote dan faqat localda yo'q elementlarni qo'shish
    _mergeRemote(remote) {
        if (!remote) return;
        const mergeTypes = ['schools', 'kindergartens', 'departments', 'staff', 'news'];
        let changed = false;
        for (const type of mergeTypes) {
            if (!remote[type] || !Array.isArray(remote[type])) continue;
            const localItems = this._cache[type] || [];
            for (const rItem of remote[type]) {
                if (!rItem.id) continue;
                if (!localItems.find(l => l.id === rItem.id)) {
                    localItems.push(rItem);
                    changed = true;
                }
            }
            this._cache[type] = localItems;
        }
        // Social links — remote dan olish agar local bo'sh bo'lsa
        if (remote.socialLinks) {
            const ls = this._cache.socialLinks;
            const rs = remote.socialLinks;
            if ((!ls.telegram && !ls.facebook && !ls.instagram) && (rs.telegram || rs.facebook || rs.instagram)) {
                this._cache.socialLinks = { ...rs };
                changed = true;
            }
        }
        // Org info — remote dan olish agar local default bo'lsa
        if (remote.orgInfo) {
            const localOrg = this._cache.orgInfo;
            if (localOrg.name === 'Asaka tumani MMTB' && localOrg.phone === '+998 74 123 45 67') {
                this._cache.orgInfo = { ...remote.orgInfo };
                changed = true;
            }
        }
        if (changed) this._saveLocal();
    },

    _saveLocal() {
        localStorage.setItem('siteData', JSON.stringify(this._cache));
    },

    async _saveBoth() {
        this._saveLocal();
        if (this._syncing) return;
        this._syncing = true;
        try {
            await fetch(JSONBIN_CONFIG.BASE_URL + '/' + JSONBIN_CONFIG.BIN_ID, {
                method: 'PUT',
                headers: {
                    'X-Master-Key': JSONBIN_CONFIG.API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this._cache)
            });
        } catch (e) { /* local saqlandi */ }
        this._syncing = false;
    },

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

    _ensureCache() {
        if (!this._cache) this._cache = this._getDefaults();
        if (!Array.isArray(this._cache.schools)) this._cache.schools = [];
        if (!Array.isArray(this._cache.kindergartens)) this._cache.kindergartens = [];
        if (!Array.isArray(this._cache.departments)) this._cache.departments = [];
        if (!Array.isArray(this._cache.staff)) this._cache.staff = [];
        if (!Array.isArray(this._cache.news)) this._cache.news = [];
        if (!this._cache.socialLinks) this._cache.socialLinks = { telegram: '', facebook: '', instagram: '', youtube: '' };
        if (!Array.isArray(this._cache.admins)) this._cache.admins = [{ id: 1, login: 'admin', password: 'admin123', created: new Date().toISOString().split('T')[0] }];
        if (!this._cache.orgInfo) this._cache.orgInfo = this._getDefaults().orgInfo;
    },

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
        this._saveBoth();
        return item;
    },

    update(type, id, updates) {
        this._ensureCache();
        const data = this._cache[type] || [];
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            this._cache[type] = data;
            this._saveBoth();
            return data[index];
        }
        return null;
    },

    delete(type, id) {
        this._ensureCache();
        this._cache[type] = (this._cache[type] || []).filter(item => item.id !== id);
        this._saveBoth();
        return this._cache[type];
    },

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

    getOrgInfo() { this._ensureCache(); return this._cache.orgInfo || {}; },
    updateOrgInfo(data) { this._ensureCache(); this._cache.orgInfo = data; this._saveBoth(); },
    getSocialLinks() { this._ensureCache(); return this._cache.socialLinks || { telegram: '', facebook: '', instagram: '', youtube: '' }; },
    updateSocialLinks(data) { this._ensureCache(); this._cache.socialLinks = data; this._saveBoth(); },
    getAdmins() { this._ensureCache(); return this._cache.admins || []; },
    addAdmin(login, password) {
        this._ensureCache();
        const admins = this._cache.admins || [];
        const id = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
        admins.push({ id, login, password, created: new Date().toISOString().split('T')[0] });
        this._cache.admins = admins;
        this._saveBoth();
    },
    deleteAdmin(id) { this._ensureCache(); this._cache.admins = (this._cache.admins || []).filter(a => a.id !== id); this._saveBoth(); },
    checkAdmin(login, password) { return this.getAdmins().find(a => a.login === login && a.password === password); },
    updateAdminPassword(id, newPassword) {
        this._ensureCache();
        const admin = (this._cache.admins || []).find(a => a.id === id);
        if (admin) { admin.password = newPassword; this._saveBoth(); }
    }
};
