'use client';

import { useState } from 'react';
import Link from 'next/link';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
}

export default function BudgetCalculator() {
  const [items, setItems] = useState<BudgetItem[]>([
    { id: '1', category: 'Venue', description: 'Sewa Venue', amount: 5000000 },
    { id: '2', category: 'Sound', description: 'Sound System Rental', amount: 3000000 },
    { id: '3', category: 'Lighting', description: 'Lighting Equipment', amount: 2000000 }
  ]);
  const [newItem, setNewItem] = useState({ category: '', description: '', amount: 0 });

  const addItem = () => {
    if (newItem.category && newItem.description && newItem.amount > 0) {
      setItems([...items, { id: Date.now().toString(), ...newItem }]);
      setNewItem({ category: '', description: '', amount: 0 });
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const categories = Array.from(new Set(items.map(i => i.category)));
  const categoryTotals = categories.map(cat => ({
    category: cat,
    total: items.filter(i => i.category === cat).reduce((sum, i) => sum + i.amount, 0)
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
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
        <h1 className="text-4xl font-black text-white mb-8">💰 Event Budget Calculator</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Tambah Item Budget</h2>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Kategori</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  placeholder="Venue, Sound, Lighting..."
                  className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Deskripsi</label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Contoh: Sewa Venue"
                  className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Jumlah (IDR)</label>
                <input
                  type="number"
                  value={newItem.amount}
                  onChange={(e) => setNewItem({...newItem, amount: Number(e.target.value)})}
                  placeholder="0"
                  className="w-full mt-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={addItem}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition rounded"
              >
                Tambah Item
              </button>
            </div>
          </div>

          {/* Summary & Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total */}
            <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
              <p className="text-gray-300 text-sm">Total Budget</p>
              <h3 className="text-4xl font-black text-white">{formatCurrency(total)}</h3>
            </div>

            {/* Category Breakdown */}
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Breakdown per Kategori</h2>
              <div className="space-y-2">
                {categoryTotals.map((cat) => (
                  <div key={cat.category} className="flex justify-between items-center p-3 bg-gray-900 rounded">
                    <span className="text-gray-300">{cat.category}</span>
                    <span className="text-white font-bold">{formatCurrency(cat.total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Items */}
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Detail Item</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-900 rounded border border-gray-800 hover:border-gray-700 group">
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{item.description}</p>
                      <p className="text-gray-400 text-xs">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">{formatCurrency(item.amount)}</span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition rounded opacity-0 group-hover:opacity-100"
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
