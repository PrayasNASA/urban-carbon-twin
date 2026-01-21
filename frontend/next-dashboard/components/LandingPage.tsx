"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LandingPage({ onInitialize }: { onInitialize: () => void }) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Aesthetic entry animation if needed in future
    }, []);

    const handleScrollToDashboard = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black snap-start">
            {/* Background Video Placeholder */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-forest-canopy-and-sky-seen-from-below-1191-large.mp4" type="video/mp4" />
            </video>

            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 backdrop-blur-md bg-black/30" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 max-w-2xl px-6 mx-auto h-full flex flex-col justify-center items-center">
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

            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neon-emerald/50"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Begin</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-px h-12 bg-gradient-to-b from-neon-emerald to-transparent"
                />
            </motion.div>

            {/* Decorative Organic Shapes */}
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-neon-emerald/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-emerald-900/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>
    );
}
