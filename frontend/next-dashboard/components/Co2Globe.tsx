
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Cartesian3, Color, ScreenSpaceEventType, Cartographic, Math as CesiumMath, ScreenSpaceEventHandler } from "cesium";
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
    };
}

interface Co2GlobeProps {
    data: Co2Data | null;
    onCloseData?: () => void;
    simultaneousView?: boolean;
}

const GlobalDataPoints = ({ show, viewMode }: { show: boolean; viewMode: 'aqi' | 'temp' | 'both' }) => {
    const [points, setPoints] = useState<{ lat: number, lon: number, aqi: number, temp: number }[]>([]);

    useEffect(() => {
        if (show && points.length === 0) {
            // Generate some mock global points
            const newPoints = [];
            for (let i = 0; i < 200; i++) {
                newPoints.push({
                    lat: (Math.random() - 0.5) * 160,
                    lon: (Math.random() - 0.5) * 360,
                    aqi: Math.floor(Math.random() * 300),
                    temp: Math.floor(Math.random() * 40) + 5
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
                    {(viewMode === 'aqi' || viewMode === 'both') && (
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
                    {/* Temperature Point (Offset slightly or showing together) */}
                    {(viewMode === 'temp' || viewMode === 'both') && (
                        <Entity
                            position={Cartesian3.fromDegrees(p.lon + 0.5, p.lat + 0.5)}
                            point={{
                                pixelSize: 8,
                                color: p.temp > 30 ? Color.ORANGERED : p.temp > 20 ? Color.WHITE : Color.DEEPSKYBLUE,
                                outlineColor: Color.WHITE.withAlpha(0.2),
                                outlineWidth: 2
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

const EnvironmentalPanel = dynamic(() => import("./EnvironmentalPanel"), { ssr: false });

const Co2Globe: React.FC<Co2GlobeProps & { onSelectLocation?: (lat: number, lon: number) => void; onSimulate?: () => void; budget?: number }> = ({ data, onCloseData, onSelectLocation, onSimulate, budget, simultaneousView }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [viewMode, setViewMode] = useState<'aqi' | 'temp' | 'both'>('both');

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
                <Helper onSelect={onSelectLocation} />
                <GlobalDataPoints show={!!simultaneousView} viewMode={viewMode} />

                {data && data.location && (
                    <Entity
                        position={Cartesian3.fromDegrees(data.location.lon, data.location.lat)}
                        point={{ pixelSize: 20, color: Color.RED }}
                    />
                )}
            </Viewer>

            {/* Static overlay */}
            <div className="absolute top-6 left-6 z-50 bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl pointer-events-none">
                <h3 className="text-white font-medium text-sm tracking-wide">
                    {simultaneousView ? 'Simultaneous Global Analysis' : 'Global Sensor Network'}
                </h3>
                <p className="text-xs text-white/50 mt-1">
                    {simultaneousView ? 'AQI (Solid) • Temperature (Glow)' : 'Powered by Open-Meteo & Sentinel-5P'}
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
            </div>

            {/* Legend for Simultaneous View with Toggles */}
            {simultaneousView && (
                <div className="absolute top-24 right-6 z-50 bg-black/60 backdrop-blur-xl p-4 rounded-xl border border-white/10 flex flex-col gap-4 min-w-[200px]">
                    <h4 className="text-[10px] font-extrabold text-white/40 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Visualization Layers</h4>

                    <div className="flex flex-col gap-3">
                        {/* AQI Toggle & Legend */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'aqi' ? 'temp' : (viewMode === 'both' ? 'temp' : 'both')); }}
                                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all ${viewMode === 'aqi' || viewMode === 'both' ? 'bg-neon-emerald/20 border border-neon-emerald/30' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.4)]" />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${viewMode === 'aqi' || viewMode === 'both' ? 'text-neon-emerald' : 'text-white/60'}`}>AQI ACTIVE</span>
                                </div>
                                {(viewMode === 'aqi' || viewMode === 'both') && <div className="w-1.5 h-1.5 rounded-full bg-neon-emerald" />}
                            </button>
                            {(viewMode === 'aqi' || viewMode === 'both') && (
                                <div className="grid grid-cols-2 gap-1 px-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                                        <span className="text-[8px] text-white/40 font-bold uppercase">Optimal</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                        <span className="text-[8px] text-white/40 font-bold uppercase">Moderate</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        <span className="text-[8px] text-white/40 font-bold uppercase">Severe</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Temp Toggle & Legend */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setViewMode(viewMode === 'temp' ? 'aqi' : (viewMode === 'both' ? 'aqi' : 'both')); }}
                                className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all ${viewMode === 'temp' || viewMode === 'both' ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-white/5 border border-transparent hover:bg-white/10'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${viewMode === 'temp' || viewMode === 'both' ? 'text-orange-500' : 'text-white/60'}`}>TEMP ACTIVE</span>
                                </div>
                                {(viewMode === 'temp' || viewMode === 'both') && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                            </button>
                            {(viewMode === 'temp' || viewMode === 'both') && (
                                <div className="grid grid-cols-2 gap-1 px-1">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-deepskyblue" />
                                        <span className="text-[8px] text-white/40 font-bold uppercase">Cool</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        <span className="text-[8px] text-white/40 font-bold uppercase">Warm</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orangered" />
                                        <span className="text-[8px] text-white/40 font-bold uppercase">Hot</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Active Data Overlay - Replaced with EnvironmentalPanel */}
            {data && (
                <EnvironmentalPanel
                    data={data}
                    onSimulate={onSimulate || (() => { })}
                    onClose={onCloseData || (() => { })}
                />
            )}
        </div>
    );
};

export default Co2Globe;
