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
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <label className="text-sm font-semibold text-slate-700">Project Budget (USD)</label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <span className="text-lg font-bold text-slate-900 w-24 text-right">
            ${budget.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-[11px] font-medium text-slate-400">
          <span>Min: $5,000</span>
          <span>Max: $100,000</span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-700 leading-relaxed">
          <span className="font-bold">Recommendation:</span> High-budget scenarios (&gt;$50k) allow for multi-layer sequestration strategies, improving efficiency by up to 24%.
        </p>
      </div>

      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${loading
          ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-sm"
          }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Analyzing Data...
          </>
        ) : (
          "Run Optimization Trace"
        )}
      </button>
    </div>
  );
}
