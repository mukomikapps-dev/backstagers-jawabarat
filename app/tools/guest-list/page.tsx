'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Hadir' | 'Belum Hadir' | 'Batal';
  checkInTime?: string;
}

export default function GuestListManager() {
  const [guests, setGuests] = useState<Guest[]>([
    { id: '1', name: 'Ahmad Wijaya', email: 'ahmad@example.com', phone: '081234567890', status: 'Hadir', checkInTime: '14:30' },
    { id: '2', name: 'Siti Aminah', email: 'siti@example.com', phone: '081234567891', status: 'Belum Hadir' },
    { id: '3', name: 'Budi Santoso', email: 'budi@example.com', phone: '081234567892', status: 'Batal' }
  ]);
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const addGuest = () => {
    if (newGuest.name && newGuest.email && newGuest.phone) {
      setGuests([...guests, { id: Date.now().toString(), ...newGuest, status: 'Belum Hadir' }]);
      setNewGuest({ name: '', email: '', phone: '' });
    }
  };

  const checkIn = (id: string) => {
    setGuests(guests.map(g => 
      g.id === id 
        ? { ...g, status: 'Hadir', checkInTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }
        : g
    ));
  };

  const updateStatus = (id: string, status: Guest['status']) => {
    setGuests(guests.map(g => g.id === id ? { ...g, status } : g));
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter(g => g.id !== id));
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone.includes(searchTerm)
  );

  const stats = {
    total: guests.length,
    hadir: guests.filter(g => g.status === 'Hadir').length,
    belumHadir: guests.filter(g => g.status === 'Belum Hadir').length,
    batal: guests.filter(g => g.status === 'Batal').length
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Hadir': return 'bg-green-900 text-green-200';
      case 'Belum Hadir': return 'bg-yellow-900 text-yellow-200';
      case 'Batal': return 'bg-red-900 text-red-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-950 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-blue-400 hover:text-blue-300 text-sm font-bold">
            ← Kembali ke Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black text-white mb-8">👥 Guest List Manager</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Add Guest Form */}
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-6">Tambah Tamu</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-400 text-xs">Nama</label>
                <input
                  type="text"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  placeholder="Nama tamu"
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Email</label>
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  placeholder="Email"
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Nomor Telepon</label>
                <input
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  placeholder="08xx"
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={addGuest}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition rounded"
              >
                Tambah Tamu
              </button>
            </div>
          </div>

          {/* Guest List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Total Tamu</p>
                <h3 className="text-3xl font-black text-white">{stats.total}</h3>
              </div>
              <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Hadir</p>
                <h3 className="text-3xl font-black text-white">{stats.hadir}</h3>
              </div>
              <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Belum Hadir</p>
                <h3 className="text-3xl font-black text-white">{stats.belumHadir}</h3>
              </div>
              <div className="bg-red-900 border border-red-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Batal</p>
                <h3 className="text-3xl font-black text-white">{stats.batal}</h3>
              </div>
            </div>

            {/* Search */}
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, email, atau nomor telepon..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Guest List */}
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Daftar Tamu</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredGuests.map((guest) => (
                  <div key={guest.id} className="p-4 bg-gray-900 border border-gray-800 rounded hover:border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-bold">{guest.name}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
                          <div>
                            <p className="text-gray-400">Email</p>
                            <p className="text-blue-400">{guest.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Telepon</p>
                            <p className="text-blue-400">{guest.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getStatusColor(guest.status)}`}>
                          {guest.status} {guest.checkInTime && `(${guest.checkInTime})`}
                        </span>
                        <button
                          onClick={() => checkIn(guest.id)}
                          disabled={guest.status === 'Hadir'}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold text-xs transition rounded"
                        >
                          Check In
                        </button>
                        <button
                          onClick={() => removeGuest(guest.id)}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition rounded"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
