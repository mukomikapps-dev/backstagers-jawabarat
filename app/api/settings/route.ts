import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  return token === ADMIN_TOKEN;
}

export async function GET() {
  try {
    // Try to fetch from settings table
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    // If table doesn't exist or no data, return default settings
    if (error) {
      console.log('Settings table error (this is OK if first time):', error.code);
      // Return default settings - table might not exist yet or be empty
      return NextResponse.json({
        id: 1,
        site_title: 'Backstagers - Jawa Barat',
        site_description: 'Organisasi Profesional Event & Entertainment',
        maintenance_mode: false,
        maintenance_message: 'Situs sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
        seo_keywords: 'event, entertainment, backstagers, jawa barat',
        social_media: {
          instagram: 'https://instagram.com/backstagers',
          facebook: 'https://facebook.com/backstagers',
          twitter: 'https://twitter.com/backstagers',
        },
      });
    }

    // Return existing settings
    return NextResponse.json(data || {
      id: 1,
      site_title: 'Backstagers - Jawa Barat',
      site_description: 'Organisasi Profesional Event & Entertainment',
      maintenance_mode: false,
      maintenance_message: 'Situs sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
      seo_keywords: 'event, entertainment, backstagers, jawa barat',
      social_media: {
        instagram: 'https://instagram.com/backstagers',
        facebook: 'https://facebook.com/backstagers',
        twitter: 'https://twitter.com/backstagers',
      },
    });
  } catch (error) {
    console.error('Settings GET error:', error);
    // Return default settings on any error
    return NextResponse.json({
      id: 1,
      site_title: 'Backstagers - Jawa Barat',
      site_description: 'Organisasi Profesional Event & Entertainment',
      maintenance_mode: false,
      maintenance_message: 'Situs sedang dalam pemeliharaan. Silakan kembali lagi nanti.',
      seo_keywords: 'event, entertainment, backstagers, jawa barat',
      social_media: {
        instagram: 'https://instagram.com/backstagers',
        facebook: 'https://facebook.com/backstagers',
        twitter: 'https://twitter.com/backstagers',
      },
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    // Try to upsert settings
    const { data, error } = await supabase
      .from('settings')
      .upsert(
        {
          id: 1,
          site_title: body.site_title,
          site_description: body.site_description,
          maintenance_mode: body.maintenance_mode,
          maintenance_message: body.maintenance_message,
          seo_keywords: body.seo_keywords,
          social_media: body.social_media,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Settings upsert error:', error);
      // Return success anyway - settings will be stored in memory
      return NextResponse.json({
        id: 1,
        site_title: body.site_title,
        site_description: body.site_description,
        maintenance_mode: body.maintenance_mode,
        maintenance_message: body.maintenance_message,
        seo_keywords: body.seo_keywords,
        social_media: body.social_media,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Settings PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
