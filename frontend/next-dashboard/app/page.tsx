"use client";

import { useState } from "react";
import { runScenario, compareScenarios } from "@/lib/api";
import CityGrid from "@/components/CityGrid";
import ScenarioPanel from "@/components/ScenarioPanel";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  async function handleRun(budget: number) {
    setLoading(true);
    setError(null);
    setComparisonData(null);
    try {
      if (compareMode) {
        const result = await compareScenarios(budget, budget * 2);
        if (result.error) {
          setError(`Comparison Error: ${result.error}`);
          setComparisonData(null);
        } else {
          setComparisonData(result);
        }
      } else {
        const result = await runScenario(budget);
        if (result.optimization_plan?.error) {
          setError(`Backend Error: ${result.optimization_plan.error}`);
          setData(null);
        } else {
          setData(result);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the Digital Twin API.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 selection:bg-blue-500/30 selection:text-blue-200 antialiased font-sans">

      {/* 🏛️ Professional Compact Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-gray-100 tracking-tight leading-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Urban Carbon Twin
            </h1>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest mt-1">Advanced Simulation Engine</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-tight text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span>System Active</span>
              </div>
              <span className="h-3 w-px bg-gray-800" />
              <span className="text-gray-400">South Asia Core</span>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors border border-gray-700">
              Force Sync
            </button>
          </div>
        </div>
      </header>

      {/* 📊 Main Simulation Grid */}
      <main className="max-w-7xl mx-auto p-6 flex flex-col gap-6">

        {/* Page Context Row */}
        <div className="flex items-baseline justify-between">
          <h2 className="page-title">Regional Carbon Sequestration Modeling</h2>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-900 border border-gray-800 px-3 py-1 rounded-full">
            Dataset: v2.43_STABLE
          </div>
        </div>

        {/* 🗺️ Primary Dashboard Layout: col-span-12 (3-6-3) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">

          {/* 🎚️ Scenario Setup Index - 3 cols */}
          <aside className="md:col-span-3 flex flex-col gap-6">
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Scenario Parameters</h3>
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider transition-all ${compareMode ? 'bg-blue-900/40 border-blue-800 text-blue-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                >
                  {compareMode ? 'COMP_ON' : 'SINGLE'}
                </button>
              </div>
              <ScenarioPanel onRun={handleRun} loading={loading} />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex gap-3 animate-in slide-in-from-top-2">
                <div className="text-red-500 shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-red-200 uppercase tracking-tight">System Alert</p>
                  <p className="text-[11px] text-red-300/80 mt-1 leading-relaxed font-medium">{error}</p>
                </div>
              </div>
            )}

            <div className="card space-y-4 bg-gray-900/50 border-dashed">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Node Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center group/metric">
                  <span className="text-[11px] font-medium text-gray-500">Spatial Resolution</span>
                  <span className="text-[11px] font-bold text-gray-300">200m²</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-gray-500">Node Population</span>
                  <span className="text-[11px] font-bold text-gray-300">400 Elements</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-gray-500">Mitigation Solver</span>
                  <span className="text-[11px] font-bold text-blue-400 bg-blue-900/20 px-1.5 rounded">G_v4</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 📈 CO₂ Spatial Component - 6 cols */}
          <section className="md:col-span-6 flex flex-col gap-6">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="section-title !mb-0">Spatial Concentration Gradient</h3>
                  <p className="text-[10px] text-gray-500 font-medium tracking-tight">Real-time simulation output feed</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold bg-gray-800 px-3 py-1 rounded">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>LIVE FEED</span>
                </div>
              </div>
              <div className="h-[540px] bg-gray-950/50 rounded-lg border border-gray-800 shadow-inner overflow-hidden relative">
                <CityGrid dispersion={data?.dispersion} />
              </div>
            </div>
          </section>

          {/* 📊 Optimization Analysis - 3 cols */}
          <aside className="md:col-span-3 flex flex-col gap-6">
            <div className="card min-h-[644px] flex flex-col">
              <div className="mb-6">
                <h3 className="section-title !mb-0">Deployment Metrics</h3>
                <p className="text-[10px] text-gray-500 font-medium tracking-tight mt-1">Optimization plan constraints</p>
              </div>
              <ResultsPanel optimization={data?.optimization_plan} />
            </div>
          </aside>

        </div>
      </main>

      {/* 💼 Corporate Analytics Footer */}
      <footer className="mt-12 border-t border-gray-900 py-8 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-gray-500 font-bold tracking-tight">© 2026 URBAN TECHNICAL SYSTEMS • ENGINE_v4.2</p>
            <p className="text-[9px] text-gray-600 font-medium">Authoritative simulation feed for government planning and research.</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Global Status</span>
              <span className="text-[10px] font-bold text-emerald-500 tracking-tighter tabular-nums">SECURE_LINK_ENCRYPTED</span>
            </div>
            <div className="flex flex-col items-end border-l border-gray-900 pl-8">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Deployment Hash</span>
              <span className="text-[10px] font-bold text-gray-400 font-mono tracking-tighter uppercase">0x4F92E_UTX</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
