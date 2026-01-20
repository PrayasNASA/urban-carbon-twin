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
    <div className="flex flex-col gap-10 w-full">

      {/* 🔮 Glowing Budget Control */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Allocation Reserve [USD]</label>
          <div className="text-xl font-bold text-white tabular-nums drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
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
            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary hover:accent-secondary transition-all"
          />
          <div className="flex justify-between mt-4 text-[9px] font-bold text-text-muted uppercase tracking-tighter">
            <span className="bg-white/5 px-2 py-0.5 rounded-md">Min_Cap: $5k</span>
            <span className="text-primary/60 font-black">SCALING_LINEAR</span>
            <span className="bg-white/5 px-2 py-0.5 rounded-md">Max_Cap: $100k</span>
          </div>
        </div>
      </div>

      {/* 💡 Intelligence Narrative */}
      <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl relative group overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-2xl rounded-full -mr-8 -mt-8" />
        <p className="text-[11px] text-gray-300 leading-relaxed font-medium relative">
          <span className="text-primary font-bold uppercase mr-2 tracking-widest">Advisory:</span>
          Budgets &gt; <span className="text-white font-bold">$50k</span> allow for multi-node agent synchronization, increasing net efficiency by <span className="text-emerald-400 font-bold">24.3%</span>.
        </p>
      </div>

      {/* 🚀 High-End Action Button */}
      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative overflow-hidden active:scale-[0.97] group ${loading
          ? "bg-white/5 text-text-muted cursor-not-allowed border border-white/10"
          : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40"
          }`}
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Engaging Engine...</span>
          </>
        ) : (
          <>
            <span>Initialize Simulation</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

    </div>
  );
}
