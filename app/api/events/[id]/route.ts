import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'events.json');

// GET single event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);
    console.log('🔍 API GET /events/[id] - ID:', eventId);
    
    if (!fs.existsSync(dataFilePath)) {
      console.error('❌ Events file not found');
      return NextResponse.json({ error: 'Events file not found' }, { status: 500 });
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const events: Event[] = JSON.parse(data);
    
    console.log('📊 Total events in file:', events.length);
    const event = events.find((e: Event) => e.id === eventId);
    
    if (!event) {
      console.error('❌ Event ID not found:', eventId);
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    console.log('✅ Event found:', event.title);
    return NextResponse.json(event);
  } catch (error) {
    console.error('❌ Error in GET /api/events/[id]:', error);
    return NextResponse.json({ error: 'Failed to read event', details: String(error) }, { status: 500 });
  }
}

// PUT - Update event (admin only)
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

    const eventId = parseInt(id);
    const updatedEvent = await request.json();
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const events: Event[] = JSON.parse(data);
    
    const index = events.findIndex((e: Event) => e.id === eventId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    events[index] = { ...events[index], ...updatedEvent, id: eventId };
    
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'Event updated successfully', event: events[index] });
  } catch (err) {
    console.error('Error updating event:', err);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE single event (admin only)
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

    const eventId = parseInt(id);
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const events: Event[] = JSON.parse(data);
    
    const filteredEvents = events.filter((e: Event) => e.id !== eventId);
    
    if (filteredEvents.length === events.length) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredEvents, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
