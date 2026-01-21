"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LandingPage({ onInitialize }: { onInitialize: () => void }) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.6)",
                repeat: -1,
                yoyo: true,
                duration: 1.5,
                ease: "sine.inOut"
            });
        }
    }, []);

    return (
        <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center bg-black">
            {/* Background Video Placeholder */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-canopy-and-sky-seen-from-below-1191-large.mp4" type="video/mp4" />
                {/* Fallback to image if video fails or for development */}
            </video>

            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 max-w-2xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-4">
                        Urban Carbon <span className="text-neon-emerald">Twin</span>
                    </h1>
                    <p className="text-lg md:text-xl text-emerald-50/80 font-medium tracking-wide">
                        Biophilic Simulation & Carbon Sequestration Modeling
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                >
                    <button
                        ref={buttonRef}
                        onClick={onInitialize}
                        className="group relative px-10 py-4 bg-neon-emerald/20 border border-neon-emerald/50 rounded-full text-neon-emerald font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-neon-emerald hover:text-white"
                    >
                        <span className="relative z-10 italic">Initialize Simulation</span>
                        {/* Ripple Effect Element */}
                        <span className="absolute inset-0 bg-neon-emerald opacity-0 group-active:opacity-10 group-active:scale-150 transition-all duration-500 rounded-full pointer-events-none" />

                        {/* Inner Glow */}
                        <div className="absolute inset-0 rounded-full border border-neon-emerald/30 group-hover:border-white/50 transition-colors" />
                    </button>
                </motion.div>
            </div>

            {/* Decorative Organic Shapes */}
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-neon-emerald/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
    );
}
