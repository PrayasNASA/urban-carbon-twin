"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface EnvironmentalPanelProps {
    data: any;
    onSimulate: () => void;
}

const PollutantItem = ({ label, value, unit, max = 200 }: any) => {
    const percentage = Math.min((value / max) * 100, 100);
    let color = "bg-emerald-500";
    if (value > 50) color = "bg-amber-500";
    if (value > 100) color = "bg-rose-500";
    if (value > 200) color = "bg-purple-500";

    return (
        <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{label}</span>
                <span className="text-xs font-mono text-white/80">{value} <span className="text-[9px] text-white/30">{unit}</span></span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    );
};

const WeatherItem = ({ icon, label, value, unit }: any) => (
    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-white/5 min-w-[70px]">
        <div className="text-emerald-400 mb-2">{icon}</div>
        <div className="text-xs font-bold text-white mb-0.5">{value}</div>
        <div className="text-[9px] text-white/40 font-medium uppercase tracking-wide">{label}</div>
    </div>
);

export default function EnvironmentalPanel({ data, onSimulate }: EnvironmentalPanelProps) {
    if (!data || !data.full_details) return null;

    const { pollutants, weather, aqi } = data.full_details;
    const locationName = data.place_name || "Selected Location";

    // Dynamic AQI State
    let aqiLabel = "Good";
    let aqiColor = "text-emerald-500";
    let aqiBg = "from-emerald-500/20 to-emerald-900/10";

    if (aqi > 50) { aqiLabel = "Moderate"; aqiColor = "text-amber-500"; aqiBg = "from-amber-500/20 to-amber-900/10"; }
    if (aqi > 100) { aqiLabel = "Unhealthy"; aqiColor = "text-rose-500"; aqiBg = "from-rose-500/20 to-rose-900/10"; }
    if (aqi > 200) { aqiLabel = "Severe"; aqiColor = "text-purple-500"; aqiBg = "from-purple-500/20 to-purple-900/10"; }
    if (aqi > 300) { aqiLabel = "Hazardous"; aqiColor = "text-red-600"; aqiBg = "from-red-600/20 to-red-900/10"; }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute top-4 right-4 z-50 w-[380px] bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]"
        >
            {/* Header / AQI Main */}
            <div className={`p-6 bg-gradient-to-br ${aqiBg} border-b border-white/5 relative`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-white font-bold text-lg leading-tight tracking-tight">{locationName}</h2>
                        <p className="text-xs text-white/50 font-mono mt-1">{data.location.lat.toFixed(3)}°N, {data.location.lon.toFixed(3)}°E</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${aqiColor.replace('text-', 'bg-')} animate-pulse`} />
                        <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Live Station</span>
                    </div>
                </div>

                <div className="mt-6 flex items-baseline gap-2">
                    <span className={`text-6xl font-black tracking-tighter ${aqiColor}`}>{aqi}</span>
                    <div className="flex flex-col">
                        <span className="text-sm text-white/40 font-bold uppercase tracking-widest">US AQI</span>
                        <span className={`text-lg font-bold ${aqiColor}`}>{aqiLabel}</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">

                {/* Pollutants Grid */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20" /></svg>
                            Pollutants
                        </h3>
                        <span className="text-[9px] text-white/30 uppercase">µg/m³</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {pollutants && Object.entries(pollutants).map(([key, p]: any) => (
                            <PollutantItem key={key} label={p.label} value={p.value} unit={p.unit} />
                        ))}
                    </div>
                </div>

                {/* Weather Row */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        Conditions
                    </h3>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <WeatherItem
                            label="Temp"
                            value={`${weather?.temp}°`}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" /></svg>}
                        />
                        <WeatherItem
                            label="Wind"
                            value={weather?.wind_speed}
                            unit="km/h"
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></svg>}
                        />
                        <WeatherItem
                            label="Humidity"
                            value={`${weather?.humidity}%`}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>}
                        />
                        <WeatherItem
                            label="Rain"
                            value={`${weather?.precipitation}mm`}
                            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 16.2A4.5 4.5 0 0 0 5.1 12.3 4.58 4.58 0 0 0 2.2 16.2M8 20v2M12 20v2M16 20v2" /></svg>}
                        />
                    </div>
                </div>

                {/* Simulation Action */}
                <button
                    onClick={onSimulate}
                    className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-xl transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 mt-4"
                >
                    <span>Run Carbon Simulation</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </button>
            </div>
        </motion.div>
    );
}
