"use client";
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CityGrid({ dispersion }: { dispersion: any }) {
  const grids = dispersion?.results || [];
  const [mounted, setMounted] = useState(false);
  const [is3D, setIs3D] = useState(true);

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
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-black/20 backdrop-blur-sm">

      {/* 🧭 Interaction Controls */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => setIs3D(!is3D)}
          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${is3D
            ? 'bg-neon-emerald border-neon-emerald text-black shadow-[0_0_15px_#10B981]'
            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
        >
          {is3D ? 'TOPOGRAPHIC_ACTIVE' : 'PLANAR_SCAN'}
        </button>
      </div>

      {/* 📍 Spatial Grid Canvas */}
      <div className="flex-1 relative flex items-center justify-center">
        <div
          className="relative transition-all duration-1000 ease-in-out"
          style={{
            transform: is3D ? 'perspective(2000px) rotateX(55deg) rotateZ(-25deg) scale(0.9) translateY(0)' : 'none',
          }}
        >
          <div className="grid grid-cols-20 gap-1 p-8 bg-neon-emerald/5 rounded-2xl border border-neon-emerald/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            {grids.map((g: any, idx: number) => {
              const intensity = Math.min(g.concentration / 100, 1);
              return (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-[2px] transition-all duration-500 group/cell relative cursor-crosshair"
                  style={{
                    backgroundColor: `rgba(16, 185, 129, ${0.1 + intensity * 0.8})`,
                    transform: is3D ? `translateZ(${g.concentration * 1.5}px)` : 'none',
                    boxShadow: is3D && g.concentration > 30
                      ? `0 0 15px rgba(16, 185, 129, ${intensity * 0.4})`
                      : 'none'
                  }}
                >
                  {/* 3D Pillars for Topography */}
                  {is3D && g.concentration > 5 && (
                    <>
                      <div className="absolute inset-x-0 top-full bg-emerald-500/10 border-b border-emerald-500/20 pointer-events-none"
                        style={{ height: `${g.concentration * 1.5}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top' }} />
                      <div className="absolute inset-y-0 left-full bg-emerald-500/5 border-r border-emerald-500/10 pointer-events-none text-transparent"
                        style={{ width: `${g.concentration * 1.5}px`, transform: 'rotateY(90deg)', transformOrigin: 'left' }} />
                    </>
                  )}

                  {/* 🔬 Holographic Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 bg-black/80 border border-neon-emerald/30 text-white rounded-lg text-[10px] font-mono opacity-0 group-hover/cell:opacity-100 transition-all z-50 pointer-events-none whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md">
                    <span className="text-neon-emerald underline mb-1 block">NODE_{g.grid_id}</span>
                    <div className="text-white/90">CONCENTRATION: <span className="text-neon-emerald font-bold">{g.concentration.toFixed(2)}</span> PPM</div>
                    <div className="text-white/40 text-[8px] mt-1">LAT: 12.9716, LNG: 77.5946</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Neon Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {mounted && particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                  y: [-20, -100],
                  x: [0, p.xOffset]
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute rounded-full bg-neon-emerald blur-[1px] shadow-[0_0_8px_#10B981]"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size
                }}
              />
            ))}
          </div>
        </div>

        {/* 🛰️ Awaiting Simulation Feed */}
        {!dispersion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050C09]/60 backdrop-blur-md z-10 transition-opacity">
            <div className="w-16 h-16 border-2 border-neon-emerald/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.1)] bg-black/40 mb-6 group">
              <div className="w-8 h-8 rounded-full border-2 border-neon-emerald border-t-transparent animate-spin" />
            </div>
            <p className="text-[12px] font-bold text-neon-emerald uppercase tracking-[0.3em] animate-pulse">Scanning Biosphere...</p>
            <p className="text-[10px] text-white/30 mt-2 uppercase tracking-widest">Awaiting spatial concentration data stream</p>
          </div>
        )}
      </div>

      {/* 📊 Resolution & Status Footer */}
      <div className="px-8 py-4 border-t border-white/5 bg-black/40 backdrop-blur-md flex justify-between items-center text-[10px] font-bold text-white/40 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="text-neon-emerald/60">Sensing Mode: Ultra_Precision</span>
          <span className="h-3 w-px bg-white/10" />
          <span className="font-mono">{grids.length} Active_Nodes</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full border border-white/20" />
            <span>Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-emerald shadow-[0_0_10px_#10B981]" />
            <span className="text-white/80">Anomaly Peak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
