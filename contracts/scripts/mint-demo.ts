import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Minting with account:", deployer.address);

    // Addresses from deployment (Fuji)
    const STABLECOIN_ADDRESS = "0xE01D2cf5e82d588f4660DB248ccFfaFCAe92309F";
    const RWA_ADDRESS = "0xE5829Fe92Cf254FF61b6FD19aD6ccE3fca4a2c57";

    // Connect to contracts
    const stablecoin = await ethers.getContractAt("AvaStablecoin", STABLECOIN_ADDRESS);
    const rwa = await ethers.getContractAt("AvaRWAAsset", RWA_ADDRESS);

    // Mint Amounts (High End Fintech Numbers)
    // 5 Million Stablecoin
    const mintAmountStable = ethers.parseEther("5000000");
    // 2.5 Million RWA Assets
    const mintAmountRWA = ethers.parseEther("2500000");

    console.log("Minting 5,000,000 Stablecoins...");
    const tx1 = await stablecoin.mint(deployer.address, mintAmountStable);
    await tx1.wait();
    console.log("Minted! Hash:", tx1.hash);

    console.log("Minting 2,500,000 RWA Assets...");
    const tx2 = await rwa.mint(deployer.address, mintAmountRWA);
    await tx2.wait();
    console.log("Minted! Hash:", tx2.hash);

    console.log("\n------------------------------------------------");
    console.log("SUCCESS! Dashboard Supply Metrics should now spike. 📈");
    console.log("------------------------------------------------");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
