'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  let theme: string = 'light';
  let toggleTheme: () => void = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch {
    // Component rendered outside ThemeProvider context during build
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'TENTANG', href: '#about' },
    { label: 'LAYANAN', href: '#services' },
    { label: 'STRUKTUR', href: '/struktur' },
    { label: 'PROYEK', href: '#portfolio' },
    { label: 'APLIKASI', href: '#applications' },
    { label: 'BERITA', href: '#news' },
    { label: 'ANGGOTA', href: '/members' },
    { label: 'KONTAK', href: '#contact' },
  ];

  return (
    <header className="border-b border-gray-700 dark:border-gray-600 sticky top-0 z-50 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src="/logo_backstagers_jawabarat.png" 
            alt="Backstagers DPD Jawa Barat" 
            className="h-10 w-auto" 
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-black dark:text-white text-sm font-semibold hover:text-gray-600 dark:hover:text-gray-400 transition"
            >
              {link.label}
            </a>
          ))}
          <button className="border border-black dark:border-white text-black dark:text-white px-6 py-2 text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
            HUBUNGI KAMI
          </button>
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="ml-4 p-2 rounded-lg border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          )}
        </nav>

        {/* Mobile Menu Button + Theme Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Theme Toggle Mobile */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900 transition"
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          )}

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-col space-y-1.5 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-black dark:bg-white transition-all duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-700 dark:border-gray-600 animate-in fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-black dark:text-white text-sm font-semibold py-2 hover:text-gray-600 dark:hover:text-gray-400 transition border-b border-gray-700 dark:border-gray-600 last:border-b-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button className="w-full mt-4 border border-black dark:border-white text-black dark:text-white px-6 py-2 text-sm font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              HUBUNGI KAMI
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
