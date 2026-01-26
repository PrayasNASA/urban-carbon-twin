"use client";

import { motion } from "framer-motion";
import { Users, AlertCircle } from "lucide-react";

interface SentimentData {
    approval: number;
    tag: string;
    metrics: {
        eco_index: number;
        disruption_index: number;
    };
}

export default function SentimentGauge({ data }: { data: SentimentData | null }) {
    if (!data) return null;

    const colors = {
        ENTHUSIASTIC: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
        FAVORABLE: "text-emerald-500/80 bg-emerald-500/5 border-emerald-500/20",
        NEUTRAL: "text-white/40 bg-white/5 border-white/10",
        SKEPTICAL: "text-amber-400 bg-amber-400/10 border-amber-400/30",
        HOSTILE: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    };

    const colorClass = colors[data.tag as keyof typeof colors] || colors.NEUTRAL;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/40" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Public Approval</span>
                </div>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-tighter border ${colorClass}`}>
                    {data.tag}
                </div>
            </div>

            <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${data.approval * 100}%` }}
                    className={`absolute inset-y-0 left-0 rounded-full ${data.approval > 0.6 ? 'bg-neon-emerald shadow-[0_0_10px_#10B981]' : data.approval > 0.4 ? 'bg-amber-400' : 'bg-rose-500'}`}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-tight mb-1">Eco Acceptance</span>
                    <span className="text-xs font-mono font-bold text-white/80">{(data.metrics.eco_index * 100).toFixed(0)}%</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] text-white/20 font-bold uppercase tracking-tight mb-1">Social Friction</span>
                    <span className="text-xs font-mono font-bold text-white/80">{(data.metrics.disruption_index * 100).toFixed(0)}%</span>
                </div>
            </div>

            {data.approval < 0.4 && (
                <div className="flex items-center gap-2 p-2 rounded bg-rose-500/5 border border-rose-500/20 text-rose-400">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span className="text-[9px] font-medium leading-tight">Protests anticipated in high-density industrial zones.</span>
                </div>
            )}
        </div>
    );
}
