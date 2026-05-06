#!/usr/bin/env node

/**
 * Script untuk migrasi data dari JSON files ke Supabase
 * 
 * Usage:
 *   node scripts/migrate-json-to-supabase.mjs
 * 
 * Pastikan sudah setup environment variables terlebih dahulu
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import ws from 'ws';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
config({ path: envPath });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

// Create Supabase client with ws transport for Node.js 21
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  realtime: {
    transport: ws
  }
});

const dataDir = path.join(process.cwd(), 'data');

// Transform field names from camelCase (JSON) to snake_case (database)
function transformToSnakeCase(obj) {
  const transformed = {};
  for (const key in obj) {
    let newKey = key;
    if (key === 'bgColor') newKey = 'bg_color';
    if (key === 'videoUrl') newKey = 'video_url';
    transformed[newKey] = obj[key];
  }
  return transformed;
}

async function migrateMembers() {
  console.log('\n📝 Migrating members...');
  const membersPath = path.join(dataDir, 'members.json');
  let members = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));
  
  // Transform field names
  members = members.map(transformToSnakeCase);

  const { error } = await supabase.from('members').insert(members);
  if (error) {
    console.error('❌ Failed to migrate members:', error);
    return false;
  }
  console.log(`✅ Migrated ${members.length} members`);
  return true;
}

async function migrateEvents() {
  console.log('\n📝 Migrating events...');
  const eventsPath = path.join(dataDir, 'events.json');
  const events = JSON.parse(fs.readFileSync(eventsPath, 'utf-8'));

  const { error } = await supabase.from('events').insert(events);
  if (error) {
    console.error('❌ Failed to migrate events:', error);
    return false;
  }
  console.log(`✅ Migrated ${events.length} events`);
  return true;
}

async function migrateNews() {
  console.log('\n📝 Migrating news...');
  const newsPath = path.join(dataDir, 'news.json');
  let news = JSON.parse(fs.readFileSync(newsPath, 'utf-8'));

  // Transform field names
  news = news.map(transformToSnakeCase);

  const { error } = await supabase.from('news').insert(news);
  if (error) {
    console.error('❌ Failed to migrate news:', error);
    return false;
  }
  console.log(`✅ Migrated ${news.length} news items`);
  return true;
}

async function migrateOrganization() {
  console.log('\n📝 Migrating organization...');
  const orgPath = path.join(dataDir, 'organization.json');
  const org = JSON.parse(fs.readFileSync(orgPath, 'utf-8'));

  const { error } = await supabase
    .from('organization')
    .insert([{ id: 1, ...org }]);
  
  if (error) {
    console.error('❌ Failed to migrate organization:', error);
    return false;
  }
  console.log('✅ Migrated organization');
  return true;
}

async function migrateStructure() {
  console.log('\n📝 Migrating structure...');
  const structurePath = path.join(dataDir, 'structure.json');
  const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

  const { error } = await supabase.from('structure').insert(structure);
  if (error) {
    console.error('❌ Failed to migrate structure:', error);
    return false;
  }
  console.log(`✅ Migrated ${structure.length} structure members`);
  return true;
}

async function cleanupTables() {
  console.log('\n🧹 Cleaning up existing data...');
  try {
    // Delete in reverse order of foreign key dependencies
    await supabase.from('structure').delete().gt('id', 0);
    await supabase.from('organization').delete().gt('id', 0);
    await supabase.from('news').delete().gt('id', 0);
    await supabase.from('events').delete().gt('id', 0);
    await supabase.from('members').delete().gt('id', 0);
    console.log('✅ Tables cleaned');
  } catch (error) {
    console.warn('⚠️ Cleanup skipped:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting migration from JSON to Supabase...\n');

  try {
    await cleanupTables();
    await migrateMembers();
    await migrateEvents();
    await migrateNews();
    await migrateOrganization();
    await migrateStructure();

    console.log('\n✅ All data migrated successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
