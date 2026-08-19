// Data Management with localStorage
const DataStore = {
    init() {
        if (!localStorage.getItem('socialLinks')) {
            localStorage.setItem('socialLinks', JSON.stringify({
                telegram: '',
                facebook: '',
                instagram: '',
                youtube: ''
            }));
        }

        if (!localStorage.getItem('admins')) {
            localStorage.setItem('admins', JSON.stringify([
                { id: 1, login: 'admin', password: 'admin123', created: new Date().toISOString().split('T')[0] }
            ]));
        }

        if (!localStorage.getItem('orgInfo')) {
            localStorage.setItem('orgInfo', JSON.stringify({
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
            }));
        }

        if (!localStorage.getItem('departments')) {
            const defaultDepartments = [
                { id: 1, name: "Rahbariyat", icon: "fa-user-tie" },
                { id: 2, name: "Kadrlar bo'limi", icon: "fa-users" },
                { id: 3, name: "Buxgalteriya", icon: "fa-calculator" },
                { id: 4, name: "Axborot texnologiyalari", icon: "fa-laptop" },
                { id: 5, name: "Metodik xizmat", icon: "fa-book" },
                { id: 6, name: "Maktablar bo'limi", icon: "fa-school" },
                { id: 7, name: "Bog'chalar bo'limi", icon: "fa-child" },
                { id: 8, name: "Texnik xizmat", icon: "fa-wrench" },
                { id: 9, name: "Monitoring va tahlil", icon: "fa-chart-line" },
                { id: 10, name: "Ijro-intizom", icon: "fa-clipboard-check" },
                { id: 11, name: "Ma'naviyat", icon: "fa-mosque" }
            ];
            localStorage.setItem('departments', JSON.stringify(defaultDepartments));
        }
        if (!localStorage.getItem('schools')) {
            const defaultSchools = [
                {
                    id: 1,
                    name: "1-sonli umumta'lim maktabi",
                    address: "Asaka tumani, Markaz mahalla",
                    phone: "+998 74 123 45 67",
                    students: 850,
                    image: "",
                    location: ""
                },
                {
                    id: 2,
                    name: "2-sonli umumta'lim maktabi",
                    address: "Asaka tumani, Navoi mahalla",
                    phone: "+998 74 123 45 68",
                    students: 720,
                    image: "",
                    location: ""
                },
                {
                    id: 3,
                    name: "3-sonli umumta'lim maktabi",
                    address: "Asaka tumani, Bunyodkor mahalla",
                    phone: "+998 74 123 45 69",
                    students: 680,
                    image: "",
                    location: ""
                },
                {
                    id: 4,
                    name: "4-sonli umumta'lim maktabi",
                    address: "Asaka tumani, Sharq mahalla",
                    phone: "+998 74 123 45 70",
                    students: 590,
                    image: "",
                    location: ""
                },
                {
                    id: 5,
                    name: "5-sonli umumta'lim maktabi",
                    address: "Asaka tumani, Do'stlik mahalla",
                    phone: "+998 74 123 45 71",
                    students: 640,
                    image: "",
                    location: ""
                },
                {
                    id: 6,
                    name: "6-sonli umumta'lim maktabi",
                    address: "Asaka tumani, Yoshlik mahalla",
                    phone: "+998 74 123 45 72",
                    students: 520,
                    image: "",
                    location: ""
                }
            ];
            localStorage.setItem('schools', JSON.stringify(defaultSchools));
        }

        if (!localStorage.getItem('kindergartens')) {
            const defaultKindergartens = [
                {
                    id: 1,
                    name: "1-sonli bog'cha",
                    address: "Asaka tumani, Markaz mahalla",
                    phone: "+998 74 234 56 78",
                    children: 120,
                    image: "",
                    location: ""
                },
                {
                    id: 2,
                    name: "2-sonli bog'cha",
                    address: "Asaka tumani, Navoi mahalla",
                    phone: "+998 74 234 56 79",
                    children: 95,
                    image: "",
                    location: ""
                },
                {
                    id: 3,
                    name: "3-sonli bog'cha",
                    address: "Asaka tumani, Bunyodkor mahalla",
                    phone: "+998 74 234 56 80",
                    children: 85,
                    image: "",
                    location: ""
                },
                {
                    id: 4,
                    name: "4-sonli bog'cha",
                    address: "Asaka tumani, Sharq mahalla",
                    phone: "+998 74 234 56 81",
                    children: 110,
                    image: "",
                    location: ""
                }
            ];
            localStorage.setItem('kindergartens', JSON.stringify(defaultKindergartens));
        }

        if (!localStorage.getItem('staff')) {
            const defaultStaff = [
                {
                    id: 1,
                    name: "Karimov Alisher Karimovich",
                    position: "Bo'lim boshlig'i",
                    phone: "+998 74 111 22 33",
                    email: "karimov@asaka-edu.uz",
                    image: "",
                    departmentId: 1
                },
                {
                    id: 2,
                    name: "Rahimova Nilufar Rashidovna",
                    position: "O'rinbosar",
                    phone: "+998 74 111 22 34",
                    email: "rahimova@asaka-edu.uz",
                    image: "",
                    departmentId: 1
                },
                {
                    id: 3,
                    name: "Toshmatov Boburmirzo Rustamovich",
                    position: "Kadrlar bo'limi boshlig'i",
                    phone: "+998 74 111 22 35",
                    email: "toshmatov@asaka-edu.uz",
                    image: "",
                    departmentId: 2
                },
                {
                    id: 4,
                    name: "Mirzayeva Dilnoza Baxtiyorovna",
                    position: "Moliya bo'limi boshlig'i",
                    phone: "+998 74 111 22 36",
                    email: "mirzayeva@asaka-edu.uz",
                    image: "",
                    departmentId: 3
                },
                {
                    id: 5,
                    name: "Abdullayev Jasurbek Mirodilovich",
                    position: "Axborot texnologiyalari mutaxassisi",
                    phone: "+998 74 111 22 37",
                    email: "abdullayev@asaka-edu.uz",
                    image: "",
                    departmentId: 4
                },
                {
                    id: 6,
                    name: "Nazarova Gulnora Karimovna",
                    position: "Metodist",
                    phone: "+998 74 111 22 38",
                    email: "nazarova@asaka-edu.uz",
                    image: "",
                    departmentId: 5
                }
            ];
            localStorage.setItem('staff', JSON.stringify(defaultStaff));
        }

        if (!localStorage.getItem('news')) {
            const today = new Date();
            const defaultNews = [
                {
                    id: 1,
                    title: "Yangi o'quv yili boshlandi",
                    content: "2025-2026 o'quv yili Asaka tumanidagi barcha maktablarda muvaffaqiyatli boshlandi. 6 ta maktabda jami 4000 dan ortiq o'quvchi ta'lim olmoqda.",
                    date: today.toISOString().split('T')[0],
                    image: ""
                },
                {
                    id: 2,
                    title: "Xodimlar uchun malaka oshirish kursi",
                    content: "Bo'lim xodimlari uchun zamonaviy ta'lim texnologiyalari bo'yicha malaka oshirish kursi tashkil etildi.",
                    date: new Date(today - 86400000).toISOString().split('T')[0],
                    image: ""
                },
                {
                    id: 3,
                    title: "Bog'chalar faoliyati yaxshilandi",
                    content: "Tuman markazidagi 4 ta bog'chada ta'lim jarayoni yangi standartlar asosida olib borilmoqda.",
                    date: new Date(today - 172800000).toISOString().split('T')[0],
                    image: ""
                },
                {
                    id: 4,
                    title: "Sport musobaqasi bo'lib o'tdi",
                    content: "Tuman maktablari o'rtasida an'anaviy sport musobaqasi bo'lib o'tdi. 6 ta maktab jamoasi ishtirok etdi.",
                    date: new Date(today - 259200000).toISOString().split('T')[0],
                    image: ""
                },
                {
                    id: 5,
                    title: "Sifat nazorati o'tkazildi",
                    content: "Barcha maktablarda sifat nazorati o'tkazildi va natijalar ijobiy baholandi.",
                    date: new Date(today - 345600000).toISOString().split('T')[0],
                    image: ""
                },
                {
                    id: 6,
                    title: "Fan festivali tashkil etildi",
                    content: "O'quvchilar o'rtasida ilmiy fan festivali tashkil etildi. 100 dan ortiq loyiha taqdim etildi.",
                    date: new Date(today - 432000000).toISOString().split('T')[0],
                    image: ""
                }
            ];
            localStorage.setItem('news', JSON.stringify(defaultNews));
        }
    },

    // CRUD Operations
    getAll(type) {
        return JSON.parse(localStorage.getItem(type)) || [];
    },

    getById(type, id) {
        const data = this.getAll(type);
        return data.find(item => item.id === id);
    },

    add(type, item) {
        const data = this.getAll(type);
        item.id = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
        data.push(item);
        localStorage.setItem(type, JSON.stringify(data));
        return item;
    },

    update(type, id, updates) {
        const data = this.getAll(type);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates };
            localStorage.setItem(type, JSON.stringify(data));
            return data[index];
        }
        return null;
    },

    delete(type, id) {
        const data = this.getAll(type);
        const filtered = data.filter(item => item.id !== id);
        localStorage.setItem(type, JSON.stringify(filtered));
        return filtered;
    },

    // Get statistics
    getStats() {
        const schools = this.getAll('schools');
        const kindergartens = this.getAll('kindergartens');
        const staff = this.getAll('staff');
        const news = this.getAll('news');
        const totalStudents = schools.reduce((sum, s) => sum + (s.students || 0), 0);
        const totalTeachers = staff.filter(s => s.position.toLowerCase().includes('o\'qituvchi')).length || Math.floor(staff.length * 25);
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
        return JSON.parse(localStorage.getItem('orgInfo')) || {};
    },

    updateOrgInfo(data) {
        localStorage.setItem('orgInfo', JSON.stringify(data));
    },

    getSocialLinks() {
        return JSON.parse(localStorage.getItem('socialLinks')) || { telegram: '', facebook: '', instagram: '', youtube: '' };
    },

    updateSocialLinks(data) {
        localStorage.setItem('socialLinks', JSON.stringify(data));
    },

    getAdmins() {
        return JSON.parse(localStorage.getItem('admins')) || [];
    },

    addAdmin(login, password) {
        const admins = this.getAdmins();
        const id = admins.length > 0 ? Math.max(...admins.map(a => a.id)) + 1 : 1;
        admins.push({ id, login, password, created: new Date().toISOString().split('T')[0] });
        localStorage.setItem('admins', JSON.stringify(admins));
    },

    deleteAdmin(id) {
        const admins = this.getAdmins().filter(a => a.id !== id);
        localStorage.setItem('admins', JSON.stringify(admins));
    },

    checkAdmin(login, password) {
        return this.getAdmins().find(a => a.login === login && a.password === password);
    },

    updateAdminPassword(id, newPassword) {
        const admins = this.getAdmins();
        const admin = admins.find(a => a.id === id);
        if (admin) {
            admin.password = newPassword;
            localStorage.setItem('admins', JSON.stringify(admins));
        }
    }
};

// Initialize data on load
DataStore.init();
