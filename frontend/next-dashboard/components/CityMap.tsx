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
        }
    }, [center, map]);
    return null;
};

export default function CityMap({ dispersion, optimizationPlan, comparisonData, initialCenter }: { dispersion?: any; optimizationPlan?: any; comparisonData?: any; initialCenter?: [number, number] }) {
    const [mounted, setMounted] = useState(false);

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
        if (val > 300) return '#7f1d1d'; // Severe (Dark Red)
        if (val > 200) return '#7c3aed'; // Very Unhealthy (Purple) - Matches Image 2
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

                    const con = typeof g.concentration === 'number' ? g.concentration : (g.aqi || 50);
                    const color = getColor(con);

                    return (
                        <Polygon
                            key={`${g.grid_id}-${i}`}
                            positions={positions}
                            pathOptions={{
                                color: color,
                                weight: 1,
                                opacity: 0.6,
                                fillOpacity: 0.4,
                                fillColor: color
                            }}
                        >
                            <Popup className="glass-popup">
                                <div className="p-2 min-w-[150px]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Zone Analysis</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 mb-1">Desc-{String(g.grid_id).padStart(3, '0')}</h3>
                                    <div className="text-2xl font-bold tabular-nums text-slate-900">
                                        {Math.round(con)} <span className="text-xs font-medium text-slate-400">AQI</span>
                                    </div>
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

            {/* Legend Overlay */}
            <div className="absolute bottom-6 left-6 z-[400] bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Concentration Zones</h4>
                <div className="space-y-2">
                    {[
                        { label: 'Very Unhealthy (200+)', color: '#7c3aed' }, // Purple
                        { label: 'Unhealthy (150-200)', color: '#dc2626' },   // Red
                        { label: 'Sensitive (100-150)', color: '#f97316' },   // Orange
                        { label: 'Moderate (50-100)', color: '#facc15' },     // Yellow
                        { label: 'Good (0-50)', color: '#10b981' }            // Green
                    ].map((item) => (
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
