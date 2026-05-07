'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Gagal memuat events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

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

  if (loading) {
    return <div className="p-8">Memuat...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Daftar Events</h1>
        <Link
          href="/admin/events/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
        >
          + Tambah Event
        </Link>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full">
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
  );
}
