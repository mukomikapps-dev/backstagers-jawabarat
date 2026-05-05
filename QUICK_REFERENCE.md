# ⚡ Quick Reference - Backstagers Website

## 🏃 Run Commands

### Development
```bash
cd /Users/sugenghariadi/backstagers
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality
```

### URLs
- **Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API Members**: http://localhost:3000/api/members
- **API Events**: http://localhost:3000/api/events
- **API Organization**: http://localhost:3000/api/organization

## 🔑 Credentials

| Item | Value |
|------|-------|
| **Admin URL** | /admin/login |
| **Default Password** | `admin123` |
| **Admin Token** | `admin_secret_token_12345` |

> ⚠️ Ganti password & token untuk production!

## 📄 Environment Variables (.env.local)

```env
ADMIN_TOKEN=admin_secret_token_12345
ADMIN_PASSWORD=admin123
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📁 Important Files

```
├── .env.local                    # Environment variables (LOCAL ONLY)
├── data/
│   ├── members.json             # Member data
│   ├── events.json              # Events data
│   └── organization.json        # Organization info
├── app/
│   ├── page.tsx                 # Homepage
│   ├── admin/                   # Admin pages
│   └── api/                     # API routes
└── README.md                    # Project docs
```

## 🚀 Deployment

### Option 1: GitHub → Vercel (Recommended)

```bash
# 1. Initialize Git
cd web
git init

# 2. Commit everything
git add .
git commit -m "Initial Backstagers website"

# 3. Push to GitHub
git remote add origin https://github.com/USERNAME/backstagers.git
git branch -M main
git push -u origin main
```

Then:
1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Select GitHub repo
4. Set environment variables
5. Deploy!

### Option 2: Direct Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts to deploy
```

## 🎯 Admin Panel Features

### Dashboard (/admin)
- View all members
- View all events
- Quick edit buttons

### Add Member (/admin/members/new)
Fields: Name, Position, Email, Phone, Bio

### Edit Member (/admin/members/1)
Same fields + delete button

### Add Event (/admin/events/new)
Fields: Title, Description, Date, Time, Location, Category

### Organization (/admin/organization)
Fields: Name, Description, Founded Year, Location, Contact, Social Media

## 📝 Data Format

### Adding Member via Admin
```
Name:     John Doe
Position: Chairman
Email:    john@backstagers.org
Phone:    081234567890
Bio:      Founder and leader
```

### Adding Event via Admin
```
Title:       Workshop Teater
Description: Pembelajaran akting dasar
Date:        2026-06-15
Time:        19:00
Location:    Studio A, Jakarta
Category:    workshop
```

## 🔍 API Examples

### GET All Members
```bash
curl http://localhost:3000/api/members
```

### GET All Events
```bash
curl http://localhost:3000/api/events
```

### POST New Member (with token)
```bash
curl -X POST http://localhost:3000/api/members \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_secret_token_12345" \
  -d '{
    "name": "Jane Doe",
    "position": "Vice Chair",
    "email": "jane@backstagers.org",
    "phone": "081234567891",
    "bio": "Co-founder"
  }'
```

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `npm run dev -- -p 3001` |
| Can't login to admin | Check password in .env.local |
| Data not updating | Hard refresh browser (Ctrl+Shift+R) |
| Build error | `npm install` then `npm run build` |
| Vercel deploy fails | Check env variables in Vercel dashboard |

## 📚 File Locations

| What | Where |
|------|-------|
| Homepage | `web/app/page.tsx` |
| Admin Dashboard | `web/app/admin/page.tsx` |
| Login Page | `web/app/admin/login/page.tsx` |
| Members API | `web/app/api/members/route.ts` |
| Events API | `web/app/api/events/route.ts` |
| Members Data | `web/data/members.json` |
| Events Data | `web/data/events.json` |
| Org Data | `web/data/organization.json` |

## 🛠 Quick Edits

### Change Website Color
Edit `web/app/page.tsx`:
```tsx
// Change purple to blue
"from-purple-50"  → "from-blue-50"
"text-purple-600" → "text-blue-600"
```

### Add New Admin Function
1. Add API route in `web/app/api/`
2. Create UI in `web/app/admin/`
3. Call API from component

### Edit JSON Directly
```bash
# Edit members
nano web/data/members.json

# Or use any editor
code web/data/members.json
```

## 📞 Support Docs

- **Setup**: See `SETUP.md`
- **Project Info**: See `README.md` (in web folder)
- **Tech Docs**: 
  - [Next.js](https://nextjs.org/docs)
  - [Vercel](https://vercel.com/docs)
  - [Tailwind](https://tailwindcss.com/docs)

## ✨ Performance Tips

- Vercel auto-optimizes images
- JSON files cached by CDN
- Next.js minifies production builds
- Check Vercel Analytics for metrics

## 🔐 Security Reminders

✅ DO:
- Commit `.gitignore` with `.env.local`
- Use strong password for production
- Backup `data/` folder regularly
- Check Vercel logs for errors

❌ DON'T:
- Commit `.env.local` with real passwords
- Share admin password publicly
- Delete JSON files without backup
- Ignore Vercel deployment errors

---

**For more info**: Read SETUP.md or README.md
