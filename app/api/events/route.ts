import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'events.json');

// GET all events
export async function GET() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const events = JSON.parse(data);
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
  }
}

// POST - Add new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newEvent = await request.json();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const events = JSON.parse(data);
    
    const maxId = Math.max(...events.map((e: any) => e.id), 0);
    newEvent.id = maxId + 1;
    
    events.push(newEvent);
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updatedEvent = await request.json();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    let events = JSON.parse(data);
    
    events = events.map((e: any) => 
      e.id === updatedEvent.id ? updatedEvent : e
    );
    
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE - Remove event
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    let events = JSON.parse(data);
    
    events = events.filter((e: any) => e.id !== id);
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
