import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET single structure member by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    const { data, error } = await supabaseAdmin
      .from('structure')
      .select('*')
      .eq('id', memberId)
      .single();

    if (error) {
      console.error('Failed to fetch structure member:', error);
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching structure member:', error);
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}

// PUT - Update structure member (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();

    const { data, error } = await supabaseAdmin
      .from('structure')
      .update(updateData)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update structure member:', error);
      return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating structure member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

// DELETE - Delete structure member (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from('structure')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Failed to delete structure member:', error);
      return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting structure member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
