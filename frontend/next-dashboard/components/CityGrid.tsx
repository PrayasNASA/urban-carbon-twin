"use client";
import { useState } from 'react';

export default function CityGrid({ dispersion }: { dispersion: any }) {
  const grids = dispersion?.results || [];
  const [is3D, setIs3D] = useState(false);

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-background/20 backdrop-blur-sm">

      {/* 🧭 Premium Interaction Controls */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => setIs3D(!is3D)}
          className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all border shadow-lg ${is3D
            ? 'bg-primary border-primary/50 text-white shadow-primary/20'
            : 'bg-surface border-white/10 text-text-muted hover:text-white hover:bg-surface-hover'
            }`}
        >
          {is3D ? 'ISO_VIEW_ENHANCED' : 'PLANAR_ORTHO'}
        </button>
      </div>

      {/* 📍 Cyber-Spatial Grid Canvas */}
      <div className="flex-1 relative">
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{
            transform: is3D ? 'perspective(1500px) rotateX(48deg) rotateZ(-12deg) scale(0.95) translateY(-30px)' : 'none',
          }}
        >
          <div className="grid grid-cols-20 gap-[3px] p-8 bg-white/[0.02] rounded-3xl border border-white/[0.05] shadow-2xl relative">
            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            {grids.map((g: any, idx: number) => {
              const intensity = Math.min(g.concentration / 100, 1);
              return (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-[2px] transition-all duration-500 group/cell relative cursor-crosshair"
                  style={{
                    backgroundColor: `rgba(168, 85, 247, ${0.05 + intensity * 0.9})`,
                    transform: is3D ? `translateZ(${g.concentration * 0.5}px)` : 'none',
                    boxShadow: g.concentration > 40
                      ? `0 0 15px rgba(168, 85, 247, ${intensity * 0.5})`
                      : 'none'
                  }}
                >
                  {/* Vertical Volumetric Plate (Isometric only) */}
                  {is3D && g.concentration > 10 && (
                    <div className="absolute inset-x-0 top-full bg-gradient-to-b from-primary/30 to-transparent pointer-events-none"
                      style={{ height: `${g.concentration * 0.5}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top' }} />
                  )}

                  {/* 🔬 Glass Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 bg-surface/90 backdrop-blur-md border border-white/10 text-white rounded-xl text-[10px] font-bold opacity-0 group-hover/cell:opacity-100 transition-all z-50 pointer-events-none whitespace-nowrap shadow-glass translate-y-1 group-hover/cell:translate-y-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>NODE_{g.grid_id}</span>
                    </div>
                    <div className="text-gray-400 font-medium">CONCENTRATION: <span className="text-white font-bold">{g.concentration.toFixed(2)} g/s</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🛰️ Awaiting Simulation Feed */}
        {!dispersion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md z-10 transition-opacity">
            <div className="w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center shadow-glass bg-surface mb-4 animate-pulse">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary opacity-60">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 12h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </div>
            <p className="text-[12px] font-bold text-white uppercase tracking-[.3em]">Establishing Spatial Feed</p>
            <p className="text-[10px] text-text-muted mt-2 font-bold uppercase tracking-widest">Awaiting authoritative node sync...</p>
          </div>
        )}
      </div>

      {/* 📊 Resolution & Status Footer */}
      <div className="px-8 py-5 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-[10px] font-bold text-text-muted uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-white/40">RESOLUTION //</span>
            <span className="text-white font-black">OPT_HIGH_PRECISION</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="tabular-nums"><span className="text-white">{grids.length}</span> ACTIVE_NODES</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-white/5 border border-white/10" />
            <span className="tracking-tighter">Baseline_Field</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-sm bg-primary shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
            <span className="text-primary tracking-tighter font-black underline decoration-primary/30 underline-offset-4">Mitigation_Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
