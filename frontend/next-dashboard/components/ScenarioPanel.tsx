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
    <div className="glass-card p-6 flex flex-col gap-6 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-cyan/10 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight">Scenario Setup</h2>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-foreground/70">Simulation Budget</label>
          <span className="text-sm font-bold text-accent-cyan">${budget.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min="5000"
          max="100000"
          step="5000"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-accent-cyan transition-all hover:bg-white/10"
        />
        <div className="flex justify-between text-[10px] text-foreground/40 uppercase tracking-widest">
          <span>Low Impact</span>
          <span>High Impact</span>
        </div>
      </div>

      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${loading
            ? "bg-white/5 text-foreground/40 cursor-not-allowed"
            : "bg-accent-cyan text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Execute Twin
          </>
        )}
      </button>

      <div className="p-3 bg-white/5 rounded-lg border border-white/5">
        <p className="text-[11px] leading-relaxed text-foreground/60 italic">
          Optimize CO2 capture placement across 400+ city grids using budget-constrained greedy algorithms.
        </p>
      </div>
    </div>
  );
}
