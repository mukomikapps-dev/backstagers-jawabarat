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
