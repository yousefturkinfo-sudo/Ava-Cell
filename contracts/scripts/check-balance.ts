import { ethers } from "ethers";

async function main() {
    const provider = new ethers.JsonRpcProvider("https://api.avax-test.network/ext/bc/C/rpc");
    const address = "0xd483265ac3060DE9268C1143e96fCC4A1374dFcc";
    const balance = await provider.getBalance(address);
    console.log("Balance:", ethers.formatEther(balance));
}

main().catch(console.error);
