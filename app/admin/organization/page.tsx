'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Organization {
  name: string;
  description: string;
  founded: number;
  location: string;
  email: string;
  phone: string;
  website: string;
  about: string;
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

export default function EditOrganization() {
  const [org, setOrg] = useState<Organization>({
    name: '',
    description: '',
    founded: 2020,
    location: '',
    email: '',
    phone: '',
    website: '',
    about: '',
    social: {
      instagram: '',
      facebook: '',
      twitter: '',
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      const res = await fetch('/api/organization');
      const data = await res.json();
      setOrg(data);
    } catch (error) {
      console.error('Error fetching organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(org),
      });

      if (res.ok) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error saving organization:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Organisasi</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Nama Organisasi</label>
            <input
              type="text"
              value={org.name}
              onChange={(e) => setOrg({ ...org, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Deskripsi</label>
            <input
              type="text"
              value={org.description}
              onChange={(e) => setOrg({ ...org, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tentang</label>
            <textarea
              value={org.about}
              onChange={(e) => setOrg({ ...org, about: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tahun Berdiri</label>
              <input
                type="number"
                value={org.founded}
                onChange={(e) => setOrg({ ...org, founded: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Lokasi</label>
              <input
                type="text"
                value={org.location}
                onChange={(e) => setOrg({ ...org, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={org.email}
                onChange={(e) => setOrg({ ...org, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Telepon</label>
              <input
                type="tel"
                value={org.phone}
                onChange={(e) => setOrg({ ...org, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Website</label>
            <input
              type="url"
              value={org.website}
              onChange={(e) => setOrg({ ...org, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Media Sosial</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Instagram</label>
                <input
                  type="url"
                  value={org.social.instagram}
                  onChange={(e) => setOrg({ ...org, social: { ...org.social, instagram: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Facebook</label>
                <input
                  type="url"
                  value={org.social.facebook}
                  onChange={(e) => setOrg({ ...org, social: { ...org.social, facebook: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Twitter</label>
                <input
                  type="url"
                  value={org.social.twitter}
                  onChange={(e) => setOrg({ ...org, social: { ...org.social, twitter: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <Link href="/admin" className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 text-center">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
