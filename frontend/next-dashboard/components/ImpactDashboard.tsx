"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ImpactStatsProps {
    data: any;
    budget: number;
}

export default function ImpactDashboard({ data, budget }: ImpactStatsProps) {
    // Mock ROI Calculations based on pollution reduction
    const stats = useMemo(() => {
        const reduction = data?.optimization_plan?.projected_improvement?.aqi || 0;
        const healthcareSavings = reduction * 125000; // $125k saved per AQI point reduced
        const roi = budget > 0 ? ((healthcareSavings - budget) / budget) * 100 : 0;

        return {
            healthcareSavings,
            roi: roi.toFixed(1),
            livesSaved: Math.floor(reduction * 1.2), // 1.2 lives per AQI point
            productivityGain: (reduction * 0.5).toFixed(1) // % gain in workforce productivity
        };
    }, [data, budget]);

    if (!data) return null;

    return (
        <div className="glass-panel p-6 border border-white/10 rounded-2xl w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Impact ROI Analytics</h3>
                    <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em] mt-1">Financial & Social Return on Investment</p>
                </div>
                <div className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    BigQuery BI Engine
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {/* 1. Healthcare Savings */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group hover:border-neon-emerald/30 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" /></svg>
                    </div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Healthcare Savings</div>
                    <div className="text-2xl font-black text-white tabular-nums">
                        ${(stats.healthcareSavings / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-neon-emerald mt-1 font-bold">+12.4% YoY</div>
                </div>

                {/* 2. ROI Metric */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group hover:border-amber-400/30 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7 11h2v2H7zm0 4h2v2H7zm4 0h2v2h-2zm0-4h2v2h-2zm4 0h2v2h-2zm0 4h2v2h-2zM5 21h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zM5 5h14v14H5V5z" /></svg>
                    </div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Capital Efficiency</div>
                    <div className={`text-2xl font-black tabular-nums ${Number(stats.roi) > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {stats.roi}%
                    </div>
                    <div className="text-[10px] text-white/30 mt-1 font-bold">Projected Yield</div>
                </div>

                {/* 3. Social Impact (Lives) */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group hover:border-rose-400/30 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                    </div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Lives Impacted</div>
                    <div className="text-2xl font-black text-rose-400 tabular-nums">
                        {stats.livesSaved}
                    </div>
                    <div className="text-[10px] text-white/30 mt-1 font-bold">Respiratory Prevention</div>
                </div>

                {/* 4. Workforce Productivity */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 relative overflow-hidden group hover:border-blue-400/30 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" /></svg>
                    </div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Workforce Gain</div>
                    <div className="text-2xl font-black text-blue-400 tabular-nums">
                        +{stats.productivityGain}%
                    </div>
                    <div className="text-[10px] text-white/30 mt-1 font-bold">GDP Correlation</div>
                </div>
            </div>
        </div>
    );
}
