"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MarketplacePanelProps {
    credits: number;
    balance: number;
    onSellCredits: (amount: number, price: number) => void;
    show: boolean;
    onClose: () => void;
}

export default function MarketplacePanel({ credits, balance, onSellCredits, show, onClose }: MarketplacePanelProps) {
    const [price, setPrice] = useState(45.50);
    const [trend, setTrend] = useState<'up' | 'down'>('up');
    const [history, setHistory] = useState<number[]>(Array(20).fill(45));

    // Simulate Live Market Data
    useEffect(() => {
        if (!show) return;

        const interval = setInterval(() => {
            setPrice(prev => {
                const change = (Math.random() - 0.45) * 2; // Slight upward bias
                const newPrice = Math.max(20, Object.is(NaN, prev + change) ? 45 : prev + change);
                setTrend(change > 0 ? 'up' : 'down');
                setHistory(prevHist => [...prevHist.slice(1), newPrice]);
                return newPrice;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [show]);

    if (!show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-24 right-6 z-50 w-[320px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/80">Carbon Exchange</span>
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>

            <div className="p-5 space-y-6">
                {/* 1. Wallet Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Treasury Balance</div>
                        <div className="text-xl font-bold text-white tabular-nums">
                            <span className="text-white/30 mr-0.5">$</span>{(balance / 1000).toFixed(1)}k
                        </div>
                    </div>
                    <div className="p-3 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20">
                        <div className="text-[10px] text-neon-emerald/60 uppercase tracking-wider mb-1">Carbon Credits</div>
                        <div className="text-xl font-bold text-neon-emerald tabular-nums">
                            {credits.toLocaleString()} <span className="text-[10px] text-neon-emerald/50">tCO₂</span>
                        </div>
                    </div>
                </div>

                {/* 2. Live Market Chart (CSS SVG) */}
                <div className="relative h-32 w-full bg-black/40 rounded-lg border border-white/5 p-2 flex items-end justify-between gap-1 overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 border-t border-white/5 top-1/2 left-0 right-0 pointer-events-none" />

                    {/* Bars showing Price History */}
                    {history.map((h, i) => {
                        const height = ((h - 20) / 60) * 100; // Normalize 20-80 range
                        return (
                            <div
                                key={i}
                                className={`w-full rounded-sm transition-all duration-500 ${i === history.length - 1 ? 'bg-amber-400' : 'bg-white/10'}`}
                                style={{ height: `${Math.max(5, height)}%` }}
                            />
                        );
                    })}

                    {/* Live Price Tag */}
                    <div className="absolute top-2 right-2 flex flex-col items-end">
                        <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Spot Price</span>
                        <div className={`text-lg font-mono font-bold flex items-center gap-1 ${trend === 'up' ? 'text-amber-400' : 'text-rose-400'}`}>
                            ${price.toFixed(2)}
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className={trend === 'up' ? '' : 'rotate-180'}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                        </div>
                    </div>
                </div>

                {/* 3. Trading Controls */}
                <div className="space-y-3">
                    <button
                        onClick={() => onSellCredits(100, price)}
                        disabled={credits < 100}
                        className={`w-full py-3 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${credits >= 100
                                ? 'bg-white text-black hover:scale-[1.02] shadow-lg'
                                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                            }`}
                    >
                        <span>Sell 100 Credits</span>
                        <div className="bg-black/10 px-1.5 py-0.5 rounded text-[9px] font-mono">
                            +${(100 * price).toFixed(0)}
                        </div>
                    </button>

                    <button
                        onClick={() => onSellCredits(credits, price)}
                        disabled={credits <= 0}
                        className={`w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-colors ${credits > 0
                                ? 'text-white/60 hover:text-white bg-white/5 hover:bg-white/10'
                                : 'text-white/20 cursor-not-allowed'
                            }`}
                    >
                        Liquidate All Assets
                    </button>
                </div>

                {/* Footer Insight */}
                <div className="pt-3 border-t border-white/10 text-[9px] text-white/30 leading-relaxed text-center">
                    Market data simulated based on global voluntary carbon market indices.
                </div>
            </div>
        </motion.div>
    );
}
