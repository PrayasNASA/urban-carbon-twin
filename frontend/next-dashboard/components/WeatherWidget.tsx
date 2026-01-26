"use client";

import { motion } from "framer-motion";
import { Wind, Thermometer, Droplets, Compass } from "lucide-react";

interface WeatherData {
    wind_speed: number;
    wind_deg: number;
    temp: number;
    humidity: number;
}

export default function WeatherWidget({ data }: { data: WeatherData | null }) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-xl hover:bg-white/10 transition-all group"
        >
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Atmospheric Sync</span>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Live_Sensing</span>
                </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            <div className="flex items-center gap-8">
                {/* Wind */}
                <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover/item:text-blue-400 group-hover/item:bg-blue-400/10 transition-all">
                        <Wind className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-tight">Wind</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white tabular-nums">{data.wind_speed.toFixed(1)}</span>
                            <span className="text-[10px] text-white/40 font-medium">m/s</span>
                        </div>
                    </div>
                </div>

                {/* Wind Direction */}
                <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover/item:text-amber-400 group-hover/item:bg-amber-400/10 transition-all">
                        <motion.div
                            animate={{ rotate: data.wind_deg }}
                            transition={{ type: "spring", stiffness: 50 }}
                        >
                            <Compass className="w-4 h-4" />
                        </motion.div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-tight">Flow</span>
                        <span className="text-sm font-bold text-white tabular-nums">{data.wind_deg.toFixed(0)}°</span>
                    </div>
                </div>

                {/* Temp */}
                <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover/item:text-orange-400 group-hover/item:bg-orange-400/10 transition-all">
                        <Thermometer className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-tight">Temp</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white tabular-nums">{data.temp.toFixed(1)}</span>
                            <span className="text-[10px] text-white/40 font-medium">°C</span>
                        </div>
                    </div>
                </div>

                {/* Humidity */}
                <div className="flex items-center gap-3 group/item">
                    <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover/item:text-cyan-400 group-hover/item:bg-cyan-400/10 transition-all">
                        <Droplets className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-white/30 uppercase font-bold tracking-tight">RH</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white tabular-nums">{data.humidity.toFixed(0)}</span>
                            <span className="text-[10px] text-white/40 font-medium">%</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
