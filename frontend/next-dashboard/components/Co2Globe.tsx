
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

const Co2Globe: React.FC<Co2GlobeProps & { onSelectLocation?: (lat: number, lon: number) => void; onSimulate?: () => void }> = ({ data, onSelectLocation, onSimulate }) => {
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
            <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10 pointer-events-none">
                <h3 className="text-white font-bold text-sm">Global Sensor Network</h3>
                <p className="text-xs text-white/50 mb-2">Powered by Google Earth Engine & Sentinel-5P</p>
                <p className="text-[10px] text-neon-emerald font-mono uppercase">Instruction: Click anywhere to sample CO2.</p>
            </div>

            {/* Active Data Overlay */}
            {data && (
                <div className="absolute bottom-8 right-8 z-50 bg-gray-900/90 backdrop-blur-xl p-6 rounded-xl border border-neon-emerald/30 shadow-[0_0_30px_rgba(16,185,129,0.1)] max-w-sm">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-neon-emerald font-bold text-lg">Sensor Reading</h3>
                            <p className="text-xs text-white/40 font-mono">{data.location.lat.toFixed(4)}°N, {data.location.lon.toFixed(4)}°E</p>
                        </div>
                        <div className="bg-neon-emerald/20 text-neon-emerald text-xs px-2 py-1 rounded font-bold">
                            LIVE
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/40 p-3 rounded-lg">
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Concentration</p>
                            <p className="text-xl font-bold text-white mt-1">{data.value.toFixed(4)} <span className="text-xs text-white/50">{data.unit}</span></p>
                        </div>
                        <div className="bg-black/40 p-3 rounded-lg">
                            <p className="text-[10px] text-white/50 uppercase tracking-widest">Quality</p>
                            <p className="text-xl font-bold text-white mt-1">Moderate</p>
                        </div>
                    </div>

                    <button
                        onClick={onSimulate}
                        className="w-full py-3 bg-neon-emerald hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-xs rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                        Initialize Simulation Here
                    </button>
                </div>
            )}
        </div>
    );
};

export default Co2Globe;
