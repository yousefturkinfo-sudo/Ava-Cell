"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GlobePoint } from "@/lib/types"

export const Globe = ({ points }: { points: GlobePoint[] }) => {

    // Convert Lat/Lng to % positions (Equirectangular approximation)
    const renderPoints = useMemo(() => {
        return points.map(p => ({
            ...p,
            x: ((p.lng + 180) / 360) * 100,
            y: ((-p.lat + 90) / 180) * 100
        }))
    }, [points])

    return (
        <div className="w-full h-full bg-[#050505] relative overflow-hidden flex items-center justify-center rounded-xl border border-white/10">
            {/* Grid Background */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* World Map Overlay (Abstract SVG) */}
            <div className="absolute inset-x-10 inset-y-10 opacity-30 select-none pointer-events-none">
                <svg viewBox="0 0 100 50" className="w-full h-full fill-white/10 stroke-white/20 stroke-[0.1]">
                    {/* Simplified Continents */}
                    <path d="M15,5 Q35,0 45,15 T15,35 Z" /> {/* North America */}
                    <path d="M20,40 Q30,40 35,60 T25,50 Z" /> {/* South America */}
                    <path d="M50,5 Q80,0 90,15 T60,45 Z" /> {/* Eurasia */}
                    <path d="M50,50 Q60,50 65,70 T55,60 Z" /> {/* Africa */}
                    <path d="M80,35 Q90,35 85,45 Z" />      {/* Australia */}
                </svg>
            </div>

            {/* Data Points */}
            <div className="absolute inset-x-10 inset-y-10">
                {renderPoints.map((point, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="absolute w-3 h-3 -ml-1.5 -mt-1.5"
                        style={{ left: `${point.x}%`, top: `${point.y}%` }}
                    >
                        <div className={`w-full h-full rounded-full animate-ping absolute inset-0 ${point.risk > 0.5 ? 'bg-orange-500' : 'bg-emerald-500'} opacity-75`} />
                        <div className={`relative w-full h-full rounded-full ${point.risk > 0.5 ? 'bg-orange-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(255,255,255,0.5)]`} />

                        {/* Tooltip */}
                        <div className="group relative w-full h-full cursor-help">
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 border border-white/20 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {point.countryName} (Risk: {(point.risk * 100).toFixed(0)}%)
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent h-[20%] w-full animate-scan pointer-events-none" />

            {/* Status Overlay */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/50 border border-white/10 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] text-zinc-400 font-mono">LIVE_FEED_ACTIVE</span>
                </div>
            </div>
        </div>
    )
}

export default Globe;
