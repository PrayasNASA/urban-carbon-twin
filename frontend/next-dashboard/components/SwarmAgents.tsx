"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useCesium } from 'resium';
import { Cartesian3, Color, CallbackProperty } from 'cesium';
import dynamic from 'next/dynamic';

// Entity dynamic import
const Entity = dynamic(() => import("resium").then((mod) => mod.Entity), { ssr: false });

interface Agent {
    id: number;
    position: Cartesian3;
    velocity: Cartesian3;
}

export default function SwarmAgents({ target }: { target: { lat: number, lon: number } }) {
    const { viewer } = useCesium();
    const [agents, setAgents] = useState<Agent[]>([]);
    const lastUpdateTime = useRef(Date.now());
    const animationFrameRef = useRef<number | null>(null);

    // Initialize Swarm
    useEffect(() => {
        const initialAgents: Agent[] = [];
        for (let i = 0; i < 40; i++) {
            // Spawn agents randomly around the target
            const latOffset = (Math.random() - 0.5) * 0.05;
            const lonOffset = (Math.random() - 0.5) * 0.05;
            const alt = 500 + Math.random() * 1000;

            initialAgents.push({
                id: i,
                position: Cartesian3.fromDegrees(target.lon + lonOffset, target.lat + latOffset, alt),
                velocity: new Cartesian3(0, 0, 0) // Will be calculated in loop
            });
        }
        setAgents(initialAgents);
    }, [target]);

    // Animation Loop (Simulating Cloud Run Logic)
    useEffect(() => {
        if (!viewer) return;

        const animate = () => {
            const now = Date.now();
            const dt = (now - lastUpdateTime.current) / 1000;
            lastUpdateTime.current = now;

            setAgents(prevAgents => {
                return prevAgents.map(agent => {
                    // TODO: Implement simple boids/attraction logic here if needed for smoother animation
                    // For now, let's just make them orbit/hover slightly or static since Cartesians are immutable-ish in state
                    // Actually, modifying Cartesian3 in react state loop is heavy.
                    // Better approach for Cesium: Use CallbackProperty for position if frequent updates.
                    return agent;
                });
            });

            // For this version, we will let Cesium's CallbackProperty handle positions if we want movement
            // Or just re-render infrequent updates.
            // Let's stick to static swarm creation for v1 to ensure performance, 
            // visualizing them "Converging" on the target.
        };

        // animationFrameRef.current = requestAnimationFrame(animate); 
        // return () => cancelAnimationFrame(animationFrameRef.current!);
    }, [viewer]);

    if (agents.length === 0) return null;

    return (
        <>
            {agents.map(agent => (
                <Entity
                    key={agent.id}
                    position={agent.position}
                    point={{
                        pixelSize: 4,
                        color: Color.CYAN,
                        outlineColor: Color.BLACK,
                        outlineWidth: 1
                    }}
                    // Trail
                    path={{
                        resolution: 1,
                        material: Color.CYAN.withAlpha(0.3),
                        width: 1
                    }}
                />
            ))}

            {/* Swarm Status Indicator */}
            <div className="absolute bottom-24 right-6 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-cyan-500/30 flex items-center gap-3">
                <div className="flex flex-col">
                    <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">Cloud Run Swarm</span>
                    <span className="text-[9px] text-white/50">Active Agents: {agents.length}</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_cyan]" />
            </div>
        </>
    );
}
