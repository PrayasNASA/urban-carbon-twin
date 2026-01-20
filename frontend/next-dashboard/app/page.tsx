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
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      {/* SaaS Global Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm font-bold">
              U
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">UrbanCarbon</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                System Active
              </span>
              <span className="border-l border-slate-200 h-4" />
              <span className="text-slate-400">Region: South Asia Core</span>
            </div>
            <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              Sync Data
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Page Title Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Environmental Dashboard</h2>
          <p className="text-sm text-slate-500">Real-time carbon concentration monitoring and intervention planning.</p>
        </div>

        {/* Primary Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Controls - 4 cols */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Configuration</h3>
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`text-xs font-semibold px-3 py-1 rounded-md transition-all border ${compareMode ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  {compareMode ? 'Comparison Mode' : 'Single Mode'}
                </button>
              </div>
              <ScenarioPanel onRun={handleRun} loading={loading} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 shadow-sm">
                <div className="text-red-600 shrink-0 mt-0.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 leading-none">Simulation Error</p>
                  <p className="text-xs text-red-600 mt-1.5">{error}</p>
                </div>
              </div>
            )}

            <div className="card bg-slate-50 shadow-none border-dashed">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Technical Overview</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Sequestration modeling uses high-resolution spatial nodes combined with budget-constrained greedy optimization.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-200 border-dashed">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <span>Solver Type</span>
                  <span className="text-slate-600">Multi-Agent Greedy</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Visualization - 8 cols */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Spatial Distribution Map</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Dataset v2.4</span>
              </div>
              <div className="h-[500px] bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                <CityGrid dispersion={data?.dispersion} />
              </div>
            </div>

            <div className="card">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Optimization Analytics</h3>
                <p className="text-sm text-slate-500 mt-1">Output data from carbon mitigation algorithms.</p>
              </div>
              <ResultsPanel optimization={data?.optimization_plan} />
            </div>
          </section>
        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">© 2026 Urban Technical Analytics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Lat: 28.5355 | Lng: 77.3910</span>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-slate-600 cursor-pointer transition-colors">Security Portals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
