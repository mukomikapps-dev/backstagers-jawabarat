'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
}

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;
  const isNew = eventId === 'new';
  
  const [event, setEvent] = useState<Event>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: 'workshop',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew && eventId) {
      fetchEvent();
    } else {
      setLoading(false);
    }
  }, [eventId, isNew]);

  const fetchEvent = async () => {
    try {
      console.log('Fetching event with ID:', eventId);
      const res = await fetch(`/api/events/${eventId}`);
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Event data fetched:', data);
        setEvent(data);
      } else {
        const errorData = await res.json();
        console.error('Error response:', errorData);
        alert('Event tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      alert('Error loading event: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/events' : `/api/events/${eventId}`;
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(event),
      });

      if (res.ok) {
        alert(isNew ? 'Event berhasil ditambahkan' : 'Event berhasil diperbarui');
        router.push('/admin');
      } else {
        alert('Gagal menyimpan event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error menyimpan event');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        alert('Event berhasil dihapus');
        router.push('/admin');
      } else {
        alert('Gagal menghapus event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error menghapus event');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isNew ? 'Tambah Event' : 'Edit Event'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Judul</label>
            <input
              type="text"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
            <textarea
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tanggal</label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Waktu</label>
              <input
                type="time"
                value={event.time}
                onChange={(e) => setEvent({ ...event, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Lokasi</label>
            <input
              type="text"
              value={event.location}
              onChange={(e) => setEvent({ ...event, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Kategori</label>
            <select
              value={event.category}
              onChange={(e) => setEvent({ ...event, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="workshop">Workshop</option>
              <option value="performance">Performance</option>
              <option value="meeting">Meeting</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">URL Gambar</label>
            <input
              type="text"
              value={event.image}
              onChange={(e) => setEvent({ ...event, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="/events/nama-event.jpg"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
            >
              {saving ? 'Menyimpan...' : isNew ? 'Tambah Event' : 'Simpan Perubahan'}
            </button>
            {!isNew && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
              >
                Hapus Event
              </button>
            )}
            <Link href="/admin" className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-center font-semibold">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
