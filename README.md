# 🎭 Backstagers Organization Website

**Website dinamis untuk organisasi Backstagers - siap untuk Vercel!**

## 📦 Apa Ada di Sini?

### `/web/` - Full Next.js Project
Website lengkap dengan:
- 🏠 **Homepage** - Tampilan publik organisasi
- 👥 **Members Page** - Daftar anggota dengan profil
- 📅 **Events Section** - Daftar event/aktivitas
- 🔐 **Admin Panel** - Password-protected management interface
- 📄 **JSON Storage** - Data disimpan dalam JSON files (tanpa database!)
- 🚀 **Vercel Ready** - Siap deploy ke Vercel dengan satu klik

### File Penting
- `SETUP.md` - Panduan lengkap setup dan deployment
- `web/README.md` - Quick start guide
- `web/.env.local` - Environment variables
- `web/data/` - JSON data files

## 🚀 Quick Start

```bash
# 1. Masuk ke folder project
cd /Users/sugenghariadi/backstagers/web

# 2. Install dependencies (sudah ada node_modules, tapi run jika perlu)
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka browser
# Website: http://localhost:3000
# Admin: http://localhost:3000/admin/login
# Password: admin123
```

## 🔑 Admin Features

Dari admin panel (`/admin/login`) Anda bisa:

✅ **Manage Anggota**
- Tambah/Edit/Hapus member
- Field: Nama, Posisi, Email, Telepon, Bio

✅ **Manage Event**
- Tambah/Edit/Hapus event
- Field: Judul, Deskripsi, Tanggal, Waktu, Lokasi, Kategori

✅ **Organization Settings**
- Edit nama & deskripsi organisasi
- Update contact info
- Manage social media links

## 📁 Project Structure

```
backstagers/
├── web/                           # ← Next.js Project
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── api/                  # API Routes
│   │   └── admin/                # Admin Dashboard
│   ├── data/
│   │   ├── members.json
│   │   ├── events.json
│   │   └── organization.json
│   ├── .env.local                # Environment variables
│   ├── package.json
│   ├── README.md
│   └── vercel.json               # Vercel config
├── SETUP.md                       # Panduan setup lengkap
├── LIST ANGGOTA BACKSTAGERS.xlsx  # Data anggota asli
└── LOGO PERUSAHAAN.zip            # Logo organisasi
```

## 🌐 Deploy ke Vercel

### Cara Cepat (5 menit):

1. **Push ke GitHub**
   ```bash
   cd web
   git init
   git add .
   git commit -m "Backstagers website"
   git remote add origin https://github.com/YOU/backstagers.git
   git push -u origin main
   ```

2. **Buka Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import dari GitHub repository
   - Set environment variables:
     ```
     ADMIN_TOKEN = admin_secret_token_12345
     ADMIN_PASSWORD = admin123
     NEXT_PUBLIC_API_URL = https://your-project.vercel.app
     ```
   - Click "Deploy"

3. **Done!** Website sudah live dalam 2-5 menit

Lihat `SETUP.md` untuk panduan detail.

## 💾 Data Management

Semua data tersimpan dalam **JSON files** di `web/data/`:

### members.json - Data Anggota
```json
[
  {
    "id": 1,
    "name": "Nama Anggota",
    "position": "Posisi",
    "email": "email@example.com",
    "phone": "081234567890",
    "bio": "Bio singkat"
  }
]
```

### events.json - Data Event
```json
[
  {
    "id": 1,
    "title": "Workshop Teater",
    "description": "Deskripsi event",
    "date": "2026-06-15",
    "time": "19:00",
    "location": "Lokasi",
    "category": "workshop"
  }
]
```

### organization.json - Info Organisasi
```json
{
  "name": "Backstagers DPD Jabar",
  "description": "Deskripsi organisasi",
  "email": "info@backstagers.org",
  "phone": "+62 812-3456-7890",
  "social": {
    "instagram": "https://instagram.com/...",
    "facebook": "https://facebook.com/...",
    "twitter": "https://twitter.com/..."
  }
}
```

## 🔐 Security

**Password admin:** `admin123` (ganti saat production!)

Untuk production:
1. Pergi ke Vercel dashboard
2. Settings → Environment Variables
3. Update `ADMIN_PASSWORD` dengan password kuat
4. Commit perubahan (jangan commit `.env.local` dengan password asli)

## 🛠 Tech Stack

- **Framework**: Next.js 16.2.4
- **UI**: React + TypeScript
- **Styling**: Tailwind CSS
- **Storage**: JSON Files
- **Authentication**: Simple password auth
- **Deployment**: Vercel

## 📞 API Endpoints

### Public (Tidak perlu login)
- `GET /api/members` - Ambil semua anggota
- `GET /api/events` - Ambil semua event
- `GET /api/organization` - Ambil info organisasi

### Protected (Perlu admin token)
- `POST /api/members` - Tambah anggota
- `PUT /api/members` - Edit anggota
- `DELETE /api/members` - Hapus anggota
- (Sama untuk events dan organization)

## ⚙️ Customization

### Ganti warna/tema:
Edit `web/app/page.tsx` - ubah class Tailwind:
- `from-purple-50` → warna background
- `text-purple-600` → warna primary
- `bg-purple-600` → warna buttons

### Tambah page baru:
1. Buat file di `web/app/nama-page/page.tsx`
2. Write React component
3. Automatic routing!

### Tambah API baru:
1. Buat file di `web/app/api/endpoint/route.ts`
2. Export `GET`, `POST`, `PUT`, `DELETE` functions
3. Done!

## 🐛 Troubleshooting

**Port 3000 sudah terpakai?**
```bash
npm run dev -- -p 3001
```

**Data tidak muncul?**
- Check browser console (F12)
- Pastikan JSON files valid
- Restart dev server

**Build error?**
```bash
npm run build
# atau
npm cache clean --force
npm install
```

**Vercel deployment failed?**
- Check Vercel logs di dashboard
- Pastikan `.env` variables sudah diset
- Pastikan build berhasil di local

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hooks](https://react.dev)

## ✅ Checklist

Setup:
- [x] Next.js project created
- [x] API routes implemented
- [x] Admin panel built
- [x] JSON data files ready
- [x] Environment variables configured
- [x] Build tested
- [x] Documentation written

Ready for:
- [x] Local development
- [x] Admin testing
- [x] Vercel deployment
- [x] Custom domain setup
- [x] Production use

## 🎉 Ready to Go!

Website Backstagers sudah 100% ready untuk:
1. ✅ Development di local machine
2. ✅ Admin management melalui panel
3. ✅ Deployment ke Vercel
4. ✅ Regular content updates

Semua data dalam JSON files, mudah di-backup dan di-version control dengan Git!

---

**Next Steps:**
1. Read `SETUP.md` for detailed instructions
2. Run `npm run dev` to test locally
3. Deploy to Vercel when ready
4. Update content via admin panel

**Happy coding! 🚀**
