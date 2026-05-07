'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Member {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  bgColor?: string;
}

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

interface Organization {
  name: string;
  description: string;
  founded: number;
  location: string;
  email: string;
  phone: string;
  website: string;
  about: string;
  social?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

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

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'events' | 'organization' | 'news'>('members');
  const [editingId, setEditingId] = useState<number | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, eventsRes, orgRes, newsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/events'),
        fetch('/api/organization'),
        fetch('/api/news')
      ]);

      if (!membersRes.ok) {
        console.error('Failed to fetch members:', membersRes.status);
        setMembers([]);
      } else {
        const membersData = await membersRes.json();
        setMembers(Array.isArray(membersData) ? membersData : []);
      }

      if (!eventsRes.ok) {
        console.error('Failed to fetch events:', eventsRes.status);
        setEvents([]);
      } else {
        const eventsData = await eventsRes.json();
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      }

      if (!orgRes.ok) {
        console.error('Failed to fetch organization:', orgRes.status);
        setOrganization(null);
      } else {
        const orgData = await orgRes.json();
        setOrganization(orgData);
      }

      if (!newsRes.ok) {
        console.error('Failed to fetch news:', newsRes.status);
        setNews([]);
      } else {
        const newsData = await newsRes.json();
        setNews(Array.isArray(newsData) ? newsData : []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMembers([]);
      setEvents([]);
      setOrganization(null);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus member ini?')) return;
    
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMembers(members.filter(m => m.id !== id));
        alert('Member berhasil dihapus');
      } else {
        alert('Gagal menghapus member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error menghapus member');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
    
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setEvents(events.filter(e => e.id !== id));
        alert('Event berhasil dihapus');
      } else {
        alert('Gagal menghapus event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error menghapus event');
    }
  };

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Links */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
          Dashboard
        </Link>
        <Link href="/admin/struktur" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-semibold">
          Kelola Struktur
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-8">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'members'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'events'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('news')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'news'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Berita ({news.length})
        </button>
        <button
          onClick={() => setActiveTab('organization')}
          className={`px-6 py-3 font-semibold border-b-2 transition ${
            activeTab === 'organization'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Organization
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Daftar Members</h2>
            <Link
              href="/admin/members/new"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
            >
              + Tambah Member
            </Link>
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Nama</th>
                  <th className="px-6 py-3 text-left">Perusahaan</th>
                  <th className="px-6 py-3 text-left">Posisi</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{member.id}</td>
                    <td className="px-6 py-4 font-semibold">{member.name}</td>
                    <td className="px-6 py-4">{member.company}</td>
                    <td className="px-6 py-4">{member.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{member.email || '-'}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/admin/members/${member.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Daftar Events</h2>
            <Link
              href="/admin/events/new"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
            >
              + Tambah Event
            </Link>
          </div>

          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="w-full bg-white">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Judul</th>
                  <th className="px-6 py-3 text-left">Tanggal</th>
                  <th className="px-6 py-3 text-left">Lokasi</th>
                  <th className="px-6 py-3 text-left">Kategori</th>
                  <th className="px-6 py-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{event.id}</td>
                    <td className="px-6 py-4 font-semibold">{event.title}</td>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4 text-sm">{event.location}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Organization Tab */}
      {activeTab === 'organization' && organization && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Pengaturan Organisasi</h2>
            <Link
              href="/admin/organization/edit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
            >
              Edit Organisasi
            </Link>
          </div>

          <div className="bg-white shadow-md rounded-lg p-8 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-4">Informasi Dasar</h3>
              <div className="space-y-3">
                <p><strong>Nama:</strong> {organization.name}</p>
                <p><strong>Lokasi:</strong> {organization.location}</p>
                <p><strong>Berdiri:</strong> {organization.founded}</p>
                <p><strong>Website:</strong> <a href={organization.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{organization.website}</a></p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <div className="space-y-3">
                <p><strong>Email:</strong> {organization.email}</p>
                <p><strong>Telepon:</strong> {organization.phone}</p>
                {organization.social && (
                  <div className="mt-4">
                    <strong className="block mb-2">Media Sosial:</strong>
                    <div className="space-y-1 text-sm">
                      {organization.social.instagram && <p>Instagram: <a href={organization.social.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{organization.social.instagram}</a></p>}
                      {organization.social.facebook && <p>Facebook: <a href={organization.social.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{organization.social.facebook}</a></p>}
                      {organization.social.twitter && <p>Twitter: <a href={organization.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{organization.social.twitter}</a></p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-8 mt-6">
            <h3 className="text-lg font-bold mb-4">Tentang Organisasi</h3>
            <p className="text-gray-700 leading-relaxed">{organization.about}</p>
          </div>
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Daftar Berita</h2>
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
      )}
    </div>
  );
}
