"use client"

import Link from "next/link"
import { Icon } from "@iconify/react"
import { motion } from "framer-motion"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-orange-500/30 selection:text-orange-100 overflow-x-hidden">

            {/* Navbar - Clean B2B Style */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <div className="w-4 h-4 bg-black rounded-sm rotate-45"></div>
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight">Ava<span className="text-zinc-500">//</span>Cell</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <a href="#features" className="hover:text-white transition-colors">Platform</a>
                        <a href="#compliance" className="hover:text-white transition-colors">Compliance</a>
                        <a href="#developers" className="hover:text-white transition-colors">Developers</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/sign-in" className="text-sm font-medium text-white hover:text-zinc-300 transition-colors">Log In</Link>
                        <Link href="/sign-up" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-all shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)]">
                            Start Building
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Technical & Graphic */}
            <main className="pt-32 pb-24 px-6 relative">
                {/* Background Grid - "Blueprint" Feel */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                            <span className="text-xs font-mono text-orange-400 font-bold tracking-wide">V1.0 LIVE ON AVALANCHE</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500">
                            Automate RWA <br />
                            <span className="text-white">Compliance</span>
                        </h1>

                        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                            Stop building manual KYC silos. Ava//Cell embeds identity and risk logic directly into the asset token, enabling instant, compliant settlement across borders.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                            <Link href="/sign-up" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                                Start Free Trial <Icon icon="lucide:arrow-right" />
                            </Link>
                            <Link href="https://docs.avax.network" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                <Icon icon="lucide:code" /> API Docs
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 pt-8 grayscale opacity-50">
                            <Icon icon="simple-icons:avalanche" width="24" />
                            <Icon icon="simple-icons:chainlink" width="24" />
                            <Icon icon="simple-icons:okx" width="24" />
                            <span className="text-xs font-mono text-zinc-600">TRUSTED BY BUILDERS</span>
                        </div>
                    </div>

                    {/* Technical Graphic - "The Stack" */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                        <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-6">
                            {/* Window UI */}
                            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                                </div>
                                <div className="ml-auto text-[10px] font-mono text-zinc-600">SENTINEL_PROCESS_ACTIVE</div>
                            </div>

                            {/* The Stack Animation */}
                            <div className="space-y-4">
                                {/* Layer 1: Asset */}
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/50 border border-white/5 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                                    <div className="w-10 h-10 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                        <Icon icon="lucide:box" className="text-indigo-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-bold text-white">ERC-20 Token</span>
                                            <span className="text-[10px] font-mono text-indigo-400">0x72a...91b</span>
                                        </div>
                                        <div className="h-1 w-full bg-zinc-800 rounded mt-2 overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[60%]"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Connector */}
                                <div className="flex justify-center -my-2 relative z-10">
                                    <Icon icon="lucide:arrow-down" className="text-zinc-700" />
                                </div>

                                {/* Layer 2: Compliance (Highlighted) */}
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-orange-500/10 border border-orange-500/50 relative">
                                    <div className="absolute inset-0 bg-orange-500/5 animate-pulse"></div>
                                    <div className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center border border-orange-500">
                                        <Icon icon="lucide:shield-check" className="text-orange-500" />
                                    </div>
                                    <div className="flex-1 relative z-10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-white">Ava//Sentinel Layer</span>
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500 text-black text-[10px] font-bold">
                                                <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></span> PROCESSING
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            <div className="text-[10px] text-center py-1 bg-black/50 border border-orange-500/30 rounded text-orange-200">KYB Check</div>
                                            <div className="text-[10px] text-center py-1 bg-black/50 border border-orange-500/30 rounded text-orange-200">Sanctions</div>
                                            <div className="text-[10px] text-center py-1 bg-black/50 border border-orange-500/30 rounded text-orange-200">Jurisdiction</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Connector */}
                                <div className="flex justify-center -my-2 relative z-10">
                                    <Icon icon="lucide:arrow-down" className="text-zinc-700" />
                                </div>

                                {/* Layer 3: Settlement */}
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/50 border border-white/5 group hover:border-emerald-500/30 transition-colors">
                                    <div className="w-10 h-10 rounded bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                        <Icon icon="lucide:check-circle" className="text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-bold text-white">Subnet Settlement</span>
                                            <span className="text-[10px] font-mono text-emerald-400">Finality: &lt;1s</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-[10px] text-zinc-500">Block #18,291,002 Confirmed</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Feature Grid - B2B Grid Style */}
            <section className="py-24 border-t border-white/5 bg-[#080808]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl font-display font-bold text-white mb-4">Infrastructure for the <span className="text-orange-500">Tokenized Economy</span></h2>
                        <p className="text-zinc-400 max-w-2xl">Built for asset managers who need programmatic compliance without sacrificing DeFi composability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Programmatic Identity", desc: "Attach Verifiable Credentials (W3C DIDs) to every wallet address.", icon: "fingerprint" },
                            { title: "Policy Engine", desc: "Define transfer rules (Whitelists, Limits) in pure Solidity or Python.", icon: "file-code" },
                            { title: "Gas Abstraction", desc: "Pay transaction fees in fiat or stablecoins via Paymaster integration.", icon: "fuel" },
                            { title: "Privacy Zones", desc: "Leverage ZK-proofs to shield balances while proving solvency.", icon: "eye-off" },
                            { title: "Institutional Custody", desc: "Native integration with Fireblocks and Copper MPC wallets.", icon: "lock" },
                            { title: "instant Settlement", desc: "T+0 Finality on a dedicated Avalanche Subnet.", icon: "zap" }
                        ].map((f, i) => (
                            <div key={i} className="p-8 bg-zinc-900/20 border border-white/5 rounded-xl hover:bg-zinc-900/40 hover:border-orange-500/20 transition-all group">
                                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                                    <Icon icon={`lucide:${f.icon}`} width="24" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/5 bg-black text-zinc-600 text-sm">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 Ava//Cell Inc.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Status</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
