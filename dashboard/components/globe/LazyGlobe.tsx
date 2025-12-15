'use client'

import dynamic from 'next/dynamic'

export const LazyGlobe = dynamic(() => import('./Globe').then(mod => mod.Globe), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-black/20 text-xs text-zinc-500">Initializing 3D Engine...</div>
})
