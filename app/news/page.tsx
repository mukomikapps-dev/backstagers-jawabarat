'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        // Filter only published news and sort by date descending
        const published = data.filter((n: News) => n.status === 'published');
        const sorted = published.sort((a: News, b: News) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setNews(sorted);
        setFilteredNews(sorted);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories = ['all', ...Array.from(new Set(news.map(n => n.category)))];

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(n => n.category === category));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-black text-white mb-4">SEMUA BERITA</h1>
          <div className="border-t-2 border-white w-16 mb-6"></div>
          <p className="text-gray-400 text-lg">Ikuti perkembangan terbaru dari Backstagers Indonesia</p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 pb-8 border-b border-gray-700">
          <p className="text-sm font-bold text-gray-400 mb-4 uppercase">Filter Kategori</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-6 py-2 rounded font-bold text-sm transition uppercase ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'border border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {category === 'all' ? 'Semua' : category}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="border border-gray-700 overflow-hidden hover:border-white transition group flex flex-col h-full"
              >
                {/* Image */}
                {item.image && (
                  <div className="h-48 overflow-hidden bg-gray-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6 bg-gray-950 flex flex-col grow">
                  {/* Meta */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-semibold uppercase">
                      {item.category}
                    </span>
                    {item.featured && <span className="text-yellow-500 text-xs font-bold">⭐</span>}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition grow">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-gray-500 text-xs">
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="text-blue-400 font-bold text-sm group-hover:text-blue-300 transition">
                      Baca →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Tidak ada berita dalam kategori ini</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            Menampilkan <span className="text-white font-bold">{filteredNews.length}</span> dari{' '}
            <span className="text-white font-bold">{news.length}</span> berita
          </p>
        </div>
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
