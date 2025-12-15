"use client"

import { createPublicClient, createWalletClient, custom, http, parseEther, formatEther } from 'viem'
import { useEffect, useState } from 'react'
import { CONTRACTS, RPC_URL, AVA_CELL_CHAIN_ID } from '@/lib/contracts'

// Define custom chain for Ava//Cell Subnet
const avaCellChain = {
    id: AVA_CELL_CHAIN_ID,
    name: 'Ava//Cell Network',
    network: 'avacell',
    nativeCurrency: {
        decimals: 18,
        name: 'AvaCell',
        symbol: 'CELL',
    },
    rpcUrls: {
        default: { http: [RPC_URL] },
        public: { http: [RPC_URL] },
    },
} as const

export function useWeb3() {
    const [account, setAccount] = useState<string | null>(null)
    const [publicClient, setPublicClient] = useState<any>(null)
    const [walletClient, setWalletClient] = useState<any>(null)
    const [isOkxInstalled, setIsOkxInstalled] = useState(false)

    // Initialize Public Client & Eager Connect
    useEffect(() => {
        const pc = createPublicClient({
            chain: avaCellChain,
            transport: http()
        })
        setPublicClient(pc)

        // Check for OKX & Eager Connect
        const checkConnection = async () => {
            if (typeof window === 'undefined') return

            const provider = (window as any).okxwallet || (window as any).ethereum
            const isOkx = !!(window as any).okxwallet

            if (isOkx) setIsOkxInstalled(true)

            if (provider) {
                try {
                    // Check if already authorized
                    const accounts = await provider.request({ method: 'eth_accounts' })
                    if (accounts && accounts.length > 0) {
                        // User previously connected, auto-connect now
                        const wc = createWalletClient({
                            chain: avaCellChain,
                            transport: custom(provider)
                        })
                        setWalletClient(wc)
                        setAccount(accounts[0])
                        console.log("Auto-connected:", accounts[0])
                    }
                } catch (err) {
                    console.warn("Auto-connect failed", err)
                }
            }
        }

        checkConnection()
    }, [])

    // Helper for Chain Switching
    const textChainId = `0x${AVA_CELL_CHAIN_ID.toString(16)}`

    const switchNetwork = async (provider: any) => {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: textChainId }],
            });
        } catch (switchError: any) {
            if (switchError.code === 4902) {
                await provider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: textChainId,
                        chainName: 'Avalanche Fuji (Ava//Cell)',
                        nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
                        rpcUrls: [RPC_URL],
                    }],
                });
            }
        }
    }

    // Connect Standard Wallet (MetaMask/Core)
    const connectWallet = async () => {
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            try {
                const provider = (window as any).ethereum
                const chainId = await provider.request({ method: 'eth_chainId' })
                if (parseInt(chainId, 16) !== AVA_CELL_CHAIN_ID) {
                    await switchNetwork(provider)
                }

                const wc = createWalletClient({
                    chain: avaCellChain,
                    transport: custom(provider)
                })
                const [address] = await wc.requestAddresses()
                setAccount(address)
                setWalletClient(wc)
                return address
            } catch (error) {
                console.error("Failed to connect wallet:", error)
                return null
            }
        } else {
            alert("Please install MetaMask or Core Wallet!")
            return null
        }
    }

    // Connect OKX Specifically
    const connectOKX = async () => {
        const provider = (window as any).okxwallet || (window as any).ethereum
        if (!provider) {
            window.open("https://www.okx.com/web3", "_blank")
            return
        }

        try {
            const chainId = await provider.request({ method: 'eth_chainId' })
            if (parseInt(chainId, 16) !== AVA_CELL_CHAIN_ID) {
                await switchNetwork(provider)
            }

            const wc = createWalletClient({
                chain: avaCellChain,
                transport: custom(provider)
            })
            const [address] = await wc.requestAddresses()
            setAccount(address)
            setWalletClient(wc)
            console.log("Connected via OKX:", address)
            return address
        } catch (error) {
            console.error("OKX Connection Error:", error)
        }
    }

    return {
        account,
        connectWallet,
        connectOKX, // Exposed
        isOkxInstalled,
        publicClient,
        walletClient,
        CONTRACTS
    }
}
