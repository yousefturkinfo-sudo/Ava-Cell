
"use client"
export const dynamic = "force-dynamic"

import { useEffect, useState } from 'react'
import { Globe } from "@/components/globe/Globe"
import { supabase } from "@/lib/supabaseClient"
import { GlobePoint } from "@/lib/types"

export default function GlobePage() {
    const [points, setPoints] = useState<GlobePoint[]>([])
    const [loading, setLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        async function fetchData() {
            // Fetch countries and their stats
            const { data: countries } = await supabase.from('countries').select('*')
            const { data: stats } = await supabase.from('country_rwa_stats').select('*')

            if (countries && stats) {
                // Map stats to countries
                const mappedPoints: GlobePoint[] = countries.map(c => {
                    const stat = stats.find(s => s.country_id === c.id)
                    return {
                        lat: c.lat,
                        lng: c.lng,
                        value: stat ? stat.total_value_usd / 500_000_000 : 0.1, // Normalize
                        risk: stat ? stat.risk_score / 100 : 0,
                        countryName: c.name,
                        country_id: c.iso_code // Use ISO code for ID
                    }
                })
                setPoints(mappedPoints)
            }
            setLoading(false)
        }

        fetchData()

        // Realtime subscription
        const channel = supabase
            .channel('globe-updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'country_rwa_stats' }, () => {
                fetchData()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Live Asset Map</h1>
                <div className="flex gap-2">
                    <span className="text-sm text-muted-foreground">
                        {loading ? 'Connecting to satellite link...' : 'Real-time node status: Active'}
                    </span>
                </div>
            </div>
            <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden shadow-2xl relative">
                {isMounted && <Globe points={points} />}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                )}
            </div>
        </div>
    )
}

