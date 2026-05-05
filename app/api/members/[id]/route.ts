import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Member {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  bgColor: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'members.json');

// GET single member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    console.log('🔍 API GET /members/[id]');
    console.log('📍 Data file path:', dataFilePath);
    console.log('🔑 Looking for member ID:', memberId);
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      console.error('❌ Members file not found at:', dataFilePath);
      return NextResponse.json({ error: 'Members file not found' }, { status: 500 });
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const members: Member[] = JSON.parse(data);
    
    console.log('📊 Total members in file:', members.length);
    console.log('🔍 All member IDs:', members.map((m: Member) => m.id));
    
    const member = members.find((m: Member) => m.id === memberId);
    
    if (!member) {
      console.error('❌ Member ID not found:', memberId);
      return NextResponse.json({ error: 'Member not found', memberId, totalMembers: members.length }, { status: 404 });
    }
    
    console.log('✅ Member found:', member.name);
    return NextResponse.json(member);
  } catch (error) {
    console.error('❌ Error in GET /api/members/[id]:', error);
    return NextResponse.json({ error: 'Failed to read member', details: String(error) }, { status: 500 });
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
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const members: Member[] = JSON.parse(data);
    
    const index = members.findIndex((m: Member) => m.id === memberId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    members[index] = { ...members[index], ...updatedMember, id: memberId };
    
    fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'Member updated successfully', member: members[index] });
  } catch (err) {
    console.error('Error updating member:', err);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
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
