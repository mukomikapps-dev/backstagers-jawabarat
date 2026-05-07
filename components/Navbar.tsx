'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="border-b border-gray-700 sticky top-0 z-50 bg-black">
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
              className="text-white text-sm font-semibold hover:text-gray-300 transition"
            >
              {link.label}
            </a>
          ))}
          <button className="border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition">
            HUBUNGI KAMI
          </button>
        </nav>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col space-y-1.5 focus:outline-none z-50"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-gray-700 animate-in fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-white text-sm font-semibold py-2 hover:text-gray-300 transition border-b border-gray-700 last:border-b-0"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button className="w-full mt-4 border border-white text-white px-6 py-2 text-sm font-bold hover:bg-white hover:text-black transition">
              GET IN TOUCH
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
