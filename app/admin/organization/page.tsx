'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Organization {
  id: number;
  nama: string;
  lokasi: string;
  berdiri: number;
  website: string;
  email: string;
  telepon: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tentang: string;
}

export default function OrganizationPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await fetch('/api/organization');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOrg(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;
  if (!org) return <div className="p-8">No organization data</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Organisasi</h1>
        <Link
          href="/admin/organization/edit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ✏️ Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Informasi Dasar</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600 font-semibold">Nama</label>
              <p className="text-lg">{org.nama}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Lokasi</label>
              <p className="text-lg">{org.lokasi}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Berdiri Tahun</label>
              <p className="text-lg">{org.berdiri}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Website</label>
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {org.website}
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Kontak</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-600 font-semibold">Email</label>
              <a
                href={`mailto:${org.email}`}
                className="text-blue-600 hover:underline"
              >
                {org.email}
              </a>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Telepon</label>
              <p className="text-lg">{org.telepon}</p>
            </div>
            <div>
              <label className="text-gray-600 font-semibold">Media Sosial</label>
              <div className="flex gap-4 mt-2">
                {org.instagram && (
                  <a
                    href={org.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Instagram
                  </a>
                )}
                {org.facebook && (
                  <a
                    href={org.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Facebook
                  </a>
                )}
                {org.twitter && (
                  <a
                    href={org.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Tentang Organisasi</h2>
        <p className="text-gray-700 leading-relaxed">{org.tentang}</p>
      </div>
    </div>
  );
}
