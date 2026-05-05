import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, updateFileContent } from '@/lib/github-utils';

const DATA_PATH = 'data/organization.json';

// GET organization info
export async function GET() {
  try {
    const org = await getFileContent(DATA_PATH);
    return NextResponse.json(org);
  } catch (error) {
    console.error('Failed to read organization data:', error);
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
    await updateFileContent(DATA_PATH, updatedOrg, 'Update organization info');
    
    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error('Failed to update organization:', error);
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 });
  }
}
