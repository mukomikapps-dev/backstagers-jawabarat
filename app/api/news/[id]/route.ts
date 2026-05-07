import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET single news by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = parseInt(id);

    const { data, error } = await supabaseAdmin
      .from('news')
      .select('*')
      .eq('id', newsId)
      .single();

    if (error) {
      console.error('Failed to fetch news:', error);
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/news/[id]:', error);
    return NextResponse.json({ error: 'Failed to read news' }, { status: 500 });
  }
}

// PUT - Update news (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newsId = parseInt(id);
    const updateData = await request.json();

    const { data, error } = await supabaseAdmin
      .from('news')
      .update(updateData)
      .eq('id', newsId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update news:', error);
      return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE - Delete news (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newsId = parseInt(id);

    const { error } = await supabaseAdmin
      .from('news')
      .delete()
      .eq('id', newsId);

    if (error) {
      console.error('Failed to delete news:', error);
      return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
