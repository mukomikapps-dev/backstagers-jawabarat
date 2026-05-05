import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, updateFileContent } from '@/lib/github-utils';

const DATA_PATH = 'data/events.json';

// GET all events
export async function GET() {
  try {
    const events = await getFileContent(DATA_PATH);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to read events:', error);
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
    const events = await getFileContent(DATA_PATH);
    
    const maxId = Math.max(...events.map((e: any) => e.id), 0);
    newEvent.id = maxId + 1;
    
    events.push(newEvent);
    await updateFileContent(DATA_PATH, events, `Add new event: ${newEvent.title}`);
    
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
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
    let events = await getFileContent(DATA_PATH);
    
    events = events.map((e: any) => 
      e.id === updatedEvent.id ? updatedEvent : e
    );
    
    await updateFileContent(DATA_PATH, events, `Update event: ${updatedEvent.title}`);
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Failed to update event:', error);
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
    let events = await getFileContent(DATA_PATH);
    
    events = events.filter((e: any) => e.id !== id);
    await updateFileContent(DATA_PATH, events, `Delete event with id: ${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
