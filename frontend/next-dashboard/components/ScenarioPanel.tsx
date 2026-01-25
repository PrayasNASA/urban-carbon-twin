"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const PolicySandbox = dynamic(() => import("./PolicySandbox"), { ssr: false });

export default function ScenarioPanel({
  onRun,
  loading,
  budget,
  setBudget,
  idealBudget,
  onSimulate
}: {
  onRun: (budget: number) => void;
  loading: boolean;
  budget: number;
  setBudget: (b: number) => void;
  idealBudget?: number;
  onSimulate?: () => void;
  onSimulate?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'capital' | 'policy'>('capital');
  const [policyImpact, setPolicyImpact] = useState(0);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
        <button
          onClick={() => setActiveTab('capital')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'capital' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
        >
          Capital Allocation
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${activeTab === 'policy' ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'text-white/40 hover:text-white'}`}
        >
          Policy Sandbox
        </button>
      </div>

      {activeTab === 'capital' ? (
        <>
          {/* 🎚️ Connected Capital Control */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Global Capital Allocation</label>
              <div className="text-5xl font-light text-white tabular-nums tracking-tighter leading-none">
                <span className="text-neon-emerald/40 mr-1">$</span>{budget.toLocaleString()}
              </div>
            </div>

            {/* Dynamic Status Indicator */}
            {idealBudget && (
              <div className="flex items-center gap-2 -mt-3 justify-end">
                <span className="text-[9px] uppercase font-black tracking-[0.15em] text-white/20">Target Required</span>
                <span className={`text-[11px] font-black tabular-nums transition-colors duration-500 ${budget >= idealBudget ? 'text-neon-emerald' : 'text-rose-500'}`}>
                  ${idealBudget.toLocaleString()}
                </span>
              </div>
            )}

            <div className="relative h-12 flex items-center">
              {/* Track Background */}
              <div className="absolute w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-neon-emerald/40 transition-all duration-500 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${(budget / 500000) * 100}%` }} />

                {/* Required Budget Marker on Track */}
                {idealBudget && (
                  <div
                    className="absolute top-0 bottom-0 bg-rose-500/30 w-0.5 z-10"
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
                className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] pointer-events-none transition-all duration-150 ease-out border-[3px] border-white/50"
                style={{ left: `calc(${(budget / 500000) * 100}% - 12px)` }}
              >
                <div className="absolute inset-0 m-auto w-2 h-2 bg-black rounded-full shadow-inner" />
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

            <div className="flex justify-between -mt-2 text-[9px] font-black text-white/10 uppercase tracking-[0.25em]">
              <span>$5K</span>
              {idealBudget && budget < idealBudget && <span className="text-rose-500/60 animate-pulse">Insufficient Capital</span>}
              {idealBudget && budget >= idealBudget && <span className="text-neon-emerald/60">Optimized</span>}
              <span>$500K</span>
            </div>
          </div>

          {/* 💡 Intelligence Context Box */}
          <div className="p-6 premium-blur border border-white/5 rounded-2xl relative overflow-hidden group hover:border-neon-emerald/20 transition-all duration-500">
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-emerald/50 shadow-[0_0_15px_#10B981]" />
            <p className="text-[12px] text-white/60 leading-relaxed font-medium">
              <span className="text-neon-emerald font-black uppercase mr-3 tracking-[0.2em] text-[10px] bg-neon-emerald/10 px-2 py-0.5 rounded">Insight</span>
              Deployments exceeding <span className="text-white font-bold">$50K</span> activate regional swarm agents, increasing capture efficiency by <span className="text-neon-emerald font-black">24.3%</span>.
            </p>
          </div>

          {/* ⚡ Primary Execution CTA */}
          <button
            onClick={() => onRun(budget)}
            disabled={loading}
            className={`w-full py-5 px-10 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-5 active:scale-[0.97] shadow-2xl group ${loading
              ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              : "bg-white text-black hover:shadow-[0_20px_40px_rgba(255,255,255,0.15)] hover:scale-[1.01] relative overflow-hidden"
              }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/10 border-t-black rounded-full animate-spin" />
                <span className="font-bold tracking-widest">Processing Entity...</span>
              </>
            ) : (
              <>
                <span className="relative z-10 transition-transform group-hover:translate-x-[-4px]">Begin Simulation</span>
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white transition-transform group-hover:translate-x-4 relative z-10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M5 12h14m-7-7l7 7-7 7" />
                  </svg>
                </div>
              </>
            )}
          </>
        )}
        </button>
    </>
  ) : (
    <PolicySandbox onUpdateImpact={setPolicyImpact} />
  )
}

{/* Global Impact Summary (Always Visible if Policy Active) */ }
{
  policyImpact > 0 && (
    <div className="mt-[-10px] p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">BigQuery Projection</span>
      <span className="text-sm font-bold text-white">-{policyImpact.toFixed(1)}% CO₂</span>
    </div>
  )
}

    </div >
  );
}
