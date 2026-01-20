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
    <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">

      {/* 🔮 Premium Glass Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-surface backdrop-blur-3xl border-r border-card-border z-50 hidden xl:flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">UrbanTwin®</span>
            <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Simulation Core</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { name: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z', active: true },
            { name: 'Emissions', icon: 'M13 10V3L4 14h7v7l9-11h-7z', active: false },
            { name: 'Mitigation', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', active: false },
            { name: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', active: false },
          ].map((item) => (
            <button key={item.name} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-white/5 text-white' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-sm font-bold tracking-tight">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto card !p-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <p className="text-[10px] font-bold text-primary uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold">Optimizing Core_v4</span>
          </div>
          <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase transition-colors">View Logs</button>
        </div>
      </aside>

      {/* 🚀 Main Content Shell */}
      <div className="flex-1 xl:ml-64 flex flex-col min-h-screen">

        {/* ☁️ Floating Glass Header */}
        <header className="sticky top-0 z-40 bg-background/50 backdrop-blur-md border-b border-card-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="xl:hidden w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Active Simulation</h2>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Regional / South Asia</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex bg-surface px-4 py-2 rounded-xl border border-card-border gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Budget_Avail</span>
                <span className="text-xs font-bold text-white tabular-nums">$2.4M</span>
              </div>
              <div className="w-px h-6 bg-card-border" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Nodes_Sync</span>
                <span className="text-xs font-bold text-emerald-400 tabular-nums">400/400</span>
              </div>
            </div>

            <button className="p-2.5 rounded-xl bg-surface border border-card-border text-text-muted hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 8v4M12 16h.01" /></svg>
            </button>
            <div className="w-10 h-10 rounded-xl border-2 border-primary/20 p-0.5">
              <div className="w-full h-full rounded-[9px] bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20" />
            </div>
          </div>
        </header>

        {/* 📊 Main Scrollable Dashboard */}
        <main className="p-8 flex flex-col gap-10">

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold tracking-widest uppercase">Analytics_Live</span>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">TS_09:57:09</span>
            </div>
            <h1 className="page-title text-4xl">Carbon Optimization <span className="text-primary tracking-tighter">Control Center</span></h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* ⚙️ Control & Filters */}
            <aside className="lg:col-span-3 flex flex-col gap-8 animate-slide-up [animation-delay:100ms]">
              <div className="card space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="label-sm">Budget Engine</h3>
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`text-[9px] font-bold px-3 py-1 rounded-lg border uppercase tracking-wider transition-all shadow-sm ${compareMode ? 'bg-primary/20 border-primary/50 text-white' : 'bg-white/5 border-white/10 text-text-muted'}`}
                  >
                    {compareMode ? 'Comparison_On' : 'Single_Trace'}
                  </button>
                </div>
                <ScenarioPanel onRun={handleRun} loading={loading} />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-4 animate-in slide-in-from-top-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Incident Report</p>
                    <p className="text-[11px] text-red-200/70 font-medium leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="label-sm px-2">System Constraints</h4>
                {[
                  { label: 'Spatial Res', value: '200m²', progress: 85 },
                  { label: 'Compute Load', value: 'G_v4_Auto', progress: 42 },
                  { label: 'Reliability', value: '99.9%', progress: 99 },
                ].map((stat) => (
                  <div key={stat.label} className="card !p-4 group">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] font-bold text-text-muted uppercase tracking-tighter">{stat.label}</span>
                      <span className="text-[11px] font-bold text-white mb-0.5">{stat.value}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000" style={{ width: `${stat.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* 🌍 Spatial Hub */}
            <section className="lg:col-span-6 flex flex-col gap-8 animate-slide-up [animation-delay:200ms]">
              <div className="card overflow-hidden !p-0 flex flex-col min-h-[600px] border-primary/10 shadow-primary/5">
                <div className="p-6 border-b border-card-border flex items-center justify-between">
                  <div>
                    <h3 className="section-title !mb-1 text-lg">Dynamic Distribution Matrix</h3>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest tracking-tighter">Interactive GIS Sequestration Field</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-bold tracking-widest uppercase">Live_Sync</span>
                  </div>
                </div>
                <div className="flex-1 relative bg-black/20">
                  <CityGrid dispersion={data?.dispersion} />
                </div>
              </div>
            </section>

            {/* 📈 Outcome Analytics */}
            <aside className="lg:col-span-3 flex flex-col gap-8 animate-slide-up [animation-delay:300ms]">
              <div className="card !p-0 flex flex-col min-h-[600px] border-secondary/10 shadow-secondary/5">
                <div className="p-6 border-b border-card-border">
                  <h3 className="section-title !mb-1 text-lg">Optimal Interventions</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Decision Support Matrix</p>
                </div>
                <div className="p-6 flex-1">
                  <ResultsPanel optimization={data?.optimization_plan} />
                </div>
              </div>
            </aside>

          </div>
        </main>

        <footer className="mt-auto border-t border-card-border p-8 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-bold text-white uppercase tracking-widest italic">Urban Intelligence Engine // v4.2.0-STABLE</p>
            <p className="text-[10px] text-text-muted font-medium">Standard authoritative data feed for regional climate governance and strategic resilience.</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Network_Integrity</span>
              <span className="text-[10px] font-bold text-primary tracking-tighter">ENCRYPTED_SSL_TLS_v1.3</span>
            </div>
            <div className="w-px h-8 bg-card-border" />
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Instance_ID</span>
              <span className="text-[10px] font-bold text-white font-mono uppercase">Node_4-F92E_STA</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
