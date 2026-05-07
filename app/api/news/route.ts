import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET all published news
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('date', { ascending: false });

    if (error) {
      console.error('Failed to fetch news:', error);
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to read news:', error);
    return NextResponse.json({ error: 'Failed to read news' }, { status: 500 });
  }
}

// POST - Create new news (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newNews = await request.json();

    const { data, error } = await supabaseAdmin
      .from('news')
      .insert([newNews])
      .select()
      .single();

    if (error) {
      console.error('Failed to create news:', error);
      return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

// PUT - Update news (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update news:', error);
      return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE - Delete news (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete news:', error);
      return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
