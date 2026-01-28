"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeatmapBackground from "@/components/HeatmapBackground";
import Link from 'next/link';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Removed scroll-linked animations to ensure visibility
  // const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  // const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <main
      ref={containerRef}
      className="min-h-screen overflow-hidden relative bg-black text-white font-sans selection:bg-neon-emerald selection:text-black"
    >
      <HeatmapBackground scrollProgress={scrollYProgress} />

      <motion.section
        style={{ opacity: 1 }}
        className="h-screen w-full flex flex-col items-center justify-center relative z-20"
      >
        <div className="text-center space-y-8 max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-emerald"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">System Online • v4.2</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              Urban Carbon <br />
              <span className="text-neon-emerald">Twin</span>
            </h1>

            <p className="text-sm md:text-lg text-white/50 max-w-xl font-medium leading-relaxed">
              A high-frequency digital twin for urban decarbonization. Simulate policy impacts, visualize pollution dynamics, and execute AI-driven infrastructure interventions in real-time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center pt-8"
          >
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-neon-emerald text-black font-bold uppercase tracking-widest text-xs rounded-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-3">
                Initialize Simulation
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
              </span>
            </Link>

            <Link
              href="/user_book.pdf"
              target="_blank"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-white/10 transition-colors"
            >
              View Documentation
            </Link>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-12 w-full text-center">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">Powered by Google Cloud Platform • Vertex AI • BigQuery</p>
        </div>
      </motion.section>
    </main>
  );
}
