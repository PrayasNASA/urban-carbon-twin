"use client";

export default function ResultsPanel({ optimization }: { optimization: any }) {
  const plan = optimization?.plan || [];
  const totalBudget = optimization?.total_budget || 0;
  const budgetUsed = optimization?.budget_used || 0;
  const carbonAvoided = plan.reduce((acc: number, curr: any) => acc + curr.expected_reduction, 0);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">Total Allocation</p>
          <p className="text-2xl font-bold text-slate-900">${budgetUsed.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-[11px] font-bold text-blue-400 uppercase tracking-tight mb-1">CO2 Potential</p>
          <p className="text-2xl font-bold text-blue-700">{carbonAvoided.toFixed(2)}t</p>
        </div>
      </div>

      {/* Utilization Chart */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold text-slate-600">Budget Resource Consumption</span>
          <span className="text-xs font-bold text-blue-600">{((budgetUsed / (totalBudget || 1)) * 100).toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-700 ease-out"
            style={{ width: `${(budgetUsed / (totalBudget || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Detailed Node Logs */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1 h-3 bg-slate-200 rounded-full" />
          Optimization Plan
        </h4>
        <div className="scrolling-content flex-1 overflow-auto pr-2 space-y-3">
          {plan.length > 0 ? (
            plan.map((p: any, idx: number) => (
              <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    NODE: {p.grid_id}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Qty: {p.units}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800 mb-3 capitalize">
                  {p.intervention.replace(/_/g, ' ')}
                </p>
                <div className="flex justify-between text-[11px] font-medium pt-3 border-t border-slate-50">
                  <span className="text-slate-500">Cost: <span className="text-slate-900">${p.cost.toLocaleString()}</span></span>
                  <span className="text-blue-600 font-bold">Reduction: {p.expected_reduction.toFixed(3)} g/s</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 opacity-60">
              <p className="text-xs font-medium italic">Awaiting simulation execution...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
