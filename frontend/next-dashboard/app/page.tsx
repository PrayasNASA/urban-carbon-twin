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
    <div className="min-h-screen bg-background text-foreground antialiased font-sans p-6 lg:p-10 flex flex-col gap-10">

      {/* 🚀 Header Section (Integrated) */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold tracking-widest uppercase">Analytics_Live</span>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Core_v4 Active
            </div>
          </div>
          <h1 className="page-title text-4xl lg:text-5xl">Urban Carbon <span className="text-primary tracking-tighter italic">Digital Twin</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-surface px-6 py-3 rounded-2xl border border-card-border flex gap-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Total_Budget</span>
              <span className="text-sm font-bold text-white tabular-nums">$2.4M</span>
            </div>
            <div className="w-px h-8 bg-card-border" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Nodes_Sync</span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">400/400</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl border-2 border-primary/20 p-0.5">
            <div className="w-full h-full rounded-[11px] bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20" />
          </div>
        </div>
      </header>

      {/* 📊 Main Content Grid (Original 3-Column) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ⚙️ Control Panel */}
        <aside className="lg:col-span-3 flex flex-col gap-8 animate-slide-up [animation-delay:100ms]">
          <div className="card space-y-6">
            <div className="flex items-center justify-between px-1">
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

        {/* 🌍 Spatial Hub (Main Map) */}
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

      </main>

      {/* ⚓ Footer */}
      <footer className="mt-8 border-t border-card-border pt-10 pb-6 text-center lg:text-left flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest italic">Urban Intelligence Engine // v4.2.0-STABLE</p>
          <p className="text-[10px] text-text-muted font-medium">Authoritative regional climate governance and strategic resilience dashboard.</p>
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
  );
}
