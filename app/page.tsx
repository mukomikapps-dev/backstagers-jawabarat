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

interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  category?: string;
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>([]);
  const [featuredMember, setFeaturedMember] = useState<Member | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, orgRes, newsRes, projectsRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/organization'),
          fetch('/api/news'),
          fetch('/api/projects')
        ]);
        
        if (!membersRes.ok) {
          console.error('Failed to fetch members:', membersRes.status);
          setMembers([]);
        } else {
          const membersData = await membersRes.json();
          const membersArray = Array.isArray(membersData) ? membersData : [];
          setMembers(membersArray);
          // Set random featured member
          if (membersArray.length > 0) {
            const randomMember = membersArray[Math.floor(Math.random() * membersArray.length)];
            setFeaturedMember(randomMember);
          }
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

        if (!projectsRes.ok) {
          console.error('Failed to fetch projects:', projectsRes.status);
          setProjects([]);
        } else {
          const projectsData = await projectsRes.json();
          setProjects(Array.isArray(projectsData) ? projectsData : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMembers([]);
        setOrg(null);
        setNews([]);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-white">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

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
                LAYANAN KAMI
              </button>
            </div>
            <div className="h-96 rounded-lg overflow-hidden">
              <img src="/hero-stage.jpg" alt="Backstagers Production" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black text-white mb-8">TENTANG KAMI</h2>
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
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: 'PRODUKSI\nACARA',
                desc: 'Produksi acara dari konsep hingga eksekusi, dengan standar profesional dan detail yang presisi.',
                icon: '📋',
                image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop'
              },
              {
                title: 'TEKNIS\n& PERALATAN',
                desc: 'Menyediakan kebutuhan teknis dan peralatan terbaik untuk mendukung setiap produksi.',
                icon: '⚡',
                image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'
              },
              {
                title: 'MANAJEMEN\nKRU',
                desc: 'Manajemen kru berpengalaman yang siap bekerja profesional di setiap situasi.',
                icon: '👥',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
              },
              {
                title: 'SOLUSI\nKREATIF',
                desc: 'Solusi kreatif untuk mewujudkan ide-ide pengalaman yang berkesan dan berdampak.',
                icon: '✨',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop'
              }
            ].map((service, idx) => (
              <div key={idx} className="border border-gray-600 overflow-hidden hover:border-white transition group">
                <div className="h-40 bg-gray-800 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition"
                  />
                </div>
                <div className="p-6">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="font-bold text-sm mb-3 whitespace-pre-line text-white">{service.title}</h3>
                  <p className="text-gray-400 text-xs mb-4 leading-relaxed">{service.desc}</p>
                  <a href="#" className="text-gray-300 text-xs font-bold hover:text-white transition">SELENGKAPNYA →</a>
                </div>
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
              <p className="text-red-600 text-sm uppercase tracking-wider font-bold">HASIL KARYA KAMI</p>
              <h2 className="text-4xl font-black text-white">PROYEK UNGGULAN</h2>
            </div>
            <button className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition">
              LIHAT SEMUA PROYEK
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {projects.length > 0 ? (
              projects.slice(0, 4).map((project) => (
                <div key={project.id} className="border border-gray-700 overflow-hidden hover:border-white transition group cursor-pointer">
                  <div className="h-48 bg-gray-800 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                  <div className="p-4 bg-gray-950">
                    <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition">{project.name}</h3>
                    {project.category && (
                      <p className="text-gray-400 text-xs mt-1">{project.category}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((idx) => (
                <div key={idx} className="bg-gray-700 h-48 rounded-lg overflow-hidden hover:opacity-80 transition cursor-pointer flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-5xl mb-2">🎪</div>
                    <p className="font-bold">Project {idx}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="bg-black py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-green-600 text-sm uppercase tracking-wider font-bold mb-2">TOOLS & UTILITIES</p>
            <h2 className="text-4xl font-black text-white">APLIKASI KAMI</h2>
            <div className="border-t-2 border-green-600 w-16 mt-4"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Stage Design Generator',
                desc: 'Buat desain stage profesional dengan drag-and-drop tools yang mudah digunakan',
                icon: '🎭',
                link: '/tools/stage-design'
              },
              {
                title: 'Event Budget Calculator',
                desc: 'Hitung dan kelola budget acara dengan detail breakdown per kategori',
                icon: '💰',
                link: '/tools/budget-calculator'
              },
              {
                title: 'Crew Schedule Planner',
                desc: 'Atur jadwal kru dan shift dengan sistem notifikasi otomatis',
                icon: '📅',
                link: '/tools/schedule-planner'
              },
              {
                title: 'Equipment Inventory',
                desc: 'Manajemen inventori peralatan event dengan tracking real-time',
                icon: '📦',
                link: '/tools/equipment-inventory'
              },
              {
                title: 'Guest List Manager',
                desc: 'Kelola daftar tamu dengan check-in system yang terintegrasi',
                icon: '👥',
                link: '/tools/guest-list'
              },
              {
                title: 'Audio Tech Assistant',
                desc: 'Kalkulator sound system, decibel converter, dan tuning guidance',
                icon: '🔊',
                link: '/tools/audio-assistant'
              }
            ].map((app, idx) => (
              <Link
                key={idx}
                href={app.link}
                className="group relative overflow-hidden rounded-lg border border-gray-600 hover:border-white transition"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition"></div>
                <div className="relative p-6">
                  <div className="text-5xl mb-4">{app.icon}</div>
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition">{app.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{app.desc}</p>
                  <span className="text-blue-400 text-sm font-bold group-hover:text-blue-300 transition inline-flex items-center gap-2">
                    BUKA APLIKASI →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Member */}
      {featuredMember && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-700">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Featured Member Image */}
            <div className={`${featuredMember.bgColor || 'bg-gray-900'} h-80 md:h-96 flex items-center justify-center p-8 border border-gray-700 hover:border-white transition`}>
              <img 
                src={featuredMember.image} 
                alt={featuredMember.name} 
                className="h-full w-auto object-contain max-w-full"
                onError={(e) => {(e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2240%22%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'}}
              />
            </div>

            {/* Featured Member Info */}
            <div>
              <h2 className="text-5xl font-black text-white mb-2">{featuredMember.name}</h2>
              <p className="text-xl text-blue-400 font-bold mb-1">{featuredMember.position}</p>
              <p className="text-lg text-gray-400 font-bold mb-6 border-b border-gray-700 pb-6">{featuredMember.company}</p>
              <p className="text-gray-300 text-base leading-relaxed mb-8">{featuredMember.bio}</p>
              
              {/* Contact Links */}
              <div className="flex flex-col gap-4 mb-10">
                {featuredMember.email && (
                  <a href={`mailto:${featuredMember.email}`} className="text-blue-400 hover:text-blue-300 transition font-bold flex items-center gap-2">
                    → EMAIL: {featuredMember.email}
                  </a>
                )}
                {featuredMember.phone && (
                  <a href={`tel:${featuredMember.phone}`} className="text-blue-400 hover:text-blue-300 transition font-bold flex items-center gap-2">
                    → PHONE: {featuredMember.phone}
                  </a>
                )}
              </div>

              {/* View All Button */}
              <Link
                href="/members"
                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black transition border-2 border-blue-600 hover:border-blue-700"
              >
                LIHAT SEMUA ANGGOTA →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="bg-black text-white py-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hubungi Kami */}
            <div className="text-center md:text-left">
              <h2 className="text-5xl font-black mb-6">HUBUNGI KAMI</h2>
              <p className="text-gray-400 mb-8 text-sm">Hubungi kami untuk kolaborasi atau pertanyaan lebih lanjut</p>
              <button className="border border-white text-white px-8 py-3 font-bold text-sm hover:bg-white hover:text-black transition">
                KIRIM PESAN
              </button>
            </div>

            {/* Follow Us */}
            <div className="max-w-md mx-auto md:mx-0">
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
