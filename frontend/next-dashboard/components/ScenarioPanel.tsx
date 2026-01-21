"use client";

import { useState } from "react";

export default function ScenarioPanel({
  onRun,
  loading,
}: {
  onRun: (budget: number) => void;
  loading: boolean;
}) {
  const [budget, setBudget] = useState(25000);

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* 🎚️ Solarpunk Budget Control */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Global Capital [USD]</label>
          <div className="text-2xl font-bold text-neon-emerald tabular-nums drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            ${budget.toLocaleString()}
          </div>
        </div>

        <div className="relative pt-2">
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-emerald hover:accent-emerald-400 transition-all"
          />
          <div className="flex justify-between mt-4 text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">
            <span>MIN_5K</span>
            <span className="text-neon-emerald/30 underline decoration-dotted">LINEAR_SCALE</span>
            <span>MAX_100K</span>
          </div>
        </div>
      </div>

      {/* 💡 Intelligence Context Box */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon-emerald/40" />
        <p className="text-[11px] text-white/70 leading-relaxed font-medium transition-colors group-hover:text-white">
          <span className="text-neon-emerald font-bold uppercase mr-2 tracking-tighter">[ADVISORY]</span>
          Deployments exceeding <span className="text-neon-emerald">$50K</span> activate regional swarm agents, increasing capture efficiency by <span className="font-bold underline">24.3%</span>.
        </p>
      </div>

      {/* ⚡ Primary Execution CTA */}
      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-full py-6 px-10 rounded-full font-bold text-[12px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-5 active:scale-[0.97] group ${loading
          ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
          : "bg-neon-emerald text-black hover:bg-white shadow-[0_0_25px_rgba(16,185,129,0.5)]"
          }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <span className="italic">Running Sequence...</span>
          </>
        ) : (
          <>
            <span>Initialize Simulation</span>
            <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-neon-emerald/10 transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </div>
          </>
        )}
      </button>

    </div>
  );
}
