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

// GET all news
export async function GET() {
  try {
    console.log('📰 API GET /api/news');
    
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json([]);
    }
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const news: News[] = JSON.parse(data);
    
    console.log('✅ Retrieved', news.length, 'news items');
    return NextResponse.json(news);
  } catch (error) {
    console.error('❌ Error in GET /api/news:', error);
    return NextResponse.json({ error: 'Failed to read news' }, { status: 500 });
  }
}

// POST - Create new news (admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const newNews = await request.json();
    
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    const news: News[] = JSON.parse(data);
    
    // Generate ID
    const maxId = Math.max(...news.map(n => n.id), 0);
    const newsItem: News = {
      id: maxId + 1,
      ...newNews,
      date: newNews.date || new Date().toISOString().split('T')[0]
    };
    
    news.push(newsItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(news, null, 2), 'utf-8');
    
    console.log('✅ News created:', newsItem.title);
    return NextResponse.json({ message: 'News created successfully', news: newsItem });
  } catch (err) {
    console.error('Error creating news:', err);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
