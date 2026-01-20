"use client";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="flex flex-col gap-10 h-full">

      {/* 📊 High-Contrast Performance Indicators */}
      <div className="grid grid-cols-1 gap-6">
        <div className="card !p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-12 -mt-12" />
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-3">Capital Allocation</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-white tabular-nums">${budgetUsed.toLocaleString()}</p>
            <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">LIVE_ACT</div>
          </div>
        </div>

        <div className="card !p-5 relative overflow-hidden group border-primary/20 bg-primary/[0.02]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">Net Sequestration</p>
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl font-bold text-white tabular-nums leading-none">{carbonAvoided.toFixed(2)}</p>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">TONNES_CO2</span>
          </div>

          {/* ✨ High-End Sparkline (Mockup) */}
          <div className="h-10 w-full mt-2">
            <svg width="100%" height="100%" viewBox="0 0 200 60" preserveAspectRatio="none">
              <path d="M0 50 Q 25 20, 50 45 T 100 25 T 150 40 T 200 10" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary opacity-60" />
              <path d="M0 50 Q 25 20, 50 45 T 100 25 T 150 40 T 200 10 V 60 H 0 Z" fill="url(#grad)" className="opacity-10" />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0.5 }} />
                  <stop offset="100%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* 📉 Resource Utilization Trace */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end px-1">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[.2em]">Budget Usage</span>
          <span className="text-xs font-bold text-white tabular-nums bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-1000 ease-in-out"
            style={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 📜 Optimization Sequence */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 pt-2">
        <div className="flex items-center justify-between mb-5 px-1">
          <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[.2em]">Intervention Flow</h4>
          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20 tracking-widest uppercase">
            {plan.length} ACTIVE_NODES
          </span>
        </div>

        <div className="scrolling-content flex-1 overflow-auto pr-3 space-y-4">
          {plan.length > 0 ? (
            plan.map((p: any, idx: number) => (
              <div key={idx} className="card !p-5 bg-white/[0.01] hover:bg-white/[0.04] transition-all group/row border-white/[0.04]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[11px] font-black text-white font-mono tracking-tighter">
                      N_{p.grid_id.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Qty</span>
                    <span className="text-[11px] font-bold text-white tabular-nums">{p.units}U</span>
                  </div>
                </div>

                <p className="text-[12px] font-bold text-gray-100 mb-5 capitalize tracking-tight leading-snug">
                  {p.intervention.replace(/_/g, ' ')}
                </p>

                <div className="flex justify-between items-center text-[10px] pt-4 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-text-muted font-bold uppercase text-[8px] tracking-widest mb-1">Impact</span>
                    <span className="text-white font-bold tabular-nums">${p.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-primary font-black uppercase text-[8px] tracking-widest mb-1">Efficiency</span>
                    <span className="text-primary font-black tabular-nums">-{p.expected_reduction.toFixed(3)} g/s</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text-muted gap-4 opacity-20">
              <div className="w-16 h-16 rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20m10-10H2" /></svg>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[.3em] italic">Awaiting Engine Output</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
