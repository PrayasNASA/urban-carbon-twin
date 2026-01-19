"use client";
import { useState } from 'react';

export default function CityGrid({ dispersion }: { dispersion: any }) {
  const grids = dispersion?.results || [];

  // Helper to determine color intensity based on CO2 concentration
  const getIntensityColor = (val: number) => {
    // val is typically 0-50 range based on simulation defaults
    const opacity = Math.min(val / 40, 0.9);
    return `rgba(0, 242, 255, ${opacity})`; // Cyan glow for CO2
  };

  const [is3D, setIs3D] = useState(false);

  return (
    <div className="glass-card p-6 flex-1 flex flex-col gap-4 relative overflow-hidden">
      {/* Background Grid Lines for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: is3D ? 'perspective(1000px) rotateX(60deg) scale(2)' : 'none',
          transformOrigin: '50% 100%',
          transition: 'transform 0.8s ease'
        }}
      />

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-cyan/10 rounded-lg backdrop-blur-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">CO₂ Spatial Distribution</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* 3D Toggle */}
          <button
            onClick={() => setIs3D(!is3D)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all
                    ${is3D
                ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                : 'bg-white/5 border-white/10 text-foreground/60 hover:bg-white/10'
              }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l10 5-10 5L2 8l10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            {is3D ? '3D VIEW ON' : '2D FLAT'}
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/60">Live</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 scrolling-content overflow-hidden min-h-[400px] border border-white/5 rounded-xl bg-black/40 p-10 flex items-center justify-center perspective-1000">

        <div
          className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 transition-all duration-700 ease-out transform-style-3d
                ${is3D ? 'rotate-x-60 scale-90 translate-y-12' : 'rotate-x-0 scale-100'}
            `}
        >
          {grids.length > 0 ? (
            grids.map((g: any) => (
              <div
                key={g.grid_id}
                className={`aspect-square rounded-md border border-white/10 flex flex-col items-center justify-center transition-all duration-300 hover:scale-110 cursor-help group relative
                   ${is3D ? 'hover:translate-z-10 shadow-2xl' : 'hover:z-10'}
                `}
                style={{
                  background: getIntensityColor(g.concentration),
                  boxShadow: g.concentration > 20 ? `0 0 20px ${getIntensityColor(g.concentration)}` : 'none',
                  transform: is3D ? `translateZ(${g.concentration * 1.5}px)` : 'none'
                }}
              >
                {/* Vertical Bar for 3D effect */}
                {is3D && (
                  <div
                    className="absolute bottom-0 w-full bg-accent-cyan/30 border-x border-white/20"
                    style={{
                      height: `${g.concentration * 2}px`,
                      transform: 'rotateX(-90deg) translateY(100%)',
                      transformOrigin: 'bottom',
                      opacity: 0.5
                    }}
                  />
                )}

                <span className="text-[8px] font-bold text-black/80 group-hover:text-black z-10">
                  {g.concentration.toFixed(1)}
                </span>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 border border-white/10 rounded text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  Grid: <span className="text-accent-cyan">{g.grid_id}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-foreground/20 italic transform-style-3d">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-10 animate-bounce">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Start simulation to project carbon twin
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-foreground/40 font-mono">
        <span>GRID_RES: 200M x 200M</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-accent-cyan opacity-20" />
            <span>BASELINE</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-sm bg-accent-cyan opacity-80" />
            <span>CRITICAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
