import { NextRequest, NextResponse } from 'next/server';
import { getFileContent, updateFileContent } from '@/lib/github-utils';

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

const DATA_PATH = 'data/news.json';

// GET all news
export async function GET() {
  try {
    console.log('📰 API GET /api/news');
    
    try {
      const news: News[] = await getFileContent(DATA_PATH);
      console.log('✅ Retrieved', news.length, 'news items');
      return NextResponse.json(news);
    } catch {
      return NextResponse.json([]);
    }
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
    
    const news: News[] = await getFileContent(DATA_PATH);
    
    // Generate ID
    const maxId = Math.max(...news.map(n => n.id), 0);
    const newsItem: News = {
      id: maxId + 1,
      ...newNews,
      date: newNews.date || new Date().toISOString().split('T')[0]
    };
    
    news.push(newsItem);
    await updateFileContent(DATA_PATH, news, `Create news: ${newsItem.title}`);
    
    console.log('✅ News created:', newsItem.title);
    return NextResponse.json({ message: 'News created successfully', news: newsItem });
  } catch (err) {
    console.error('Error creating news:', err);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
