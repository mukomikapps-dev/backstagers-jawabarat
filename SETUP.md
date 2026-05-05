# 📖 Panduan Setup Backstagers Website

## 🎯 Apa itu?

Website dinamis untuk organisasi Backstagers yang:
- ✅ Menggunakan Next.js + React
- ✅ Data disimpan dalam JSON files (tanpa database)
- ✅ Admin panel untuk update konten
- ✅ Siap deploy ke Vercel

## 📋 Prerequisites

- Node.js v18+ ([download](https://nodejs.org))
- GitHub account (untuk deploy ke Vercel)
- Vercel account (gratis di [vercel.com](https://vercel.com))

## 🚀 Local Development

### Step 1: Install Dependencies

```bash
cd /Users/sugenghariadi/backstagers/web
npm install
```

### Step 2: Buat .env.local

File sudah ada di: `.env.local` dengan content:

```
ADMIN_TOKEN=admin_secret_token_12345
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Step 3: Jalankan Server

```bash
npm run dev
```

Output:
```
▲ Next.js 16.2.4
  - Local:        http://localhost:3000
```

### Step 4: Buka Browser

- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Password**: `admin123`

## 🎨 Admin Panel Features

### Dashboard (`/admin`)
- View daftar anggota
- View daftar event
- Quick action buttons

### Manage Members (`/admin/members/[id]`)
- Tambah anggota baru: `/admin/members/new`
- Edit anggota: `/admin/members/1`
- Field: Nama, Posisi, Email, Telepon, Bio

### Manage Events (`/admin/events/[id]`)
- Tambah event baru: `/admin/events/new`
- Edit event: `/admin/events/1`
- Field: Judul, Deskripsi, Tanggal, Waktu, Lokasi, Kategori

### Organization Settings (`/admin/organization`)
- Edit nama organisasi
- Edit deskripsi
- Edit info kontak
- Setup social media links

## 📁 File Structure

```
web/
├── app/
│   ├── page.tsx                    # 🏠 Homepage
│   ├── layout.tsx                  # Layout global
│   ├── api/                        # 🔌 API Routes
│   │   ├── members/route.ts
│   │   ├── events/route.ts
│   │   ├── organization/route.ts
│   │   └── auth/login/route.ts
│   └── admin/                      # 🔐 Admin Dashboard
│       ├── layout.tsx
│       ├── page.tsx
│       ├── login/page.tsx
│       ├── members/[id]/page.tsx
│       ├── events/[id]/page.tsx
│       └── organization/page.tsx
├── data/                           # 📄 JSON Data
│   ├── members.json
│   ├── events.json
│   └── organization.json
├── public/                         # 📸 Static files
│── .env.local                      # 🔑 Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── README.md
```

## 🗂️ Data Files

### members.json
Struktur anggota organisasi:

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "position": "Chairman",
    "email": "john@backstagers.org",
    "phone": "081234567890",
    "image": "/members/john.jpg",
    "bio": "Founder and leader"
  }
]
```

### events.json
Struktur event/aktivitas:

```json
[
  {
    "id": 1,
    "title": "Workshop Teater",
    "description": "Pembelajaran akting dasar",
    "date": "2026-06-15",
    "time": "19:00",
    "location": "Studio A, Jakarta",
    "image": "/events/workshop.jpg",
    "category": "workshop"
  }
]
```

### organization.json
Informasi organisasi:

```json
{
  "name": "Backstagers DPD Jabar",
  "description": "Organisasi kreatif dan inovatif",
  "founded": 2020,
  "location": "Jawa Barat, Indonesia",
  "email": "info@backstagers.org",
  "phone": "+62 812-3456-7890",
  "website": "https://backstagers.org",
  "about": "Backstagers adalah organisasi seni pertunjukan...",
  "social": {
    "instagram": "https://instagram.com/backstagers.dpd.jabar",
    "facebook": "https://facebook.com/backstagers",
    "twitter": "https://twitter.com/backstagers"
  }
}
```

## 📤 Deploy ke Vercel

### Step 1: Siapkan Git Repository

```bash
cd /Users/sugenghariadi/backstagers/web

# Jika belum ada git
git init
git add .
git commit -m "Initial Backstagers website"
```

### Step 2: Push ke GitHub

1. Buat repository baru di GitHub: https://github.com/new
2. Nama repo: `backstagers-website`
3. Jangan pilih "Add .gitignore"
4. Klik "Create repository"

Kemudian jalankan:

```bash
git remote add origin https://github.com/YOUR_USERNAME/backstagers-website.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy ke Vercel

1. Buka https://vercel.com/dashboard
2. Klik "Add New Project"
3. Pilih "Import an existing project"
4. Pilih "Continue with GitHub"
5. Login dengan GitHub account
6. Pilih repository: `backstagers-website`
7. Klik "Import"

Di halaman Project Settings:

**Environment Variables:**

```
ADMIN_TOKEN = admin_secret_token_12345
ADMIN_PASSWORD = admin123
NEXT_PUBLIC_API_URL = https://your-project.vercel.app
```

8. Klik "Deploy"
9. Tunggu ~5 menit sampai selesai
10. Klik "Continue to Dashboard"
11. Copy URL di production domain

### Step 4: Setup Custom Domain (Opsional)

1. Di Vercel dashboard, pergi ke "Settings" → "Domains"
2. Masukkan domain (misal: `backstagers.com`)
3. Ikuti instruksi untuk setup DNS
4. Setelah DNS propagate (~24 jam), domain akan aktif

## 🔑 Security Tips

### Untuk Production (Vercel):

1. **Ganti Password:**
   - Ke Vercel dashboard
   - Settings → Environment Variables
   - Update `ADMIN_PASSWORD` dengan password yang kuat

2. **Ganti Token:**
   - Buat token baru (bisa random string panjang)
   - Update `ADMIN_TOKEN`

3. **Backup Data:**
   - Commit folder `data/` ke Git secara regular
   - Atau download JSON files secara berkala

4. **Monitor Logs:**
   - Di Vercel dashboard, lihat "Function Logs"
   - Check untuk suspicious activities

## 🐛 Troubleshooting

### Login tidak bisa

```bash
# Clear browser cache/localStorage
# Atau coba di incognito mode
# Pastikan password di .env.local benar
```

### Data tidak muncul di website

```bash
# Check browser console (F12)
# Check Vercel logs
# Pastikan JSON files valid
# Test API endpoint: /api/members
```

### Error saat upload/edit

- Vercel tidak support file write di production
- Alternatif: Gunakan database (Firebase, Supabase, dll)
- Atau: Commit changes langsung ke GitHub

### Build error

```bash
npm run build
# Check output untuk error detail
```

## 📞 Support & Help

### Docs
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Common Issues
1. **Port 3000 sudah terpakai**: `npm run dev -- -p 3001`
2. **Module not found**: `npm install` ulang
3. **Permission denied**: Check file permissions

## ✅ Checklist Pre-Deploy

- [ ] Test website di localhost
- [ ] Admin login bisa
- [ ] Bisa tambah/edit anggota
- [ ] Bisa tambah/edit event
- [ ] JSON files ada di `data/`
- [ ] `.env.local` dikonfigurasi
- [ ] `.gitignore` include `.env.local`
- [ ] GitHub repo siap
- [ ] Vercel account siap

## 🎉 Selesai!

Website sudah siap untuk:
- ✅ Development
- ✅ Admin management
- ✅ Production deployment
- ✅ Regular updates

Semua data tersimpan dalam JSON files yang mudah di-backup dan di-version control dengan Git.

---

**Need help?** Check file ini atau lihat README.md untuk info lengkap.
