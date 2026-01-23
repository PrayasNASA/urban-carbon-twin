"use client";
import { useState, useMemo, useEffect } from 'react';


export default function CityGrid({ dispersion, mapImage }: { dispersion: any; mapImage?: string }) {
  const grids = dispersion?.results || [];
  const [mounted, setMounted] = useState(false);
  const [is3D, setIs3D] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random particles for CO2 density visual
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      xOffset: (Math.random() - 0.5) * 50
    }));
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">

      {/* 🧭 Interaction Controls */}
      <div className="absolute top-6 right-6 z-30 flex gap-3">
        <button
          onClick={() => setIs3D(!is3D)}
          className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 ${is3D
            ? 'bg-white text-black shadow-lg'
            : 'bg-black/20 text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md border border-white/5'
            }`}
        >
          {is3D ? '3D View' : '2D Map'}
        </button>
      </div>

      {/* 📍 Spatial Grid Canvas */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div
          className="relative transition-all duration-1000 ease-out"
          style={{
            transform: is3D ? 'perspective(2000px) rotateX(45deg) rotateZ(0deg) scale(0.85)' : 'none',
          }}
        >


          {/* Main Grid Container */}
          <div className={`grid grid-cols-20 gap-1 p-2 transition-all duration-500 ${!is3D ? 'bg-black/20 rounded-xl border border-white/5 shadow-inner' : ''}`}>
            {grids.map((g: any, idx: number) => {
              const val = g.concentration;

              // 🎨 "Beautiful" High-End Palette
              // We use a continuous-feeling set of vibrant, "cosmic" data colors

              let bgStyle;
              let glowColor;
              let borderColor;

              if (val >= 75) {
                // High: Red / Rose (Danger)
                // Using a sophisticated, deep red/rose instead of harsh #FF0000
                bgStyle = `rgba(225, 29, 72, ${0.5 + (val / 100) * 0.4})`; // Rose-600
                glowColor = 'rgba(225, 29, 72, 0.6)';
                borderColor = 'rgba(225, 29, 72, 0.4)';
              } else if (val >= 40) {
                // Med: Amber / Orange (Warning)
                bgStyle = `rgba(245, 158, 11, ${0.5 + (val / 100) * 0.4})`; // Amber-500
                glowColor = 'rgba(245, 158, 11, 0.6)';
                borderColor = 'rgba(245, 158, 11, 0.4)';
              } else {
                // Low: Emerald / Green (Safe)
                bgStyle = `rgba(16, 185, 129, ${0.4 + (val / 100) * 0.3})`; // Emerald-500
                glowColor = 'rgba(16, 185, 129, 0.5)';
                borderColor = 'rgba(16, 185, 129, 0.3)';
              }

              return (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-[3px] transition-all duration-500 group/cell relative"
                  style={{
                    backgroundColor: bgStyle,
                    border: `1px solid ${borderColor}`,
                    transform: is3D ? `translateZ(${val * 0.8}px)` : 'none',
                    boxShadow: is3D ? `0 0 15px ${glowColor}` : 'none' // Always glow a bit for beauty
                  }}
                >
                  {/* 3D Pillars */}
                  {is3D && val > 10 && (
                    <div className="absolute inset-0 pointer-events-none mix-blend-screen"
                      style={{
                        transform: `translateZ(-${val * 0.8}px)`,
                        height: `${val * 0.8}px`,
                        backgroundColor: glowColor,
                        opacity: 0.15
                      }}
                    />
                  )}

                  {/* Minimal Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-black/90 text-white rounded-md shadow-2xl opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-[100px] border border-white/10 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">Reading</span>
                      <div className="text-xs font-bold tabular-nums text-white">{val.toFixed(1)} PPM</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Loading State - Minimalist */}
        {!dispersion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin mb-4" />
            <span className="text-xs font-medium text-white/40 tracking-widest uppercase">Calibrating Sensors</span>
          </div>
        )}
      </div>

      {/* 📊 Refined Footer */}
      <div className="px-8 py-5 border-t border-white/5 bg-black/20 flex justify-between items-center text-xs text-white/60 font-medium">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Resolution</span>
            <span>High-Fidelity Grid</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-white/30 uppercase tracking-wider">Active Nodes</span>
            <span>{grids.length > 0 ? grids.length : 'OFFLINE'}</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Safe</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Caution</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-[0_0_10px_#e11d48] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Hazardous</span>
          </div>
        </div>
      </div>
    </div>
  );
}
