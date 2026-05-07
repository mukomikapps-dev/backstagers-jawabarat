'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

export default function MemberDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/members/${id}`);
        
        if (!response.ok) {
          setError('Member tidak ditemukan');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setMember(data);
      } catch (err) {
        console.error('Error fetching member:', err);
        setError('Gagal memuat data member');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Navbar />
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">{error || 'Member tidak ditemukan'}</h1>
            <Link
              href="/#about"
              className="inline-block border border-white text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-black transition"
            >
              Kembali ke Anggota
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const bgColor = member.bgColor || '#1a1a1a';

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero Section */}
      <section
        className="py-16"
        style={{ backgroundColor: bgColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Member Image */}
            <div className="h-96 rounded-lg overflow-hidden border-2 border-gray-700">
              <img
                src={member.image || '/placeholder-member.jpg'}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Member Info */}
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-4">{member.name}</h1>
              <div className="border-l-4 border-white pl-4 mb-6">
                <p className="text-2xl font-semibold mb-2">{member.position}</p>
                <p className="text-gray-300 text-lg">{member.company}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">EMAIL</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-white hover:text-gray-300 transition"
                  >
                    {member.email}
                  </a>
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">PHONE</p>
                  <a
                    href={`tel:${member.phone}`}
                    className="text-white hover:text-gray-300 transition"
                  >
                    {member.phone}
                  </a>
                </div>
              </div>

              <Link
                href="/#about"
                className="inline-block border border-white text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-black transition"
              >
                Kembali ke Anggota
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {member.bio && (
        <section className="bg-black py-16 border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Tentang</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {member.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Backstagers DPD Jawa Barat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
