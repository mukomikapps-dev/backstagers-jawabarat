'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface StructureData {
  id: number;
  name: string;
  position: string;
  title: string;
  phone: string;
  email: string;
  bio: string;
  department: string;
}

const departments = ['Leadership', 'Administration', 'Finance', 'Development', 'Marketing', 'Membership', 'Social', 'Production'];

export default function StructurePage() {
  const router = useRouter();
  const [data, setData] = useState<StructureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [adminToken, setAdminToken] = useState('');

  const [formData, setFormData] = useState<Partial<StructureData>>({
    name: '',
    position: '',
    title: '',
    phone: '',
    email: '',
    bio: '',
    department: 'Leadership',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    setAdminToken(token);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/structure');
      const result = await response.json();
      setData(result || []);
    } catch (error) {
      console.error('Failed to fetch:', error);
      alert('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: StructureData) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setFormData({
      name: '',
      position: '',
      title: '',
      phone: '',
      email: '',
      bio: '',
      department: 'Leadership',
    });
    setEditingId(null);
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({
      name: '',
      position: '',
      title: '',
      phone: '',
      email: '',
      bio: '',
      department: 'Leadership',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.position) {
      alert('Nama dan Posisi harus diisi');
      return;
    }

    try {
      if (editingId) {
        // Update
        const response = await fetch('/api/structure', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify({ id: editingId, ...formData }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal update');
        }

        alert('Berhasil diupdate');
      } else {
        // Create
        const response = await fetch('/api/structure', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Gagal tambah');
        }

        alert('Berhasil ditambahkan');
      }

      fetchData();
      handleCancel();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus?')) return;

    try {
      const response = await fetch('/api/structure', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal hapus');
      }

      alert('Berhasil dihapus');
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  if (loading) {
    return <div className="p-8">Memuat...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Kelola Struktur Organisasi</h1>

      {/* Form Tambah/Edit */}
      {(isAddingNew || editingId) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Posisi (Indonesia)"
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Title (English)"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="Telepon"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <select
              value={formData.department || 'Leadership'}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="border rounded px-3 py-2"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Biodata"
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="border rounded px-3 py-2 md:col-span-2"
              rows={3}
            />

            <div className="flex gap-2 md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tombol Tambah */}
      {!isAddingNew && !editingId && (
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-6"
        >
          + Tambah Anggota
        </button>
      )}

      {/* Tabel Data */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Nama</th>
              <th className="text-left px-4 py-3 font-semibold">Posisi</th>
              <th className="text-left px-4 py-3 font-semibold">Department</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center px-4 py-3 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{item.name}</td>
                  <td className="px-4 py-3">{item.position}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {item.department}
                    </span>
                  </td>
                  <td className="px-4 py-3">{item.email || '-'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <p className="text-gray-700">
          Total anggota: <strong>{data.length}</strong>
        </p>
      </div>
    </div>
  );
}
