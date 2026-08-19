# Asaka tumani MTB - Web Sayt

Maktabgacha va maktab ta'limi bo'limi uchun web sayt

## Xususiyatlari

### Bosh sahifa
- Tashkilot haqida ma'lumot
- Statistika (maktablar, bog'chalar, o'qituvchilar, o'quvchilar)
- Yangiliklar paneli
- Kontaktlar

### Admin Panel
- Login tizimi (admin/admin123)
- Maktablarni boshqarish (CRUD)
- Bog'chalarni boshqarish (CRUD)
- Xodimlarni boshqarish (CRUD)
- Yangiliklarni boshqarish (CRUD)

## O'rnatish

1. Repozitoriyani clone qiling:
```bash
git clone https://github.com/username/asaka-edu-uz.git
```

2. Papkani oching:
```bash
cd asaka-edu-uz
```

3. Brauzerda `index.html` faylini oching

## Deploy qilish

### GitHub Pages (bepul)

1. GitHub'da yangi repository yarating
2. Kodni push qiling:
```bash
git remote add origin https://github.com/username/asaka-edu-uz.git
git push -u origin main
```

3. Settings > Pages bo'limiga boring
4. Source: Deploy from a branch
5. Branch: main / root
6. Save tugmasini bosing

Sayt: `https://username.github.io/asaka-edu-uz/`

### Netlify (bepul)

1. https://app.netlify.com/ saytiga boring
2. Drag and drop orqali papkani yuklang
3. Deploy tugmasini bosing

### Vercel (bepul)

1. https://vercel.com/ saytiga boring
2. GitHub'dan import qiling
3. Deploy tugmasini bosing

## Foydalanish

### Admin panelga kirish
1. Saytni oching
2. Pastdagi sozlamalar tugmasini bosing
3. Login: admin
4. Parol: admin123

### Ma'lumotlar
- Barcha ma'lumotlar brauzer localStorage'da saqlanadi
- Yangi ma'lumot qo'shish uchun admin panelni ishlating

## Struktura

```
asaka-edu-uz/
├── index.html          # Bosh sahifa
├── admin.html          # Admin panel
├── css/
│   ├── style.css       # Bosh sahifa uslublari
│   └── admin.css       # Admin panel uslublari
├── js/
│   ├── data.js         # Ma'lumotlar boshqaruvi
│   ├── main.js         # Bosh sahifa skriptlari
│   └── admin.js        # Admin panel skriptlari
├── images/             # Rasmlar papkasi
└── README.md           # Dokumentatsiya
```

## Texnologiyalar

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- Font Awesome 6 (Ikonkalar)
- localStorage (Ma'lumotlar saqlash)

## Brauzerlar

- Google Chrome (eng yaxshi)
- Mozilla Firefox
- Microsoft Edge
- Safari

## Qo'shimcha

- Responsive dizain (mobil qurilmalarga mos)
- Tez yuklanish
- Oson boshqarish
- Bepul hosting imkoniyatlari
