import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET single member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);

    const { data, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('id', memberId)
      .single();

    if (error) {
      console.error('Failed to fetch member:', error);
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in GET /api/members/[id]:', error);
    return NextResponse.json({ error: 'Failed to read member' }, { status: 500 });
  }
}

// PUT - Update member (admin only)
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

    const memberId = parseInt(id);
    const updatedMember = await request.json();
    
    const { data, error } = await supabaseAdmin
      .from('members')
      .update(updatedMember)
      .eq('id', memberId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update member:', error);
      return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Member updated successfully', member: data });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

// DELETE - Delete member (admin only)
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

    const memberId = parseInt(id);

    const { error } = await supabaseAdmin
      .from('members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('Failed to delete member:', error);
      return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
}

// DELETE single member (admin only)
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

    const memberId = parseInt(id);
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const members: Member[] = JSON.parse(data);
    
    const filteredMembers = members.filter((m: Member) => m.id !== memberId);
    
    if (filteredMembers.length === members.length) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredMembers, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error('Error deleting member:', err);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
