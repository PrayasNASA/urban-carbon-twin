"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runScenario, compareScenarios } from "@/lib/api";
import CityGrid from "@/components/CityGrid";
import ScenarioPanel from "@/components/ScenarioPanel";
import ResultsPanel from "@/components/ResultsPanel";
import LandingPage from "@/components/LandingPage";
import { Activity, Shield, Hash, RefreshCcw, Layout, Zap, AlertCircle } from "lucide-react";

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
    <div className="min-h-screen text-emerald-50 selection:bg-emerald-500/30 selection:text-emerald-200 antialiased font-sans">
      <AnimatePresence mode="wait">
        {!showDashboard ? (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <LandingPage onStart={() => setShowDashboard(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col"
          >
            {/* 🏛️ Solarpunk Glass Header */}
            <header className="glass sticky top-0 z-50 border-b border-emerald-500/10 mb-6 mx-6 mt-4 rounded-2xl">
              <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-white tracking-tight leading-none flex items-center gap-2">
                      Urban Carbon Twin
                    </h1>
                    <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-[0.2em] mt-1.5">Simulation Engine v4.2</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-tight text-emerald-500/40">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" />
                      <span className="text-emerald-400/80">System Active</span>
                    </div>
                    <span className="h-4 w-px bg-emerald-500/10" />
                    <div className="flex items-center gap-2">
                      <Layout className="w-3.5 h-3.5" />
                      <span>South Asia Core</span>
                    </div>
                  </div>

                  <button className="glass hover:bg-emerald-500/10 text-emerald-400 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-emerald-500/20 flex items-center gap-2 group">
                    <RefreshCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    Force Sync
                  </button>
                </div>
              </div>
            </header>

            {/* 📊 Main Simulation Grid */}
            <main className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-8 pb-12">

              {/* Page Context Row */}
              <div className="flex items-end justify-between px-2">
                <div className="space-y-2">
                  <h2 className="page-title">Regional Carbon Sequestration Modeling</h2>
                  <p className="text-emerald-100/40 text-sm font-medium">Real-time optimization of urban greenery interventions</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest glass px-4 py-2 rounded-full border-emerald-500/10">
                  <Hash className="w-3 h-3" />
                  Dataset: v2.43_STABLE
                </div>
              </div>

              {/* 🗺️ Primary Dashboard Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Sidebar - 3 cols */}
                <aside className="lg:col-span-3 flex flex-col gap-8">
                  <div className="card space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="section-title !mb-0">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        Scenario setup
                      </h3>
                      <button
                        onClick={() => setCompareMode(!compareMode)}
                        className={`text-[9px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider transition-all ${compareMode ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-emerald-100/40'}`}
                      >
                        {compareMode ? 'COMP_ON' : 'SINGLE'}
                      </button>
                    </div>
                    <ScenarioPanel onRun={handleRun} loading={loading} />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex gap-4 backdrop-blur-md"
                    >
                      <div className="text-amber-500 shrink-0 mt-0.5">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">System Alert</p>
                        <p className="text-[11px] text-amber-200/60 mt-1.5 leading-relaxed font-semibold">{error}</p>
                      </div>
                    </motion.div>
                  )}

                  <div className="card space-y-5 bg-white/[0.02] border-dashed border-emerald-500/20">
                    <h4 className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.2em]">Node Metrics</h4>
                    <div className="space-y-4">
                      {[
                        { label: 'Spatial Resolution', value: '200m²' },
                        { label: 'Node Population', value: '400 Elements' },
                        { label: 'Mitigation Solver', value: 'G_v4', special: true },
                      ].map((metric) => (
                        <div key={metric.label} className="flex justify-between items-center px-1">
                          <span className="text-[11px] font-semibold text-emerald-100/30">{metric.label}</span>
                          <span className={`text-[11px] font-bold ${metric.special ? 'text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md' : 'text-emerald-100/80'}`}>
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Center Map Component - 6 cols */}
                <section className="lg:col-span-6 flex flex-col gap-8">
                  <div className="card overflow-hidden !p-0">
                    <div className="p-6 flex items-center justify-between border-b border-emerald-500/10">
                      <div>
                        <h3 className="section-title !mb-0">Spatial Concentration Gradient</h3>
                        <p className="text-[10px] text-emerald-500/40 font-bold uppercase tracking-widest mt-1.5">Simulated Output Feed</p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-bold glass px-4 py-2 rounded-full border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-emerald-400">RESEARCH_MODE_ACTIVE</span>
                      </div>
                    </div>
                    <div className="h-[580px] bg-black/40 relative group">
                      <CityGrid dispersion={data?.dispersion} />
                    </div>
                  </div>
                </section>

                {/* Right Optimization Panel - 3 cols */}
                <aside className="lg:col-span-3 flex flex-col gap-8">
                  <div className="card min-h-[644px] flex flex-col">
                    <div className="mb-8">
                      <h3 className="section-title !mb-0">Deployment Metrics</h3>
                      <p className="text-[10px] text-emerald-500/40 font-bold uppercase tracking-widest mt-1.5">Optimization Constraints</p>
                    </div>
                    <ResultsPanel optimization={data?.optimization_plan} />
                  </div>
                </aside>

              </div>
            </main>

            {/* 💼 Solarpunk Analytics Footer */}
            <footer className="mt-auto border-t border-emerald-500/5 py-12 px-12 bg-black/20 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] text-emerald-500/40 font-bold tracking-[0.4em] uppercase">© 2026 URBAN TECHNICAL SYSTEMS • ENGINE_V4.2</p>
                  <p className="text-xs text-emerald-100/20 font-medium">Authoritative carbon simulation feed for government planning and research.</p>
                </div>
                <div className="flex items-center gap-12">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-emerald-500/20 uppercase tracking-[0.3em] mb-1">Global Status</span>
                    <span className="text-[10px] font-bold text-emerald-400 tracking-tighter tabular-nums flex items-center gap-2">
                      <Shield className="w-3 h-3 text-emerald-500/50" />
                      SECURE_LINK_ENCRYPTED
                    </span>
                  </div>
                  <div className="flex flex-col items-end border-l border-emerald-500/10 pl-12">
                    <span className="text-[9px] font-bold text-emerald-500/20 uppercase tracking-[0.3em] mb-1">Deployment Hash</span>
                    <span className="text-[10px] font-bold text-emerald-100/40 font-mono tracking-tighter uppercase">0x4F92E_UTX</span>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
