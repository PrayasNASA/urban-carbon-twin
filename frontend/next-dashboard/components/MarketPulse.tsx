"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function MarketPulse() {
    const [data, setData] = useState<{
        current_price: number;
        change: number;
        history: { price: number }[]
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                // In production, this would hit the API Gateway via Next.js Proxy
                // For now, we expect it to fail or show "Data Unavailable" as per plan
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/scenario/economy/market-pulse`);
                if (!res.ok) throw new Error("Market Data Unavailable");
                const json = await res.json();
                if (json.error) throw new Error(json.error);

                // Calculate change from history if not provided directly
                const history = json.history || [];
                const price = json.current_price;
                const lastPrice = history.length > 0 ? history[history.length - 1].price : price;
                const change = ((price - lastPrice) / lastPrice) * 100;

                setData({ ...json, change });
            } catch (err: any) {
                console.error("Market Pulse Error:", err);
                setError(err.message || "Live Feed Offline");
            } finally {
                setLoading(false);
            }
        };

        fetchMarketData();
        // Refresh every minute
        const interval = setInterval(fetchMarketData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl overflow-hidden relative group opacity-50">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Carbon Spot Price</span>
                    <div className="flex items-center gap-2 text-rose-400">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs font-bold">{error}</span>
                    </div>
                </div>
            </div>
        )
    }

    if (loading || !data) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl animate-pulse">
                <div className="h-4 w-24 bg-white/10 rounded mb-4" />
                <div className="h-8 w-16 bg-white/10 rounded" />
            </div>
        )
    }

    const { current_price, change, history } = data;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl overflow-hidden relative group">
            <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Carbon Spot Price</span>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white tabular-nums">${current_price.toFixed(2)}</span>
                        <span className="text-[10px] text-white/40 font-bold">/ tCO2e</span>
                    </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${change >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"}`}>
                    {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(change).toFixed(2)}%
                </div>
            </div>

            <div className="h-12 flex items-end gap-1 px-1">
                {history.map((item, i) => {
                    const val = item.price;
                    const allPrices = history.map(h => h.price);
                    const maxVal = Math.max(...allPrices, val, 1);
                    const minVal = Math.min(...allPrices, val);
                    // Normalize height for better visual
                    const range = maxVal - minVal || 1;
                    const height = 20 + ((val - minVal) / range) * 80;

                    return (
                        <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            className={`flex-1 rounded-t-sm ${i === history.length - 1 ? "bg-white" : "bg-white/20"}`}
                            style={{ height: `${height}%`, minWidth: '4px' }}
                        />
                    );
                })}
            </div>

            {/* Pulse Indicator */}
            <div className="absolute top-0 right-0 p-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
        </div>
    );
}
