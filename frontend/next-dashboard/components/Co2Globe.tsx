
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Cartesian3, Color, ScreenSpaceEventType, Cartographic, Math as CesiumMath, ScreenSpaceEventHandler, Fog, CallbackProperty, PostProcessStage, Cesium3DTileStyle } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { useCesium } from "resium";

// Dynamically import Resium components to avoid SSR issues with Cesium
const Viewer = dynamic(() => import("resium").then((mod) => mod.Viewer), { ssr: false });
const Entity = dynamic(() => import("resium").then((mod) => mod.Entity), { ssr: false });
const CameraFlyTo = dynamic(() => import("resium").then((mod) => mod.CameraFlyTo), { ssr: false });

interface Co2Data {
    value: number;
    unit: string;
    location: { lat: number, lon: number };
    place_name?: string;
    full_details?: {
        aqi: number;
        pm2_5: number;
        unit: string;
        pollutants?: Record<string, { label: string, value: number, unit: string }>;
        isOptimized?: boolean;
    };
}

interface Co2GlobeProps {
    data: Co2Data | null;
    onCloseData?: () => void;
    simultaneousView?: boolean;
}

const GlobalDataPoints = ({ show, viewMode }: { show: boolean; viewMode: 'aqi' | 'temp' | 'no2' | 'pm25' | 'methane' }) => {
    const [points, setPoints] = useState<{ lat: number, lon: number, aqi: number, temp: number, no2: number, pm25: number, methane: number }[]>([]);

    useEffect(() => {
        if (show && points.length === 0) {
            // Generate some mock global points
            const newPoints = [];
            for (let i = 0; i < 200; i++) {
                newPoints.push({
                    lat: (Math.random() - 0.5) * 160,
                    lon: (Math.random() - 0.5) * 360,
                    aqi: Math.floor(Math.random() * 300),
                    temp: Math.floor(Math.random() * 40) + 5,
                    no2: Math.floor(Math.random() * 100),
                    pm25: Math.floor(Math.random() * 150),
                    methane: Math.floor(Math.random() * 50)
                });
            }
            setPoints(newPoints);
        }
    }, [show, points.length]);

    if (!show) return null;

    return (
        <>
            {points.map((p, i) => (
                <React.Fragment key={i}>
                    {/* AQI Point (Small) */}
                    {(viewMode === 'aqi') && (
                        <Entity
                            position={Cartesian3.fromDegrees(p.lon, p.lat)}
                            point={{
                                pixelSize: 6,
                                color: p.aqi > 200 ? Color.RED : p.aqi > 100 ? Color.YELLOW : Color.LIME,
                                outlineColor: Color.BLACK,
                                outlineWidth: 1
                            }}
                        />
                    )}
                    {/* Temperature Point */}
                    {(viewMode === 'temp') && (
                        <Entity
                            position={Cartesian3.fromDegrees(p.lon, p.lat)}
                            point={{
                                pixelSize: 6,
                                color: p.temp > 30 ? Color.ORANGERED : p.temp > 20 ? Color.WHITE : Color.DEEPSKYBLUE,
                                outlineColor: Color.WHITE.withAlpha(0.2),
                                outlineWidth: 2
                            }}
                        />
                    )}
                    {/* NO2 Point */}
                    {(viewMode === 'no2') && (
                        <Entity
                            position={Cartesian3.fromDegrees(p.lon, p.lat)}
                            point={{
                                pixelSize: 6,
                                color: p.no2 > 50 ? Color.PURPLE : Color.LAVENDER,
                                outlineColor: Color.BLACK,
                                outlineWidth: 1
                            }}
                        />
                    )}
                    {/* PM2.5 Point */}
                    {(viewMode === 'pm25') && (
                        <Entity
                            position={Cartesian3.fromDegrees(p.lon, p.lat)}
                            point={{
                                pixelSize: 6,
                                color: p.pm25 > 100 ? Color.DARKGRAY : Color.LIGHTGRAY,
                                outlineColor: Color.BLACK,
                                outlineWidth: 1
                            }}
                        />
                    )}
                    {/* Methane Point */}
                    {(viewMode === 'methane') && (
                        <Entity
                            position={Cartesian3.fromDegrees(p.lon, p.lat)}
                            point={{
                                pixelSize: 6,
                                color: p.methane > 20 ? Color.BROWN : Color.BEIGE,
                                outlineColor: Color.BLACK,
                                outlineWidth: 1
                            }}
                        />
                    )}
                </React.Fragment>
            ))}
        </>
    );
};

const Helper = ({ onSelect }: { onSelect?: (lat: number, lon: number) => void }) => {
    const { viewer } = useCesium();

    useEffect(() => {
        if (!viewer || !onSelect) return;

        const eventHandler = new ScreenSpaceEventHandler(viewer.scene.canvas);

        eventHandler.setInputAction((movement: any) => {
            const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid);
            if (cartesian) {
                const cartographic = Cartographic.fromCartesian(cartesian);
                const lat = CesiumMath.toDegrees(cartographic.latitude);
                const lon = CesiumMath.toDegrees(cartographic.longitude);
                console.log("Clicked:", lat, lon);
                onSelect(lat, lon);
            }
        }, ScreenSpaceEventType.LEFT_CLICK);

        return () => {
            eventHandler.destroy();
        };
    }, [viewer, onSelect]);

    return null;
}

const ImmersiveVisuals = () => {
    const { viewer } = useCesium();

    useEffect(() => {
        if (!viewer) return;

        const scene = viewer.scene;

        // 1. Enable Day/Night Lighting
        scene.globe.enableLighting = true;

        // 2. Configure Atmospheric Fog
        scene.fog.density = 0.00015; // Slightly denser for "Solarpunk" vibe
        scene.fog.screenSpaceErrorFactor = 2.0;

        // 3. Enable Built-in Bloom for Solarpunk glow
        scene.postProcessStages.bloom.enabled = true;
        scene.postProcessStages.bloom.uniforms.contrast = 110.0;
        scene.postProcessStages.bloom.uniforms.brightness = -0.1;
        scene.postProcessStages.bloom.uniforms.glowOnly = false;

        // 4. Load 3D Assets (Terrain & Buildings)
        const loadAssets = async () => {
            try {
                // Dynamically import the entire Cesium module to inspect available exports
                const Cesium = await import("cesium");

                // Fallback to older sync method or skip if async creator is missing
                let terrainProvider;
                if (Cesium.createWorldTerrainAsync) {
                    terrainProvider = await Cesium.createWorldTerrainAsync();
                } else {
                    console.warn("createWorldTerrainAsync not found, skipping terrain.");
                    // Optional: terrainProvider = Cesium.createWorldTerrain(); // logic for older versions if needed
                }

                if (terrainProvider) {
                    viewer.terrainProvider = terrainProvider;
                }

                if (Cesium.createOsmBuildingsAsync) {
                    try {
                        const tileset = await Cesium.createOsmBuildingsAsync();

                        // Solarpunk Styling: Dark base with neon highlights
                        // Using simpler compatibility-first expressions
                        tileset.style = new Cesium.Cesium3DTileStyle({
                            color: {
                                conditions: [
                                    ["${height} === undefined || ${height} === null", "color('rgba(255, 255, 255, 0.1)')"],
                                    ["${height} > 100", "color('rgba(16, 185, 129, 0.5)')"],
                                    ["${height} > 50", "color('rgba(16, 185, 129, 0.3)')"],
                                    ["true", "color('rgba(255, 255, 255, 0.1)')"]
                                ]
                            }
                        });

                        viewer.scene.primitives.add(tileset);
                    } catch (tilesetError) {
                        console.warn("Failed to apply 3D building tileset:", tilesetError);
                    }
                } else {
                    console.warn("createOsmBuildingsAsync not found, skipping 3D buildings.");
                }

            } catch (error: any) {
                console.error("Failed to load immersive assets (detailed):", error, error.message, error.stack);
            }
        };

        loadAssets();

        return () => {
            // Cleanup if necessary (Cesium usually handles primitive cleanup on destroy, 
            // but manual primitive removal could be done here if the component unmounts while viewer stays)
        };
    }, [viewer]);

    return null;
};

const AIScanner = ({ active, center }: { active: boolean, center: { lat: number, lon: number } }) => {
    const { viewer } = useCesium();
    if (!active || !viewer) return null;

    return (
        <Entity
            position={Cartesian3.fromDegrees(center.lon, center.lat)}
            ellipse={{
                semiMinorAxis: new CallbackProperty(() => {
                    const start = viewer.clock.startTime.secondsOfDay || 0;
                    const now = viewer.clock.currentTime.secondsOfDay || 0;
                    return 1000 + (Math.sin((now - start) * 5) + 1) * 2000;
                }, false),
                semiMajorAxis: new CallbackProperty(() => {
                    const start = viewer.clock.startTime.secondsOfDay || 0;
                    const now = viewer.clock.currentTime.secondsOfDay || 0;
                    return 1000 + (Math.sin((now - start) * 5) + 1) * 2000;
                }, false),
                material: Color.fromCssColorString('#10B981').withAlpha(0.2),
                outline: true,
                outlineColor: Color.fromCssColorString('#10B981'),
                outlineWidth: 2
            }}
        />
    );
};

const ProposalOverlay = dynamic(() => import("./ProposalOverlay"), { ssr: false });
const SwarmAgents = dynamic(() => import("./SwarmAgents"), { ssr: false });
const EnvironmentalPanel = dynamic(() => import("./EnvironmentalPanel"), { ssr: false });

const Co2Globe: React.FC<Co2GlobeProps & { onSelectLocation?: (lat: number, lon: number) => void; onSimulate?: () => void; budget?: number }> = ({ data, onCloseData, onSelectLocation, onSimulate, budget, simultaneousView }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [viewMode, setViewMode] = useState<'aqi' | 'temp' | 'no2' | 'pm25' | 'methane'>('aqi');
    const [showProposals, setShowProposals] = useState(false);
    const [showSwarm, setShowSwarm] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[600px] w-full flex items-center justify-center bg-black/40 text-emerald-500">Loading Globe Engine...</div>;

    const targetPos = (data && data.location)
        ? Cartesian3.fromDegrees(data.location.lon, data.location.lat, 20000)
        : Cartesian3.fromDegrees(77.20, 28.61, 2000000);

    return (
        <div className="h-[600px] w-full relative overflow-hidden rounded-xl border border-white/10">
            <Viewer
                full
                selectionIndicator={false}
                infoBox={false}
                geocoder={true}
                homeButton={true}
                baseLayerPicker={true}
                sceneModePicker={true}
                navigationHelpButton={false}
            >
                <CameraFlyTo destination={targetPos} duration={2} />
                <ImmersiveVisuals />
                <Helper onSelect={onSelectLocation} />
                <GlobalDataPoints show={!!simultaneousView} viewMode={viewMode} />

                {data && data.location && showSwarm && (
                    <SwarmAgents target={data.location} />
                )}

                {data && data.location && (
                    <ProposalOverlay center={data.location} show={showProposals} />
                )}

                <AIScanner active={isScanning} center={data?.location || { lat: 0, lon: 0 }} />

                {data && data.location && (
                    <Entity
                        position={Cartesian3.fromDegrees(data.location.lon, data.location.lat)}
                        point={{ pixelSize: 20, color: Color.RED }}
                    />
                )}
            </Viewer>

            {/* Static overlay - Added onClick stopPropagation to prevent map moving */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="absolute top-6 left-6 z-50 bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl"
            >
                <h3 className="text-white font-medium text-sm tracking-wide">
                    {simultaneousView ? 'Multi-Pollutant Analysis' : 'Global Sensor Network'}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                    {simultaneousView ? 'NO2 • PM2.5 • Methane • AQI • Temp' : 'Powered by Open-Meteo & Sentinel-5P'}
                </p>
                <div className="mt-4 flex items-center gap-3">
                    <p className="text-[10px] text-teal-400 font-medium uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        {simultaneousView ? 'DUAL_MODE_ACTIVE' : 'System Active'}
                    </p>
                    <div className="h-4 w-px bg-white/10"></div>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                        Click Map to Analyze
                    </p>
                </div>

                {data && !simultaneousView && (
                    <div className="mt-4 flex flex-col gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (!showProposals) {
                                    setIsScanning(true);
                                    // Hide scanning after a delay to show "results"
                                    setTimeout(() => {
                                        setIsScanning(false);
                                        setShowProposals(true);
                                    }, 2000);
                                } else {
                                    setShowProposals(false);
                                }
                            }}
                            className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-all ${showProposals || isScanning ? 'bg-neon-emerald text-black border-neon-emerald' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
                        >
                            {showProposals || isScanning ? (
                                <>
                                    <div className={isScanning ? "animate-spin" : ""}>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </div>
                                    <span>{isScanning ? 'AI ANALYZING...' : 'Clear Vertex AI Plan'}</span>
                                </>
                            ) : (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                    <span>Generate Vertex AI Plan</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setShowSwarm(!showSwarm)}
                            className={`w-full py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest transition-all ${showSwarm ? 'bg-cyan-500 text-black border-cyan-500' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${showSwarm ? 'bg-black animate-pulse' : 'bg-cyan-500'}`} />
                            <span>{showSwarm ? 'Deactivate Cloud Swarm' : 'Deploy Cloud Run Swarm'}</span>
                        </button>
                    </div>
                )}
            </div>


            {/* Legend for Simultaneous View with Toggles */}
            {
                simultaneousView && (
                    <div className="absolute top-24 right-6 z-50 bg-black/60 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex flex-col gap-4 min-w-[200px]">
                        <h4 className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Visualization Layers</h4>

                        <div className="flex flex-col gap-3">
                            {/* Layer Toggles */}
                            {['aqi', 'temp', 'no2', 'pm25', 'methane'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={(e) => { e.stopPropagation(); setViewMode(mode as any); }}
                                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all ${viewMode === mode ? 'bg-neon-emerald/20 border border-neon-emerald/30' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                                >
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${viewMode === mode ? 'text-neon-emerald' : 'text-white/60'}`}>
                                        {mode.replace('no2', 'NO₂').replace('pm25', 'PM2.5').toUpperCase()} ACTIVE
                                    </span>
                                    {viewMode === mode && <div className="w-1.5 h-1.5 rounded-full bg-neon-emerald" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Active Data Overlay - Replaced with EnvironmentalPanel */}
            {
                (() => {
                    let displayedData = data;
                    if (data && showProposals && data.full_details) {
                        // Simulate Vertex AI optimization impact
                        const reduction = 0.22; // 22% reduction
                        displayedData = {
                            ...data,
                            full_details: {
                                ...data.full_details,
                                aqi: Math.round(data.full_details.aqi * (1 - reduction)),
                                pollutants: data.full_details.pollutants ? Object.fromEntries(
                                    Object.entries(data.full_details.pollutants).map(([k, p]: any) => [
                                        k,
                                        { ...p, value: typeof p.value === 'number' ? Math.round(p.value * (1 - reduction)) : p.value }
                                    ])
                                ) : undefined,
                                isOptimized: true
                            }
                        };
                    }

                    return displayedData && (
                        <EnvironmentalPanel
                            data={displayedData}
                            onSimulate={onSimulate || (() => { })}
                            onClose={onCloseData || (() => { })}
                        />
                    );
                })()
            }
        </div >
    );
};

export default Co2Globe;
