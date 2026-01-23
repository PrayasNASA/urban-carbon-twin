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

      {/* 🎚️ Connected Capital Control */}
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <label className="text-xs font-medium text-white/50 tracking-wider uppercase">Global Capital Allocation</label>
          <div className="text-3xl font-light text-white tabular-nums tracking-tight">
            ${budget.toLocaleString()}
          </div>
        </div>

        {/* Dynamic Status Indicator */}
        {idealBudget && (
          <div className="flex items-center gap-2 -mt-2 justify-end">
            <span className="text-[10px] uppercase font-medium tracking-wider text-white/30">Target Required</span>
            <span className={`text-xs font-bold tabular-nums ${budget >= idealBudget ? 'text-teal-400' : 'text-rose-400'}`}>
              ${idealBudget.toLocaleString()}
            </span>
          </div>
        )}

        <div className="relative h-12 flex items-center">
          {/* Track Background */}
          <div className="absolute w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all duration-300" style={{ width: `${(budget / 500000) * 100}%` }} />

            {/* Required Budget Marker on Track */}
            {idealBudget && (
              <div
                className="absolute top-0 bottom-0 bg-rose-500/50 w-0.5 z-10"
                style={{ left: `${Math.min(100, (idealBudget / 500000) * 100)}%` }}
              />
            )}
          </div>

          <input
            type="range"
            min="5000"
            max="500000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="relative w-full h-12 bg-transparent appearance-none cursor-pointer z-20 opacity-0"
          />

          {/* Custom Thumb */}
          <div
            className="absolute h-5 w-5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] pointer-events-none transition-all duration-75 ease-out border-2 border-white/50"
            style={{ left: `calc(${(budget / 500000) * 100}% - 10px)` }}
          >
            <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-black rounded-full" />
          </div>

          {/* Required Marker Warning Icon */}
          {idealBudget && (
            <div
              className={`absolute top-[-12px] -ml-2 text-rose-500 pointer-events-none transition-all duration-500 transform ${budget >= idealBudget ? 'opacity-0 translate-y-2' : 'opacity-100'}`}
              style={{ left: `${Math.min(100, (idealBudget / 500000) * 100)}%` }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm1 16h-2v-2h2v2zm0-4h-2v-4h2v4z" /></svg>
            </div>
          )}
        </div>

        <div className="flex justify-between -mt-2 text-[10px] font-medium text-white/20 uppercase tracking-widest">
          <span>$5K</span>
          {idealBudget && budget < idealBudget && <span className="text-rose-400 font-bold tracking-widest animate-pulse">Insufficient Capital</span>}
          {idealBudget && budget >= idealBudget && <span className="text-teal-400 font-bold tracking-widest">Optimized</span>}
          <span>$500K</span>
        </div>
      </div>

      {/* 💡 Intelligence Context Box */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:bg-white/10 transition-colors">
        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50" />
        <p className="text-xs text-white/70 leading-relaxed font-normal">
          <span className="text-teal-400 font-bold uppercase mr-2 tracking-wider text-[10px]">Insight</span>
          Deployments exceeding <span className="text-white font-medium">$50K</span> activate regional swarm agents, increasing capture efficiency by <span className="text-teal-400 font-bold">24.3%</span>.
        </p>
      </div>

      {/* ⚡ Primary Execution CTA */}
      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`w-fit py-4 px-10 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 active:scale-[0.98] shadow-xl ${loading
          ? "bg-white/10 text-white/20 cursor-not-allowed"
          : "bg-white text-black hover:bg-gray-100 hover:shadow-2xl hover:scale-[1.02]"
          }`}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            <span className="italic normal-case tracking-normal opacity-70">Processing...</span>
          </>
        ) : (
          <>
            <span>Initialize Simulation</span>
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </div>
          </>
        )}
      </button>

    </div>
  );
}
