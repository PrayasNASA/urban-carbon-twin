"use client";

import { useState, useRef } from "react";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { runScenario, compareScenarios, initializeSimulation, API_GATEWAY } from "@/lib/api";
import CityGrid from "@/components/CityGrid"; // Keeping for fallback/reference if needed, or we can remove usage
import ScenarioPanel from "@/components/ScenarioPanel"; // This will be replaced by dynamic import later
import ResultsPanel from "@/components/ResultsPanel";
import LandingPage from "@/components/LandingPage";
import HeatmapBackground from "@/components/HeatmapBackground";
import { Search, Home as HomeIcon, Globe, LayoutDashboard, Database } from "lucide-react";

// Dynamic imports
const Co2Globe = dynamic(() => import("@/components/Co2Globe"), { ssr: false });
const CityMap = dynamic(() => import("@/components/CityMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-white/40 text-xs tracking-widest uppercase">Initializing Map Engine...</div>
});
const MarketplacePanel = dynamic(() => import("@/components/MarketplacePanel"), { ssr: false });
// ScenarioPanel is now dynamically imported to allow for absolute positioning
const DynamicScenarioPanel = dynamic(() => import("@/components/ScenarioPanel"), { ssr: false });
const ImpactDashboard = dynamic(() => import("@/components/ImpactDashboard"), { ssr: false });
const GlobalLeaderboard = dynamic(() => import("@/components/GlobalLeaderboard"), { ssr: false });


if (typeof window !== "undefined") {
  (window as any).CESIUM_BASE_URL = "/cesium";
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(true);
  const [showSimultaneousView, setShowSimultaneousView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Marketplace State
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [credits, setCredits] = useState(1250); // Initial seed credits
  const [balance, setBalance] = useState(50000); // Initial budget

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform values for cinematic transition
  const landingOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const landingScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.98]);
  const dashboardOpacity = useTransform(scrollYProgress, [0.15, 0.35], [0, 1]);
  const dashboardY = useTransform(scrollYProgress, [0.15, 0.35], [40, 0]);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSellCredits = (amount: number, price: number) => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      setBalance(prev => prev + (amount * price));
    }
  };

  async function handleRunSimulation(budget: number) {
    setLoading(true);
    setError(null);
    setComparisonData(null);
    try {
      // If we are in Global View mode (or have global data loaded), assume we want to re-run the LIVE simulation
      if (globalData) {
        const initialAqi = globalData?.full_details?.aqi || 50;
        const result = await initializeSimulation(globalData.location.lat, globalData.location.lon, budget, initialAqi);
        setData(result);
        setCompareMode(false); // Switch to map view
      }
      // Fallback for "Local Grid" mode (Legacy/Mock)
      else if (compareMode) {
        const result = await compareScenarios(budget, budget * 2);
        if (result.error) {
          setError(`Comparison Error: ${result.error}`);
          setComparisonData(null);
        } else {
          setComparisonData(result);
        }
      } else {
        // Fallback if no global data is present (should rarely happen in non-compare mode now)
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

  // Placeholder for handleDeploy, if it's meant to be used by ScenarioPanel
  const handleDeploy = () => {
    console.log("Deploy action triggered (placeholder)");
  };

  // const [budget, setBudget] = useState(25000); // Removed local budget state in favor of global balance

  // New handler for Global View interactions
  const [globalData, setGlobalData] = useState<any>(null);

  async function handleGlobalSelect(lat: number, lon: number) {
    setLoading(true); // Reuse loading or create specific one
    try {
      // Using API Gateway instead of hardcoded localhost
      const res = await fetch(`${API_GATEWAY}/scenario/gee/co2?lat=${lat}&lon=${lon}`);
      if (!res.ok) throw new Error("GEE Fetch Failed");
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }

      // MOCK ENRICHMENT FOR PHASE 1
      // Adding simulated multi-pollutant data until backend supports it
      if (json.full_details && !json.full_details.pollutants) {
        json.full_details.pollutants = {
          co2: { label: 'CO2', value: 420 + Math.floor(Math.random() * 50), unit: 'ppm' },
          no2: { label: 'NO₂', value: Math.floor(Math.random() * 80), unit: 'µg/m³' },
          pm25: { label: 'PM2.5', value: Math.floor(Math.random() * 150), unit: 'µg/m³' },
          methane: { label: 'CH₄', value: (1.8 + Math.random()).toFixed(2), unit: 'ppm' }
        };
      }

      setGlobalData(json);
    } catch (e: any) {
      console.error(e);
      // Show non-blocking toast or alert? reuse error state for now
      // setError(`GEE Error: ${e.message}`); // Maybe too intrusive if just browsing
    } finally {
      setLoading(false);
    }
  }

  async function handleSimulate() {
    if (globalData) {
      setLoading(true);
      setError(null);
      try {
        const initialAqi = globalData?.full_details?.aqi || 50;
        const result = await initializeSimulation(globalData.location.lat, globalData.location.lon, balance, initialAqi); // Use balance as budget
        setData(result);
        setCompareMode(false);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize simulation via backend.");
      } finally {
        setLoading(false);
      }
    }
  }

  const idealBudget = data?.optimization_plan?.ideal_budget_required;

  return (
    <main
      ref={containerRef}
      className="min-h-screen overflow-y-auto overflow-x-hidden scroll-smooth grain-overlay relative bg-background"
    >
      <HeatmapBackground scrollProgress={scrollYProgress} />
      {/* 🌿 Section 1: Landing Page */}
      <motion.section
        style={{
          opacity: landingOpacity,
          scale: landingScale,
          pointerEvents: landingOpacity.get() === 0 ? 'none' : 'auto'
        }}
        className="h-screen w-screen sticky top-0 z-10"
      >
        <LandingPage onInitialize={() => { }} />
      </motion.section>

      {/* 🚀 Section 2: Dashboard Engine */}
      <motion.section
        style={{ opacity: dashboardOpacity }}
        className="min-h-screen w-screen relative z-20 bg-transparent text-gray-50 antialiased font-sans pointer-events-auto"
      >
        {/* 🏛️ Solarpunk Header */}
        <header className="glass-panel border-b border-white/10 sticky top-4 z-50 mx-4 md:mx-8 mb-8 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
            <div className="flex flex-col shrink-0">
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-neon-emerald shadow-[0_0_15px_#10B981]" />
                Urban Carbon <span className="text-neon-emerald">Twin</span>
              </h1>
              <p className="text-[10px] text-neon-emerald/60 font-black uppercase tracking-[0.4em] mt-2.5">Solarpunk Intelligence Engine</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-4 text-[11px] font-bold uppercase tracking-tight text-emerald-500/40">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-emerald shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span>Network Online</span>
                </div>
                <span className="h-3 w-px bg-white/10" />
                <span className="text-emerald-500/60 font-mono tracking-widest">v4.1</span>
              </div>
            </div>
          </div>
        </header>

        {/* 📊 Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-8 pb-12 flex flex-col gap-10">
          {/* Page Title Row */}
          <div className="flex items-baseline justify-between mt-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Environmental Sequestration Metrics</h2>
            <div className="text-[10px] font-black text-neon-emerald uppercase tracking-[0.3em] bg-neon-emerald/5 border border-neon-emerald/10 px-5 py-2 rounded-xl backdrop-blur-xl">
              Region: {globalData?.place_name ? globalData.place_name : 'South Asia Core'}
            </div>
          </div>

          {/* 🏗️ Tier 1: Core Simulation Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch">
            {/* Parameters Sidebar */}
            <aside className="md:col-span-3 flex flex-col gap-8">
              <div className="glass-panel p-8 space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-extrabold text-emerald-500/60 uppercase tracking-[0.2em]">Scenario</h3>
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md border uppercase tracking-widest transition-all ${compareMode ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-white/40'}`}
                  >
                    {compareMode ? 'LOCAL_GRID' : 'GLOBAL_VIEW'}
                  </button>
                </div>
                {/* ScenarioPanel is now rendered as an absolute positioned component */}
                <DynamicScenarioPanel
                  onRun={handleRunSimulation}
                  loading={loading}
                  budget={balance} // Pass the dynamic balance
                  setBudget={setBalance}
                  idealBudget={idealBudget}
                  onSimulate={handleDeploy}
                />
              </div>

              {/* 5. Global Leaderboard */}
              <GlobalLeaderboard />

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
            </aside>

            {/* Spatial Grid (Expanded Map) */}
            <section className="md:col-span-9 flex flex-col gap-8 h-full">
              <div className="glass-panel p-2 overflow-hidden h-full min-h-[600px] flex flex-col">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-widest">{compareMode ? 'Global AQI Explorer' : 'Spatial Concentration Map'}</h3>
                      <p className="text-[11px] text-emerald-500/40 font-medium tracking-tight">Real-time topographic AQI distribution</p>
                    </div>
                    {compareMode && (
                      <button
                        onClick={() => setShowSimultaneousView(!showSimultaneousView)}
                        className={`p-2 rounded-lg border transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${showSimultaneousView ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-white/5 border-white/10 text-white/40 hover:text-neon-emerald hover:border-neon-emerald/50'}`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{showSimultaneousView ? 'Disable Dual Mode' : 'Enable Dual Mode'}</span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 text-[11px] font-bold bg-neon-emerald/10 text-neon-emerald px-4 py-1.5 rounded-lg border border-neon-emerald/20">
                      <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
                      <span>LIVE_SENSING_ACTIVE</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">RES: 200m²_GRID • NODES: 400</span>
                  </div>
                </div>
                <div className="flex-1 bg-black/40 rounded-xl m-2 border border-white/5 overflow-hidden relative">
                  {compareMode ? (
                    <Co2Globe
                      data={globalData}
                      onSelectLocation={handleGlobalSelect}
                      onSimulate={handleSimulate}
                      onCloseData={() => setGlobalData(null)}
                      simultaneousView={showSimultaneousView}
                    />
                  ) : (
                    // Using CityMap instead of CityGrid for Real Map visualization
                    <CityMap
                      dispersion={data?.dispersion}
                      optimizationPlan={data?.optimization_plan}
                      initialCenter={globalData?.location ? [globalData.location.lat, globalData.location.lon] : undefined}
                    />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* 📽️ Tier 2: Deployment Matrix (Full-Width) */}
          <div className="w-full">
            <div className="glass-panel p-8 flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-widest">Deployment Matrix</h3>
                  <p className="text-[11px] text-emerald-500/40 font-bold uppercase tracking-[0.2em] mt-1">Optimization analysis & resource distribution</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-neon-emerald">
                  <span className="bg-neon-emerald/10 px-3 py-1.5 rounded-md border border-neon-emerald/20">SOLVER_V4.2</span>
                  <span className="bg-white/5 px-3 py-1.5 rounded-md border border-white/10 text-white/40 uppercase">Target: Carbon Neutral 2040</span>
                </div>
              </div>
              <ResultsPanel optimization={data?.optimization_plan} />

              {/* ROI & Impact Analytics */}
              <ImpactDashboard data={data} budget={balance} />
            </div>
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
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">GCP</span>
                <span className="text-[11px] font-bold text-white/50">PRAYAS</span>
              </div>
            </div>
          </div>
        </footer>
      </motion.section>

      {/* OVERLAYS & CONTROLS (Rendered Outside Footer/Section flow) */}

      {/* 1. Marketplace Toggle (Top Right) */}
      <div className="absolute top-12 right-6 z-50 flex items-center gap-4">
        <button
          onClick={() => setShowMarketplace(!showMarketplace)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${showMarketplace
            ? 'bg-amber-400 text-black border-amber-400 font-bold'
            : 'bg-black/40 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
            }`}
        >
          <div className={`w-2 h-2 rounded-full ${showMarketplace ? 'bg-black' : 'bg-amber-400'} animate-pulse`} />
          <span className="text-xs font-bold uppercase tracking-widest">Carbon Market</span>
        </button>

        <div className="flex flex-col items-end bg-black/40 px-3 py-1 rounded-lg border border-white/5">
          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Capital</span>
          <span className="text-xl font-light text-white tabular-nums">${balance.toLocaleString()}</span>
        </div>
      </div>

      {/* 2. Marketplace Panel */}
      <MarketplacePanel
        show={showMarketplace}
        onClose={() => setShowMarketplace(false)}
        credits={credits}
        balance={balance}
        onSellCredits={handleSellCredits}
      />

      {/* 3. Scenario Controls (Left Panel) */}
      <div className="absolute top-24 left-6 z-40 w-[360px]">
        <DynamicScenarioPanel
          onRun={handleRunSimulation}
          loading={loading}
          budget={balance}
          setBudget={setBalance}
          idealBudget={idealBudget}
          onSimulate={handleDeploy}
        />
      </div>
    </main >
  );
}
