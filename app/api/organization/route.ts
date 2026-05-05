import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'organization.json');

// GET organization info
export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const org = JSON.parse(data);
    return NextResponse.json(org);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read organization data' }, { status: 500 });
  }
}

// PUT - Update organization (admin only)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedOrg = await request.json();
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedOrg, null, 2));
    
    return NextResponse.json(updatedOrg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}
