import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

interface StructureMember {
  id: number;
  name: string;
  position: string;
  title: string;
  phone: string;
  email: string;
  bio: string;
  image: string;
  department: string;
}

const dataPath = join(process.cwd(), 'data', 'structure.json');

function getData(): StructureMember[] {
  try {
    const data = readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading structure data:', error);
    return [];
  }
}

function saveData(data: StructureMember[]): void {
  writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    console.log('📋 API GET /structure/[id] - ID:', memberId);

    const data = getData();
    const member = data.find(m => m.id === memberId);

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching structure member:', error);
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    const body = await request.json();
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const adminToken = process.env.ADMIN_TOKEN;

    console.log('📋 API PUT /structure/[id] - ID:', memberId);

    if (!token || token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = getData();
    const index = data.findIndex(m => m.id === memberId);

    if (index === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    data[index] = { ...data[index], ...body, id: memberId };
    saveData(data);

    return NextResponse.json(data[index]);
  } catch (error) {
    console.error('Error updating structure member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = parseInt(id);
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const adminToken = process.env.ADMIN_TOKEN;

    console.log('🗑️ API DELETE /structure/[id] - ID:', memberId);

    if (!token || token !== adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = getData();
    const filtered = data.filter(m => m.id !== memberId);

    if (filtered.length === data.length) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    saveData(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting structure member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
