"use client";

import React, { useEffect, useState } from 'react';
import { useCesium } from 'resium';
import { Cartesian3, Color, ColorMaterialProperty } from 'cesium';
import dynamic from 'next/dynamic';
import { Proposal, generateProposals } from '@/lib/ProposalEngine';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamic Import for Entity to avoid SSR
const Entity = dynamic(() => import("resium").then((mod) => mod.Entity), { ssr: false });

export default function ProposalOverlay({ center, show }: { center: { lat: number, lon: number }, show: boolean }) {
    const { viewer } = useCesium();
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    // Initial Generation when enabled
    useEffect(() => {
        if (show && proposals.length === 0 && !loading) {
            setLoading(true);
            generateProposals(center).then(data => {
                setProposals(data);
                setLoading(false);
            });
        }
    }, [show, center]);

    // Cleanup when hidden
    useEffect(() => {
        if (!show) {
            setProposals([]);
            setSelectedProposal(null);
        }
    }, [show]);

    if (!show) return null;

    return (
        <>
            {/* 3D Visualizations of Proposals */}
            {proposals.map((p) => (
                <Entity
                    key={p.id}
                    position={Cartesian3.fromDegrees(p.location.lon, p.location.lat)}
                    point={{
                        pixelSize: 14,
                        color: Color.fromCssColorString('#10B981'), // Neon Emerald
                        outlineColor: Color.WHITE,
                        outlineWidth: 2
                    }}
                    // Cinematic Cylinder to represent the "Zone" volume
                    cylinder={{
                        length: 1500, // 1.5km tall
                        topRadius: 300, // 300m wide
                        bottomRadius: 300,
                        material: new ColorMaterialProperty(Color.fromCssColorString('#10B981').withAlpha(0.4)),
                        outline: true,
                        outlineColor: Color.fromCssColorString('#10B981').withAlpha(0.8),
                        outlineWidth: 2
                    }}
                    description={p.description}
                    onClick={() => setSelectedProposal(p)}
                />
            ))}

            {/* Loading State Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                    >
                        <div className="bg-black/60 backdrop-blur-md border border-neon-emerald/30 p-4 rounded-xl flex items-center gap-3 shadow-2xl">
                            <div className="w-5 h-5 border-2 border-neon-emerald border-t-transparent rounded-full animate-spin" />
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-xs uppercase tracking-widest">Vertex AI</span>
                                <span className="text-[10px] text-neon-emerald/80">Generating Proposals...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Proposal Details Card (GCP Branding) */}
            <AnimatePresence>
                {/* Always show list summary if not loading */}
                {!loading && proposals.length > 0 && !selectedProposal && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-6 left-6 z-50 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 w-[280px]"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-bold text-xs uppercase tracking-widest">Vertex AI Plan</h3>
                            <span className="text-[9px] bg-neon-emerald/20 text-neon-emerald px-2 py-0.5 rounded border border-neon-emerald/30">CONFIDENCE 92%</span>
                        </div>
                        <div className="space-y-2">
                            {proposals.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setSelectedProposal(p)}
                                    className="w-full text-left p-2 rounded bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                                >
                                    <span className="text-[10px] text-white/70 group-hover:text-white transition-colors">{p.title}</span>
                                    <span className="text-[10px] font-mono text-neon-emerald">{p.impact}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Selected Proposal Detail */}
                {selectedProposal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-6 left-6 z-50 bg-black/90 backdrop-blur-xl border border-neon-emerald/30 rounded-xl p-5 w-[320px] shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                    >
                        <button
                            onClick={() => setSelectedProposal(null)}
                            className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-neon-emerald shadow-[0_0_10px_#10B981]" />
                            <span className="text-[10px] font-black text-neon-emerald uppercase tracking-[0.2em]">Optimization Candidate</span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">{selectedProposal.title}</h3>
                        <p className="text-xs text-white/60 leading-relaxed mb-4">{selectedProposal.description}</p>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Proj. Impact</div>
                                <div className="text-sm font-bold text-neon-emerald">{selectedProposal.impact}</div>
                            </div>
                            <div className="bg-white/5 p-2 rounded border border-white/5">
                                <div className="text-[9px] text-white/30 uppercase tracking-wider mb-1">Est. Cost</div>
                                <div className="text-sm font-bold text-white">${selectedProposal.cost.toLocaleString()}</div>
                            </div>
                        </div>

                        <button className="w-full py-2 bg-neon-emerald text-black font-bold text-[10px] uppercase tracking-widest rounded hover:bg-emerald-400 transition-colors text-center">
                            Auto-Deploy via Cloud Run
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
