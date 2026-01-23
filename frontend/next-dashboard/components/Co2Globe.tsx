
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
}

interface Co2GlobeProps {
    data: Co2Data | null;
}

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

const Co2Globe: React.FC<Co2GlobeProps & { onSelectLocation?: (lat: number, lon: number) => void; onSimulate?: () => void; budget?: number }> = ({ data, onSelectLocation, onSimulate, budget }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[600px] w-full flex items-center justify-center bg-black/40 text-emerald-500">Loading Globe Engine...</div>;

    const targetPos = data
        ? Cartesian3.fromDegrees(data.location.lon, data.location.lat, 20000)
        : Cartesian3.fromDegrees(77.20, 28.61, 2000000);

    return (
        <div className="h-[600px] w-full relative overflow-hidden rounded-xl border border-white/10">
            <Viewer full selectionIndicator={false} infoBox={false}>
                <CameraFlyTo destination={targetPos} duration={2} />
                <Helper onSelect={onSelectLocation} />

                {data && (
                    <Entity
                        position={Cartesian3.fromDegrees(data.location.lon, data.location.lat)}
                        point={{ pixelSize: 20, color: Color.RED }}
                    />
                )}
            </Viewer>

            {/* Static overlay */}
            <div className="absolute top-6 left-6 z-50 bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl pointer-events-none">
                <h3 className="text-white font-medium text-sm tracking-wide">Global Sensor Network</h3>
                <p className="text-xs text-white/50 mt-1">Powered by Google Earth Engine & Sentinel-5P</p>
                <p className="text-[10px] text-teal-400 font-medium uppercase mt-3 tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    System Active
                </p>
            </div>

            {/* Active Data Overlay */}
            {data && (
                <div className="absolute bottom-8 right-8 z-50 bg-black/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl max-w-sm w-full">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-white font-medium text-lg tracking-tight">Sensor Reading</h3>
                            <p className="text-xs text-white/40 font-mono mt-1">{data.location.lat.toFixed(4)}°N, {data.location.lon.toFixed(4)}°E</p>
                        </div>
                        <div className="bg-teal-500/10 text-teal-400 text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase border border-teal-500/20">
                            Live Feed
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Concentration</p>
                            <p className="text-2xl font-light text-white mt-1 tabular-nums">{data.value.toFixed(2)} <span className="text-xs text-white/30 font-normal">{data.unit}</span></p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Air Quality</p>
                            <p className="text-lg font-medium text-white mt-2">Moderate</p>
                        </div>
                    </div>

                    <button
                        onClick={onSimulate}
                        className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-xl transition-all hover:bg-gray-100 active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
                    >
                        <span>Run Simulation</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Co2Globe;
