# Panduan Migrasi ke Supabase

Dokumentasi lengkap untuk migrasi database dari JSON ke Supabase.

## Keuntungan Supabase vs JSON

| Aspek | JSON | Supabase |
|-------|------|----------|
| **Scalability** | Terbatas | Unlimited |
| **Concurrent Users** | Rendah | Tinggi |
| **Real-time Updates** | Tidak | Ya |
| **Backup Otomatis** | Manual | Otomatis |
| **Authentication** | Manual | Built-in |
| **Query Performance** | Lambat | Cepat |
| **Cost** | Gratis (storage terbatas) | Gratis dengan tier berbayar |

## Step 1: Setup Supabase Project

### 1.1 Buat Project Baru

```bash
# Buka https://supabase.com
# Klik "Start Your Project"
# Login dengan GitHub atau email
```

### 1.2 Create New Project

1. Klik **"New Project"** atau **"Create a new project"**
2. **Project name**: `backstagers`
3. **Database password**: Buat password kuat (catat untuk nanti)
4. **Region**: Pilih `Singapore` atau region terdekat
5. Klik **"Create new project"**
6. Tunggu ~5 menit sampai selesai

### 1.3 Copy API Keys

Setelah project selesai:

1. Buka menu **Settings** → **API** (di sidebar kiri)
2. Cari bagian **"Project API keys"**
3. Copy nilai berikut:
   - **Project URL** (dengan format `https://xxxxx.supabase.co`)
   - **Anon public key** (label: anon public)
   - **Service role key** (label: service_role secret)

Simpan ketiga nilai ini di tempat aman.

## Step 2: Setup Environment Variables

### 2.1 Buat .env.local

```bash
cd /Users/sugenghariadi/backstagers
cp .env.local.example .env.local
```

Edit `.env.local` dan isi dengan nilai dari Step 1.3:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ADMIN_TOKEN=admin_secret_token_12345
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2.2 Verifikasi Environment Variables

```bash
# Pastikan file .env.local dibaca
npm run dev

# Check di browser console, tidak ada error tentang Supabase
```

## Step 3: Setup Database Schema

### 3.1 Buka SQL Editor di Supabase

1. Dashboard Supabase → **SQL Editor** (di sidebar)
2. Klik **"New Query"**

### 3.2 Run Migration Script

1. Buka file `lib/supabase.sql`
2. Copy seluruh isi
3. Paste ke SQL Editor
4. Klik **"Run"** atau tekan `Ctrl+Enter`

Status berhasil: Tidak ada error message

### 3.3 Verifikasi Tables Terbuat

1. Buka **Table Editor** (di sidebar)
2. Verifikasi ada tabel:
   - `members`
   - `events`
   - `news`
   - `organization`
   - `structure`

## Step 4: Migrate Data dari JSON

### Option A: Menggunakan Script (Recommended)

```bash
# Pastikan sudah di folder project
cd /Users/sugenghariadi/backstagers

# Run migration script
npm run migrate:json-to-supabase
```

Output yang diharapkan:
```
🚀 Starting migration from JSON to Supabase...

📝 Migrating members...
✅ Migrated 50 members

📝 Migrating events...
✅ Migrated 2 events

📝 Migrating news...
✅ Migrated 3 news items

📝 Migrating organization...
✅ Migrated organization

📝 Migrating structure...
✅ Migrated 10 structure members

✅ All data migrated successfully!
```

### Option B: Manual Import via Supabase UI

**Untuk Members:**
1. Buka table `members`
2. Klik **"Insert"** → **"Insert from CSV"**
3. Buka `data/members.json` di editor
4. Copy isi dan paste ke CSV uploader
5. Click **"Import"**

(Ulangi untuk setiap table: events, news, organization, structure)

## Step 5: Test Local Development

```bash
# Pastikan .env.local sudah lengkap
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Test API endpoints
curl http://localhost:3000/api/members
curl http://localhost:3000/api/events
curl http://localhost:3000/api/organization
curl http://localhost:3000/api/news
curl http://localhost:3000/api/structure

# Buka http://localhost:3000 di browser
# Cek data muncul dengan benar
```

## Step 6: Deploy ke Vercel

### 6.1 Setup Environment Variables di Vercel

1. Buka Vercel Dashboard
2. Pilih project **backstagers**
3. Settings → **Environment Variables**
4. Tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ADMIN_TOKEN=admin_secret_token_12345
   ADMIN_PASSWORD=admin123
   ```
5. Klik **Save**

### 6.2 Deploy

```bash
# Pilih Option A atau B:

# Option A: Automatic (recommended)
# Cukup push ke GitHub
git add .
git commit -m "migrate: switch database to Supabase"
git push origin main
# Vercel akan otomatis deploy

# Option B: Manual
# Di Vercel Dashboard, klik "Redeploy"
```

### 6.3 Verify Production

1. Tunggu deploy selesai (~3 menit)
2. Buka production URL
3. Check data muncul dengan benar
4. Verifikasi API endpoints via Vercel Function Logs

## Step 7: Cleanup (Optional)

Setelah semua berjalan baik:

```bash
# Hapus github-utils.ts (tidak diperlukan lagi)
rm lib/github-utils.ts

# Update file yang reference github-utils (sudah dilakukan)

# Commit
git add .
git commit -m "cleanup: remove github-utils, now using Supabase"
git push origin main
```

## Troubleshooting

### Error: "Missing Supabase environment variables"

**Solusi:**
- Pastikan `.env.local` ada di folder root project
- Check spelling environment variable names
- Restart `npm run dev`

### Error: "connection refused" atau timeout

**Solusi:**
- Check internet connection
- Verify Supabase project status: https://status.supabase.com
- Check Supabase API keys valid (copy ulang dari dashboard)

### Data tidak muncul di website

**Debug steps:**
1. Check browser console (F12 → Console tab)
2. Check Vercel Function Logs (Production)
3. Check Supabase table data ada:
   - Dashboard → Table Editor
   - Select each table dan pastikan data ada
4. Check RLS policies di SQL Editor

### "Failed to fetch members" error

**Troubleshooting:**
1. Verify environment variables di Vercel
2. Check API route di `/api/members`
3. Run: `curl https://your-project.vercel.app/api/members`
4. Check response (harus array, bukan error object)

### Admin tidak bisa edit/hapus

**Check:**
1. Token di .env.local correct
2. Authorization header di API calls benar
3. Check Supabase Service Role Key ada di `.env.local`

## Monitoring & Maintenance

### Backup Data

Regular backup di Supabase:
1. Dashboard → Database → Backups
2. Supabase otomatis backup daily
3. Keep backup untuk peace of mind

### Monitor Performance

1. Dashboard → Database → Monitoring
2. Check query performance
3. Optimize queries jika needed

### Update Data

Semua update bisa dilakukan via:
- Admin panel web app
- Supabase Table Editor (untuk urgent changes)
- Custom script untuk bulk operations

## FAQ

**Q: Berapa cost untuk Supabase?**
A: Gratis untuk development (500MB storage, unlimited API). Upgrade untuk production.

**Q: Bagaimana dengan data yang sudah ada di JSON?**
A: Sudah teratasi dengan migration script - semua data ter-migrate otomatis.

**Q: Bisa rollback ke JSON?**
A: Bisa, tapi tidak recommended. JSON files masih tersimpan di Git history.

**Q: Bagaimana jika ada error saat migration?**
A: Script bersifat idempotent - bisa dijalankan ulang tanpa duplicate data.

## Next Steps

1. ✅ Setup Supabase project
2. ✅ Create database schema
3. ✅ Migrate data
4. ✅ Test locally
5. ✅ Deploy ke Vercel
6. ✅ Monitor production
7. (Optional) Setup CI/CD pipelines
8. (Optional) Setup real-time subscriptions
9. (Optional) Add authentication system

---

**Need help?** Check Supabase docs: https://supabase.com/docs
