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
    <div className="glass-card p-8 flex flex-col gap-8 w-full">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-accent-purple/10 rounded-xl border border-accent-purple/20">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight font-header uppercase group-hover:text-accent-purple transition-all">Command <span className="text-accent-purple/80">Input</span></h2>
          <p className="text-[9px] font-mono text-foreground/30 tracking-widest uppercase">BUDGET_ALLOCATION_MATRIX</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Simulation Budget</label>
          <span className="text-2xl font-black text-accent-cyan font-header tracking-tight">${budget.toLocaleString()}</span>
        </div>

        <div className="relative pt-2">
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-accent-cyan transition-all hover:bg-white/10"
          />
          <div className="flex justify-between mt-3 text-[9px] font-mono text-foreground/20 uppercase tracking-tighter">
            <span>Minimum_Threshold</span>
            <span>Max_Operating_Limit</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-full py-5 rounded-xl font-black text-xs tracking-[0.3em] uppercase transition-all duration-500 flex items-center justify-center gap-4 group/btn relative overflow-hidden ${loading
          ? "bg-white/5 text-foreground/20 cursor-not-allowed border border-white/5"
          : "bg-black border border-accent-cyan/40 text-accent-cyan hover:border-accent-cyan hover:shadow-[0_0_30px_rgba(0,242,255,0.2)] active:scale-95"
          }`}
      >
        {!loading && <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />}

        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="animate-pulse">Processing_Matrix...</span>
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-125 transition-transform duration-500">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Execute Twin
          </>
        )}
      </button>

      <div className="p-4 bg-accent-cyan/5 rounded-xl border border-accent-cyan/10 relative group">
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
          </svg>
        </div>
        <p className="text-[10px] leading-relaxed text-foreground/60 font-medium">
          <span className="text-accent-cyan font-bold block mb-1 uppercase tracking-widest text-[8px]">Simulation Engine Insight:</span>
          Utilizing budget-constrained greedy optimization across 400+ nodes to achieve maximal carbon reduction.
        </p>
      </div>
    </div>
  );
}
