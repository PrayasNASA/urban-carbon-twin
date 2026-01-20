"use client";
import { useState } from 'react';

export default function CityGrid({ dispersion }: { dispersion: any }) {
  const grids = dispersion?.results || [];
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden">
      {/* Interaction Controls */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <button
          onClick={() => setIs3D(!is3D)}
          className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all shadow-sm border ${is3D
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
        >
          {is3D ? 'View Flat' : 'View Isometric'}
        </button>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{
            transform: is3D ? 'perspective(1200px) rotateX(45deg) rotateZ(-15deg) scale(0.9) translateY(-20px)' : 'none',
          }}
        >
          <div className="grid grid-cols-20 gap-0.5 p-4">
            {grids.map((g: any, idx: number) => (
              <div
                key={idx}
                className="w-4 h-4 rounded-sm transition-all duration-300 group/cell relative"
                style={{
                  backgroundColor: `rgba(37, 99, 235, ${Math.min(g.concentration / 100, 0.9)})`,
                  transform: is3D ? `translateZ(${g.concentration * 0.5}px)` : 'none',
                  boxShadow: is3D ? '0 4px 8px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                {/* Simplified Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white rounded text-[9px] opacity-0 group-hover/cell:opacity-100 transition-opacity z-50 pointer-events-none whitespace-nowrap">
                  Conc: {g.concentration.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State Overlay */}
        {!dispersion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[2px] z-10">
            <div className="w-12 h-12 text-slate-300 mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-400">No Dispersion Data Available</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Run simulation to visualize results</p>
          </div>
        )}
      </div>

      {/* Resolution Indicator */}
      <div className="p-4 border-t border-slate-100 bg-white/50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
        <span>Resolution Score: 0.94</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-100 border border-slate-200" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span>High Density</span>
          </div>
        </div>
      </div>
    </div>
  );
}
