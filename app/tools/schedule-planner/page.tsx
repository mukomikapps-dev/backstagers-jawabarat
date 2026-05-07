'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Shift {
  id: string;
  crewName: string;
  date: string;
  startTime: string;
  endTime: string;
  role: string;
}

export default function SchedulePlanner() {
  const [shifts, setShifts] = useState<Shift[]>([
    { id: '1', crewName: 'Budi Santoso', date: '2026-05-15', startTime: '08:00', endTime: '17:00', role: 'Lighting Tech' },
    { id: '2', crewName: 'Siti Nurhaliza', date: '2026-05-15', startTime: '09:00', endTime: '18:00', role: 'Sound Engineer' }
  ]);
  const [newShift, setNewShift] = useState({
    crewName: '',
    date: '',
    startTime: '',
    endTime: '',
    role: ''
  });

  const addShift = () => {
    if (newShift.crewName && newShift.date && newShift.startTime && newShift.endTime && newShift.role) {
      setShifts([...shifts, { id: Date.now().toString(), ...newShift }]);
      setNewShift({ crewName: '', date: '', startTime: '', endTime: '', role: '' });
    }
  };

  const removeShift = (id: string) => {
    setShifts(shifts.filter(shift => shift.id !== id));
  };

  const sortedShifts = [...shifts].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.startTime}`);
    const dateB = new Date(`${b.date}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  const crewNames = Array.from(new Set(shifts.map(s => s.crewName)));

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
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
        <h1 className="text-4xl font-black text-white mb-8">📅 Crew Schedule Planner</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Input Form */}
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-6">Tambah Jadwal</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-400 text-xs">Nama Kru</label>
                <input
                  type="text"
                  value={newShift.crewName}
                  onChange={(e) => setNewShift({...newShift, crewName: e.target.value})}
                  placeholder="Nama kru"
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Tanggal</label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) => setNewShift({...newShift, date: e.target.value})}
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Jam Mulai</label>
                <input
                  type="time"
                  value={newShift.startTime}
                  onChange={(e) => setNewShift({...newShift, startTime: e.target.value})}
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Jam Berakhir</label>
                <input
                  type="time"
                  value={newShift.endTime}
                  onChange={(e) => setNewShift({...newShift, endTime: e.target.value})}
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Posisi</label>
                <input
                  type="text"
                  value={newShift.role}
                  onChange={(e) => setNewShift({...newShift, role: e.target.value})}
                  placeholder="Lighting Tech, Sound..."
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={addShift}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition rounded"
              >
                Tambah Jadwal
              </button>
            </div>
          </div>

          {/* Schedule List */}
          <div className="lg:col-span-3">
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Jadwal Kru</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sortedShifts.map((shift) => (
                  <div key={shift.id} className="p-4 bg-gray-900 border border-gray-800 rounded hover:border-gray-700 group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-bold">{shift.crewName}</p>
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-gray-400">Tanggal</p>
                            <p className="text-blue-400 font-bold">{new Date(shift.date).toLocaleDateString('id-ID')}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Jam</p>
                            <p className="text-green-400 font-bold">{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Posisi</p>
                            <p className="text-white font-bold">{shift.role}</p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeShift(shift.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition rounded opacity-0 group-hover:opacity-100"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew Summary */}
            <div className="mt-6 bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Ringkasan Kru</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {crewNames.map((name) => {
                  const crewShifts = shifts.filter(s => s.crewName === name);
                  return (
                    <div key={name} className="p-3 bg-gray-900 rounded border border-gray-800">
                      <p className="text-white font-bold">{name}</p>
                      <p className="text-gray-400 text-xs mt-1">{crewShifts.length} shift</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
