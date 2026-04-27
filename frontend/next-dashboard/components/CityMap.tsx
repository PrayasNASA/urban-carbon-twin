"use client";

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js/Leaflet
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 13, { duration: 2 });
            // Ensure map redraws correctly after transition
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }
    }, [center, map]);
    return null;
};

export default function CityMap({ dispersion, optimizationPlan, comparisonData, initialCenter }: { dispersion?: any; optimizationPlan?: any; comparisonData?: any; initialCenter?: [number, number] }) {
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState<'initial' | 'optimized'>('optimized');

    useEffect(() => {
        setMounted(true);
        // Fix Leaflet icon issue
        (async () => {
            // Check if window is defined (client-side)
            if (typeof window !== 'undefined') {
                // @ts-ignore
                delete L.Icon.Default.prototype._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: iconRetinaUrl,
                    iconUrl: iconUrl,
                    shadowUrl: shadowUrl,
                });
            }
        })();
    }, []);

    const grids = useMemo(() => {
        return dispersion?.results || comparisonData?.scenario_b?.plan?.post_mitigation || [];
    }, [dispersion, comparisonData]);

    const centerPos: [number, number] = initialCenter
        ? initialCenter
        : (grids.length > 0 && grids[0].geometry
            ? [grids[0].geometry.coordinates[0][0][1], grids[0].geometry.coordinates[0][0][0]]
            : [28.6139, 77.2090]); // Default New Delhi

    const getColor = (val: number) => {
        if (val > 300) return '#831843'; // Hazardous (Maroon)
        if (val > 200) return '#7c3aed'; // Very Unhealthy (Purple)
        if (val > 150) return '#dc2626'; // Unhealthy (Red)
        if (val > 100) return '#f97316'; // Sensitive (Orange)
        if (val > 50) return '#facc15';  // Moderate (Yellow)
        return '#10b981';                // Good (Green)
    };

    if (!mounted) return <div className="h-full w-full bg-black/40 animate-pulse flex items-center justify-center text-emerald-500 font-mono text-xs">LOADING GEOSPATIAL ENGINE...</div>;

    return (
        <div className="w-full h-full relative z-0 group rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black">
            <style jsx global>{`
                .leaflet-popup-content-wrapper, .leaflet-popup-tip {
                    background: rgba(0, 0, 0, 0.8) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important;
                    color: white !important;
                }
                .leaflet-container {
                    background: #000 !important;
                }
            `}</style>
            <MapContainer
                center={centerPos}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#000' }}
                zoomControl={false}
                attributionControl={false}
            >
                <ZoomControl position="topright" />

                {/* Dark Matter Basemap - Matches Image 2 */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                <MapUpdater center={centerPos} />

                {/* Hexagonal Grids */}
                {grids.map((g: any, i: number) => {
                    if (!g.geometry || !g.geometry.coordinates) return null;

                    // GeoJSON coordinates are [lon, lat], Leaflet wants [lat, lon]
                    const positions: [number, number][] = g.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);

                    const initialCon = typeof g.concentration === 'number' ? g.concentration : (g.aqi || 50);
                    
                    let displayCon = initialCon;
                    let interventionName = null;
                    let expectedReduction = 0;

                    if (viewMode === 'optimized' && optimizationPlan?.plan) {
                        const intervention = optimizationPlan.plan.find((p: any) => p.grid_id === g.grid_id);
                        if (intervention) {
                            expectedReduction = intervention.expected_reduction;
                            interventionName = intervention.intervention;
                            displayCon = Math.max(0, initialCon - expectedReduction);
                        }
                    }

                    const color = getColor(displayCon);

                    return (
                        <Polygon
                            key={`${g.grid_id}-${i}-${viewMode}`}
                            positions={positions}
                            pathOptions={{
                                color: color,
                                weight: interventionName ? 2 : 1, // Highlight intervened grids
                                opacity: 0.8,
                                fillOpacity: 0.4,
                                fillColor: color,
                                dashArray: interventionName ? "4" : undefined
                            }}
                        >
                            <Popup className="glass-popup">
                                <div className="p-2 min-w-[150px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Zone Analysis</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-1">{g.grid_id}</h3>
                                    
                                    <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-2">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-slate-400 font-bold uppercase">Initial</span>
                                            <span className="text-lg font-bold text-slate-600">{Math.round(initialCon)}</span>
                                        </div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] text-emerald-500 font-bold uppercase">Current</span>
                                            <span className="text-2xl font-black text-slate-900">{Math.round(displayCon)}</span>
                                        </div>
                                    </div>

                                    {interventionName && (
                                        <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                                            <div className="text-[9px] font-bold text-emerald-600 uppercase mb-1">Intervention Active</div>
                                            <div className="text-xs font-bold text-slate-800">{interventionName.replace(/_/g, ' ')}</div>
                                            <div className="text-[10px] font-bold text-emerald-600 mt-1">Reduction: -{expectedReduction.toFixed(0)} AQI</div>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Polygon>
                    );
                })}

            </MapContainer>

            {/* Custom Leaflet Attribution (Bottom Right) - Matches Image 2 */}
            <div className="absolute bottom-1 right-1 bg-white/10 backdrop-blur-sm px-2 py-0.5 text-[9px] text-white/50 z-[400] rounded-tl-md">
                Leaflet | © CARTO
            </div>

            {/* Before/After Toggle Overlay */}
            {optimizationPlan?.plan?.length > 0 && (
                <div className="absolute top-6 left-6 z-[400] bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-xl shadow-2xl flex gap-2">
                    <button
                        onClick={() => setViewMode('initial')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                            viewMode === 'initial' 
                                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50' 
                                : 'bg-transparent text-white/40 hover:text-white border border-transparent'
                        }`}
                    >
                        Before Intervention
                    </button>
                    <button
                        onClick={() => setViewMode('optimized')}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                            viewMode === 'optimized' 
                                ? 'bg-neon-emerald/20 text-neon-emerald border border-neon-emerald/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                                : 'bg-transparent text-white/40 hover:text-white border border-transparent'
                        }`}
                    >
                        After Intervention
                    </button>
                </div>
            )}

            {/* Legend Overlay */}
            {/* /* and this is absoule the bottom and the text */ }
            <div className="absolute bottom-6 left-6 z-[400] bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Concentration Zones</h4>
                <div className="space-y-2">
                    {[
                        { label: 'Hazardous (300+)', color: '#831843' },      // Maroon
                        { label: 'Very Unhealthy (200-300)', color: '#7c3aed' }, // Purple
                        { label: 'Unhealthy (150-200)', color: '#dc2626' },   // Red
                        { label: 'Sensitive (100-150)', color: '#f97316' },   // Orange
                        { label: 'Moderate (50-100)', color: '#facc15' },     // Yellow
                        { label: 'Good (0-50)', color: '#10b981' }            // Green
                    ].map((item) => (
                        // add this point in the middle of the map and this is not doing the same as the upooer is doning writ this
                        <div key={item.label} className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-tight">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
