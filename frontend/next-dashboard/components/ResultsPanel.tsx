"use client";

import { motion } from "framer-motion";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="flex flex-col gap-8 h-full">

      {/* 📊 Primary Performance Indicators */}
      <div className="grid grid-cols-1 gap-4">
        <div className="p-5 glass-panel !border-white/5 bg-white/5 rounded-2xl">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3">Allocated Resources</p>
          <p className="text-3xl font-bold text-white tabular-nums">${budgetUsed.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-neon-emerald/10 border border-neon-emerald/20 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-emerald shadow-[0_0_15px_#10B981]" />
          <p className="text-[10px] font-bold text-neon-emerald uppercase tracking-[0.2em] mb-3">Estimated Sequestration</p>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-white tabular-nums">{carbonAvoided.toFixed(2)}</p>
            <span className="text-[11px] font-bold text-neon-emerald/60 uppercase tracking-tighter font-mono">TN_CO2_EQ</span>
          </div>
        </div>
      </div>

      {/* 📉 Resource Utilization Trace */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Efficiency Index</span>
          <span className="text-xs font-mono font-bold text-neon-emerald tabular-nums">+{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-neon-emerald shadow-[0_0_10px_#10B981]"
          />
        </div>
      </div>

      {/* 📜 Optimization Sequence */}
      <div className="flex-1 flex flex-col min-h-0 pt-2">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Deployment Sequence</h4>
          <span className="text-[9px] font-mono font-bold text-neon-emerald bg-neon-emerald/10 px-3 py-1 rounded-full border border-neon-emerald/20">
            {plan.length}_NODES_ARMED
          </span>
        </div>

        <div className="flex-1 space-y-4">
          {plan.length > 0 ? (
            plan.map((p: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 glass-panel !bg-white/5 border border-white/5 rounded-2xl hover:border-neon-emerald/40 transition-all group/row cursor-pointer relative overflow-hidden"
              >
                {/* Holographic Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-emerald/0 via-neon-emerald/0 to-neon-emerald/5 opacity-0 group-hover/row:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse" />
                    <span className="text-[10px] font-bold text-neon-emerald font-mono">
                      ELMT_{p.grid_id.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Intensity</span>
                    <span className="text-[11px] font-bold text-white/80 tabular-nums">{p.units} Units</span>
                  </div>
                </div>

                <p className="text-[13px] font-bold text-white mb-5 capitalize tracking-tight relative z-10 group-hover/row:text-neon-emerald transition-colors">
                  {p.intervention.replace(/_/g, ' ')}
                </p>

                <div className="flex justify-between items-center text-[10px] pt-4 border-t border-white/5 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-white/20 font-bold uppercase text-[8px] tracking-widest mb-1">Cap_Alloc</span>
                    <span className="text-white/70 font-bold font-mono">${p.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-neon-emerald/40 font-bold uppercase text-[8px] tracking-widest mb-1">Impact_Delta</span>
                    <span className="text-neon-emerald font-bold font-mono">-{p.expected_reduction.toFixed(3)} G/S</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4 opacity-40 py-20">
              <div className="p-4 border border-dashed border-white/20 rounded-full">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7" />
                </svg>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] italic text-center leading-relaxed">System Awaiting<br />Initialization Sequence</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
