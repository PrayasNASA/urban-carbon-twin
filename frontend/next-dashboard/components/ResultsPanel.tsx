"use client";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="glass-card p-8 w-full flex flex-col gap-8 h-full">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-accent-cyan/10 rounded-xl border border-accent-cyan/20 animate-pulse">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight font-header uppercase">Optimization <span className="text-accent-cyan/80">Stream</span></h2>
          <p className="text-[9px] font-mono text-foreground/30 tracking-widest uppercase">REALTIME_ANALYTICS_OUTPUT</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-purple/40 group-hover:bg-accent-purple transition-colors" />
          <p className="text-[9px] text-foreground/40 uppercase font-mono tracking-widest mb-2 font-bold">Allocation</p>
          <p className="text-xl font-black text-accent-purple font-header">${budgetUsed.toLocaleString()}</p>
        </div>
        <div className="p-5 bg-white/5 border border-white/5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-cyan/40 group-hover:bg-accent-cyan transition-colors" />
          <p className="text-[9px] text-foreground/40 uppercase font-mono tracking-widest mb-2 font-bold">Mitigation</p>
          <p className="text-xl font-black text-accent-cyan font-header">{carbonAvoided.toFixed(2)}t</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <h3 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Intervention_Logs</h3>
        <div className="scrolling-content flex-1 overflow-auto pr-2 space-y-4">
          {plan.length > 0 ? (
            plan.map((p: any, idx: number) => (
              <div key={idx} className="p-5 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 hover:border-accent-cyan/20 transition-all duration-300 group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black font-mono text-accent-cyan bg-accent-cyan/5 border border-accent-cyan/20 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {p.grid_id}
                  </span>
                  <span className="text-[9px] font-bold text-foreground/20 font-mono italic">
                    {p.units}_PACKETS
                  </span>
                </div>
                <p className="text-sm font-black mb-4 font-header tracking-tight uppercase group-hover:text-accent-cyan transition-colors">
                  {p.intervention.replace('_', ' ')}
                </p>
                <div className="flex justify-between items-center text-[10px] font-mono text-foreground/30 border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {p.cost.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1.5 text-accent-cyan/80 font-bold">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                      <path d="M12 19V5M5 12l7-7 7 7" />
                    </svg>
                    {p.expected_reduction.toFixed(3)} G/S
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-foreground/10 py-20 italic">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="mb-4 opacity-10">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
              <p className="text-[11px] font-mono tracking-widest">DATA_BUFFER_EMPTY</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-white/5 pt-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[9px] text-foreground/40 font-mono tracking-widest uppercase font-bold">Efficiency_Index</span>
          <span className="text-xs font-black text-accent-purple font-header">{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-accent-purple shadow-[0_0_10px_var(--accent-purple)] transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
