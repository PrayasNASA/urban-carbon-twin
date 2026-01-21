"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Info, ArrowRight, DollarSign } from "lucide-react";

export default function ScenarioPanel({
  onRun,
  loading,
}: {
  onRun: (budget: number) => void;
  loading: boolean;
}) {
  const [budget, setBudget] = useState(25000);

  return (
    <div className="flex flex-col gap-10 w-full">

      {/* 🎚️ Scientific Budget Control */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col gap-1">
            <label className="label-sm">Total Allocation</label>
            <div className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.2em] flex items-center gap-2">
              <DollarSign className="w-3 h-3" />
              Resource Nodes
            </div>
          </div>
          <div className="text-2xl font-black text-white tabular-nums text-glow">
            ${budget.toLocaleString()}
          </div>
        </div>

        <div className="relative pt-4 group">
          {/* Custom Range Track Background */}
          <div className="absolute top-[22px] left-0 right-0 h-1 bg-emerald-500/10 rounded-full" />

          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="relative z-10 w-full h-1 bg-transparent rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between mt-5 text-[9px] font-bold text-emerald-500/30 uppercase tracking-[0.2em]">
            <span>Min: $5k</span>
            <span className="text-emerald-500/50">Linear_Scale</span>
            <span>Max: $100k</span>
          </div>
        </div>
      </div>

      {/* 💡 Intelligence Context Box */}
      <div className="p-5 glass border-emerald-500/10 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
          <Info className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-[11px] text-emerald-100/40 leading-relaxed font-semibold">
          <span className="text-emerald-400 font-black uppercase tracking-widest mr-2 underline decoration-emerald-500/30 underline-offset-4">Strategic Advisory:</span>
          Budgets over <span className="text-emerald-300">$50,000</span> enable high-resolution swarm protocols, significantly reducing localized carbon spikes.
        </p>
      </div>

      {/* ⚡ Primary Execution CTA */}
      <button
        onClick={() => onRun(budget)}
        disabled={loading}
        className={`group relative w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all duration-500 overflow-hidden ${loading
          ? "bg-emerald-950/20 text-emerald-800 cursor-not-allowed border border-emerald-500/10"
          : "glass hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
          }`}
      >
        <div className="relative z-10 flex items-center justify-center gap-4">
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-emerald-500/20 border-t-emerald-400 rounded-full"
              />
              <span className="text-glow">Processing...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
              <span>Execute Simulation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </div>

        {/* Hover Glow Effect */}
        {!loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
      </button>

    </div>
  );
}
