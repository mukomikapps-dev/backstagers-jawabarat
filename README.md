# Backstagers Organization Website

Website organisasi Backstagers dengan Next.js, menggunakan JSON files untuk data management tanpa database.

## Fitur

- ✨ **Website Dinamis** - Konten yang dapat diupdate melalui admin panel
- 📝 **Admin Panel** - Interface untuk mengelola anggota, event, dan informasi organisasi
- 🔐 **Authentication** - Password protection untuk admin access
- 📄 **JSON File Storage** - Data disimpan dalam JSON files, mudah di-backup
- 📱 **Responsive Design** - Bekerja baik di desktop, tablet, dan mobile
- 🚀 **Vercel Ready** - Siap deploy ke Vercel

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local`:

```env
ADMIN_TOKEN=admin_secret_token_12345
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### 4. Login ke Admin Panel

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Password: `admin123`

## Struktur Project

```
├── app/
│   ├── page.tsx                    # Homepage
│   ├── api/
│   │   ├── members/route.ts       # API anggota
│   │   ├── events/route.ts        # API event
│   │   ├── organization/route.ts  # API organisasi
│   │   └── auth/login/route.ts    # API login
│   └── admin/
│       ├── layout.tsx
│       ├── page.tsx               # Admin dashboard
│       ├── login/page.tsx
│       ├── members/[id]/page.tsx
│       ├── events/[id]/page.tsx
│       └── organization/page.tsx
├── data/
│   ├── members.json
│   ├── events.json
│   └── organization.json
└── .env.local
```

## Deploy ke Vercel

### 1. Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <YOUR_GITHUB_REPO>
git push -u origin main
```

### 2. Deploy

1. Buka [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Set Environment Variables:
   - `ADMIN_TOKEN=your_secret_token`
   - `ADMIN_PASSWORD=your_password`
   - `NEXT_PUBLIC_API_URL=https://your-domain.vercel.app`
4. Deploy!

## Admin Features

- ✅ Tambah/Edit/Hapus Anggota
- ✅ Tambah/Edit/Hapus Event
- ✅ Edit Informasi Organisasi
- ✅ Kelola Social Media Links

## Data Format

### Members (data/members.json)
```json
[
  {
    "id": 1,
    "name": "Nama",
    "position": "Posisi",
    "email": "email@example.com",
    "phone": "081234567890",
    "image": "/members/photo.jpg",
    "bio": "Bio singkat"
  }
]
```

### Events (data/events.json)
```json
[
  {
    "id": 1,
    "title": "Judul Event",
    "description": "Deskripsi",
    "date": "2026-06-15",
    "time": "19:00",
    "location": "Lokasi",
    "image": "/events/photo.jpg",
    "category": "workshop"
  }
]
```

## Tips

- 💾 Data tersimpan dalam JSON files - mudah di-backup
- 🔒 Admin access dilindungi password
- 📱 Fully responsive design
- 🚀 Deploy langsung ke Vercel
- 📝 Edit JSON files langsung untuk quick updates

---

Made for **Backstagers DPD Jawa Barat**
