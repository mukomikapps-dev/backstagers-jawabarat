import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET organization info
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('organization')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Failed to fetch organization:', error);
      return NextResponse.json({ error: 'Failed to fetch organization' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read organization data:', error);
    return NextResponse.json({ error: 'Failed to read organization data' }, { status: 500 });
  }
}

// PUT - Update organization (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();

    const { data, error } = await supabaseAdmin
      .from('organization')
      .update(updateData)
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Failed to update organization:', error);
      return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}
