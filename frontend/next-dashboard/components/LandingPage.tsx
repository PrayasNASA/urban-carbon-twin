"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LandingPage({ onInitialize }: { onInitialize: () => void }) {
    const [currentFrame, setCurrentFrame] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFrame(prev => (prev % 40) + 1);
        }, 120); // Slightly slower for better perception of each frame
        return () => clearInterval(interval);
    }, []);

    const handleScrollToDashboard = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-black snap-start">
            {/* Image Frame Sequencer */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={`/co2-background-images/ezgif-frame-${currentFrame.toString().padStart(3, '0')}.jpg`}
                    alt="Atmospheric CO2 Migration"
                    className="w-full h-full object-cover opacity-95 scale-105 transition-opacity duration-300"
                />
            </div>

            {/* Frosted Glass Overlay with Section Bleed Gradient */}
            <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-b from-black/20 via-black/30 to-background" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 max-w-4xl px-6 mx-auto h-full flex flex-col justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                >
                    <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-6">
                        Urban Carbon <span className="text-neon-emerald">Twin</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-50/90 font-medium tracking-[0.15em] uppercase">
                        Biophilic Simulation & Carbon Sequestration Modeling
                    </p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-neon-emerald opacity-70 cursor-pointer"
                onClick={handleScrollToDashboard}
            >
                <span className="text-[11px] uppercase tracking-[0.5em] font-bold italic">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-px h-16 bg-gradient-to-b from-neon-emerald to-transparent"
                />
            </motion.div>

            {/* Decorative Organic Shapes (More subtle now) */}
            <div className="absolute top-[15%] left-[10%] w-96 h-96 bg-neon-emerald/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[150px] animate-pulse delay-700" />
        </div>
    );
}
