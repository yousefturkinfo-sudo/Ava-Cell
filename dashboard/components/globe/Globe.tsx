"use client"

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { GlobePoint } from '@/lib/types'
import { getRiskScore, AIRiskResponse } from '@/lib/aiClient'
import { Loader2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react'

function DataPoints({ points, onSelect }: { points: GlobePoint[], onSelect: (p: GlobePoint) => void }) {
    const pointData = useMemo(() => {
        return points.map(p => {
            const phi = (90 - p.lat) * (Math.PI / 180)
            const theta = (p.lng + 180) * (Math.PI / 180)
            const x = -(Math.sin(phi) * Math.cos(theta))
            const y = Math.cos(phi)
            const z = Math.sin(phi) * Math.sin(theta)
            return { pos: [x, y, z], ...p }
        })
    }, [points])

    const [hovered, setHovered] = useState<number | null>(null)

    return (
        <group>
            {pointData.map((p, i) => (
                <mesh
                    key={i}
                    position={p.pos as [number, number, number]}
                    scale={(0.03 + (p.value * 0.05)) * (hovered === i ? 1.5 : 1)}
                    onClick={(e) => {
                        e.stopPropagation()
                        onSelect(p)
                    }}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(i) }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(null) }}
                >
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color={new THREE.Color().setHSL(0.3 - (p.risk * 0.3), 1, 0.5)} />
                    {hovered === i && (
                        <Html distanceFactor={12} zIndexRange={[100, 0]}>
                            <div className="bg-black/80 text-white border border-white/10 px-2 py-1 rounded shadow-lg backdrop-blur-md pointer-events-none select-none flex flex-col items-center gap-0.5">
                                <div className="text-[10px] font-bold tracking-wider">{p.country_id}</div>
                                <div className="flex items-center gap-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${p.risk > 0.5 ? 'bg-red-500' : 'bg-green-500'}`} />
                                    <span className="text-[9px] font-mono opacity-80">{Math.round(p.risk * 100)}</span>
                                </div>
                            </div>
                        </Html>
                    )}
                </mesh>
            ))}
        </group>
    )
}

function Earth() {
    const earthRef = useRef<THREE.Mesh>(null)

    useFrame(() => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.0005
        }
    })

    return (
        <mesh ref={earthRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                color="#0f172a"
                emissive="#020617"
                roughness={0.7}
                metalness={0.1}
                wireframe={true}
                transparent
                opacity={0.8}
            />
        </mesh>
    )
}

export const Globe = React.memo(function Globe({ points }: { points: GlobePoint[] }) {
    const [selectedPoint, setSelectedPoint] = useState<GlobePoint | null>(null)
    const [aiAnalysis, setAiAnalysis] = useState<AIRiskResponse | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSelect = async (point: GlobePoint) => {
        setSelectedPoint(point)
        setLoading(true)
        setAiAnalysis(null)

        // Use standard dummy address for AI analysis based on country
        const dummyAddress = `0x${Buffer.from(point.country_id).toString('hex').padEnd(40, '0').slice(0, 40)}`

        const data = await getRiskScore(dummyAddress, [])
        setAiAnalysis(data)
        setLoading(false)
    }

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
