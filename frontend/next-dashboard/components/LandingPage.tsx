"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

interface LandingPageProps {
    onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-midnight-dark">
            {/* Background Video/Image */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover scale-105 grayscale-[20%] opacity-80"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" type="video/mp4" />
                </video>
                {/* Frosted Glass Overlay */}
                <div className="absolute inset-0 bg-midnight-dark/60 backdrop-blur-[3px]" />
            </div>

            {/* Floating Organic Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -50, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-24 -right-24 w-[30rem] h-[30rem] bg-emerald-900/20 rounded-full blur-3xl"
                />
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center px-6 max-w-4xl"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
                    className="inline-flex items-center justify-center mb-10"
                >
                    <div className="w-24 h-24 rounded-full glass flex items-center justify-center border-emerald-500/30 p-1">
                        <div className="w-full h-full rounded-full border border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
                            <Leaf className="w-12 h-12 text-emerald-400 fill-emerald-400/10" />
                        </div>
                    </div>
                </motion.div>

                <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                    URBAN <br />
                    <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">CARBON TWIN</span>
                </h1>

                <p className="max-w-2xl mx-auto text-emerald-100/70 text-lg md:text-xl mb-14 font-medium leading-relaxed tracking-tight">
                    Overhauling the relationship between urban density and natural equilibrium through advanced biophilic simulation.
                </p>

                <motion.button
                    onClick={onStart}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(16, 185, 129, 0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-10 py-5 glass border-emerald-500/40 rounded-full transition-all duration-500 overflow-hidden"
                >
                    {/* Inner Light Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                    <span className="relative z-10 text-emerald-50 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-4">
                        Initialize Simulation
                        <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            →
                        </motion.div>
                    </span>

                    {/* Ripple Effect Utility from globals.css */}
                    <div className="absolute inset-0 rounded-full animate-ripple pointer-events-none opacity-50" />
                </motion.button>
            </motion.div>

            {/* Decorative Grid Overlay */}
            <div className="absolute inset-0 z-5 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            {/* Bottom Label */}
            <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
                <div className="glass px-4 py-2 rounded-full border-emerald-500/10">
                    <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[0.3em]">System v4.0.2 Stable</span>
                </div>
            </div>
        </div>
    );
}
