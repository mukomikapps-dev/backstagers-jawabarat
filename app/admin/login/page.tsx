'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error('Password salah');
      }

      const data = await res.json();
      localStorage.setItem('adminToken', data.token);
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full border-2 border-black">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Admin</h1>
          <p className="text-gray-600">Backstagers CMS</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black font-semibold mb-2">Password Admin</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Masukkan password"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded border-l-4 border-red-500">
              <p className="font-semibold">Login Gagal</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 font-semibold transition"
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk ke Admin'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
          <p className="text-sm text-gray-700">
            <strong>Password Default:</strong>
          </p>
          <code className="bg-white px-3 py-2 rounded border border-blue-200 text-blue-600 font-mono font-bold text-center block mt-2">
            admin123
          </code>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Ganti password di file .env.local untuk keamanan lebih baik
        </p>
      </div>
    </div>
  );
}
