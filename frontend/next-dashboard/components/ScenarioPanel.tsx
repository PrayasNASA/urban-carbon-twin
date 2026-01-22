"use client";

import { useState } from "react";

export default function ScenarioPanel({
  onRun,
  loading,
  budget,
  setBudget,
  idealBudget
}: {
  onRun: (budget: number) => void;
  loading: boolean;
  budget: number;
  setBudget: (b: number) => void;
  idealBudget?: number;
}) {

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

        {/* Dynamic Status Indicator */}
        {idealBudget && (
          <div className="flex items-center gap-2 mb-1 justify-end">
            <span className="text-[9px] uppercase font-bold tracking-widest text-white/40">Required:</span>
            <span className={`text-[10px] font-bold tabular-nums ${budget >= idealBudget ? 'text-neon-emerald' : 'text-rose-400'}`}>
              ${idealBudget.toLocaleString()}
            </span>
          </div>
        )}

        <div className="relative pt-2 h-8 flex items-center">
          {/* Track Background */}
          <div className="absolute w-full h-1 bg-white/10 rounded-full overflow-hidden">
            {/* Required Budget Marker on Track */}
            {idealBudget && (
              <div
                className="absolute top-0 bottom-0 bg-rose-500/30 w-1 z-0"
                style={{ left: `${Math.min(100, (idealBudget / 100000) * 100)}%` }}
              />
            )}
          </div>

          <input
            type="range"
            min="5000"
            max="100000"
            step="1000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="relative w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer accent-neon-emerald hover:accent-emerald-400 transition-all z-10"
          />

          {/* Required Marker Warning Icon */}
          {idealBudget && (
            <div
              className="absolute top-[-8px] -ml-1.5 w-3 h-3 text-rose-500 pointer-events-none transition-all duration-500"
              style={{ left: `${Math.min(100, (idealBudget / 100000) * 100)}%`, opacity: budget >= idealBudget ? 0 : 1 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 16h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
            </div>
          )}

        </div>

        <div className="flex justify-between -mt-2 text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">
          <span>MIN_5K</span>
          {idealBudget && budget < idealBudget && <span className="text-rose-400 font-bold animate-pulse">UNDERFUNDED</span>}
          {idealBudget && budget >= idealBudget && <span className="text-neon-emerald font-bold">OPTIMIZED</span>}
          {!idealBudget && <span className="text-neon-emerald/30 underline decoration-dotted">LINEAR_SCALE</span>}

          <span>MAX_100K</span>
        </div>
      </div>

      {/* 💡 Intelligence Context Box */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden group">
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
        className={`w-fit py-3.5 px-8 rounded-xl font-bold text-[11px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-4 active:scale-[0.98] group ${loading
          ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
          : "bg-neon-emerald text-black hover:bg-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
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
