"use client";
import { useState } from 'react';

export default function CityGrid({ dispersion }: { dispersion: any }) {
  const grids = dispersion?.results || [];
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-gray-950/50">

      {/* 🧭 Interaction Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setIs3D(!is3D)}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${is3D
            ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
        >
          {is3D ? 'ISO_VIEW_ACTIVE' : 'PLANAR_VIEW'}
        </button>
      </div>

      {/* 📍 Spatial Grid Canvas */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{
            transform: is3D ? 'perspective(1200px) rotateX(45deg) rotateZ(-15deg) scale(0.9) translateY(-20px)' : 'none',
          }}
        >
          <div className="grid grid-cols-20 gap-[2px] p-6 bg-gray-900/30 rounded-xl border border-gray-800/50 shadow-2xl">
            {grids.map((g: any, idx: number) => {
              const intensity = Math.min(g.concentration / 100, 1);
              return (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-[1px] transition-all duration-300 group/cell relative cursor-crosshair"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${0.05 + intensity * 0.85})`,
                    transform: is3D ? `translateZ(${g.concentration * 0.4}px)` : 'none',
                    boxShadow: is3D && g.concentration > 40
                      ? `0 0 10px rgba(59, 130, 246, ${intensity * 0.3})`
                      : 'none'
                  }}
                >
                  {/* Vertical Plate (Isometric only) */}
                  {is3D && g.concentration > 10 && (
                    <div className="absolute inset-x-0 top-full bg-blue-500/10 pointer-events-none"
                      style={{ height: `${g.concentration * 0.4}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top' }} />
                  )}

                  {/* 🔬 Scientific Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 border border-gray-700 text-gray-100 rounded text-[9px] font-bold opacity-0 group-hover/cell:opacity-100 transition-all z-50 pointer-events-none whitespace-nowrap shadow-2xl translate-y-1 group-hover/cell:translate-y-0">
                    <span className="text-gray-500 mr-1">NODE_ID:</span> {g.grid_id}
                    <div className="text-blue-400">CONC: {g.concentration.toFixed(2)} g/s</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🛰️ Awaiting Simulation Feed */}
        {!dispersion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 backdrop-blur-[4px] z-10 transition-opacity">
            <div className="w-10 h-10 border border-gray-800 rounded-lg flex items-center justify-center shadow-lg bg-gray-900/50 mb-3 animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
              </svg>
            </div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Awaiting spatial feed...</p>
            <p className="text-[10px] text-gray-600 mt-1 uppercase tracking-tighter">Establishing secure environment link</p>
          </div>
        )}
      </div>

      {/* 📊 Resolution & Status Footer */}
      <div className="px-5 py-3 border-t border-gray-800/60 bg-gray-900/20 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase">
        <div className="flex items-center gap-4">
          <span className="tracking-widest">Resolution: Opt_High</span>
          <span className="text-gray-800">|</span>
          <span className="tabular-nums">{grids.length} ACTIVE_NODES</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-800 border border-gray-700" />
            <span className="tracking-tighter">Baseline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.6)]" />
            <span className="text-blue-500 tracking-tighter">Peak Intensity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
