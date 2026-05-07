'use client';

import { useEffect, useState } from 'react';

interface Stats {
  members: number;
  events: number;
  news: number;
  projects: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    members: 0,
    events: 0,
    news: 0,
    projects: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const [membersRes, eventsRes, newsRes, projectsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/events'),
        fetch('/api/news'),
        fetch('/api/projects'),
      ]);

      const members = await membersRes.json();
      const events = await eventsRes.json();
      const news = await newsRes.json();
      const projects = await projectsRes.json();

      setStats({
        members: Array.isArray(members) ? members.length : 0,
        events: Array.isArray(events) ? events.length : 0,
        news: Array.isArray(news) ? news.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Kelola semua data organisasi Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Members</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{stats.members}</p>
            </div>
            <div className="text-5xl text-blue-200">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Events</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{stats.events}</p>
            </div>
            <div className="text-5xl text-green-200">📅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Berita</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{stats.news}</p>
            </div>
            <div className="text-5xl text-purple-200">📰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">Proyek</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{stats.projects}</p>
            </div>
            <div className="text-5xl text-orange-200">🎯</div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-2">👋 Selamat datang!</h2>
        <p className="text-blue-800">
          Gunakan sidebar di sebelah kiri untuk mengelola members, events, berita, struktur organisasi, dan data lainnya.
        </p>
      </div>
    </div>
  );
}
