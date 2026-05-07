'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Equipment {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: 'Baik' | 'Rusak Ringan' | 'Rusak Berat';
  lastMaintenance: string;
}

export default function EquipmentInventory() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: '1', name: 'Proyektor 4K', category: 'Display', quantity: 2, condition: 'Baik', lastMaintenance: '2026-04-01' },
    { id: '2', name: 'Speaker Line Array', category: 'Audio', quantity: 4, condition: 'Baik', lastMaintenance: '2026-03-15' },
    { id: '3', name: 'LED Par Can 200W', category: 'Lighting', quantity: 12, condition: 'Baik', lastMaintenance: '2026-04-10' }
  ]);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    category: '',
    quantity: 0,
    condition: 'Baik' as const,
    lastMaintenance: ''
  });

  const addEquipment = () => {
    if (newEquipment.name && newEquipment.category && newEquipment.quantity > 0) {
      setEquipment([...equipment, { id: Date.now().toString(), ...newEquipment }]);
      setNewEquipment({ name: '', category: '', quantity: 0, condition: 'Baik', lastMaintenance: '' });
    }
  };

  const removeEquipment = (id: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const totalItems = equipment.reduce((sum, e) => sum + e.quantity, 0);

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'Baik': return 'bg-green-900 text-green-200';
      case 'Rusak Ringan': return 'bg-yellow-900 text-yellow-200';
      case 'Rusak Berat': return 'bg-red-900 text-red-200';
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
        <h1 className="text-4xl font-black text-white mb-8">📦 Equipment Inventory</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Input Form */}
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-6 h-fit">
            <h2 className="text-lg font-bold text-white mb-6">Tambah Peralatan</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="text-gray-400 text-xs">Nama Peralatan</label>
                <input
                  type="text"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  placeholder="Nama peralatan"
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Kategori</label>
                <input
                  type="text"
                  value={newEquipment.category}
                  onChange={(e) => setNewEquipment({...newEquipment, category: e.target.value})}
                  placeholder="Audio, Lighting, Display..."
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Jumlah</label>
                <input
                  type="number"
                  value={newEquipment.quantity}
                  onChange={(e) => setNewEquipment({...newEquipment, quantity: Number(e.target.value)})}
                  placeholder="0"
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs">Kondisi</label>
                <select
                  value={newEquipment.condition}
                  onChange={(e) => setNewEquipment({...newEquipment, condition: e.target.value as any})}
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option>Baik</option>
                  <option>Rusak Ringan</option>
                  <option>Rusak Berat</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs">Perawatan Terakhir</label>
                <input
                  type="date"
                  value={newEquipment.lastMaintenance}
                  onChange={(e) => setNewEquipment({...newEquipment, lastMaintenance: e.target.value})}
                  className="w-full mt-1 px-2 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={addEquipment}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition rounded"
              >
                Tambah Peralatan
              </button>
            </div>
          </div>

          {/* Equipment List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Total Peralatan</p>
                <h3 className="text-3xl font-black text-white">{equipment.length}</h3>
              </div>
              <div className="bg-green-900 border border-green-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Total Item</p>
                <h3 className="text-3xl font-black text-white">{totalItems}</h3>
              </div>
              <div className="bg-purple-900 border border-purple-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Kategori</p>
                <h3 className="text-3xl font-black text-white">{categories.length}</h3>
              </div>
            </div>

            {/* Equipment Items */}
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Daftar Peralatan</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {equipment.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-900 border border-gray-800 rounded hover:border-gray-700 group">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-white font-bold">{item.name}</p>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-xs">
                          <div>
                            <p className="text-gray-400">Kategori</p>
                            <p className="text-blue-400">{item.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Stok</p>
                            <p className="text-green-400 font-bold">{item.quantity}x</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Kondisi</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1 ${getConditionColor(item.condition)}`}>
                              {item.condition}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeEquipment(item.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition rounded opacity-0 group-hover:opacity-100"
                      >
                        Hapus
                      </button>
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
