'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StructureMember {
  id: number;
  name: string;
  position: string;
  title: string;
  phone: string;
  email: string;
  bio: string;
  image: string;
  department: string;
}

export default function StructurePage() {
  const [structure, setStructure] = useState<StructureMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        const response = await fetch('/api/structure');
        const data = await response.json();
        setStructure(data);
      } catch (error) {
        console.error('Error fetching structure:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStructure();
  }, []);

  const departments = ['All', ...Array.from(new Set(structure.map(m => m.department)))];
  const filtered = selectedDept === 'All' 
    ? structure 
    : structure.filter(m => m.department === selectedDept);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 sticky top-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo_backstagers_jawabarat.png" alt="Backstagers DPD Jawa Barat" className="h-10 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#news" className="text-white text-sm font-semibold hover:text-gray-300 transition">BERITA</Link>
            <Link href="/" className="text-white text-sm font-semibold hover:text-gray-300 transition">BERANDA</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-6xl font-black text-white mb-2">STRUKTUR ORGANISASI</h1>
          <p className="text-2xl font-bold text-blue-400 mb-4">Dewan Pimpinan Daerah (DPD) Jawa Barat</p>
          <div className="border-t-2 border-white w-16 mb-6"></div>
          <p className="text-gray-400 text-lg">Kenal tim profesional yang memimpin Backstagers di Jawa Barat</p>
        </div>

        {/* Department Filter */}
        <div className="mb-12 pb-8 border-b border-gray-700">
          <p className="text-sm font-bold text-gray-400 mb-4 uppercase">Filter Divisi</p>
          <div className="flex flex-wrap gap-3">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-6 py-2 rounded font-bold text-sm transition uppercase ${
                  selectedDept === dept
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : 'border border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Hierarchy View for Leadership */}
        {selectedDept === 'All' && (
          <div className="mb-20">
            <h2 className="text-3xl font-black text-white mb-12 text-center">Pimpinan Utama</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {structure.filter(m => m.department === 'Leadership').map((member) => (
                <div
                  key={member.id}
                  className="border border-gray-700 overflow-hidden hover:border-white transition bg-gray-950"
                >
                  {member.image && (
                    <div className="h-64 overflow-hidden bg-gray-900">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-black text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 font-bold text-lg mb-3">{member.position}</p>
                    <p className="text-gray-400 text-sm mb-4">{member.title}</p>
                    <p className="text-gray-400 text-sm mb-4">{member.bio}</p>
                    <div className="pt-4 border-t border-gray-700 space-y-2 text-sm">
                      <p className="text-gray-500">📧 {member.email}</p>
                      <p className="text-gray-500">📱 {member.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Members Grid */}
        <h2 className="text-3xl font-black text-white mb-8 text-center">
          {selectedDept === 'All' ? 'Tim Divisi' : selectedDept}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="border border-gray-700 overflow-hidden hover:border-white transition group bg-gray-950"
            >
              {member.image && (
                <div className="h-48 overflow-hidden bg-gray-900">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-black text-white mb-1 line-clamp-2">{member.name}</h3>
                <p className="text-blue-400 font-bold mb-1 text-sm">{member.position}</p>
                <p className="text-gray-500 text-xs mb-3">{member.title}</p>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{member.bio}</p>
                <div className="pt-4 border-t border-gray-700 space-y-2 text-xs">
                  <p className="text-gray-500 truncate">📧 {member.email}</p>
                  <p className="text-gray-500">📱 {member.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">Tidak ada anggota di divisi ini</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="font-bold text-white">&copy; 2026 Backstagers Indonesia. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition">Admin Panel</Link>
        </div>
      </footer>
    </div>
  );
}
