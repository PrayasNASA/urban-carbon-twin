"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, MapPin } from "lucide-react";

interface City {
    id: string;
    name: string;
    center: { lat: number; lon: number };
}

export default function CitySelector({ onCityChange }: { onCityChange: (city: City) => void }) {
    const [cities, setCities] = useState<City[]>([]);
    const [selected, setSelected] = useState<City | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_GATEWAY}/gis/city/presets`);
                if (res.ok) {
                    const data = await res.json();
                    setCities(data);
                }
            } catch (e) {
                console.error("Failed to load cities", e);
                setCities([{ id: "new_delhi", name: "New Delhi", center: { lat: 28.6139, lon: 77.2090 } }]);
            }
        };
        fetchCities();
    }, []);

    const handleSelect = (city: City | null) => {
        setSelected(city);
        setIsOpen(false);
        onCityChange(city as any);
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/5 transition-all group"
            >
                <div className="p-1.5 rounded-lg bg-neon-emerald/10 text-neon-emerald group-hover:bg-neon-emerald/20 transition-colors">
                    <Globe2 className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active Region</p>
                    <p className="text-sm font-bold text-white uppercase tracking-wider">{selected ? selected.name : "Global System"}</p>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full text-left mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                    >
                        {/* Global Option */}
                        <button
                            onClick={() => handleSelect(null)}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${!selected ? "bg-neon-emerald/10" : ""}`}
                        >
                            <Globe2 className={`w-3 h-3 ${!selected ? "text-neon-emerald" : "text-white/30"}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${!selected ? "text-neon-emerald" : "text-white/70"}`}>
                                Global Earth View
                            </span>
                        </button>

                        <div className="h-px bg-white/5 mx-2 my-1" />

                        {cities.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => handleSelect(city)}
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${selected?.id === city.id ? "bg-neon-emerald/10" : ""}`}
                            >
                                <MapPin className={`w-3 h-3 ${selected?.id === city.id ? "text-neon-emerald" : "text-white/30"}`} />
                                <span className={`text-xs font-bold uppercase tracking-wider ${selected?.id === city.id ? "text-neon-emerald" : "text-white/70"}`}>
                                    {city.name}
                                </span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
