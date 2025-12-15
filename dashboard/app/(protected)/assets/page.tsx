"use client"

import { useEffect, useState } from 'react'
import { Filter, SlidersHorizontal, Download, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWeb3 } from "@/hooks/useWeb3"
import { formatEther, parseEther } from 'viem'

export default function AssetsPage() {
    const { publicClient, walletClient, CONTRACTS, account } = useWeb3()
    const [assets, setAssets] = useState<any[]>([])

    // Modal State
    const [isMintModalOpen, setIsMintModalOpen] = useState(false)
    const [mintRecipient, setMintRecipient] = useState("")
    const [mintAmount, setMintAmount] = useState("")
    const [isMinting, setIsMinting] = useState(false)

    useEffect(() => {
        if (!publicClient) return

        async function fetchAssets() {
            try {
                const [name, symbol, supply] = await Promise.all([
                    publicClient.readContract({
                        address: CONTRACTS.AvaRWAAsset.address,
                        abi: CONTRACTS.AvaRWAAsset.abi,
                        functionName: 'name'
                    }),
                    publicClient.readContract({
                        address: CONTRACTS.AvaRWAAsset.address,
                        abi: CONTRACTS.AvaRWAAsset.abi,
                        functionName: 'symbol'
                    }),
                    publicClient.readContract({
                        address: CONTRACTS.AvaRWAAsset.address,
                        abi: CONTRACTS.AvaRWAAsset.abi,
                        functionName: 'totalSupply'
                    })
                ])

                setAssets([{
                    name: name as string,
                    type: "RWA Token",
                    value: `$${Number(formatEther(supply as bigint)).toLocaleString()}`,
                    symbol: symbol as string,
                    status: "Active"
                }])

            } catch (error) {
                console.error("Failed to fetch asset data:", error)
            }
        }

        fetchAssets()
        const interval = setInterval(fetchAssets, 5000)
        return () => clearInterval(interval)
    }, [publicClient])

    const handleMint = async () => {
        if (!walletClient || !account) {
            alert("Please connect your wallet first!")
            return
        }

        setIsMinting(true)
        try {
            const hash = await walletClient.writeContract({
                address: CONTRACTS.AvaRWAAsset.address,
                abi: CONTRACTS.AvaRWAAsset.abi,
                functionName: 'mint',
                args: [mintRecipient as `0x${string}`, parseEther(mintAmount)],
                account
            })
            console.log("Mint Tx:", hash)
            alert(`Mint submitted! Tx: ${hash}`)
            setIsMintModalOpen(false)
            setMintAmount("")
            setMintRecipient("")
        } catch (error) {
            console.error("Mint failed:", error)
            alert("Minting failed. Check console.")
        } finally {
            setIsMinting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Regulated Assets</h1>
                    <p className="text-muted-foreground">Manage tokenized real-world assets on Subnet.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsMintModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Mint New Asset
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-muted/50">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/90">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Mint Modal */}
            {isMintModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-4">Mint RWA Token</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Recipient Address</label>
                                <input
                                    type="text"
                                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="0x..."
                                    value={mintRecipient}
                                    onChange={e => setMintRecipient(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Amount</label>
                                <input
                                    type="number"
                                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="1000"
                                    value={mintAmount}
                                    onChange={e => setMintAmount(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsMintModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-muted/50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMint}
                                    disabled={isMinting}
                                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors flex justify-center"
                                >
                                    {isMinting ? 'Minting...' : 'Confirm Mint'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/20 text-muted-foreground uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Asset Name</th>
                            <th className="px-6 py-4">Symbol</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4 text-right">Supply</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {assets.map((asset, i) => (
                            <tr key={i} className="hover:bg-muted/5 transition-colors cursor-pointer">
                                <td className="px-6 py-4 font-medium">{asset.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{asset.symbol}</td>
                                <td className="px-6 py-4 text-muted-foreground">{asset.type}</td>
                                <td className="px-6 py-4 text-right font-mono">{asset.value}</td>
                                <td className="px-6 py-4">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {asset.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {assets.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    Connecting to initialized Subnet...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
