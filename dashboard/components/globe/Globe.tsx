"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { GlobePoint } from "@/lib/types"

// Simplified World Map SVG Paths (Mercator-ish)
const WORLD_PATHS = [
    // North America
    "M 15 15 L 40 15 L 45 35 L 30 50 L 10 40 Z",
    // South America
    "M 35 55 L 50 55 L 45 90 L 35 80 Z",
    // Europe/Asia
    "M 55 15 L 95 15 L 90 60 L 60 55 L 50 40 Z",
    // Africa
    "M 55 60 L 75 60 L 70 90 L 50 80 Z",
    // Australia
    "M 80 75 L 95 75 L 90 90 L 80 85 Z"
]

// Actual SVG Map (Simplified geometry for visual reference)
const GEO_PATH = "M150,0 L1000,0 L1000,500 L0,500 L0,0 Z" // Placeholder if no paths

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
        <div className="w-full h-full bg-[#050505] relative overflow-hidden flex items-center justify-center">
            {/* Grid Background */}
            <div className="absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            return (
            <div className="w-full h-full min-h-[500px] rounded-xl overflow-hidden relative flex flex-col md:flex-row">
                <div className="flex-1 relative h-[500px] md:h-auto">
                    <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <Earth />
                        <DataPoints points={points} onSelect={handleSelect} />
                        <OrbitControls enableZoom={true} minDistance={1.5} maxDistance={4} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>
                </div>

                {/* AI Analysis Sidebar Overlay or Panel */}
                {selectedPoint && (
                    <div className="absolute right-4 top-4 bottom-4 w-72 bg-background/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-2xl flex flex-col animate-in slide-in-from-right-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{selectedPoint.country_id}</h3>
                                <p className="text-xs text-muted-foreground">Compliance Report</p>
                            </div>
                            <button onClick={() => setSelectedPoint(null)} className="text-muted-foreground hover:text-foreground">✕</button>
                        </div>

                        <div className="space-y-4 flex-1 overflow-y-auto">
                            <div className="p-3 bg-muted/30 rounded-lg">
                                <div className="text-xs text-muted-foreground mb-1">Total Asset Value</div>
                                <div className="text-xl font-mono">${(selectedPoint.value * 1000000).toLocaleString()}</div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-primary/10 rounded-md">
                                        <Loader2 className={`w-4 h-4 text-primary ${loading ? 'animate-spin' : ''}`} />
                                    </div>
                                    <span className="font-semibold text-sm">AI Risk Analysis</span>
                                </div>

                                {loading ? (
                                    <div className="space-y-2 opacity-50">
                                        <div className="h-4 bg-muted rounded w-3/4" />
                                        <div className="h-4 bg-muted rounded w-1/2" />
                                    </div>
                                ) : aiAnalysis ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Risk Score</span>
                                            <span className={cn("text-lg font-bold",
                                                aiAnalysis.riskScore > 70 ? "text-red-500" :
                                                    aiAnalysis.riskScore > 30 ? "text-amber-500" : "text-emerald-500"
                                            )}>
                                                {aiAnalysis.riskScore}/100
                                            </span>
                                        </div>

                                        <div className="p-2 rounded bg-muted/50 text-xs border border-border">
                                            <div className="flex items-center gap-2 mb-1">
                                                {aiAnalysis.label === 'LOW' && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                                                {aiAnalysis.label === 'MEDIUM' && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                                                {aiAnalysis.label === 'HIGH' && <ShieldAlert className="w-3 h-3 text-red-500" />}
                                                <span className="font-medium">Verdict: {aiAnalysis.label} RISK</span>
                                            </div>
                                            <p className="opacity-80">
                                                AI-generated assessment based on transaction patterns and regulatory compliance history.
                                            </p>
                                        </div>

                                        {aiAnalysis.isMock && (
                                            <div className="text-[10px] text-muted-foreground text-center">
                                                (Simulated Response)
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* Legend */}
                {!selectedPoint && (
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md p-3 rounded-lg border border-border text-xs pointer-events-none">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Low Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>Medium Risk</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span>High Risk</span>
                        </div>
                    </div>
                )}
            </div>
            )
})

            function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ')
}
