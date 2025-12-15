export const AVA_CELL_CHAIN_ID = 43113; // Fuji Testnet
export const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";

export const CONTRACTS = {
    AvaStablecoin: {
        address: "0xE01D2cf5e82d588f4660DB248ccFfaFCAe92309F" as `0x${string}`,
        abi: [
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
                "name": "balanceOf",
                "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    { "internalType": "address", "name": "to", "type": "address" },
                    { "internalType": "uint256", "name": "amount", "type": "uint256" }
                ],
                "name": "mint",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    { "indexed": true, "internalType": "address", "name": "from", "type": "address" },
                    { "indexed": true, "internalType": "address", "name": "to", "type": "address" },
                    { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]
    },
    AvaRWAAsset: {
        address: "0xE5829Fe92Cf254FF61b6FD19aD6ccE3fca4a2c57" as `0x${string}`,
        abi: [
            {
                "inputs": [],
                "name": "name",
                "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
                "name": "balanceOf",
                "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    },
    AvaRegistry: {
        address: "0xc78a185dDC2d862B52A381295Ce24E5E2C98e3c8" as `0x${string}`,
        abi: [
            {
                "anonymous": false,
                "inputs": [
                    { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
                    { "indexed": false, "internalType": "enum AvaComplianceRegistry.ComplianceLevel", "name": "level", "type": "uint8" }
                ],
                "name": "ComplianceLevelChanged",
                "type": "event"
            },
            {
                "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
                "name": "getComplianceLevel",
                "outputs": [{ "internalType": "enum AvaComplianceRegistry.ComplianceLevel", "name": "", "type": "uint8" }],
                "stateMutability": "view",
                "type": "function"
            }
        ]
    }
} as const;
