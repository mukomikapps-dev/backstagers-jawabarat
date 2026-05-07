'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Members', href: '/admin/members', icon: '👥' },
  { name: 'Events', href: '/admin/events', icon: '📅' },
  { name: 'Berita', href: '/admin/news', icon: '📰' },
  { name: 'Struktur', href: '/admin/struktur', icon: '🏢' },
  { name: 'Organisasi', href: '/admin/organization', icon: '📋' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const isLoginPage = pathname === '/admin/login';
    
    if (!token && !isLoginPage) {
      router.push('/admin/login');
      return;
    }
    
    if (token) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [router, pathname]);

  // If on login page, just render children without layout
  if (pathname === '/admin/login') {
    return children;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-screen flex flex-col">
          {/* Logo */}
          <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold">Backstagers</h2>
            <p className="text-xs text-gray-300">Admin Panel</p>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-6 py-3 transition ${
                    isActive
                      ? 'bg-blue-600 border-r-4 border-yellow-400 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="border-t border-gray-700 p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-gray-700 text-2xl"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="w-10"></div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
