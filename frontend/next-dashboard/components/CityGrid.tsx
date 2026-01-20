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
    <div className="glass-card p-8 flex-1 flex flex-col gap-6 relative overflow-hidden group/grid">
      {/* Background Grid Lines for depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(var(--accent-cyan) 1px, transparent 1px),
            linear-gradient(90deg, var(--accent-cyan) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: is3D ? 'perspective(1200px) rotateX(60deg) scale(2.5) translateY(50px)' : 'none',
          transformOrigin: '50% 100%',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-cyan/10 rounded-xl backdrop-blur-md border border-accent-cyan/20 animate-pulse">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white font-header uppercase group-hover/grid:text-accent-cyan transition-colors">
              Spatial <span className="text-accent-cyan/80">Intelligence</span>
            </h2>
            <p className="text-[10px] text-foreground/40 font-mono tracking-widest mt-0.5">CO2_DISTRIBUTION_MAP_PROJECTION</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIs3D(!is3D)}
            className={`flex items-center gap-3 px-5 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500
                    ${is3D
                ? 'bg-accent-cyan/20 border-accent-cyan text-accent-cyan shadow-[0_0_20px_rgba(0,242,255,0.4)]'
                : 'bg-white/5 border-white/10 text-foreground/50 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${is3D ? 'rotate-12 scale-110' : ''} transition-transform duration-500`}>
              <path d="M12 3l10 5-10 5L2 8l10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            {is3D ? '3D Active' : '2D Plane'}
          </button>
        </div>
      </div>

      <div className="relative flex-1 scrolling-content overflow-hidden min-h-[450px] border border-white/5 rounded-2xl bg-black/60 p-12 flex items-center justify-center perspective-1000 shadow-inner">
        {/* Coordinate System Labels */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-20 text-[9px] font-mono text-accent-cyan/30 uppercase tracking-tighter [writing-mode:vertical-lr] rotate-180">
          <span>Northing_Reference</span>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-20 text-[9px] font-mono text-accent-cyan/30 uppercase tracking-tighter">
          <span>Easting_Vector_X</span>
        </div>

        <div
          className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2.5 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform-style-3d
                ${is3D ? 'rotate-x-60 scale-95 translate-y-20' : 'rotate-x-0 scale-100'}
            `}
        >
          {grids.length > 0 ? (
            grids.map((g: any) => (
              <div
                key={g.grid_id}
                className={`aspect-square rounded-lg border border-white/5 flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.15] cursor-crosshair group/cell relative
                   ${is3D ? 'hover:translate-z-20' : 'hover:z-10'}
                `}
                style={{
                  background: getIntensityColor(g.concentration),
                  boxShadow: g.concentration > 15 ? `0 0 30px -5px ${getIntensityColor(g.concentration)}` : 'none',
                  transform: is3D ? `translateZ(${g.concentration * 2.5}px)` : 'none'
                }}
              >
                {/* 3D Vertical Extrusion Sides */}
                {is3D && g.concentration > 0 && (
                  <>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-accent-cyan/20 to-transparent border-x border-white/10"
                      style={{
                        height: `${g.concentration * 3}px`,
                        transform: 'rotateX(-90deg)',
                        transformOrigin: 'bottom',
                        opacity: 0.4
                      }}
                    />
                  </>
                )}

                <div className="absolute -inset-[1px] rounded-lg border border-accent-cyan/0 group-hover/cell:border-accent-cyan/50 transition-all duration-500 shadow-[inset_0_0_10px_rgba(0,242,255,0)] group-hover/cell:shadow-[inset_0_0_10px_rgba(0,242,255,0.2)]" />

                <span className="text-[9px] font-mono font-black text-black/90 group-hover/cell:text-black z-10 transition-colors">
                  {Math.round(g.concentration)}
                </span>

                {/* Cyber Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-black/95 border border-accent-cyan/30 rounded-lg text-[10px] whitespace-nowrap opacity-0 group-hover/cell:opacity-100 transition-all duration-300 translate-y-2 group-hover/cell:translate-y-0 pointer-events-none z-50 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                    ID: <span className="text-accent-cyan font-bold">{g.grid_id}</span>
                  </div>
                  <div className="mt-1 text-foreground/40 font-mono text-[8px] uppercase">Concentration: {g.concentration.toFixed(2)} units</div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-80 flex flex-col items-center justify-center text-foreground/10 italic font-header tracking-[0.2em]">
              <div className="relative mb-8">
                <div className="absolute -inset-8 bg-accent-cyan/5 blur-3xl animate-pulse rounded-full" />
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-20 animate-spin-slow">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <p className="animate-pulse">PR0JECTION_SYSTEM_READY</p>
              <p className="text-[9px] mt-2 font-mono">WAITING_FOR_DATA_PACKETS...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] text-foreground/30 font-mono uppercase tracking-[0.1em]">
        <div className="flex items-center gap-6">
          <span>Resolution: 200m²</span>
          <span className="hidden sm:inline">Sensor_Sync: 12ms</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-accent-cyan/20 rounded-full" />
            <span>Nominal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-1 bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)] rounded-full" />
            <span>Peak_Emission</span>
          </div>
        </div>
      </div>
    </div>
  );
}
