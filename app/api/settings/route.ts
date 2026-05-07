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
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // Return default settings if none exist
    const settings = data || {
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
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
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

    // Upsert settings
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
      throw error;
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
