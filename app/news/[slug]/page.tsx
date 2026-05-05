'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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
  status: 'draft' | 'published';
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [news, setNews] = useState<News | null>(null);
  const [allNews, setAllNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        console.log('📰 Fetching news with slug:', slug);
        
        // Fetch all news to find by slug
        const response = await fetch('/api/news');
        const newsData = await response.json();
        setAllNews(newsData);
        
        // Find news by slug
        const foundNews = newsData.find((n: News) => n.slug === slug);
        if (foundNews) {
          console.log('✅ News found:', foundNews.title);
          setNews(foundNews);
        } else {
          console.error('❌ News not found with slug:', slug);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNews();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-black">
        <header className="border-b border-gray-700 sticky top-0 z-50 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo_backstagers_jawabarat.png" alt="Backstagers DPD Jawa Barat" className="h-10 w-auto" />
            </Link>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl font-black text-white mb-4">Berita Tidak Ditemukan</h1>
          <p className="text-gray-400 mb-8">Maaf, berita yang Anda cari tidak tersedia.</p>
          <Link 
            href="/" 
            className="inline-block border border-white text-white px-8 py-3 font-bold hover:bg-white hover:text-black transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  // Get related news (same category, excluding current)
  const relatedNews = allNews
    .filter(n => n.category === news.category && n.id !== news.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 sticky top-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo_backstagers_jawabarat.png" alt="Backstagers DPD Jawa Barat" className="h-10 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#news" className="text-white text-sm font-semibold hover:text-gray-300 transition">BERITA</Link>
            <Link href="/" className="text-white text-sm font-semibold hover:text-gray-300 transition">BERANDA</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/#news" className="text-gray-400 hover:text-white text-sm transition">
            ← Kembali ke Berita
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-12">
          <div className="mb-4">
            <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-xs font-semibold uppercase">
              {news.category}
            </span>
          </div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">{news.title}</h1>
          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <span>📅 {new Date(news.date).toLocaleDateString('id-ID', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span>✍️ {news.author}</span>
            {news.featured && <span className="text-yellow-500 font-bold">⭐ FEATURED</span>}
          </div>
        </div>

        {/* Featured Image */}
        {news.image && (
          <div className="mb-12 rounded-lg overflow-hidden border border-gray-700 h-96">
            <img 
              src={news.image} 
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Description/Summary */}
        <div className="mb-8 pb-8 border-b border-gray-700">
          <p className="text-xl text-gray-300 leading-relaxed">{news.description}</p>
        </div>

        {/* Video (if available) */}
        {news.videoUrl && (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6">Video Terkait</h2>
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <iframe
                width="100%"
                height="500"
                src={news.videoUrl}
                title={news.title}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>
        </div>

        {/* Author Info */}
        <div className="border-t border-gray-700 pt-8 mb-12">
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-8">
            <h3 className="text-xl font-bold text-white mb-2">Tentang Penulis</h3>
            <p className="text-gray-400">{news.author}</p>
          </div>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="border-t border-gray-700 pt-12">
            <h2 className="text-3xl font-black text-white mb-8">Berita Terkait</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((item) => (
                <Link 
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="border border-gray-700 overflow-hidden hover:border-white transition group"
                >
                  {item.image && (
                    <div className="h-40 overflow-hidden bg-gray-900">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-4 bg-gray-950">
                    <h3 className="text-sm font-black text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-xs">{item.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="font-bold text-white">&copy; 2026 Backstagers Indonesia. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition">Admin Panel</Link>
        </div>
      </footer>
    </div>
  );
}
