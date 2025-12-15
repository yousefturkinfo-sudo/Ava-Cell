import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const SUBNET_RPC_URL = process.env.SUBNET_RPC_URL || "http://127.0.0.1:9650/ext/bc/22222/rpc"; // Default fallback
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5cc235828aa0"; // Default prefunded key invocation

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        avaCell: {
            url: SUBNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 22222,
        },
        fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            chainId: 43113,
            accounts: [PRIVATE_KEY] // User needs to fund this address
        }
    },
};

export default config;
