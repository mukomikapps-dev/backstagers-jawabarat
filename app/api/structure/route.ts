import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET all structure
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('structure')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Failed to fetch structure:', error);
      return NextResponse.json({ error: 'Failed to fetch structure' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to read structure:', error);
    return NextResponse.json({ error: 'Failed to read structure' }, { status: 500 });
  }
}

// POST - Add new structure (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newItem = await request.json();

    const { data, error } = await supabaseAdmin
      .from('structure')
      .insert([newItem])
      .select()
      .single();

    if (error) {
      console.error('Failed to create structure:', error);
      return NextResponse.json({ error: 'Failed to create structure' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create structure:', error);
    return NextResponse.json({ error: 'Failed to create structure' }, { status: 500 });
  }
}

// PUT - Update structure (admin only)
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
      .from('structure')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update structure:', error);
      return NextResponse.json({ error: 'Failed to update structure' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update structure:', error);
    return NextResponse.json({ error: 'Failed to update structure' }, { status: 500 });
  }
}

// DELETE - Delete structure (admin only)
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
      .from('structure')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete structure:', error);
      return NextResponse.json({ error: 'Failed to delete structure' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete structure:', error);
    return NextResponse.json({ error: 'Failed to delete structure' }, { status: 500 });
  }
}
