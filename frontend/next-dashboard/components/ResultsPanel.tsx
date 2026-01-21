"use client";

import { motion } from "framer-motion";
import { TreePine, Zap, Target, Layers, FileText, ChevronRight } from "lucide-react";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="flex flex-col gap-10 h-full">

      {/* 📊 Primary Performance Indicators */}
      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 glass border-emerald-500/10 rounded-2xl group transition-all duration-500 hover:border-emerald-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-4 h-4 text-emerald-500/60" />
            <p className="label-sm">Capital Utilization</p>
          </div>
          <p className="text-3xl font-black text-white tabular-nums text-glow">${budgetUsed.toLocaleString()}</p>
        </div>

        <div className="p-6 glass border-emerald-500/10 rounded-2xl relative overflow-hidden group transition-all duration-500 hover:border-emerald-500/30">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400 group-hover:w-2 transition-all duration-500" />
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-4 h-4 text-emerald-400" />
            <p className="label-sm text-emerald-400/80">Net Sequestration</p>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-black text-emerald-100 tabular-nums text-glow">{carbonAvoided.toFixed(2)}</p>
            <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Tonnes_CO2</span>
          </div>
        </div>
      </div>

      {/* 📉 Resource Utilization Trace */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-1">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-emerald-500/40" />
            <span className="label-sm">Budget Exhaustion</span>
          </div>
          <span className="text-xs font-black text-emerald-50 tabular-nums">{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-emerald-500/5 rounded-full overflow-hidden border border-emerald-500/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          />
        </div>
      </div>

      {/* 📜 Optimization Sequence */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 pt-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TreePine className="w-4 h-4 text-emerald-500/40" />
            <h4 className="label-sm">Deployment Sequence</h4>
          </div>
          <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {plan.length} ACTIVE_UNITS
          </span>
        </div>

        <div className="scrolling-content flex-1 overflow-auto pr-3 space-y-4">
          {plan.length > 0 ? (
            plan.map((p: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 glass border-emerald-500/5 rounded-2xl hover:border-emerald-500/20 transition-all duration-300 group/row relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover/row:opacity-100 transition-opacity">
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </div>

                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-emerald-500/40 font-mono tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
                    UNIT_{p.grid_id.toString().padStart(3, '0')}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-emerald-500/20 uppercase tracking-widest">Payload</span>
                    <span className="text-[11px] font-bold text-emerald-100/90 tabular-nums">{p.units} Modules</span>
                  </div>
                </div>

                <p className="text-[12px] font-black text-white mb-5 capitalize tracking-tight flex items-center gap-3">
                  {p.intervention.replace(/_/g, ' ')}
                </p>

                <div className="flex justify-between items-center text-[10px] pt-4 border-t border-emerald-500/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-500/30 font-bold uppercase text-[8px] tracking-[0.1em]">Impact_Cost</span>
                    <span className="text-emerald-100/80 font-bold font-mono">${p.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-emerald-400 font-bold uppercase text-[8px] tracking-[0.1em]">Sequestration_Yield</span>
                    <span className="text-emerald-400 font-black text-glow">-{p.expected_reduction.toFixed(3)} g/s</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-emerald-500/20 gap-4 opacity-50 py-12">
              <FileText className="w-10 h-10 stroke-[1]" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] italic text-center leading-loose">
                Awaiting Primary <br /> Simulation Link
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
