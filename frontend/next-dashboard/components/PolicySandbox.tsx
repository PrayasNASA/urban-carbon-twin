"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyzePolicies } from '@/lib/api';

interface Policy {
    id: string;
    name: string;
    description: string;
    impact_co2: number; // Percentage reduction
    impact_cost: number; // Cost increase/decrease
    active: boolean;
}

export default function PolicySandbox({ onUpdateImpact, lat, lon }: { onUpdateImpact: (impact: number) => void, lat?: number, lon?: number }) {
    const [policies, setPolicies] = useState<Policy[]>([
        { id: 'ev_zone', name: 'EV-Only Zone', description: 'Restrict ICE vehicles in city center', impact_co2: 12.5, impact_cost: 50000, active: false },
        { id: 'green_roof', name: 'Green Roof Mandate', description: 'Require 30% vegetation on new builds', impact_co2: 8.2, impact_cost: 120000, active: false },
        { id: 'carbon_tax', name: 'Industrial Carbon Tax', description: 'Tax heavy emitters >100 tons/yr', impact_co2: 15.0, impact_cost: -200000, active: false }, // Negative cost = revenue
        { id: 'public_transit', name: 'Super-Cycle Network', description: 'Expand bike lanes by 400%', impact_co2: 5.4, impact_cost: 25000, active: false }
    ]);

    const [isQuerying, setIsQuerying] = useState(false);

    useEffect(() => {
        const fetchImpacts = async () => {
            setIsQuerying(true);
            try {
                const dynamicImpacts = await analyzePolicies(lat, lon);
                setPolicies(prev => prev.map(p => {
                    const dynamic = dynamicImpacts.find((d: any) => d.id === p.id);
                    return dynamic ? {
                        ...p,
                        impact_co2: dynamic.impact_co2,
                        impact_cost: dynamic.impact_cost ?? p.impact_cost
                    } : p;
                }));
            } catch (err) {
                console.error("Failed to fetch policy impacts:", err);
            } finally {
                setIsQuerying(false);
            }
        };
        fetchImpacts();
    }, [lat, lon]);

    const togglePolicy = (id: string) => {
        setIsQuerying(true);

        // Simulate BigQuery Latency
        setTimeout(() => {
            setPolicies(prev => {
                const updated = prev.map(p =>
                    p.id === id ? { ...p, active: !p.active } : p
                );

                // Calculate total impact
                const totalImpact = updated
                    .filter(p => p.active)
                    .reduce((sum, p) => sum + p.impact_co2, 0);

                onUpdateImpact(totalImpact);
                return updated;
            });
            setIsQuerying(false);
        }, 800);
    };

    return (
        <div className="flex flex-col gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden">
            {/* BigQuery Branding */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                    <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">BigQuery Simulator</span>
                </div>
                {isQuerying && <span className="text-[9px] text-blue-400 animate-pulse">SYNCING GIS DATA...</span>}
            </div>

            <div className="space-y-3">
                {policies.map(policy => (
                    <button
                        key={policy.id}
                        onClick={() => togglePolicy(policy.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left ${policy.active
                            ? 'bg-blue-500/20 border-blue-500/50'
                            : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                    >
                        <div className="flex flex-col">
                            <span className={`text-xs font-bold ${policy.active ? 'text-blue-400' : 'text-white'}`}>{policy.name}</span>
                            <span className="text-[10px] text-white/40">{policy.description}</span>
                            <span className="text-[8px] text-blue-400/50 mt-1 uppercase tracking-widest font-bold">GIS Model: Accurate</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-[10px] font-mono font-bold ${policy.active ? 'text-neon-emerald' : 'text-white/20'}`}>
                                {policy.active ? `-${policy.impact_co2.toFixed(1)}%` : '---'}
                            </span>
                            <span className="text-[8px] text-white/20 font-mono">Cost: ${Math.abs(policy.impact_cost).toLocaleString()}</span>
                            {/* Checkbox visual */}
                            <div className={`w-3 h-3 rounded border mt-1 flex items-center justify-center ${policy.active ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}>
                                {policy.active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><polyline points="20 6 9 17 4 12" /></svg>}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
