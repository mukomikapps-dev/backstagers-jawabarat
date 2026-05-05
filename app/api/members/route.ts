import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, updateFileContent } from '@/lib/github-utils';

const DATA_PATH = 'data/members.json';

// GET all members
export async function GET() {
  try {
    const members = await getFileContent(DATA_PATH);
    return NextResponse.json(members);
  } catch (error) {
    console.error('Failed to read members:', error);
    return NextResponse.json({ error: 'Failed to read members' }, { status: 500 });
  }
}

// POST - Add new member (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newMember = await request.json();
    const members = await getFileContent(DATA_PATH);
    
    const maxId = Math.max(...members.map((m: any) => m.id), 0);
    newMember.id = maxId + 1;
    
    members.push(newMember);
    await updateFileContent(DATA_PATH, members, `Add new member: ${newMember.name}`);
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Failed to create member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}

// PUT - Update member
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedMember = await request.json();
    let members = await getFileContent(DATA_PATH);
    
    members = members.map((m: any) => 
      m.id === updatedMember.id ? updatedMember : m
    );
    
    await updateFileContent(DATA_PATH, members, `Update member: ${updatedMember.name}`);
    
    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Failed to update member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

// DELETE - Remove member
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    let members = await getFileContent(DATA_PATH);
    
    members = members.filter((m: any) => m.id !== id);
    await updateFileContent(DATA_PATH, members, `Delete member with id: ${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
