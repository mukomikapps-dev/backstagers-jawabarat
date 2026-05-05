'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
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

const BG_COLOR_OPTIONS = [
  'bg-white',
  'bg-gray-700',
  'bg-amber-900',
  'bg-slate-800',
  'bg-black',
  'bg-blue-900',
  'bg-red-900',
  'bg-amber-700',
  'bg-cyan-900',
  'bg-purple-900',
  'bg-yellow-900',
  'bg-indigo-900',
  'bg-lime-900',
  'bg-teal-900',
  'bg-rose-900',
  'bg-orange-900',
  'bg-emerald-900',
  'bg-violet-900',
  'bg-red-800',
  'bg-fuchsia-900',
  'bg-slate-700',
  'bg-slate-900',
];

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [member, setMember] = useState<Member>({
    id: 0,
    name: '',
    position: '',
    company: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    bgColor: 'bg-gray-900',
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  useEffect(() => {
    if (!isNew && id) {
      fetchMember();
    } else {
      setLoading(false);
    }
  }, [id, isNew]);

  const fetchMember = async () => {
    try {
      console.log('Fetching member with ID:', id);
      const response = await fetch(`/api/members/${id}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Member data fetched:', data);
        setMember(data);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('Member tidak ditemukan');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
      alert('Error loading member: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMember(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/members' : `/api/members/${id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(member)
      });

      if (response.ok) {
        alert(isNew ? 'Member berhasil ditambahkan' : 'Member berhasil diperbarui');
        router.push('/admin');
      } else {
        alert('Gagal menyimpan member');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error menyimpan member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus member ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Member berhasil dihapus');
        router.push('/admin');
      } else {
        alert('Gagal menghapus member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Error menghapus member');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{isNew ? 'Tambah Member Baru' : 'Edit Member'}</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          ← Kembali ke Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nama */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama *</label>
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama lengkap"
            />
          </div>

          {/* Perusahaan */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Perusahaan *</label>
            <input
              type="text"
              name="company"
              value={member.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nama perusahaan"
            />
          </div>

          {/* Posisi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Posisi *</label>
            <input
              type="text"
              name="position"
              value={member.position}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Posisi/Jabatan"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={member.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email address"
            />
          </div>

          {/* Telepon */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Telepon</label>
            <input
              type="tel"
              name="phone"
              value={member.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nomor telepon"
            />
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Warna Background Logo</label>
            <select
              name="bgColor"
              value={member.bgColor || 'bg-gray-900'}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {BG_COLOR_OPTIONS.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">URL Logo / Gambar</label>
          <input
            type="text"
            name="image"
            value={member.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="/logo-perusahaan/nama-logo.jpg"
          />
          {member.image && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <div className={`${member.bgColor} h-24 flex items-center justify-center rounded`}>
                <img 
                  src={member.image} 
                  alt={member.company}
                  className="max-h-20 max-w-40 object-contain"
                  onError={(e) => {(e.target as HTMLImageElement).style.display = 'none'}}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / Deskripsi</label>
          <textarea
            name="bio"
            value={member.bio}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Deskripsi singkat tentang member"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : isNew ? 'Tambah Member' : 'Simpan Perubahan'}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold transition"
            >
              Hapus Member
            </button>
          )}
          <Link
            href="/admin"
            className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 font-semibold transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
