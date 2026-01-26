"use client";

import React, { useState, useEffect } from 'react';

interface MarketplacePanelProps {
    credits: number;
    balance: number;
    onSellCredits: (amount: number, price: number) => void;
}

export default function MarketplacePanel({ credits, balance, onSellCredits }: MarketplacePanelProps) {
    const [price, setPrice] = useState(45.50);
    const [trend, setTrend] = useState<'up' | 'down'>('up');
    const [history, setHistory] = useState<number[]>(Array(20).fill(45));

    useEffect(() => {
        const interval = setInterval(() => {
            setPrice(prev => {
                const change = (Math.random() - 0.45) * 2;
                const newPrice = Math.max(20, Object.is(NaN, prev + change) ? 45 : prev + change);
                setTrend(change > 0 ? 'up' : 'down');
                setHistory(prevHist => [...prevHist.slice(1), newPrice]);
                return newPrice;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full space-y-6">
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

            {/* 2. Live Market Chart */}
            <div className="relative h-32 w-full bg-black/40 rounded-lg border border-white/5 p-2 flex items-end justify-between gap-1 overflow-hidden">
                <div className="absolute inset-0 border-t border-white/5 top-1/2 left-0 right-0 pointer-events-none" />
                {history.map((h, i) => {
                    const height = ((h - 20) / 60) * 100;
                    return (
                        <div
                            key={i}
                            className={`w-full rounded-sm transition-all duration-500 ${i === history.length - 1 ? 'bg-amber-400' : 'bg-white/10'}`}
                            style={{ height: `${Math.max(5, height)}%` }}
                        />
                    );
                })}
                <div className="absolute top-2 right-2 flex flex-col items-end">
                    <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Spot Price</span>
                    <div className={`text-lg font-mono font-bold flex items-center gap-1 ${trend === 'up' ? 'text-amber-400' : 'text-rose-400'}`}>
                        ${price.toFixed(2)}
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

            <div className="pt-3 border-t border-white/10 text-[9px] text-white/30 leading-relaxed text-center">
                Simulated voluntary marketplace index.
            </div>
        </div>
    );
}
