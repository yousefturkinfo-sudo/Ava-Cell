import { createPublicClient, http, defineChain } from 'viem'
import { CONFIG } from '../config'

export const avaCellChain = defineChain({
    id: CONFIG.CHAIN_ID,
    name: 'Ava//Cell Subnet',
    network: 'ava-cell',
    nativeCurrency: {
        decimals: 18,
        name: 'Avalanche',
        symbol: 'AVAX',
    },
    rpcUrls: {
        default: { http: [CONFIG.RPC_URL] },
        public: { http: [CONFIG.RPC_URL] },
    },
})

export const publicClient = createPublicClient({
    chain: avaCellChain,
    transport: http()
})
