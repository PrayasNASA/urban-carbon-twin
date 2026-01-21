"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runScenario, compareScenarios } from "@/lib/api";
import CityGrid from "@/components/CityGrid";
import ScenarioPanel from "@/components/ScenarioPanel";
import ResultsPanel from "@/components/ResultsPanel";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [showDashboard, setShowDashboard] = useState(false);
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
    <main className="h-screen overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth grain-overlay">
      {/* 🌿 Section 1: Landing Page */}
      <section className="h-screen w-screen snap-start">
        <LandingPage onInitialize={() => { }} />
      </section>

      {/* 🚀 Section 2: Dashboard Engine */}
      <section className="min-h-screen w-screen snap-start bg-background text-gray-50 antialiased font-sans">
        {/* 🏛️ Solarpunk Header */}
        <header className="glass-panel border-b border-white/10 sticky top-0 z-50 mx-8 mt-6">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-neon-emerald shadow-[0_0_15px_#10B981]" />
                Urban Carbon <span className="text-neon-emerald">Twin</span>
              </h1>
              <p className="text-[11px] text-neon-emerald/60 font-bold uppercase tracking-[0.3em] mt-2">Solarpunk Intelligence Engine</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-tight text-emerald-500/40">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-emerald shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span>Network Online</span>
                </div>
                <span className="h-3 w-px bg-white/10" />
                <span className="text-emerald-500/60 font-mono tracking-widest">v4.0_NATURE_TECH</span>
              </div>
            </div>
          </div>
        </header>

        {/* 📊 Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-8 pb-12 flex flex-col gap-10">
          {/* Page Title Row */}
          <div className="flex items-baseline justify-between mt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Environmental Sequestration Metrics</h2>
            <div className="text-[11px] font-extrabold text-neon-emerald uppercase tracking-[0.2em] bg-neon-emerald/10 border border-neon-emerald/20 px-4 py-1.5 rounded-full backdrop-blur-md">
              Region: South Asia Core
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Parameters Sidebar */}
            <aside className="md:col-span-3 flex flex-col gap-8">
              <div className="glass-panel p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-extrabold text-emerald-500/60 uppercase tracking-[0.2em]">Scenario</h3>
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border uppercase tracking-widest transition-all ${compareMode ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    {compareMode ? 'MULTI_VIEW' : 'SINGLE_NODE'}
                  </button>
                </div>
                <ScenarioPanel onRun={handleRun} loading={loading} />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-soft-amber/10 border border-soft-amber/30 rounded-2xl p-6 flex gap-4"
                >
                  <div className="text-soft-amber shrink-0 mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-soft-amber uppercase tracking-tight">System Alert</p>
                    <p className="text-[12px] text-soft-amber/80 mt-2 leading-relaxed font-medium">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="glass-panel p-8 space-y-6">
                <h4 className="text-[11px] font-extrabold text-emerald-500/40 uppercase tracking-[0.2em]">Live Node Stats</h4>
                <div className="space-y-6 font-mono text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Resolution</span>
                    <span className="text-white/80">200m²_GRID</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Active Nodes</span>
                    <span className="text-white/80">400_ELMTS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Solver</span>
                    <span className="text-neon-emerald font-bold">UTX_v4.2</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Spatial Grid */}
            <section className="md:col-span-6 flex flex-col gap-8 h-full">
              <div className="glass-panel p-2 overflow-hidden h-full min-h-[600px] flex flex-col">
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Spatial Concentration Map</h3>
                    <p className="text-[11px] text-emerald-500/40 font-medium tracking-tight">Real-time topographic CO2 distribution</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold bg-neon-emerald/10 text-neon-emerald px-4 py-1.5 rounded-full border border-neon-emerald/20">
                    <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
                    <span>LIVE_DATA</span>
                  </div>
                </div>
                <div className="flex-1 bg-black/40 rounded-xl m-2 border border-white/5 overflow-hidden relative">
                  <CityGrid dispersion={data?.dispersion} />
                </div>
              </div>
            </section>

            {/* Metrics Feed */}
            <aside className="md:col-span-3 flex flex-col gap-8">
              <div className="glass-panel p-8 h-full min-h-[600px] flex flex-col">
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Deployment Metrics</h3>
                  <p className="text-[11px] text-emerald-500/40 font-medium tracking-tight mt-2">Resource allocation & efficiency</p>
                </div>
                <div className="flex-1 overflow-y-auto scrolling-content pr-2">
                  <ResultsPanel optimization={data?.optimization_plan} />
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Solarpunk Footer */}
        <footer className="mt-12 border-t border-white/5 py-12 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] text-neon-emerald font-bold tracking-[0.2em] uppercase">© 2026 Urban Carbon Twin • Earth-First Simulation</p>
              <p className="text-[10px] text-white/40 font-medium max-w-md">Bridging the gap between terrestrial environmental science and high-frequency urban planning tech.</p>
            </div>
            <div className="flex items-center gap-12 font-mono">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">System Entropy</span>
                <span className="text-[11px] font-bold text-neon-emerald">0.0042_LOW</span>
              </div>
              <div className="flex flex-col items-end border-l border-white/10 pl-12">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Block_Hash</span>
                <span className="text-[11px] font-bold text-white/50">0XNATURE_TECH_26</span>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </main>
  );
}
