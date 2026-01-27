"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, TrendingDown, CheckCircle2, Download } from "lucide-react";

interface AiAnalysis {
    summary: string;
    justification: string;
    insight: string;
    confidence: number;
    _stats?: {
        latency: number;
        tokens: number;
    };
}

export default function AiStrategyNarrative({ analysis, loading }: { analysis: AiAnalysis | null, loading: boolean }) {
    const handleExport = async () => {
        if (!analysis) return;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/scenario/analyze/export`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ analysis })
            });
            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Carbon_Twin_Strategy_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("PDF Export Error:", e);
        }
    };

    if (loading) {
        return (
            <div className="glass-panel p-8 animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20" />
                    <div className="h-4 w-32 bg-white/5 rounded" />
                </div>
                <div className="space-y-3">
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-5/6 bg-white/5 rounded" />
                    <div className="h-4 w-4/6 bg-white/5 rounded" />
                </div>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 relative overflow-hidden group"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-emerald/5 blur-3xl -mr-16 -mt-16 group-hover:bg-neon-emerald/10 transition-all duration-700" />

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald">
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Strategy Engine</h3>
                        <p className="text-[10px] text-emerald-500/40 font-bold uppercase tracking-tight">Gemini 1.5 Intelligence</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">System Confidence</span>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <div
                                    key={s}
                                    className={`w-1.5 h-3 rounded-sm ${s <= analysis.confidence * 5 ? 'bg-neon-emerald shadow-[0_0_8px_#10B981]' : 'bg-white/5'}`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-mono font-bold text-neon-emerald">{(analysis.confidence * 100).toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div>
                    <div className="text-[10px] font-black text-neon-emerald uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Executive Summary
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed italic font-medium">
                        "{analysis.summary}"
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-neon-emerald/20 transition-all">
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-neon-emerald" />
                            Strategic Logic
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                            {analysis.justification}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-neon-emerald/5 border border-neon-emerald/10 hover:border-neon-emerald/30 transition-all">
                        <div className="text-[10px] font-bold text-neon-emerald uppercase tracking-widest mb-3 flex items-center gap-2">
                            <TrendingDown className="w-3 h-3" />
                            Creative Insight
                        </div>
                        <p className="text-[11px] text-emerald-500/80 leading-relaxed font-medium">
                            {analysis.insight}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Status bar */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse" />
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Real-time Inference</span>
                    </div>
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                        Lat: {analysis._stats?.latency ?? '---'}ms • Tokens: {analysis._stats?.tokens ?? '---'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExport}
                        className="text-[10px] font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
                    >
                        <Download className="w-3 h-3" />
                        Export PDF
                    </button>
                    <button className="text-[10px] font-bold text-neon-emerald hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group/btn">
                        Refine Strategy
                        <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
