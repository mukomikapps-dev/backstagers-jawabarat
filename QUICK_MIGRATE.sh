#!/usr/bin/env bash

# SUPABASE MIGRATION QUICK START
# Copy-paste commands satu per satu sesuai step

echo "🚀 Backstagers Database Migration: JSON → Supabase"
echo ""

# ==============================================================================
# STEP 1: CREATE SUPABASE PROJECT
# ==============================================================================
echo "STEP 1: CREATE SUPABASE PROJECT"
echo "👉 Go to: https://supabase.com"
echo "   1. Sign up / Login"
echo "   2. Create new project"
echo "      - Name: backstagers"
echo "      - Region: Singapore (or nearby)"
echo "      - Password: [buat yang kuat]"
echo "   3. Tunggu ~5 menit"
echo "   4. Go to Settings → API"
echo "   5. Copy 3 values:"
echo "      - Project URL"
echo "      - Anon public key"
echo "      - Service role key"
echo ""
read -p "✅ Done? Press ENTER to continue..."

# ==============================================================================
# STEP 2: SETUP ENVIRONMENT VARIABLES
# ==============================================================================
echo ""
echo "STEP 2: SETUP ENVIRONMENT VARIABLES"
echo ""

cd /Users/sugenghariadi/backstagers

# Copy template
cp .env.local.example .env.local

echo "📝 .env.local created!"
echo "✏️  Edit .env.local dan paste nilai dari Supabase:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "File location: /Users/sugenghariadi/backstagers/.env.local"
echo ""
read -p "✅ Done editing? Press ENTER to continue..."

# ==============================================================================
# STEP 3: CREATE DATABASE SCHEMA
# ==============================================================================
echo ""
echo "STEP 3: CREATE DATABASE SCHEMA"
echo "👉 Go to: https://app.supabase.com → Your Project → SQL Editor"
echo "   1. Click 'New Query'"
echo "   2. Copy entire content from: lib/supabase.sql"
echo "   3. Paste ke SQL editor"
echo "   4. Click 'Run'"
echo "   5. Verify no errors"
echo ""
read -p "✅ Done? Press ENTER to continue..."

# ==============================================================================
# STEP 4: MIGRATE DATA
# ==============================================================================
echo ""
echo "STEP 4: MIGRATE DATA"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "▶️  Running migration script..."
npm run migrate:json-to-supabase

echo ""
read -p "✅ Migration done? Press ENTER to continue..."

# ==============================================================================
# STEP 5: TEST LOCALLY
# ==============================================================================
echo ""
echo "STEP 5: TEST LOCALLY"
echo ""
echo "▶️  Starting development server..."
npm run dev

echo ""
echo "🌐 Open browser: http://localhost:3000"
echo "   ✓ Check homepage loads"
echo "   ✓ Check data appears (members, events, news)"
echo "   ✓ Check admin panel at http://localhost:3000/admin/login"
echo ""
read -p "✅ Testing done? Press CTRL+C to stop server, then ENTER here..."

# ==============================================================================
# STEP 6: DEPLOY TO VERCEL
# ==============================================================================
echo ""
echo "STEP 6: DEPLOY TO VERCEL"
echo ""
echo "👉 Go to: https://vercel.com → Your Project → Settings → Environment Variables"
echo ""
echo "Add these 5 variables:"
echo "   1. NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co"
echo "   2. NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc..."
echo "   3. SUPABASE_SERVICE_ROLE_KEY = eyJhbGc..."
echo "   4. ADMIN_TOKEN = admin_secret_token_12345"
echo "   5. ADMIN_PASSWORD = admin123"
echo ""
read -p "✅ Environment variables added? Press ENTER to continue..."

echo ""
echo "▶️  Deploying to Vercel..."
git add .
git commit -m "migrate: switch database to Supabase"
git push origin main

echo ""
echo "⏳ Deployment in progress..."
echo "   Go to https://vercel.com to monitor"
echo "   Usually takes 3-5 minutes"
echo ""
read -p "✅ Deployment done? Press ENTER to continue..."

# ==============================================================================
# DONE!
# ==============================================================================
echo ""
echo "🎉 MIGRATION COMPLETE!"
echo ""
echo "📊 Summary:"
echo "   ✓ Supabase project created"
echo "   ✓ Database schema created"
echo "   ✓ Data migrated"
echo "   ✓ Tested locally"
echo "   ✓ Deployed to Vercel"
echo ""
echo "📚 For more info:"
echo "   - SUPABASE_README.md - Overview"
echo "   - SUPABASE_CHECKLIST.md - Detailed checklist"
echo "   - MIGRATE_TO_SUPABASE.md - Full guide"
echo ""
echo "🚀 Ready to go live!"
