import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'members.json');

// GET all members
export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const members = JSON.parse(data);
    return NextResponse.json(members);
  } catch (error) {
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
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const members = JSON.parse(data);
    
    const maxId = Math.max(...members.map((m: any) => m.id), 0);
    newMember.id = maxId + 1;
    
    members.push(newMember);
    fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2));
    
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
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
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    let members = JSON.parse(data);
    
    members = members.map((m: any) => 
      m.id === updatedMember.id ? updatedMember : m
    );
    
    fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2));
    
    return NextResponse.json(updatedMember);
  } catch (error) {
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
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    let members = JSON.parse(data);
    
    members = members.filter((m: any) => m.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(members, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
