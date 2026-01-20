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
    <div className="min-h-screen flex flex-col">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-cyan/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-purple/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent-cyan rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.4)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
              Urban Carbon <span className="text-accent-cyan">Twin</span>
            </h1>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.3em]">Advanced Simulation Engine v1.0</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-foreground/30 uppercase font-bold tracking-widest">System Status</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-accent-cyan">OPERATIONAL</span>
              <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-foreground/30 uppercase font-bold tracking-widest">Current Region</span>
            <span className="text-xs font-bold">NEW DELHI, IN</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row p-4 md:p-8 gap-6 overflow-hidden">

        {/* Left Sidebar: Controls */}
        <aside className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
          <div className="glass-card p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Simulation Mode</h3>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border ${compareMode ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'bg-white/5 border-white/10 text-foreground/40'}`}
              >
                {compareMode ? 'COMPARISON ON' : 'SINGLE MODE'}
              </button>
            </div>
            <ScenarioPanel onRun={handleRun} loading={loading} />
          </div>

          {error && (
            <div className="glass-card border-red-500/20 bg-red-500/5 p-4 flex gap-3 animate-in fade-in slide-in-from-left-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-[11px] text-red-200/80 leading-relaxed">{error}</p>
            </div>
          )}

          {comparisonData && (
            <div className="glass-card p-6 border-accent-purple/20 bg-accent-purple/5 animate-in zoom-in-95">
              <h3 className="text-xs font-bold text-accent-purple uppercase tracking-wider mb-4">Comparison Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-foreground/40">Scenario A Impact</span>
                  <span className="text-white font-mono">{comparisonData.scenario_a.impact.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-foreground/40">Scenario B Impact</span>
                  <span className="text-white font-mono">{comparisonData.scenario_b.impact.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-white/5 text-[11px] text-accent-cyan italic">
                  {comparisonData.insight}
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-6 hidden lg:block">
            <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-4">Simulation Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground/40">Grid Dimensions</span>
                <span className="font-mono text-accent-cyan">20x20</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground/40">Time Steps</span>
                <span className="font-mono text-accent-cyan">5 Iterations</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-foreground/40">GIS Source</span>
                <span className="font-mono text-accent-cyan text-[10px]">OpenStreetMap-RT</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Visualization */}
        <section className="flex-1 flex flex-col min-w-0">
          <CityGrid dispersion={data?.dispersion} />
        </section>

        {/* Right Sidebar: Results */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <ResultsPanel optimization={data?.optimization_plan} />

          <div className="glass-card p-6 bg-accent-cyan/5 border-accent-cyan/10">
            <h3 className="text-[10px] font-bold text-accent-cyan uppercase tracking-[0.2em] mb-2">Technical Insight</h3>
            <p className="text-[11px] leading-relaxed text-foreground/60 italic">
              Using a graph-based greedy optimizer to solve the Knapsack-style intervention placement problem.
            </p>
          </div>
        </aside>


      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 px-8 py-2 flex items-center justify-between text-[9px] font-mono text-foreground/30">
        <div className="flex items-center gap-6">
          <span>COORD: 28.550N 77.190E</span>
          <span>SCALE: 1:5000</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
            API SYNC ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>© 2026 ANTIGRAVITY URBAN ANALYTICS</span>
          <span className="text-accent-cyan/40">SECURE_DYN_0X44</span>
        </div>
      </footer>
    </div>
  );
}
