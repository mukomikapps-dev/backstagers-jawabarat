# Supabase Migration Checklist

Panduan step-by-step untuk setup Supabase dan migrate database.

## ✅ Pre-Migration

- [ ] Code sudah di-update ke Supabase (done)
- [ ] Environment variables template sudah ready (`.env.local.example`)
- [ ] Migration script siap (`npm run migrate:json-to-supabase`)
- [ ] Dokumentasi lengkap tersedia

## 🔧 Setup Supabase Project

### Step 1: Create Supabase Account & Project (5 minutes)

- [ ] Buka https://supabase.com
- [ ] Sign up / Login
- [ ] Klik "Create new project" atau "New project"
- [ ] **Project name**: `backstagers`
- [ ] **Database password**: Buat yang kuat (simpan di temp note)
- [ ] **Region**: Pilih `Singapore` atau terdekat
- [ ] Klik "Create new project"
- [ ] Tunggu ~5 menit hingga selesai

### Step 2: Copy API Keys (2 minutes)

Di Supabase dashboard:

- [ ] Buka menu **Settings** → **API** (sidebar kiri)
- [ ] Cari section **"Project API keys"**
- [ ] Copy **Project URL** (format: `https://xxxxx.supabase.co`)
- [ ] Copy **anon public key** 
- [ ] Copy **service_role key** 
- [ ] Simpan ketiga nilai di temp file

## 🔐 Setup Environment Variables

### Step 3: Create .env.local (2 minutes)

```bash
cd /Users/sugenghariadi/backstagers
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Paste nilai dari Step 2
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Keep existing values
ADMIN_TOKEN=admin_secret_token_12345
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

- [ ] Edit dan paste nilai Supabase
- [ ] Save file

## 🗄️ Setup Database Schema

### Step 4: Create Tables di Supabase (1 minute)

Di Supabase dashboard:

- [ ] Buka **SQL Editor** (sidebar)
- [ ] Klik **"New Query"**
- [ ] Buka file `lib/supabase.sql` di editor lokal
- [ ] Copy **seluruh isi** file
- [ ] Paste ke Supabase SQL Editor
- [ ] Klik **"Run"** atau `Ctrl+Enter`
- [ ] Tunggu sampai sukses (no error messages)

### Step 5: Verify Tables Created (1 minute)

Di Supabase dashboard:

- [ ] Buka **Table Editor** (sidebar)
- [ ] Verify ada tabel:
  - [ ] `members`
  - [ ] `events`
  - [ ] `news`
  - [ ] `organization`
  - [ ] `structure`

## 📥 Migrate Data dari JSON

### Step 6: Run Migration Script (1 minute)

```bash
cd /Users/sugenghariadi/backstagers
npm install  # jika belum, untuk install @supabase/supabase-js
npm run migrate:json-to-supabase
```

Expected output:
```
🚀 Starting migration from JSON to Supabase...

📝 Migrating members...
✅ Migrated 50 members

📝 Migrating events...
✅ Migrated 2 events

... (similar untuk news, organization, structure)

✅ All data migrated successfully!
```

- [ ] Script berhasil dijalankan
- [ ] Semua data ter-migrate tanpa error

## 🧪 Test Local Development

### Step 7: Start Development Server (2 minutes)

```bash
npm run dev
```

Harusnya output:
```
▲ Next.js 16.2.4
  - Local:        http://localhost:3000
```

- [ ] Server berjalan tanpa error
- [ ] Console tidak ada warning tentang Supabase

### Step 8: Test Website (2 minutes)

Buka http://localhost:3000

- [ ] Homepage loading
- [ ] Data members muncul
- [ ] Data events muncul
- [ ] Data news muncul
- [ ] Data organization muncul

### Step 9: Test API Endpoints (1 minute)

Terminal baru:

```bash
# Test each endpoint
curl http://localhost:3000/api/members
curl http://localhost:3000/api/events
curl http://localhost:3000/api/organization
curl http://localhost:3000/api/news
curl http://localhost:3000/api/structure
```

- [ ] Semua endpoint return data (bukan error)
- [ ] Data sesuai dengan di website

### Step 10: Test Admin Panel (2 minutes)

- [ ] Buka http://localhost:3000/admin/login
- [ ] Login dengan password: `admin123`
- [ ] Access admin dashboard
- [ ] Try view/edit member
- [ ] Try view organization settings
- [ ] (Jangan delete data untuk sekarang 😄)

## 🚀 Deploy ke Vercel

### Step 11: Add Environment Variables di Vercel (3 minutes)

1. Buka https://vercel.com
2. Pilih project **backstagers**
3. Settings → **Environment Variables**
4. Tambahkan variable baru:

**Variable 1:**
- [ ] Name: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Value: `https://xxxxx.supabase.co`

**Variable 2:**
- [ ] Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Value: `eyJhbGc...`

**Variable 3:**
- [ ] Name: `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Value: `eyJhbGc...`

**Variable 4:**
- [ ] Name: `ADMIN_TOKEN`
- [ ] Value: `admin_secret_token_12345`

**Variable 5:**
- [ ] Name: `ADMIN_PASSWORD`
- [ ] Value: `admin123`

- [ ] Semua variable sudah di-add
- [ ] Klik Save

### Step 12: Deploy (Automatic) (5 minutes)

```bash
# Terminal di folder project
git add .
git commit -m "migrate: switch database to Supabase"
git push origin main
```

- [ ] Push ke GitHub
- [ ] Vercel otomatis trigger deployment
- [ ] Tunggu ~3-5 menit sampai selesai
- [ ] Check Vercel dashboard status "Ready"

### Step 13: Verify Production (2 minutes)

1. Buka production URL (dari Vercel dashboard)
2. Check website berjalan
   - [ ] Data loading correctly
   - [ ] No errors di console
3. Check admin panel
   - [ ] Login works
   - [ ] Dashboard accessible

## ✅ Post-Migration

- [ ] Local development working
- [ ] Production deployed successfully
- [ ] All data accessible
- [ ] Admin panel functional

## 🧹 Optional: Cleanup (tidak wajib sekarang)

Setelah semua konfirmasi working:

```bash
# Hapus library GitHub yang sudah tidak diperlukan
rm lib/github-utils.ts

# Commit
git add .
git commit -m "cleanup: remove deprecated github-utils"
git push origin main
```

- [ ] GitHub utils dihapus (opsional)
- [ ] Final commit done

## 🎉 Done!

Congratulations! Database sudah berhasil di-migrate ke Supabase!

### Dokumentasi Penting

- **Quick Setup**: Baca `SUPABASE_SETUP.md`
- **Detailed Guide**: Baca `MIGRATE_TO_SUPABASE.md`
- **What Changed**: Baca `MIGRATION_COMPLETE.md`
- **API Docs**: https://supabase.com/docs/reference/javascript/start

### Next Steps

1. Monitor production untuk beberapa hari
2. Backup data regularly (automatic via Supabase)
3. Setup SSL certificate (jika custom domain)
4. Monitor performance di Supabase dashboard

### Support

Jika ada error:
1. Check browser console (F12)
2. Check Vercel logs (Function Logs)
3. Check Supabase dashboard (Logs)
4. Refer ke documentation files

---

**Total time needed: ~30 minutes**

Happy coding! 🚀
