
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

const EnvironmentalPanel = dynamic(() => import("./EnvironmentalPanel"), { ssr: false });

const Co2Globe: React.FC<Co2GlobeProps & { onSelectLocation?: (lat: number, lon: number) => void; onSimulate?: () => void; budget?: number }> = ({ data, onSelectLocation, onSimulate, budget }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-[600px] w-full flex items-center justify-center bg-black/40 text-emerald-500">Loading Globe Engine...</div>;

    const targetPos = (data && data.location)
        ? Cartesian3.fromDegrees(data.location.lon, data.location.lat, 20000)
        : Cartesian3.fromDegrees(77.20, 28.61, 2000000);

    return (
        <div className="h-[600px] w-full relative overflow-hidden rounded-xl border border-white/10">
            <Viewer full selectionIndicator={false} infoBox={false}>
                <CameraFlyTo destination={targetPos} duration={2} />
                <Helper onSelect={onSelectLocation} />

                {data && data.location && (
                    <Entity
                        position={Cartesian3.fromDegrees(data.location.lon, data.location.lat)}
                        point={{ pixelSize: 20, color: Color.RED }}
                    />
                )}
            </Viewer>

            {/* Static overlay */}
            <div className="absolute top-6 left-6 z-50 bg-black/40 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl pointer-events-none">
                <h3 className="text-white font-medium text-sm tracking-wide">Global Sensor Network</h3>
                <p className="text-xs text-white/50 mt-1">Powered by Open-Meteo & Sentinel-5P</p>
                <div className="mt-4 flex items-center gap-3">
                    <p className="text-[10px] text-teal-400 font-medium uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        System Active
                    </p>
                    <div className="h-4 w-px bg-white/10"></div>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest flex items-center gap-2 animate-pulse">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /></svg>
                        Click Map to Analyze
                    </p>
                </div>
            </div>

            {/* Active Data Overlay - Replaced with EnvironmentalPanel */}
            {data && (
                <EnvironmentalPanel data={data} onSimulate={onSimulate || (() => { })} />
            )}
        </div>
    );
};

export default Co2Globe;
