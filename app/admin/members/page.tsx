'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching members:', error);
      alert('Gagal memuat members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

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

  if (loading) {
    return <div className="p-8">Memuat...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Daftar Members</h1>
        <Link
          href="/admin/members/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
        >
          + Tambah Member
        </Link>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg bg-white">
        <table className="w-full">
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
  );
}
