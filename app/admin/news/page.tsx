'use client';

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

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Gagal memuat berita');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handlePublishNews = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const newsItem = news.find(n => n.id === id);
      if (!newsItem) return;

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newsItem,
          status: newStatus
        })
      });

      if (response.ok) {
        setNews(news.map(n => n.id === id ? { ...n, status: newStatus } : n));
        alert(`Berita berhasil ${newStatus === 'published' ? 'dipublikasikan' : 'disimpan sebagai draft'}`);
      } else {
        alert('Gagal mengubah status berita');
      }
    } catch (error) {
      console.error('Error publishing news:', error);
      alert('Error mengubah status berita');
    }
  };

  if (loading) {
    return <div className="p-8">Memuat...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Daftar Berita</h1>
        <Link
          href="/admin/news/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
        >
          + Tambah Berita
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Judul</th>
              <th className="px-6 py-3 text-left font-semibold">Kategori</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Tanggal</th>
              <th className="px-6 py-3 text-left font-semibold">Penulis</th>
              <th className="px-6 py-3 text-center font-semibold">Utama</th>
              <th className="px-6 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {news.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-800">{item.title}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    item.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'published' ? '✓ Dipublikasi' : '● Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.author}</td>
                <td className="px-6 py-4 text-center">
                  {item.featured ? (
                    <span className="text-yellow-600 font-semibold text-lg">⭐</span>
                  ) : (
                    <span className="text-gray-300 text-lg">◇</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <a
                      href={`/news/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-sky-500 text-white p-2 rounded hover:bg-sky-600 transition" 
                      title="Lihat"
                    >
                      👁️
                    </a>
                    <button
                      onClick={() => handlePublishNews(item.id, item.status)}
                      className={`text-white p-2 rounded transition ${
                        item.status === 'published'
                          ? 'bg-gray-600 hover:bg-gray-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                      title={item.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      {item.status === 'published' ? '📤' : '📥'}
                    </button>
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                      title="Edit"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => {
                        if (!confirm('Hapus berita ini?')) return;
                        fetch(`/api/news/${item.id}`, {
                          method: 'DELETE',
                          headers: { 'Authorization': `Bearer ${token}` }
                        }).then(() => {
                          setNews(news.filter(n => n.id !== item.id));
                          alert('Berita berhasil dihapus');
                        });
                      }}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
