'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

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

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [news, setNews] = useState<News>({
    id: 0,
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    videoUrl: '',
    category: 'news',
    author: 'Admin',
    date: new Date().toISOString().split('T')[0],
    featured: false
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      console.log('Fetching news with ID:', id);
      const response = await fetch(`/api/news/${id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('News data fetched:', data);
        setNews(data);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('Berita tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Error loading news: ' + error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isNew && id) {
      fetchNews();
    } else {
      setLoading(false);
    }
  }, [id, isNew, fetchNews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setNews({
      ...news,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNews({
          ...news,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setNews({
      ...news,
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const method = isNew ? 'POST' : 'PUT';
      const endpoint = isNew ? '/api/news' : `/api/news/${id}`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(news)
      });

      if (response.ok) {
        alert(isNew ? 'Berita berhasil dibuat' : 'Berita berhasil diperbarui');
        router.push('/admin');
      } else {
        const error = await response.json();
        alert('Error: ' + error.error);
      }
    } catch (error) {
      alert('Error saving news: ' + error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Hapus berita ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Berita berhasil dihapus');
        router.push('/admin');
      } else {
        alert('Error deleting news');
      }
    } catch (error) {
      alert('Error: ' + error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{isNew ? 'Tambah Berita' : 'Edit Berita'}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Judul</label>
          <input
            type="text"
            name="title"
            value={news.title}
            onChange={handleTitleChange}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            value={news.slug}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2 bg-gray-100"
            disabled
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Deskripsi Singkat</label>
          <textarea
            name="description"
            value={news.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold mb-2">Konten</label>
          <textarea
            name="content"
            value={news.content}
            onChange={handleInputChange}
            rows={8}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded p-2"
          />
          {news.image && (
            <div className="mt-4">
              {/* Preview dengan unoptimized untuk data URLs */}
              <img 
                src={news.image} 
                alt="Preview" 
                className="max-w-xs h-auto rounded"
                style={{ width: '300px', height: 'auto' }}
              />
            </div>
          )}
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-semibold mb-2">Link Video YouTube</label>
          <input
            type="url"
            name="videoUrl"
            value={news.videoUrl}
            onChange={handleInputChange}
            placeholder="https://www.youtube.com/embed/dQw4w9WgXcQ"
            className="w-full border border-gray-300 rounded p-2"
          />
          {news.videoUrl && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="315"
                src={news.videoUrl}
                title="Video Preview"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Kategori</label>
          <select
            name="category"
            value={news.category}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="announcement">Pengumuman</option>
            <option value="tips">Tips & Trik</option>
            <option value="tutorial">Tutorial</option>
            <option value="news">Berita</option>
            <option value="event">Event</option>
          </select>
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-semibold mb-2">Penulis</label>
          <input
            type="text"
            name="author"
            value={news.author}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">Tanggal</label>
          <input
            type="date"
            name="date"
            value={news.date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="featured"
            checked={news.featured}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-semibold">Tampilkan sebagai Berita Utama</label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : isNew ? 'Buat Berita' : 'Simpan Perubahan'}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Hapus
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
