'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Settings {
  id?: number;
  site_title: string;
  site_description: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  seo_keywords: string;
  social_media: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('admin_token') || '';
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('Failed to save settings');
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Memuat...</div>;
  if (err) return <div className="p-8 text-red-600">Error: {err}</div>;
  if (!settings) return <div className="p-8">Tidak ada data pengaturan</div>;

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pengaturan Situs</h1>
        <p className="text-gray-600 dark:text-gray-400">Kelola konfigurasi global website</p>
      </div>

      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded">
          ✓ Pengaturan berhasil disimpan
        </div>
      )}

      <div className="space-y-6">
        {/* Site Title */}
        <div>
          <label className="block text-sm font-bold mb-2">Judul Situs</label>
          <input
            type="text"
            value={settings.site_title}
            onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
          />
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-bold mb-2">Deskripsi Situs</label>
          <textarea
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
          />
        </div>

        {/* SEO Keywords */}
        <div>
          <label className="block text-sm font-bold mb-2">SEO Keywords</label>
          <input
            type="text"
            value={settings.seo_keywords}
            onChange={(e) => setSettings({ ...settings, seo_keywords: e.target.value })}
            placeholder="Pisahkan dengan koma"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
          />
        </div>

        {/* Maintenance Mode */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="w-5 h-5"
            />
            <span className="font-bold">Mode Pemeliharaan Aktif</span>
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Ketika diaktifkan, pengunjung akan melihat halaman pemeliharaan
          </p>

          {settings.maintenance_mode && (
            <div className="mt-4">
              <label className="block text-sm font-bold mb-2">Pesan Pemeliharaan</label>
              <textarea
                value={settings.maintenance_message}
                onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
            </div>
          )}
        </div>

        {/* Social Media */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
          <h3 className="font-bold mb-4">Media Sosial</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold mb-1">Instagram</label>
              <input
                type="url"
                value={settings.social_media?.instagram || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_media: { ...settings.social_media, instagram: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Facebook</label>
              <input
                type="url"
                value={settings.social_media?.facebook || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_media: { ...settings.social_media, facebook: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Twitter/X</label>
              <input
                type="url"
                value={settings.social_media?.twitter || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  social_media: { ...settings.social_media, twitter: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-black dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '💾 Menyimpan...' : '💾 Simpan Pengaturan'}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            ← Kembali
          </button>
        </div>
      </div>
    </div>
  );
}
