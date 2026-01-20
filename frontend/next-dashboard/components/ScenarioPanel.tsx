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

      {/* 🎚️ Scientific Budget Control */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Budget [USD]</label>
          <div className="text-lg font-bold text-white tabular-nums">
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
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
          />
          <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
            <span>Limit_Min: $5k</span>
            <span className="text-gray-500">Scale: Linear</span>
            <span>Limit_Max: $100k</span>
          </div>
        </div>
      </div>

      {/* 💡 Intelligence Context Box */}
      <div className="p-4 bg-gray-800/40 border border-gray-800 rounded-xl">
        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
          <span className="text-blue-400 font-bold uppercase mr-1">Advisory:</span>
          Budgets &gt;$50k enable multi-agent swarm deployment, increasing sequestration precision by an estimated 24.3%.
        </p>
      </div>

      {/* ⚡ Primary Execution CTA */}
      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-full py-4 px-6 rounded-xl font-bold text-[11px] uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${loading
          ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
          : "bg-gray-50 text-gray-950 hover:bg-white shadow-lg shadow-black/20"
          }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Execute Simulation</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </>
        )}
      </button>

    </div>
  );
}
