import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface News {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  videoUrl: string;
  category: string;
  author: string;
  date: string;
  featured: boolean;
}

const dataFilePath = path.join(process.cwd(), 'data', 'news.json');

// GET single news by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsId = parseInt(id);
    console.log('🔍 API GET /news/[id] - ID:', newsId);
    
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json({ error: 'News file not found' }, { status: 500 });
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const newsList: News[] = JSON.parse(data);
    
    const newsItem = newsList.find((n: News) => n.id === newsId);
    
    if (!newsItem) {
      console.error('❌ News ID not found:', newsId);
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    console.log('✅ News found:', newsItem.title);
    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('❌ Error in GET /api/news/[id]:', error);
    return NextResponse.json({ error: 'Failed to read news', details: String(error) }, { status: 500 });
  }
}

// PUT - Update news (admin only)
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

    const newsId = parseInt(id);
    const updatedNews = await request.json();
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const newsList: News[] = JSON.parse(data);
    
    const index = newsList.findIndex((n: News) => n.id === newsId);
    
    if (index === -1) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    newsList[index] = { ...newsList[index], ...updatedNews, id: newsId };
    
    fs.writeFileSync(dataFilePath, JSON.stringify(newsList, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'News updated successfully', news: newsList[index] });
  } catch (err) {
    console.error('Error updating news:', err);
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

// DELETE single news (admin only)
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

    const newsId = parseInt(id);
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const newsList: News[] = JSON.parse(data);
    
    const filteredNews = newsList.filter((n: News) => n.id !== newsId);
    
    if (filteredNews.length === newsList.length) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 });
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredNews, null, 2), 'utf-8');
    
    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (err) {
    console.error('Error deleting news:', err);
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
