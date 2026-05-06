# Setup Supabase

Panduan lengkap untuk migrasi dari JSON ke Supabase.

## 1. Buat Project Supabase

1. Buka https://supabase.com
2. Klik "Start Your Project"
3. Login dengan GitHub atau email
4. Klik "New Project"
5. Fill form:
   - **Project name**: `backstagers`
   - **Database password**: Buat password yang kuat
   - **Region**: Pilih region terdekat (contoh: Singapore)
6. Tunggu project selesai dibuat (~5 menit)

## 2. Copy Environment Variables

Setelah project terbuat:

1. Buka **Settings** → **API** di dashboard Supabase
2. Copy nilai berikut ke file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_TOKEN=admin_secret_token_12345
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 3. Create Database Tables

1. Di Supabase dashboard, buka **SQL Editor**
2. Klik **New Query**
3. Copy isi dari `lib/supabase.sql` ke SQL editor
4. Klik **Run**
5. Tunggu selesai (harusnya sukses tanpa error)

## 4. Migrate Data dari JSON

Option A: Menggunakan Supabase UI
1. Buka table `members` di **Table Editor**
2. Klik **Insert** → **Insert from CSV**
3. Buka `data/members.json`, copy isinya
4. Paste ke CSV upload
5. Ulangi untuk setiap table

Option B: Menggunakan Script (recommended)
```bash
npm run migrate:json-to-supabase
```

Script ini akan otomatis membaca semua JSON files dan insert ke Supabase.

## 5. Setup Vercel Environment Variables

1. Buka Vercel dashboard → Project Settings → Environment Variables
2. Tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_TOKEN=admin_secret_token_12345
   ADMIN_PASSWORD=admin123
   ```
3. Redeploy aplikasi

## 6. Test

Local:
```bash
npm install
npm run dev
# Buka http://localhost:3000
# Check browser console untuk errors
```

Production:
- Deploy ke Vercel
- Check Vercel Function Logs
- Verifikasi data muncul di website

## 7. Hapus GitHub API Usage

Kalau sudah sukses dengan Supabase:
1. Hapus file `lib/github-utils.ts` (tidak butuh lagi)
2. Update `.gitignore` jika perlu
3. Commit changes ke GitHub

## Notes

- Supabase gratis dengan batasan: 500 MB storage, unlimited API calls
- Untuk production, upgrade ke plan berbayar
- Backup data regularly dari Supabase dashboard

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan `.env.local` punya semua variable
- Restart `npm run dev`

### Error: "Failed to connect to database"
- Pastikan URL dan keys benar (copy dari Settings → API)
- Check Supabase status (https://status.supabase.com)

### Data tidak muncul
- Check SQL error di Supabase SQL Editor
- Verify data sudah di-insert ke tables
- Check RLS policies

### Authentication error pada API
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah di `.env.local`
- Cek authorization header di API requests
