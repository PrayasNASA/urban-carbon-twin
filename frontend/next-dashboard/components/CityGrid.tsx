"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Map as MapIcon, Box, Hash } from 'lucide-react';

export default function CityGrid({ dispersion }: { dispersion: any }) {
  const grids = dispersion?.results || [];
  const [is3D, setIs3D] = useState(true);

  return (
    <div className="w-full h-full relative flex flex-col overflow-hidden bg-black/20">

      {/* 🧭 Interaction Controls */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        <button
          onClick={() => setIs3D(!is3D)}
          className={`glass px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 border ${is3D
            ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
            : 'border-white/10 text-emerald-100/40 hover:bg-white/5'
            }`}
        >
          {is3D ? <Box className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
          {is3D ? 'ISO_VIEW' : 'PLANAR'}
        </button>
      </div>

      {/* 📍 Spatial Grid Canvas */}
      <div className="flex-1 relative perspective-2000">
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-[0.16,1,0.3,1] transform-gpu"
          style={{
            transform: is3D
              ? 'perspective(1500px) rotateX(55deg) rotateZ(-25deg) scale(0.85) translateY(-40px)'
              : 'none',
          }}
        >
          {/* Base Topographic Grid */}
          <div className="grid grid-cols-20 gap-1 p-8 rounded-3xl border border-emerald-500/10 bg-emerald-950/20 relative shadow-2xl">
            {/* Grid Floor Glow */}
            <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

            {grids.map((g: any, idx: number) => {
              const intensity = Math.min(g.concentration / 100, 1);
              const height = g.concentration * 0.8;

              return (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-sm transition-all duration-500 group/cell relative cursor-crosshair transform-gpu"
                  style={{
                    backgroundColor: intensity > 0
                      ? `rgba(16, 185, 129, ${0.1 + intensity * 0.7})`
                      : 'rgba(255, 255, 255, 0.02)',
                    transform: is3D ? `translateZ(${height}px)` : 'none',
                    boxShadow: is3D && intensity > 0.4
                      ? `0 0 15px rgba(16, 185, 129, ${intensity * 0.4})`
                      : 'none'
                  }}
                >
                  {/* Vertical Extrusion Plates */}
                  {is3D && intensity > 0.1 && (
                    <>
                      {/* Front Plate */}
                      <div className="absolute inset-x-0 top-full bg-emerald-600/20 pointer-events-none border-t border-emerald-500/20"
                        style={{ height: `${height}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top' }} />
                      {/* Right Plate */}
                      <div className="absolute inset-y-0 left-full bg-emerald-800/20 pointer-events-none border-l border-emerald-500/20"
                        style={{ width: `${height}px`, transform: 'rotateY(90deg)', transformOrigin: 'left' }} />
                    </>
                  )}

                  {/* Top Face Highlight */}
                  {intensity > 0.7 && (
                    <div className="absolute inset-0 bg-emerald-300/30 blur-[2px] animate-pulse" />
                  )}

                  {/* 🔬 Holographic Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-2 glass border-emerald-500/30 text-emerald-50 rounded-xl text-[10px] font-bold opacity-0 group-hover/cell:opacity-100 transition-all z-50 pointer-events-none whitespace-nowrap shadow-2xl translate-y-2 group-hover/cell:translate-y-0 backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,1)]" />
                      <span className="text-emerald-500/60 font-black uppercase tracking-widest">Node {g.grid_id}</span>
                    </div>
                    <div className="text-white text-xs font-mono">CONC: {g.concentration.toFixed(2)} g/s</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 🛰️ Awaiting Simulation Feed */}
        {!dispersion && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-10 transition-opacity">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="w-16 h-16 border-2 border-emerald-500/10 border-t-emerald-400 rounded-full mb-6 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
            >
              <div className="w-12 h-12 border-2 border-emerald-500/5 border-b-emerald-400/40 rounded-full animate-spin-reverse" />
            </motion.div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-[0.4em] text-glow">Establishing spatial link</p>
            <p className="text-[10px] text-white/20 mt-3 font-bold uppercase tracking-[0.2em]">Awaiting Simulation Feed</p>
          </div>
        )}
      </div>

      {/* 📊 Resolution & Status Footer */}
      <div className="px-8 py-5 glass border-t border-emerald-500/10 flex justify-between items-center text-[10px] font-bold text-emerald-500/40 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-3 h-3 opacity-50" />
            <span>Resolution: OPT_HIGH</span>
          </div>
          <span className="h-3 w-px bg-emerald-500/10" />
          <span className="tabular-nums text-emerald-200/60 font-mono">{grids.length} Active Nodes</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />
            <span className="tracking-tighter font-black">Baseline</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="text-emerald-400 tracking-tighter">Peak Concentration</span>
          </div>
        </div>
      </div>
    </div>
  );
}
