import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET all structure members
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
    console.error('Error reading structure data:', error);
    return NextResponse.json({ error: 'Failed to read structure' }, { status: 500 });
  }
}

// POST - Add new structure member (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newMember = await request.json();

    const { data, error } = await supabaseAdmin
      .from('structure')
      .insert([newMember])
      .select()
      .single();

    if (error) {
      console.error('Failed to create structure member:', error);
      return NextResponse.json({ error: 'Failed to create structure member' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create structure member:', error);
    return NextResponse.json({ error: 'Failed to create structure member' }, { status: 500 });
  }
}

// PUT - Update structure member (admin only)
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
      console.error('Failed to update structure member:', error);
      return NextResponse.json({ error: 'Failed to update structure member' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update structure member:', error);
    return NextResponse.json({ error: 'Failed to update structure member' }, { status: 500 });
  }
}

// DELETE - Delete structure member (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('structure')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete structure member:', error);
      return NextResponse.json({ error: 'Failed to delete structure member' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete structure member:', error);
    return NextResponse.json({ error: 'Failed to delete structure member' }, { status: 500 });
  }
}
}

export async function GET() {
  try {
    console.log('📋 API GET /api/structure');
    const data = getData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching structure:', error);
    return NextResponse.json({ error: 'Failed to fetch structure' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const adminToken = process.env.ADMIN_TOKEN;

    if (!token || token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = getData();
    const newMember: StructureMember = {
      id: Math.max(...data.map(m => m.id), 0) + 1,
      ...body
    };

    data.push(newMember);
    saveData(data);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating structure member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}
