'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface StageElement {
  id: string;
  type: 'screen' | 'speaker' | 'light' | 'chair' | 'table';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export default function StageDesignGenerator() {
  const [elements, setElements] = useState<StageElement[]>([
    { id: '1', type: 'screen', x: 250, y: 50, width: 300, height: 200, rotation: 0 }
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nextId, setNextId] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = (type: StageElement['type']) => {
    const newElement: StageElement = {
      id: nextId.toString(),
      type,
      x: 100,
      y: 100,
      width: type === 'screen' ? 200 : 80,
      height: type === 'screen' ? 150 : 60,
      rotation: 0
    };
    setElements([...elements, newElement]);
    setNextId(nextId + 1);
  };

  const updateElement = (id: string, updates: Partial<StageElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedId(null);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = elements.find(el => el.id === id);
    if (!element) return;

    setSelectedId(id);
    setIsDragging(true);

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 80));
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 60));

    updateElement(selectedId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, selectedId, dragOffset]);

  const getElementColor = (type: string) => {
    switch(type) {
      case 'screen': return 'bg-blue-600';
      case 'speaker': return 'bg-yellow-600';
      case 'light': return 'bg-red-600';
      case 'chair': return 'bg-purple-600';
      case 'table': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getElementLabel = (type: string) => {
    switch(type) {
      case 'screen': return 'Layar';
      case 'speaker': return 'Speaker';
      case 'light': return 'Lampu';
      case 'chair': return 'Kursi';
      case 'table': return 'Meja';
      default: return 'Elemen';
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
        <h1 className="text-4xl font-black text-white mb-8">🎭 Stage Design Generator</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Elemen Panggung</h2>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => addElement('screen')}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition rounded"
                >
                  + Layar
                </button>
                <button
                  onClick={() => addElement('speaker')}
                  className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-sm transition rounded"
                >
                  + Speaker
                </button>
                <button
                  onClick={() => addElement('light')}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition rounded"
                >
                  + Lampu
                </button>
                <button
                  onClick={() => addElement('chair')}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition rounded"
                >
                  + Kursi
                </button>
                <button
                  onClick={() => addElement('table')}
                  className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition rounded"
                >
                  + Meja
                </button>
              </div>

              {selectedId && (
                <div className="bg-gray-900 border border-gray-600 rounded p-4">
                  <h3 className="text-sm font-bold text-white mb-4">Edit Element</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-gray-400">Posisi X</label>
                      <input
                        type="range"
                        min="0"
                        max="800"
                        value={elements.find(e => e.id === selectedId)?.x || 0}
                        onChange={(e) => updateElement(selectedId, { x: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400">Posisi Y</label>
                      <input
                        type="range"
                        min="0"
                        max="600"
                        value={elements.find(e => e.id === selectedId)?.y || 0}
                        onChange={(e) => updateElement(selectedId, { y: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400">Rotasi</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={elements.find(e => e.id === selectedId)?.rotation || 0}
                        onChange={(e) => updateElement(selectedId, { rotation: Number(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <button
                      onClick={() => deleteElement(selectedId)}
                      className="w-full mt-4 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition rounded"
                    >
                      Hapus Element
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-gray-950 border border-gray-700 rounded-lg p-8">
              <div 
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="bg-gray-900 border-2 border-gray-700 rounded w-full h-96 relative overflow-hidden cursor-move"
              >
                {/* Grid background */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
                    backgroundSize: '50px 50px'
                  }}
                />

                {/* Elements */}
                {elements.map((element) => (
                  <div
                    key={element.id}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                    className={`absolute transition ${getElementColor(element.type)} ${
                      selectedId === element.id ? 'ring-2 ring-white' : 'opacity-80 hover:opacity-100'
                    } user-select-none`}
                    style={{
                      left: `${element.x}px`,
                      top: `${element.y}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      transform: `rotate(${element.rotation}deg)`,
                      zIndex: selectedId === element.id ? 10 : 5,
                      cursor: 'grab'
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-xs text-white font-bold text-center p-1">
                      {getElementLabel(element.type)}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs mt-4">Drag element untuk memindahkan, gunakan slider untuk edit rotasi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
