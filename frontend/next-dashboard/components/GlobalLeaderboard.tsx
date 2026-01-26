"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_LEADERBOARD = [
    { rank: 1, city: 'Copenhagen', country: 'DK', score: 98.2, trend: 'up' },
    { rank: 2, city: 'Singapore', country: 'SG', score: 96.5, trend: 'up' },
    { rank: 3, city: 'Amsterdam', country: 'NL', score: 94.1, trend: 'same' },
    { rank: 4, city: 'New York', country: 'US', score: 89.4, trend: 'up' }, // User City
    { rank: 5, city: 'Tokyo', country: 'JP', score: 88.9, trend: 'down' },
    { rank: 6, city: 'London', country: 'UK', score: 87.2, trend: 'up' },
    { rank: 7, city: 'Berlin', country: 'DE', score: 85.6, trend: 'down' },
    { rank: 8, city: 'Vancouver', country: 'CA', score: 84.3, trend: 'same' },
];

export default function GlobalLeaderboard() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Toggle Button (Bottom Right) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg border backdrop-blur-md flex items-center gap-3 transition-all ${isOpen
                        ? 'bg-neon-emerald text-black border-neon-emerald'
                        : 'bg-black/60 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                    }`}
            >
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Global Rank</span>
                    <span className="text-sm font-black">#4 NYC</span>
                </div>
                <div className="h-8 w-px bg-current opacity-20" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {/* Leaderboard Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-20 right-6 z-50 w-[300px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest">Net Zero Race</h3>
                                <p className="text-[9px] text-white/40 mt-0.5">Real-time Global Index</p>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
                        </div>

                        <div className="max-h-[300px] overflow-y-auto">
                            {MOCK_LEADERBOARD.map((item, i) => (
                                <div
                                    key={item.city}
                                    className={`p-3 flex items-center gap-3 border-b border-white/5 ${item.city === 'New York' ? 'bg-neon-emerald/10' : 'hover:bg-white/5'}`}
                                >
                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${i < 3 ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/50'
                                        }`}>
                                        {item.rank}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-white">{item.city}</span>
                                            <span className="text-[9px] text-white/30">{item.country}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-bold ${item.trend === 'up' ? 'text-neon-emerald' : item.trend === 'down' ? 'text-rose-400' : 'text-white/40'}`}>
                                            {item.score}
                                        </span>
                                        {item.trend === 'up' && <span className="text-[8px] text-neon-emerald">▲</span>}
                                        {item.trend === 'down' && <span className="text-[8px] text-rose-400">▼</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
