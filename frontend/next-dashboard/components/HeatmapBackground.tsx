"use client";

import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

interface Hotspot {
    x: number;
    y: number;
    intensity: number;
    radius: number;
    velocity: { x: number; y: number };
}

export default function HeatmapBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate stable hotspots
    const hotspots = useMemo(() => {
        const count = 40;
        const spots: Hotspot[] = [];
        for (let i = 0; i < count; i++) {
            spots.push({
                x: Math.random() * 100,
                y: Math.random() * 100,
                intensity: 0.2 + Math.random() * 0.8,
                radius: 100 + Math.random() * 200,
                velocity: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                }
            });
        }
        return spots;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            hotspots.forEach(spot => {
                // Update position (drift)
                spot.x += spot.velocity.x;
                spot.y += spot.velocity.y;

                // Bounce off bounds
                if (spot.x < 0 || spot.x > 100) spot.velocity.x *= -1;
                if (spot.y < 0 || spot.y > 100) spot.velocity.y *= -1;

                const pixelX = (spot.x / 100) * canvas.width;
                const pixelY = (spot.y / 100) * canvas.height;

                const gradient = ctx.createRadialGradient(
                    pixelX, pixelY, 0,
                    pixelX, pixelY, spot.radius
                );

                // Color Ramp inspired by reference image: Blue -> Cyan -> Green -> Yellow -> Red
                const alpha = 0.15 * spot.intensity;
                gradient.addColorStop(0, `rgba(239, 68, 68, ${alpha})`);     // Red (Core)
                gradient.addColorStop(0.2, `rgba(245, 158, 11, ${alpha * 0.8})`); // Yellow
                gradient.addColorStop(0.4, `rgba(16, 185, 129, ${alpha * 0.5})`); // Emerald/Green
                gradient.addColorStop(0.6, `rgba(6, 182, 212, ${alpha * 0.3})`);  // Cyan
                gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);               // Transparent Blue Edge

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [hotspots]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050C09]">
            <canvas
                ref={canvasRef}
                className="opacity-20"
            />
            {/* Scanline / HUD Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 pointer-events-none bg-[length:100%_4px,3px_100%]" />

            {/* Static stylized urban map overlay (subtle lines) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] text-neon-emerald" viewBox="0 0 1000 1000" preserveAspectRatio="none">
                <path d="M0,200 L1000,200 M0,400 L1000,400 M0,600 L1000,600 M0,800 L1000,800" stroke="currentColor" strokeWidth="1" />
                <path d="M200,0 L200,1000 M400,0 L400,1000 M600,0 L600,1000 M800,0 L800,1000" stroke="currentColor" strokeWidth="1" />
                <path d="M100,100 L900,900 M100,900 L900,100" stroke="currentColor" strokeWidth="0.5" />
            </svg>
        </div>
    );
}
