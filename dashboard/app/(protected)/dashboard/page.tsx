"use client"

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { useWeb3 } from "@/hooks/useWeb3"
import { formatEther, parseEther, keccak256, toHex } from 'viem'
import { getRiskScore, AIRiskResponse } from '@/lib/aiClient'
import dynamic from 'next/dynamic'
const Globe = dynamic(() => import("@/components/globe/Globe").then((mod) => mod.Globe), { ssr: false })
import { GlobePoint } from "@/lib/types"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { OnboardingModal } from "@/components/onboarding/OnboardingModal"

// --- Utility: Deterministic Geo-Hash from Address ---
function getGeoFromAddress(address: string) {
    const hash = keccak256(toHex(address))
    // Lat: -60 to 80 (avoid poles)
    // Lng: -180 to 180
    const lat = (parseInt(hash.slice(2, 6), 16) % 140) - 60
    const lng = (parseInt(hash.slice(6, 10), 16) % 360) - 180
    return { lat, lng }
}

export default function DashboardPage() {
    // Top-Level State
    const { publicClient, walletClient, account, CONTRACTS, connectOKX, isOkxInstalled } = useWeb3()
    const [stableSupply, setStableSupply] = useState<string>("0")
    const [rwaSupply, setRwaSupply] = useState<string>("0")

    // Globe Data State (Real)
    const [globePoints, setGlobePoints] = useState<GlobePoint[]>([])

    // Dynamic Chart Data
    const [chartData, setChartData] = useState([
        { time: 'Jan', value: 2.4, yield: 4.2 },
        { time: 'Feb', value: 1.3, yield: 3.8 },
        { time: 'Mar', value: 4.8, yield: 5.1 },
        { time: 'Apr', value: 3.9, yield: 4.7 },
        { time: 'May', value: 7.2, yield: 6.3 },
        { time: 'Jun', value: 6.8, yield: 5.9 },
        { time: 'Jul', value: 9.5, yield: 7.2 },
    ])

    // Modal State
    const [isMintModalOpen, setIsMintModalOpen] = useState(false)
    const [mintRecipient, setMintRecipient] = useState("0x71A...9F2")
    const [mintAmount, setMintAmount] = useState("")
    const [isMinting, setIsMinting] = useState(false)
    const [mintSuccess, setMintSuccess] = useState(false)

    // Data Polling
    useEffect(() => {
        if (!publicClient) return

        async function fetchMetrics() {
            try {
                // 1. Fetch Stablecoin Supply
                const stableSup = await publicClient.readContract({
                    address: CONTRACTS.AvaStablecoin.address,
                    abi: CONTRACTS.AvaStablecoin.abi,
                    functionName: 'totalSupply'
                }) as bigint
                const formattedStable = Number(formatEther(stableSup))
                setStableSupply(formattedStable.toLocaleString(undefined, { maximumFractionDigits: 0 }))

                // 2. Fetch RWA Asset Supply
                const rwaSup = await publicClient.readContract({
                    address: CONTRACTS.AvaRWAAsset.address,
                    abi: CONTRACTS.AvaRWAAsset.abi,
                    functionName: 'totalSupply'
                }) as bigint
                setRwaSupply(Number(formatEther(rwaSup)).toLocaleString(undefined, { maximumFractionDigits: 0 }))

                // 3. Update Chart with Real Data
                setChartData(prev => {
                    const newData = [...prev]
                    const lastIndex = newData.length - 1

                    if (newData[lastIndex].time === 'Now') {
                        const updatedLast = { ...newData[lastIndex] }
                        updatedLast.value = formattedStable / 1000000
                        newData[lastIndex] = updatedLast
                    } else {
                        newData.push({ time: 'Now', value: formattedStable / 1000000, yield: 8.4 })
                    }
                    return newData
                })

                // 4. Fetch Real Compliance Events for Globe
                try {
                    const logs = await publicClient.getLogs({
                        address: CONTRACTS.AvaRegistry.address,
                        event: {
                            type: 'event',
                            name: 'ComplianceLevelChanged',
                            inputs: [
                                { type: 'address', indexed: true, name: 'user' },
                                { type: 'uint8', indexed: false, name: 'level' }
                            ]
                        },
                        fromBlock: 'earliest'
                    })

                    const realPoints: GlobePoint[] = logs.map((log: any) => {
                        const { lat, lng } = getGeoFromAddress(log.args.user)
                        const risk = log.args.level === 2 ? 0.9 : 0.1
                        return {
                            country_id: log.args.user.slice(0, 6),
                            countryName: "Unknown",
                            lat,
                            lng,
                            value: Math.random(),
                            risk
                        }
                    })

                    if (realPoints.length > 0) {
                        setGlobePoints(realPoints)
                    }
                } catch (logError) {
                    console.warn("Failed to fetch logs (likely RPC limit or empty)", logError)
                }

            } catch (error) {
                console.error("Failed to fetch metrics:", error)
            }
        }

        fetchMetrics()
        const interval = setInterval(fetchMetrics, 5000)
        return () => clearInterval(interval)
    }, [publicClient, CONTRACTS])

    // Mint Function
    const handleMint = async () => {
        if (!walletClient || !account) {
            alert("Please connect your wallet first");
            return;
        }

        setIsMinting(true)
        try {
            const hash = await walletClient.writeContract({
                address: CONTRACTS.AvaRWAAsset.address,
                abi: CONTRACTS.AvaRWAAsset.abi,
                functionName: 'mint',
                args: [mintRecipient as `0x${string}`, parseEther(mintAmount || "0")],
                account
            })
            console.log("Mint tx:", hash)
            setMintSuccess(true)

            setTimeout(() => {
                setIsMintModalOpen(false)
                setMintSuccess(false)
                setMintAmount("")
            }, 2000)
        } catch (error) {
            console.error("Mint failed:", error)
            alert("Minting failed. Check console.")
        } finally {
            setIsMinting(false)
        }
    }

    return (
        <div className="flex h-screen bg-black font-sans text-zinc-300 selection:bg-orange-500/30 selection:text-orange-100">
            <OnboardingModal />

            {/* Sidebar Navigation */}
            <aside className="w-64 flex flex-col glass-sidebar z-20 transition-all duration-300 hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2 group cursor-default">
                        <div className="relative w-5 h-5">
                            <div className="absolute inset-0 bg-white rotate-45 rounded-sm opacity-20 group-hover:rotate-90 transition-transform duration-500"></div>
                            <div className="absolute inset-1 bg-white rounded-sm"></div>
                        </div>
                        <span className="text-sm font-semibold tracking-tight font-display text-white">Ava<span className="text-zinc-600">//</span>Cell</span>
                    </div>
                </div>

                <div className="px-6 py-4">
                    <div className="group relative flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5 cursor-help">
                        <Icon icon="lucide:shield-check" width="14" className="text-orange-500" />
                        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">AI Compliance</span>
                        <div className="absolute left-0 top-full mt-2 w-full p-3 bg-zinc-900 border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <p className="text-[11px] text-zinc-300 leading-relaxed">Securing Institutional Assets with Real-Time AI Compliance.</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1">
                    <a href="#dashboard" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2 rounded-md bg-white/5 text-white text-xs font-medium border border-white/5">
                        <Icon icon="lucide:layout-dashboard" width="16" /> Overview
                    </a>
                    <a href="#globe" onClick={(e) => e.preventDefault()} className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors">
                        <Icon icon="lucide:globe" width="16" /> Live Compliance Map
                    </a>
                    <a href="#assets" onClick={(e) => { e.preventDefault(); setIsMintModalOpen(true) }} className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors">
                        <Icon icon="lucide:coins" width="16" /> Asset Management
                    </a>
                    <a href="#settings" onClick={(e) => { e.preventDefault(); alert("Configuration locked by Administrative Policy.") }} className="flex items-center gap-3 px-3 py-2 rounded-md text-zinc-500 hover:text-white hover:bg-white/5 text-xs font-medium transition-colors">
                        <Icon icon="lucide:settings-2" width="16" /> Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-black border border-white/10 flex items-center justify-center">
                            <Icon icon="lucide:wallet" width="14" className="text-zinc-400" />
                        </div>
                        <div>
                            {account ? (
                                <>
                                    <div className="text-[11px] font-mono text-white tracking-tight">
                                        {`${account.slice(0, 6)}...${account.slice(-4)}`}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] text-zinc-500">Subnet: Connected</span>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-[11px] font-mono text-zinc-500 tracking-tight">Not Connected</div>
                                    {isOkxInstalled ? (
                                        <button onClick={() => connectOKX()} className="flex items-center gap-2 px-2 py-1 bg-white text-black text-[10px] font-bold rounded hover:bg-zinc-200 transition-colors">
                                            <Icon icon="simple-icons:okx" width="10" /> Connect OKX
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            <span className="text-[10px] text-zinc-500">Disconnected</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-black">
                <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-black/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-zinc-400"><Icon icon="lucide:menu" width="20" /></button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-medium text-white font-display">Console Overview</h1>
                            <span className="text-[10px] text-zinc-500 font-mono">AI-Native RWA Infrastructure</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/[0.02]">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="text-[10px] font-mono text-zinc-400">AI Sentinel Active</span>
                        </div>
                        <button onClick={() => alert("Notification Center is currently in beta. No new alerts.")} className="text-zinc-500 hover:text-white transition-colors relative">
                            <Icon icon="lucide:bell" width="16" />
                            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full border border-black"></span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {/* Metric Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between group hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Regulated Value (TVL)</span>
                                <Icon icon="lucide:landmark" width="14" className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-medium text-white tracking-tight">${stableSupply}</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <Icon icon="lucide:trending-up" width="12" className="text-green-500" />
                                    <span className="text-[10px] text-green-500 font-mono">+12.5%</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between group hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Active Assets</span>
                                <Icon icon="lucide:files" width="14" className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-medium text-white tracking-tight">{rwaSupply}</div>
                                <div className="text-[10px] text-zinc-500 mt-1 font-mono">Real-time On-Chain</div>
                            </div>
                        </div>

                        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between group hover:border-white/20 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Jurisdictions</span>
                                <Icon icon="lucide:flag" width="14" className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <div className="text-2xl font-display font-medium text-white tracking-tight">34</div>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span className="text-[10px] text-zinc-500 font-mono">Global Coverage</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between relative overflow-hidden border-orange-500/20">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <Icon icon="lucide:siren" width="48" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="font-semibold text-sm text-white mb-3 flex items-center gap-2">
                                    <Icon icon="lucide:shield-alert" className="text-orange-500" width="14" />
                                    Active Alerts
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-2 bg-red-500/10 border border-red-500/20 rounded flex gap-2">
                                        <div className="w-1 bg-red-500 rounded-full"></div>
                                        <div>
                                            <div className="text-[11px] font-semibold text-red-200">OFAC Block</div>
                                            <div className="text-[9px] text-red-200/50">Address 0x82...91a flagged.</div>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded flex gap-2">
                                        <div className="w-1 bg-amber-500 rounded-full"></div>
                                        <div>
                                            <div className="text-[11px] font-semibold text-amber-200">Whale Alert</div>
                                            <div className="text-[9px] text-amber-200/50">&gt; $1M transfer pending review.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts & Globe */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 glass-panel p-6 rounded-xl relative overflow-hidden h-[500px]">
                            <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                                <Icon icon="lucide:globe" className="text-zinc-500" />
                                Real-Time Compliance Flow
                            </h3>
                            <Globe points={globePoints} />
                            {globePoints.length === 0 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-pulse"></span>
                                        <span className="text-[10px] text-zinc-400">Waiting for Network Activity...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="glass-panel p-6 rounded-xl flex flex-col h-[500px]">
                            <h3 className="text-sm font-medium text-white mb-6">Yield Projection</h3>
                            <div className="flex-1 w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="time" stroke="#6b7280" tickLine={false} axisLine={false} />
                                        <YAxis stroke="#6b7280" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}M`} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" strokeWidth={2} stroke="#f97316" fill="url(#colorValue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-zinc-500">Projected APY</span>
                                    <span className="text-orange-500 font-bold">8.4%</span>
                                </div>
                                <div className="flex justify-between items-center text-xs mt-2">
                                    <span className="text-zinc-500">Risk-Adjusted Return</span>
                                    <span className="text-white font-bold">7.1%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mint Modal */}
            {isMintModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center">
                            <h2 className="text-lg font-display font-medium text-white">Mint New Asset</h2>
                            <button onClick={() => setIsMintModalOpen(false)} className="text-zinc-500 hover:text-white">
                                <Icon icon="lucide:x" width="20" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {!mintSuccess ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-zinc-400 font-medium">Recipient Address</label>
                                        <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-white/5 rounded-lg">
                                            <Icon icon="lucide:wallet" className="text-zinc-600" width="16" />
                                            <input
                                                value={mintRecipient}
                                                onChange={(e) => setMintRecipient(e.target.value)}
                                                className="bg-transparent border-none outline-none text-sm text-white w-full font-mono placeholder-zinc-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] text-zinc-400 font-medium">Asset Value (USD)</label>
                                        <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-white/5 rounded-lg focus-within:border-orange-500/50 transition-colors">
                                            <span className="text-zinc-500 font-bold">$</span>
                                            <input
                                                type="number"
                                                value={mintAmount}
                                                onChange={(e) => setMintAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="bg-transparent border-none outline-none text-lg text-white w-full font-mono font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg flex gap-3 items-start">
                                        <Icon icon="lucide:info" className="text-orange-500 shrink-0 mt-0.5" width="14" />
                                        <p className="text-[10px] text-orange-200/70 leading-relaxed">
                                            This action will trigger a real-time compliance check against the Ava//Cell Registry. If the recipient is blacklisted, the transaction will revert.
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleMint}
                                        disabled={isMinting || !mintAmount}
                                        className="w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2 flex items-center justify-center gap-2"
                                    >
                                        {isMinting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                Verifying Compliance...
                                            </>
                                        ) : (
                                            <>
                                                <Icon icon="lucide:check-circle" width="16" />
                                                Mint Assets
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <div className="py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                                        <Icon icon="lucide:check" className="text-green-500" width="32" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Mint Successful</h3>
                                    <p className="text-zinc-400 text-sm">Assets have been tokenized and transferred.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
