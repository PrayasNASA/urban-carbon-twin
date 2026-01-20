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
    <div className="min-h-screen flex flex-col scanline relative overflow-hidden selection:bg-accent-cyan/30">
      {/* Cinematic Background Elements */}
      <div className="scan-effect" />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-accent-cyan/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent-purple/5 blur-[150px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* High-Tech Header */}
      <header className="relative z-20 border-b border-white/5 bg-black/40 backdrop-blur-xl px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent-cyan">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 font-header uppercase">
              Urban <span className="text-accent-cyan">Twin</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-foreground/40 font-mono tracking-[0.3em] font-bold">SIMULATION_CORE_01</span>
              <div className="h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_var(--accent-cyan)] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-8 text-[10px] font-mono tracking-wider">
            <div className="flex flex-col gap-1">
              <span className="text-foreground/30 uppercase">Uptime</span>
              <span className="text-accent-cyan font-bold">99.98%</span>
            </div>
            <div className="flex flex-col gap-1 border-l border-white/10 pl-8">
              <span className="text-foreground/30 uppercase">Traffic Load</span>
              <span className="text-foreground/80 font-bold">OPTIMAL</span>
            </div>
          </div>

          <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/10 hover:border-accent-cyan/30 transition-all active:scale-95 flex items-center gap-3 group">
            <div className="w-2 h-2 rounded-full bg-accent-purple" />
            Sync Status
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:rotate-180 transition-transform duration-500">
              <path d="M21 2v6h-6M3 22v-6h6M21 13a9 9 0 1 1-3-7.7L21 8" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row p-8 gap-10 overflow-hidden">

        {/* Left Sidebar: Controls */}
        <aside className="w-full lg:w-[400px] flex flex-col gap-10 shrink-0">
          <div className="flex flex-col gap-8">
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] font-mono">Simulation Mode</h3>
                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-bold transition-all border tracking-widest ${compareMode ? 'bg-accent-purple/20 border-accent-purple text-accent-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]' : 'bg-white/5 border-white/10 text-foreground/40'}`}
                >
                  {compareMode ? 'COMPARISON_ON' : 'SINGLE_NODE'}
                </button>
              </div>
              <ScenarioPanel onRun={handleRun} loading={loading} />
            </div>

            {error && (
              <div className="glass-card border-red-500/20 bg-red-500/5 p-5 flex gap-4 animate-in fade-in slide-in-from-left-4">
                <div className="p-2 bg-red-500/10 rounded-lg h-fit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">System_Error</p>
                  <p className="text-[11px] text-red-200/60 font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div className="glass-card p-6 bg-accent-cyan/2 border-accent-cyan/10">
              <h3 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan pointer-events-none" />
                System_Constraints
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-foreground/40 font-bold uppercase tracking-tight">Grid_Density</span>
                  <span className="text-foreground/80 font-black">400_Nodes</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/5 pt-3">
                  <span className="text-foreground/40 font-bold uppercase tracking-tight">Solver_Mode</span>
                  <span className="text-accent-cyan font-black uppercase">Multi-Agent_Greedy</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Main Visualization Grid */}
        <section className="flex-1 flex flex-col min-w-0">
          <CityGrid dispersion={data?.dispersion} />
        </section>

        {/* Right Sidebar: Live Analytics */}
        <aside className="w-full lg:w-[450px] flex flex-col min-w-0">
          <ResultsPanel
            optimization={data?.optimization_plan}
          />

          <div className="glass-card p-6 mt-6 bg-accent-cyan/2 border-accent-cyan/10">
            <h3 className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em] mb-3">Technical Insight</h3>
            <p className="text-[11px] leading-relaxed text-foreground/50 font-medium italic">
              Proactive carbon sequestration modeling using high-resolution spatial data and budget-optimized resource allocation.
            </p>
          </div>
        </aside>

      </main>

      {/* Cybernetic Footer */}
      <footer className="relative z-20 border-t border-white/5 bg-black/60 backdrop-blur-md px-10 py-3 flex items-center justify-between font-mono text-[10px] tracking-widest">
        <div className="flex items-center gap-8 text-foreground/30">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
            <span className="text-foreground/60">NODE_STATUS: ACTIVE</span>
          </div>
          <span className="hidden sm:inline border-l border-white/10 pl-8 uppercase">Region: South Asia Core</span>
          <span className="hidden md:inline border-l border-white/10 pl-8 uppercase">Auth: Dynamic_Twin_0X9F</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-accent-cyan/10 border border-accent-cyan/20 rounded-md text-accent-cyan font-bold transition-all hover:bg-accent-cyan/20 cursor-default">
            LAT: 28.5355 | LNG: 77.3910
          </div>
          <span className="text-foreground/20 italic font-sans font-medium text-[9px] uppercase hidden lg:block">Antigravity Urban Analytics © 2026</span>
        </div>
      </footer>
    </div>
  );
}
