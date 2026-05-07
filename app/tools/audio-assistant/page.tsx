'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AudioTechAssistant() {
  const [decibelValue, setDecibelValue] = useState(85);
  const [frequency, setFrequency] = useState(1000);
  const [speakers, setSpeakers] = useState(4);
  const [distance, setDistance] = useState(20);

  // Decibel reference guide
  const decibelGuide = [
    { name: 'Tanda bisik', db: 10 },
    { name: 'Percakapan normal', db: 60 },
    { name: 'Ruang perkantoran', db: 70 },
    { name: 'Pabrik', db: 90 },
    { name: 'Pesawat terbang', db: 140 }
  ];

  // Speaker calculation
  const calculateSoundPressure = () => {
    // Simplified SPL calculation
    const baseSPL = 94; // 1W/1m reference
    const speakerGain = 10 * Math.log10(speakers);
    const distanceAtten = 20 * Math.log10(distance);
    return (baseSPL + speakerGain - distanceAtten).toFixed(1);
  };

  // Frequency response guide
  const frequencyGuide = [
    { range: '20-60 Hz', name: 'Bass/Sub Bass', use: 'Kick drum, bass guitar' },
    { range: '60-250 Hz', name: 'Bass', use: 'Bass, snare, toms' },
    { range: '250 Hz-4 kHz', name: 'Midrange', use: 'Vocal utama, instrumen' },
    { range: '4-20 kHz', name: 'Treble', use: 'Detail, kejernihan' }
  ];

  const getFrequencyName = (freq: number) => {
    if (freq < 60) return 'Sub Bass (20-60 Hz)';
    if (freq < 250) return 'Bass (60-250 Hz)';
    if (freq < 4000) return 'Midrange (250 Hz-4 kHz)';
    return 'Treble (4-20 kHz)';
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
        <h1 className="text-4xl font-black text-white mb-8">🔊 Audio Tech Assistant</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Decibel Guide */}
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-black text-white mb-6">📊 Panduan Decibel</h2>
            
            <div className="mb-8">
              <label className="text-gray-400 mb-3 block">Pengatur Decibel: <span className="text-blue-400 font-bold">{decibelValue} dB</span></label>
              <input
                type="range"
                min="0"
                max="140"
                value={decibelValue}
                onChange={(e) => setDecibelValue(Number(e.target.value))}
                className="w-full"
              />
              <div className="mt-4 p-4 bg-gradient-to-r from-green-900 to-red-900 rounded">
                <p className="text-white font-bold">
                  {decibelValue < 50 ? '🟢 Aman' : decibelValue < 85 ? '🟡 Sedang' : decibelValue < 110 ? '🔴 Keras' : '🚨 Sangat Keras'}
                </p>
                <p className="text-gray-300 text-xs mt-1">Durasi maksimal paparan: {decibelValue < 85 ? '8+ jam' : decibelValue < 100 ? '2-4 jam' : '< 1 jam'}</p>
              </div>
            </div>

            <div className="space-y-2">
              {decibelGuide.map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-900 rounded border border-gray-800 flex justify-between items-center">
                  <span className="text-white">{item.name}</span>
                  <span className={`px-3 py-1 rounded font-bold text-xs ${
                    Math.abs(decibelValue - item.db) < 10 
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}>
                    {item.db} dB
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Speaker Calculator */}
          <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-black text-white mb-6">🔉 Kalkulator Speaker</h2>

            <div className="space-y-6">
              <div>
                <label className="text-gray-400 mb-2 block text-sm">Jumlah Speaker: <span className="text-green-400 font-bold">{speakers}x</span></label>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={speakers}
                  onChange={(e) => setSpeakers(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-gray-400 mb-2 block text-sm">Jarak dari penonton (meter): <span className="text-blue-400 font-bold">{distance}m</span></label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="5"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <p className="text-gray-300 text-xs">Perkiraan SPL (Sound Pressure Level)</p>
                <h3 className="text-3xl font-black text-white">{calculateSoundPressure()} dB</h3>
                <p className="text-gray-400 text-xs mt-2">Dengan {speakers}x speaker di jarak {distance}m</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-700 rounded-lg p-4">
                <p className="text-white font-bold mb-2">Rekomendasi:</p>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Untuk acara indoor: 85-95 dB</li>
                  <li>• Untuk festival outdoor: 95-105 dB</li>
                  <li>• Gunakan protection: > 85 dB</li>
                  <li>• Bass perlu 3-6x lebih banyak power</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Frequency Guide */}
        <div className="mt-8 bg-gray-950 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-black text-white mb-6">🎵 Panduan Frekuensi</h2>

          <div className="mb-6">
            <label className="text-gray-400 mb-3 block text-sm">Frekuensi: <span className="text-yellow-400 font-bold">{frequency} Hz</span> - {getFrequencyName(frequency)}</label>
            <input
              type="range"
              min="20"
              max="20000"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {frequencyGuide.map((guide, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-white font-bold mb-2">{guide.range}</p>
                <p className="text-blue-400 font-bold text-sm mb-2">{guide.name}</p>
                <p className="text-gray-400 text-xs">{guide.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-900 to-emerald-900 border border-green-700 rounded-lg p-6">
          <h2 className="text-2xl font-black text-white mb-4">💡 Tips Setup Audio</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-green-300 font-bold mb-2">Acoustic Treatment</h3>
              <p className="text-gray-300 text-sm">Gunakan acoustic panel untuk mengurangi reverb dan refleksi dinding</p>
            </div>
            <div>
              <h3 className="text-green-300 font-bold mb-2">Speaker Placement</h3>
              <p className="text-gray-300 text-sm">Posisikan speaker di tengah panggung, minimal 2x tinggi panggung dari lantai</p>
            </div>
            <div>
              <h3 className="text-green-300 font-bold mb-2">Monitoring Mix</h3>
              <p className="text-gray-300 text-sm">Gunakan personal monitor untuk artis, terpisah dari main mix</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
