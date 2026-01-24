"use client";

import { motion } from "framer-motion";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="flex flex-col gap-10">
      {/* 📊 Primary Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 glass-panel !border-white/10 bg-white/10 rounded-xl shadow-xl">
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.25em] mb-4">Allocated Resources</p>
          <p className="text-4xl font-extrabold text-white tabular-nums tracking-tighter drop-shadow-sm">${budgetUsed.toLocaleString()}</p>
        </div>
        <div className="p-8 bg-neon-emerald/20 border border-neon-emerald/30 rounded-xl relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-neon-emerald shadow-[0_0_20px_#10B981]" />
          <p className="text-[11px] font-bold text-neon-emerald uppercase tracking-[0.25em] mb-4">Projected AQI Improvement</p>
          <div className="flex items-baseline gap-4">
            <p className="text-4xl font-extrabold text-white tabular-nums tracking-tighter drop-shadow-sm">{carbonAvoided.toFixed(0)}</p>
            <span className="text-[12px] font-bold text-neon-emerald uppercase tracking-widest font-mono">AQI_PTS</span>
          </div>
        </div>
        <div className="p-8 glass-panel !border-white/10 bg-white/5 rounded-xl flex flex-col justify-center">
          <div className="flex justify-between items-end mb-4">
            <span className="text-[11px] font-extrabold text-white/30 uppercase tracking-[0.2em]">Efficiency Index</span>
            <span className="text-sm font-mono font-bold text-neon-emerald tabular-nums">+{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-neon-emerald shadow-[0_0_10px_#10B981]"
            />
          </div>
        </div>
        <div className="p-8 glass-panel !border-white/10 bg-white/5 rounded-xl flex flex-col justify-center">
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.25em] mb-2 tracking-widest font-mono">NODES_ARMED</p>
          <p className="text-3xl font-bold text-neon-emerald tabular-nums">{plan.length}</p>
        </div>
      </div>

      {/* 📜 Optimization Sequence - Horizontal Grid */}
      <div className="space-y-6">
        <h4 className="text-[11px] font-extrabold text-white/30 uppercase tracking-[0.25em] pl-2">Optimization Deployment Sequence</h4>

        {plan.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plan.map((p: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-8 glass-panel !bg-black/40 border border-white/15 rounded-xl hover:border-neon-emerald/60 transition-all group/row cursor-pointer relative overflow-hidden shadow-lg h-full flex flex-col justify-between"
              >
                {/* Holographic Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-emerald/0 via-neon-emerald/5 to-neon-emerald/10 opacity-0 group-hover/row:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-neon-emerald animate-pulse shadow-[0_0_12px_#10B981]" />
                      <span className="text-[12px] font-extrabold text-neon-emerald font-mono tracking-widest">
                        ELMT_{p.grid_id.toString().padStart(3, '0')}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Intensity</span>
                      <span className="text-[13px] font-bold text-white tabular-nums">{p.units} Units</span>
                    </div>
                  </div>

                  <p className="text-[16px] font-extrabold text-white mb-8 capitalize tracking-tight group-hover/row:text-neon-emerald transition-colors leading-tight">
                    {p.intervention.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[12px] pt-6 border-t border-white/10 relative z-10">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white/30 font-bold uppercase text-[9px] tracking-[0.2em]">Cap_Alloc</span>
                    <span className="text-white font-bold font-mono text-[13px] tracking-tight">${p.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-neon-emerald/50 font-bold uppercase text-[9px] tracking-[0.2em]">Impact_Delta</span>
                    <span className="text-neon-emerald font-extrabold font-mono text-[13px] tracking-tight">-{p.expected_reduction.toFixed(1)} AQI</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="h-64 glass-panel !bg-white/5 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-white/20 gap-4">
            <div className="p-4 border border-dashed border-white/20 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7" />
              </svg>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] italic text-center leading-relaxed">System Awaiting Simulation Initialization</p>
          </div>
        )}
      </div>
    </div>
  );
}
