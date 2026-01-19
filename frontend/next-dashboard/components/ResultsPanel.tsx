"use client";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="glass-card p-6 w-full max-w-sm flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-accent-purple/10 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-purple">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight">Optimization Results</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <p className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1">Budget Used</p>
          <p className="text-lg font-bold text-accent-purple">${budgetUsed.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
          <p className="text-[10px] text-foreground/50 uppercase tracking-widest mb-1">CO₂ Avoided</p>
          <p className="text-lg font-bold text-accent-cyan">{carbonAvoided.toFixed(2)}t</p>
        </div>
      </div>

      <div className="space-y-3 scrolling-content max-h-[300px] overflow-auto pr-2">
        <h3 className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] mb-4">Intervention Breakdown</h3>
        {plan.length > 0 ? (
          plan.map((p: any, idx: number) => (
            <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                  {p.grid_id}
                </span>
                <span className="text-[10px] font-medium text-foreground/30 font-mono">
                  {p.units} Units
                </span>
              </div>
              <p className="text-xs font-semibold mb-3 group-hover:text-accent-cyan transition-colors">
                {p.intervention.replace('_', ' ').toUpperCase()}
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono text-foreground/40">
                <span>Cost: <span className="text-foreground/70">${p.cost}</span></span>
                <span className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent-cyan">
                    <path d="m19 12-7 7-7-7" />
                    <path d="M12 19V5" />
                  </svg>
                  {p.expected_reduction.toFixed(3)} G/S
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-foreground/20 italic">
            <p className="text-xs">No active interventions</p>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-white/10 pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-foreground/40 uppercase">Budget Efficiency</span>
          <span className="text-[10px] font-bold text-accent-purple">{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent-purple transition-all duration-1000"
            style={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
