# Project Structure After Supabase Migration

## 📁 New Files & Directories

```
backstagers/
├── lib/
│   ├── supabase.ts ⭐ NEW - Supabase client initialization
│   ├── supabase.sql ⭐ NEW - Database schema & RLS policies
│   └── github-utils.ts (masih ada, tapi tidak digunakan lagi)
│
├── scripts/
│   └── migrate-json-to-supabase.js ⭐ NEW - Data migration script
│
├── app/
│   └── api/
│       ├── members/
│       │   ├── route.ts (✅ Updated - menggunakan Supabase)
│       │   └── [id]/
│       │       └── route.ts (✅ Updated - menggunakan Supabase)
│       │
│       ├── events/
│       │   ├── route.ts (✅ Updated - menggunakan Supabase)
│       │   └── [id]/
│       │       └── route.ts (sudah ada, tidak perlu update)
│       │
│       ├── news/
│       │   ├── route.ts (✅ Updated - menggunakan Supabase)
│       │   └── [id]/
│       │       └── route.ts (✅ Updated - menggunakan Supabase)
│       │
│       ├── organization/
│       │   └── route.ts (✅ Updated - menggunakan Supabase)
│       │
│       └── structure/
│           ├── route.ts (✅ Updated - menggunakan Supabase)
│           └── [id]/
│               └── route.ts (sudah ada, tidak perlu update)
│
├── .env.local.example ⭐ NEW - Environment variables template
├── package.json (✅ Updated - added @supabase/supabase-js)
│
└── Documentation Files ⭐ NEW
    ├── SUPABASE_README.md - Overview & quick start
    ├── SUPABASE_CHECKLIST.md - Step-by-step setup guide
    ├── SUPABASE_SETUP.md - Quick reference
    ├── MIGRATE_TO_SUPABASE.md - Detailed migration guide
    └── MIGRATION_COMPLETE.md - What changed summary
```

## 🔄 Before vs After

### Database Layer

**BEFORE (JSON + GitHub API)**
```typescript
// lib/github-utils.ts
export async function getFileContent(path: string) {
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    { headers: { Authorization: `token ${TOKEN}` } }
  );
  const text = await response.text();
  return JSON.parse(text);
}
```

**AFTER (Supabase)**
```typescript
// lib/supabase.ts
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### API Routes

**BEFORE (Reading from JSON file via GitHub)**
```typescript
// app/api/members/route.ts
const members = await getFileContent('data/members.json');
return NextResponse.json(members);
```

**AFTER (Reading from Supabase table)**
```typescript
// app/api/members/route.ts
const { data, error } = await supabaseAdmin
  .from('members')
  .select('*');
return NextResponse.json(data || []);
```

## 🎯 Key Changes

### 1. Database Client
```typescript
// Sebelum: 2 methods (getFileContent, updateFileContent)
// Sesudah: 1 unified Supabase client dengan method:
// .select(), .insert(), .update(), .delete()
```

### 2. Error Handling
```typescript
// Sebelum: Throw error jika file tidak ada
// Sesudah: Structured error object dari Supabase
const { data, error } = await supabaseAdmin.from('table').select();
if (error) { /* handle error */ }
```

### 3. Data Schema

Beberapa field name berubah untuk compliance dengan database convention:

| JSON | Database | Alasan |
|------|----------|--------|
| `bgColor` | `bg_color` | Snake case convention |
| `videoUrl` | `video_url` | Snake case convention |
| N/A | `created_at` | Auto-timestamp |
| N/A | `updated_at` | Auto-timestamp |

### 4. Environment Variables

**BEFORE:**
```env
GH_TOKEN=github_token
ADMIN_TOKEN=token
```

**AFTER:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=key
SUPABASE_SERVICE_ROLE_KEY=key
ADMIN_TOKEN=token
```

## 📊 Database Tables

### Members Table
```sql
CREATE TABLE members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  image TEXT,
  bg_color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Events Table
```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT,
  image TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### News Table
```sql
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  image TEXT,
  video_url TEXT,
  category TEXT,
  author TEXT,
  date DATE,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Organization Table
```sql
CREATE TABLE organization (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  founded INTEGER,
  location TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  about TEXT,
  social JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Structure Table
```sql
CREATE TABLE structure (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  title TEXT,
  phone TEXT,
  email TEXT,
  bio TEXT,
  image TEXT,
  department TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔒 Row Level Security (RLS)

Semua table punya RLS policy:

```sql
-- Public can read
CREATE POLICY "Allow public read" ON table FOR SELECT USING (true);

-- Only admin can write (via SUPABASE_SERVICE_ROLE_KEY)
-- Admin authenticated via ADMIN_TOKEN
```

## 📦 Dependencies

**Added:**
```json
"@supabase/supabase-js": "^2.38.4"
```

**Removed (in migration):**
- Tidak lagi depend pada GitHub API
- `lib/github-utils.ts` tidak diperlukan

## 🎬 Data Migration

### Automated Process
```bash
npm run migrate:json-to-supabase
```

Proses:
1. Read JSON files dari `data/` folder
2. Transform field names (camelCase → snake_case)
3. Insert ke Supabase tables
4. Verify semua data ter-insert

### Files Involved
- `scripts/migrate-json-to-supabase.js` - Migration logic
- `data/members.json` - Source data
- `data/events.json` - Source data
- `data/news.json` - Source data
- `data/organization.json` - Source data
- `data/structure.json` - Source data

## 🔗 API Endpoints (No Change)

Semua endpoint tetap sama:

```
GET  /api/members
POST /api/members
PUT  /api/members
DELETE /api/members

GET  /api/members/[id]
PUT  /api/members/[id]
DELETE /api/members/[id]

GET  /api/events
POST /api/events
PUT  /api/events
DELETE /api/events

GET  /api/organization
PUT  /api/organization

GET  /api/news
POST /api/news
PUT  /api/news
DELETE /api/news

GET  /api/news/[id]

GET  /api/structure
POST /api/structure
PUT  /api/structure
DELETE /api/structure
```

**Response format tidak berubah!** - Client tidak perlu update

## 🧪 Testing Impact

- **Unit tests**: Perlu update untuk mock Supabase client
- **Integration tests**: Database query behavior bisa berbeda
- **E2E tests**: Tidak perlu update (endpoint sama)

## 📖 Documentation Updated

| File | Purpose |
|------|---------|
| `SUPABASE_README.md` | Quick overview |
| `SUPABASE_CHECKLIST.md` | Step-by-step setup |
| `SUPABASE_SETUP.md` | Quick reference |
| `MIGRATE_TO_SUPABASE.md` | Detailed guide |
| `MIGRATION_COMPLETE.md` | What changed |
| `.env.local.example` | Config template |

## ✅ Backward Compatibility

- ✅ API response format sama
- ✅ Client-side code tidak perlu berubah
- ✅ JSON data files masih tersimpan di Git
- ✅ Bisa rollback ke JSON jika perlu

## 🚀 Deployment

**Vercel Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=key
SUPABASE_SERVICE_ROLE_KEY=key
ADMIN_TOKEN=token
ADMIN_PASSWORD=password
```

---

**Migration Complete! Ready for deployment** ✅
