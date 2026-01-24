"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Popup, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

// Component to handle map view updates
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 13); // Slightly zoomed out for regional view
    }, [center, map]);
    return null;
}

export default function CityMap({ dispersion, optimizationPlan, initialCenter }: { dispersion: any; optimizationPlan?: any; initialCenter?: [number, number] }) {
    const grids = dispersion?.results || [];
    const [center, setCenter] = useState<[number, number] | null>(initialCenter || null);
    const [selectedFeature, setSelectedFeature] = useState<any>(null);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    // Update center when initialCenter changes
    useEffect(() => {
        if (initialCenter) {
            setCenter(initialCenter);
        }
    }, [initialCenter]);

    // Calculate center based on grids if needed
    useEffect(() => {
        if (grids.length > 0 && typeof grids[0].lat === 'number') {
            const mid = grids[Math.floor(grids.length / 2)];
            if (typeof mid.lat === 'number' && typeof mid.lon === 'number') {
                setCenter([mid.lat, mid.lon]);
            }
        }
    }, [grids]);

    const geoJsonData = useMemo(() => {
        if (!grids.length) return null;
        return {
            type: "FeatureCollection",
            features: grids.filter((g: any) => g.geometry).map((g: any) => ({
                type: "Feature",
                properties: {
                    id: g.grid_id,
                    concentration: g.concentration,
                    ...g
                },
                geometry: g.geometry
            }))
        };
    }, [grids]);

    const getColor = (val: number) => {
        if (val >= 80) return '#e11d48'; // Rose-600
        if (val >= 50) return '#f59e0b'; // Amber-500
        return '#10b981'; // Emerald-500
    };

    const style = (feature: any) => {
        const val = feature.properties.concentration;
        const color = getColor(val);
        const isSelected = selectedFeature === feature.properties.id;

        return {
            fillColor: color,
            weight: isSelected ? 3 : 1,
            opacity: 1,
            color: isSelected ? (theme === 'dark' ? '#ffffff' : '#000000') : color,
            dashArray: '',
            fillOpacity: isSelected ? 0.8 : 0.6
        };
    };

    const onEachFeature = (feature: any, layer: any) => {
        layer.on({
            mouseover: (e: any) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: theme === 'dark' ? '#ffffff' : '#000000',
                    fillOpacity: 0.9
                });
            },
            mouseout: (e: any) => {
                const layer = e.target;
                const isSelected = selectedFeature === feature.properties.id;
                layer.setStyle({
                    weight: isSelected ? 3 : 1,
                    color: isSelected ? (theme === 'dark' ? '#ffffff' : '#000000') : getColor(feature.properties.concentration),
                    fillOpacity: isSelected ? 0.8 : 0.6
                });
            },
            click: (e: any) => {
                setSelectedFeature(feature.properties.id);
                // Can bubble up selection here if needed
            }
        });
    };

    if (!center) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white/50">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" />
                    <span className="text-xs uppercase tracking-widest">Initializing Satellites...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative z-0 group">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full rounded-xl z-0"
                style={{ background: theme === 'dark' ? '#0a0a0a' : '#f0f0f0' }}
            >
                <TileLayer
                    attribution='&copy; CARTO'
                    url={theme === 'dark'
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    }
                />

                <MapUpdater center={center} />

                {geoJsonData && (
                    <GeoJSON
                        // Force re-render on data change or theme change
                        key={`${optimizationPlan?.simulation_id || grids.length}-${theme}`}
                        data={geoJsonData as any}
                        style={style}
                        onEachFeature={onEachFeature}
                    >
                        {/* We use standard popups for now, simple content */}
                    </GeoJSON>
                )}
            </MapContainer>

            {/* Theme Toggle Button */}
            <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
                <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="bg-black/80 backdrop-blur-md border border-white/20 text-white p-2 rounded-lg shadow-xl hover:bg-black hover:scale-105 transition-all"
                    title="Toggle Map Theme"
                >
                    {theme === 'dark' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    )}
                </button>
            </div>

            {/* Floating Legend */}
            <div className={`absolute bottom-6 right-6 z-[1000] backdrop-blur-md border p-4 rounded-xl shadow-2xl transition-colors duration-300 ${theme === 'dark'
                ? 'bg-black/80 border-white/10 text-white'
                : 'bg-white/90 border-black/10 text-black'
                }`}>
                <div className={`text-[10px] uppercase font-bold tracking-widest mb-3 ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>Concentration Zones</div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm bg-rose-600 shadow-[0_0_8px_#e11d48]" />
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>Hazardous (80+)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>Moderate (50-79)</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                        <span className={`text-xs font-medium ${theme === 'dark' ? 'text-white/80' : 'text-black/80'}`}>Safe (0-49)</span>
                    </div>
                </div>
            </div>

            {/* Selected Region info (if any) */}
            {selectedFeature && (
                <div className="absolute top-6 left-6 z-[1000] bg-black/90 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-2xl animate-in slide-in-from-left-4 fade-in duration-300">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-white tracking-widest">Zone Analysis</span>
                    </div>
                    <div className="text-lg font-bold text-white">
                        {grids.find((g: any) => g.grid_id === selectedFeature)?.grid_id}
                    </div>
                    <div className="text-sm font-mono text-emerald-400 mt-1">
                        {grids.find((g: any) => g.grid_id === selectedFeature)?.concentration.toFixed(2)} <span className="text-white/40">ppm</span>
                    </div>
                </div>
            )}
        </div>
    );
}
