"use client";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="flex flex-col gap-8 h-full">

      {/* 📊 Primary Performance Indicators */}
      <div className="grid grid-cols-1 gap-4">
        <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-2">Total Capital Allocation</p>
          <p className="text-2xl font-bold text-gray-100 tabular-nums">${budgetUsed.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-blue-900/10 border border-blue-900/40 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.1em] mb-2">Estimated Sequestration</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-blue-100 tabular-nums">{carbonAvoided.toFixed(2)}</p>
            <span className="text-xs font-bold text-blue-500/60 uppercase">Tonnes_CO2</span>
          </div>
        </div>
      </div>

      {/* 📉 Resource Utilization Trace */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Budget Utilization</span>
          <span className="text-xs font-bold text-gray-100 tabular-nums">{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all duration-1000 ease-in-out"
            style={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* 📜 Optimization Sequence */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Deployment Plan</h4>
          <span className="text-[9px] font-bold text-gray-600 bg-gray-900 px-2 py-0.5 rounded border border-gray-800">
            {plan.length} ACTIVE_NODES
          </span>
        </div>

        <div className="scrolling-content flex-1 overflow-auto pr-2 space-y-3">
          {plan.length > 0 ? (
            plan.map((p: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors group/row">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-blue-400/60 font-mono tracking-tighter">
                    NODE_{p.grid_id.toString().padStart(3, '0')}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold text-gray-600 uppercase">Load_Qty</span>
                    <span className="text-[11px] font-bold text-gray-300 tabular-nums">{p.units} Units</span>
                  </div>
                </div>

                <p className="text-[11px] font-bold text-gray-200 mb-4 capitalize tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/40" />
                  {p.intervention.replace(/_/g, ' ')}
                </p>

                <div className="flex justify-between items-center text-[10px] pt-3 border-t border-gray-800/50">
                  <div className="flex flex-col">
                    <span className="text-gray-600 font-bold uppercase text-[8px]">Cost_Impact</span>
                    <span className="text-gray-300 font-bold">${p.cost.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-blue-500/60 font-bold uppercase text-[8px]">Peak_Efficiency</span>
                    <span className="text-blue-400 font-bold">-{p.expected_reduction.toFixed(3)} g/s</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-700 gap-2 opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M13 2v7h7" />
              </svg>
              <p className="text-[10px] font-bold uppercase tracking-widest italic">Awaiting simulation data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
