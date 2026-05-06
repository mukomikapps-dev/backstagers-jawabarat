'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Member {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  image: string;
  bio: string;
  bgColor?: string;
}

interface News {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  videoUrl: string;
  category: string;
  author: string;
  date: string;
  featured: boolean;
  status: 'draft' | 'published';
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, orgRes, newsRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/organization'),
          fetch('/api/news')
        ]);
        
        if (!membersRes.ok) {
          console.error('Failed to fetch members:', membersRes.status);
          setMembers([]);
        } else {
          const membersData = await membersRes.json();
          setMembers(Array.isArray(membersData) ? membersData : []);
        }
        
        if (!orgRes.ok) {
          console.error('Failed to fetch organization:', orgRes.status);
          setOrg(null);
        } else {
          const orgData = await orgRes.json();
          setOrg(orgData);
        }
        
        if (!newsRes.ok) {
          console.error('Failed to fetch news:', newsRes.status);
          setNews([]);
        } else {
          const newsData = await newsRes.json();
          setNews(Array.isArray(newsData) ? newsData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMembers([]);
        setOrg(null);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-700 sticky top-0 z-50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo_backstagers_jawabarat.png" alt="Backstagers DPD Jawa Barat" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-white text-sm font-semibold hover:text-gray-300 transition">HOME</a>
            <a href="#about" className="text-white text-sm font-semibold hover:text-gray-300 transition">ABOUT</a>
            <a href="#services" className="text-white text-sm font-semibold hover:text-gray-300 transition">SERVICES</a>
            <a href="/struktur" className="text-white text-sm font-semibold hover:text-gray-300 transition">STRUKTUR</a>
            <a href="#portfolio" className="text-white text-sm font-semibold hover:text-gray-300 transition">PORTFOLIO</a>
            <a href="#news" className="text-white text-sm font-semibold hover:text-gray-300 transition">BERITA</a>
            <a href="#merch" className="text-white text-sm font-semibold hover:text-gray-300 transition">MERCH</a>
            <a href="#contact" className="text-white text-sm font-semibold hover:text-gray-300 transition">CONTACT</a>
            <button className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition">
              GET IN TOUCH
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img src="/logo_backstagers_jawabarat.png" alt="Backstagers DPD Jawa Barat" className="h-64 w-auto mb-8" />
              <div className="border-t-2 border-white my-6 w-16"></div>
              <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-md">
                Backstagers Indonesia adalah creative & production house yang berpengalaman di balik layar kesuksesan sebuah acara, brand, dan pengalaman.
              </p>
              <button className="border border-white text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-black transition">
                OUR SERVICES
              </button>
            </div>
            <div className="h-96 rounded-lg overflow-hidden">
              <img src="/hero-stage.jpg" alt="Backstagers Production" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: 'EVENT\nPRODUCTION',
                desc: 'Produksi acara dari konsep hingga eksekusi, dengan standar profesional dan detail yang presisi.',
                icon: '📋'
              },
              {
                title: 'TECHNICAL\n& EQUIPMENT',
                desc: 'Menyediakan kebutuhan teknis dan peralatan terbaik untuk mendukung setiap produksi.',
                icon: '⚡'
              },
              {
                title: 'CREW\nMANAGEMENT',
                desc: 'Manajemen kru berpengalaman yang siap bekerja profesional di setiap situasi.',
                icon: '👥'
              },
              {
                title: 'CREATIVE\nSOLUTION',
                desc: 'Solusi kreatif untuk mewujudkan ide-ide pengalaman yang berkesan dan berdampak.',
                icon: '✨'
              }
            ].map((service, idx) => (
              <div key={idx} className="border border-gray-600 p-6 hover:border-white transition">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="font-bold text-sm mb-3 whitespace-pre-line text-white">{service.title}</h3>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{service.desc}</p>
                <a href="#" className="text-gray-300 text-xs font-bold hover:text-white transition">READ MORE →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-5xl font-black text-white mb-2">BERITA TERBARU</h2>
              <div className="border-t-2 border-white w-16"></div>
            </div>
            {news.filter(n => n.status === 'published').length > 4 && (
              <Link 
                href="/news"
                className="hidden sm:inline-block border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition"
              >
                LIHAT SEMUA BERITA →
              </Link>
            )}
          </div>

          {news.filter(n => n.status === 'published').length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Display only first 4 published news items */}
                {news.filter(n => n.status === 'published').slice(0, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.slug}`}
                    className="border border-gray-700 overflow-hidden hover:border-white transition group flex flex-col h-full"
                  >
                    {item.image && (
                      <div className="h-40 overflow-hidden bg-gray-900">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                      </div>
                    )}
                    <div className="p-4 bg-gray-950 flex flex-col grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs font-semibold uppercase">
                          {item.category}
                        </span>
                        {item.featured && <span className="text-yellow-500 text-xs font-bold">⭐</span>}
                      </div>
                      <h3 className="text-sm font-black text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition grow">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                        <span className="text-gray-500 text-xs">{item.date}</span>
                        <span className="text-blue-400 font-bold text-xs group-hover:text-blue-300 transition">
                          Baca →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile "View All" button */}
              {news.length > 4 && (
                <div className="sm:hidden text-center">
                  <Link 
                    href="/news"
                    className="inline-block border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition"
                  >
                    LIHAT SEMUA BERITA →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Belum ada berita tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="portfolio" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <p className="text-red-600 text-sm uppercase tracking-wider font-bold">OUR WORK</p>
              <h2 className="text-4xl font-black text-white">FEATURED PROJECTS</h2>
            </div>
            <button className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition">
              VIEW ALL PROJECTS
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="bg-gray-700 h-48 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-5xl mb-2">🎪</div>
                  <p className="font-bold">Project {idx}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white mb-8">Tentang Kami</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-300 mb-6 leading-relaxed text-sm">{org?.about}</p>
              <div className="space-y-3 text-gray-400 text-sm">
                {org?.founded && <p><strong className="text-white">Berdiri:</strong> {org.founded}</p>}
                {org?.location && <p><strong className="text-white">Lokasi:</strong> {org.location}</p>}
                {org?.email && <p><strong className="text-white">Email:</strong> {org.email}</p>}
                {org?.phone && <p><strong className="text-white">Telp:</strong> {org.phone}</p>}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">IKUTI KAMI</h3>
              <div className="space-y-3">
                {org?.social?.instagram && (
                  <a href={org.social.instagram} className="block text-gray-300 hover:text-white transition font-bold">
                    → Instagram
                  </a>
                )}
                {org?.social?.facebook && (
                  <a href={org.social.facebook} className="block text-gray-300 hover:text-white transition font-bold">
                    → Facebook
                  </a>
                )}
                {org?.social?.twitter && (
                  <a href={org.social.twitter} className="block text-gray-300 hover:text-white transition font-bold">
                    → Twitter
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section id="merch" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-700">
        <h2 className="text-4xl font-black text-white mb-12">ANGGOTA KAMI</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {members.map((member) => (
            <div key={member.id} className="border border-gray-700 overflow-hidden hover:border-white transition">
              <div className={`${member.bgColor || 'bg-gray-900'} h-40 flex items-center justify-center p-4`}>
                <img 
                  src={member.image} 
                  alt={member.company} 
                  className="h-full w-auto object-contain max-w-full"
                  onError={(e) => {(e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2240%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22%23999%22%3E{member.company}%3C/text%3E%3C/svg%3E'}}
                />
              </div>
              <div className="p-6 bg-gray-950">
                <h3 className="text-lg font-black text-white mb-1">{member.name}</h3>
                <p className="text-gray-400 font-bold text-xs mb-3 border-b border-gray-700 pb-3">{member.company}</p>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-black text-white py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black mb-6">GET IN TOUCH</h2>
          <p className="text-gray-400 mb-8 text-sm">Hubungi kami untuk kolaborasi atau pertanyaan lebih lanjut</p>
          <button className="border border-white text-white px-8 py-3 font-bold text-sm hover:bg-white hover:text-black transition">
            CONTACT US
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p className="font-bold text-white">&copy; 2026 Backstagers Indonesia. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-white transition">Admin Panel</Link>
        </div>
      </footer>
    </div>
  );
}
