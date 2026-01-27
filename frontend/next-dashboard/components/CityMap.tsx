"use client";

import { useEffect, useMemo, useState, useRef } from 'react';
import { Cartesian3, Color, Math as CesiumMath, Cesium3DTileStyle, Cartographic } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import dynamic from 'next/dynamic';
import { useCesium } from "resium";

// Dynamically import Resium components
const Viewer = dynamic(() => import("resium").then((mod) => mod.Viewer), { ssr: false });
const Entity = dynamic(() => import("resium").then((mod) => mod.Entity), { ssr: false });
const CameraFlyTo = dynamic(() => import("resium").then((mod) => mod.CameraFlyTo), { ssr: false });
const PolygonGraphics = dynamic(() => import("resium").then((mod) => mod.PolygonGraphics), { ssr: false });

// Fix for default marker icons in Next.js
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const ImmersiveCityVisuals = ({ grids, theme }: { grids: any[], theme: 'dark' | 'light' }) => {
    const { viewer } = useCesium();

    useEffect(() => {
        if (!viewer) return;

        const load3DAssets = async () => {
            try {
                const Cesium = await import("cesium");

                // 1. Terrain
                if (Cesium.createWorldTerrainAsync) {
                    viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
                }

                // 2. 3D OSM Buildings with Dynamic CO2 Styling
                if (Cesium.createOsmBuildingsAsync) {
                    const tileset = await Cesium.createOsmBuildingsAsync();

                    // Advanced Styling: Buildings "glow" based on proximity to CO2 hot zones
                    // Note: In a production app, we'd pass grid data as a texture or uniform.
                    // For now, we'll use a height-based solarpunk aesthetic that feels "informed"
                    tileset.style = new Cesium.Cesium3DTileStyle({
                        color: {
                            conditions: [
                                ["regExp('^[0-9]{3,}$').test(String(${height}))", "color('#10B981', 0.6)"],
                                ["regExp('^[0-9]{2,}$').test(String(${height}))", "color('#10B981', 0.4)"],
                                ["true", "color('#ffffff', 0.1)"]
                            ]
                        }
                    });

                    viewer.scene.primitives.add(tileset);
                }

                // 3. Solarpunk Atmosphere
                viewer.scene.fog.enabled = true;
                viewer.scene.fog.density = 0.0002;
                viewer.scene.postProcessStages.bloom.enabled = true;
                viewer.scene.postProcessStages.bloom.uniforms.contrast = 120.0;

            } catch (err) {
                console.error("3D City Load Failed:", err);
            }
        };

        load3DAssets();
    }, [viewer]);

    return null;
};

export default function CityMap({ dispersion, optimizationPlan, comparisonData, initialCenter }: { dispersion: any; optimizationPlan?: any; comparisonData?: any; initialCenter?: [number, number] }) {
    const [isMounted, setIsMounted] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    useEffect(() => setIsMounted(true), []);

    const grids = useMemo(() => {
        const raw = dispersion?.results || comparisonData?.scenario_b?.plan?.post_mitigation || [];
        return raw.filter((g: any) => g.geometry);
    }, [dispersion, comparisonData]);

    const targetPos = useMemo(() => {
        if (initialCenter) return Cartesian3.fromDegrees(initialCenter[1], initialCenter[0], 2500);
        if (grids.length > 0) {
            const mid = grids[Math.floor(grids.length / 2)];
            // Handle both flat coords and geometry structure
            const lon = mid.lon || mid.geometry.coordinates[0][0][0];
            const lat = mid.lat || mid.geometry.coordinates[0][0][1];
            return Cartesian3.fromDegrees(lon, lat, 2500);
        }
        return Cartesian3.fromDegrees(77.209, 28.613, 20000);
    }, [initialCenter, grids]);

    const getColor = (val: number) => {
        if (val > 300) return Color.fromCssColorString('#7f1d1d').withAlpha(0.7);
        if (val > 200) return Color.fromCssColorString('#7c3aed').withAlpha(0.7);
        if (val > 150) return Color.fromCssColorString('#dc2626').withAlpha(0.7);
        if (val > 100) return Color.fromCssColorString('#f97316').withAlpha(0.6);
        if (val > 50) return Color.fromCssColorString('#facc15').withAlpha(0.5);
        return Color.fromCssColorString('#10b981').withAlpha(0.4);
    };

    if (!isMounted) return <div className="h-full w-full bg-black/40 animate-pulse" />;

    return (
        <div className="w-full h-full relative z-0 group rounded-xl overflow-hidden shadow-2xl border border-white/5">
            <Viewer
                full
                selectionIndicator={false}
                infoBox={false}
                baseLayerPicker={true}
                geocoder={false}
                homeButton={false}
                sceneModePicker={false}
                navigationHelpButton={false}
                timeline={false}
                animation={false}
            >
                <CameraFlyTo destination={targetPos} duration={2} />
                <ImmersiveCityVisuals grids={grids} theme={theme} />

                {/* Render Simulation Grids as 3D Polygons */}
                {grids.map((g: any, i: number) => {
                    const coords = g.geometry.coordinates[0].flat();
                    const con = typeof g.concentration === 'number' ? g.concentration : (g.aqi || 50);

                    return (
                        <Entity key={`${g.grid_id}-${i}`} name={`Zone ${g.grid_id}`}>
                            <PolygonGraphics
                                hierarchy={Cartesian3.fromDegreesArray(coords)}
                                material={getColor(con)}
                                outline={true}
                                outlineColor={Color.WHITE.withAlpha(0.2)}
                                height={2} // Slightly above ground
                                extrudedHeight={2 + con * 0.5} // Proportional 3D volume
                            />
                        </Entity>
                    );
                })}
            </Viewer>

            {/* Premium Overlays */}
            <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-4 pointer-events-none">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">3D Digital Twin Active</h4>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 right-6 z-[1000] bg-black/60 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl transition-all hover:scale-105">
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-4">Sequestration Zones</p>
                <div className="space-y-2">
                    {[
                        { label: 'Critical', color: '#7f1d1d' },
                        { label: 'High Risk', color: '#dc2626' },
                        { label: 'Sensitive', color: '#f97316' },
                        { label: 'Moderate', color: '#facc15' },
                        { label: 'Optimized', color: '#10b981' }
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-sm shadow-sm" style={{ backgroundColor: item.color }} />
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-tight">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
