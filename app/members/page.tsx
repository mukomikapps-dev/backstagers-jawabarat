'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members');
        
        if (!response.ok) {
          console.error('Failed to fetch members');
          setMembers([]);
        } else {
          const data = await response.json();
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Navbar />
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Header Section */}
      <section className="bg-black text-white py-20 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-black mb-4">ANGGOTA BACKSTAGERS</h1>
          <div className="border-t-2 border-white w-16 mb-6"></div>
          <p className="text-gray-300 max-w-2xl mb-8">
            Temui tim profesional kami yang berpengalaman dalam industri event production dan entertainment.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Cari anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white placeholder-gray-500 rounded focus:outline-none focus:border-white transition"
            />
            <svg
              className="absolute right-3 top-3 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMembers.length > 0 ? (
            <>
              <p className="text-gray-400 mb-8">
                Menampilkan {filteredMembers.length} dari {members.length} anggota
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMembers.map((member) => (
                  <Link
                    key={member.id}
                    href={`/members/${member.id}`}
                    className="group border border-gray-700 overflow-hidden hover:border-white transition cursor-pointer"
                  >
                    <div className={`${member.bgColor || 'bg-gray-900'} h-48 flex items-center justify-center p-4 group-hover:scale-105 transition`}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-full w-auto object-contain max-w-full"
                      />
                    </div>
                    <div className="p-6 bg-gray-950">
                      <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-400 transition">
                        {member.name}
                      </h3>
                      <p className="text-blue-400 font-bold text-sm mb-2">{member.position}</p>
                      <p className="text-gray-400 text-sm mb-3 border-b border-gray-700 pb-3">{member.company}</p>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{member.bio}</p>
                      <div className="flex items-center space-x-4">
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-white transition"
                          title="Email"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </a>
                        <a
                          href={`tel:${member.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-white transition"
                          title="Phone"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773c.418 1.265 1.215 2.541 2.157 3.483.942.942 2.218 1.739 3.483 2.157l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2.159A13.905 13.905 0 012 5.159V3z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-8">
                {searchTerm ? 'Tidak ada anggota yang cocok dengan pencarian.' : 'Belum ada anggota.'}
              </p>
              <Link
                href="/#about"
                className="inline-block border border-white text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-black transition"
              >
                Kembali ke Beranda
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Backstagers DPD Jawa Barat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
