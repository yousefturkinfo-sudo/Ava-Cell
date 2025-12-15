import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    console.log("Deploying contracts...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    // 1. Deploy Registry
    const Registry = await ethers.getContractFactory("AvaComplianceRegistry");
    const registry = await Registry.deploy();
    await registry.waitForDeployment();
    const registryAddress = await registry.getAddress();
    console.log("AvaComplianceRegistry deployed to:", registryAddress);

    // 2. Deploy Stablecoin
    const Stablecoin = await ethers.getContractFactory("AvaStablecoin");
    const stablecoin = await Stablecoin.deploy(registryAddress);
    await stablecoin.waitForDeployment();
    const stablecoinAddress = await stablecoin.getAddress();
    console.log("AvaStablecoin deployed to:", stablecoinAddress);

    // 3. Deploy Example RWA
    const RWA = await ethers.getContractFactory("AvaRWAAsset");
    const rwa = await RWA.deploy("Tokenized Real Estate", "TRE", registryAddress);
    await rwa.waitForDeployment();
    const rwaAddress = await rwa.getAddress();
    console.log("AvaRWAAsset deployed to:", rwaAddress);

    // Output addresses
    const output = {
        network: "avaCell",
        chainId: 22222,
        contracts: {
            AvaComplianceRegistry: registryAddress,
            AvaStablecoin: stablecoinAddress,
            AvaRWAAsset: rwaAddress,
        },
    };

    const deployPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deployPath)) {
        fs.mkdirSync(deployPath);
    }

    fs.writeFileSync(
        path.join(deployPath, "avaCell.json"),
        JSON.stringify(output, null, 2)
    );
    console.log("Deployment info saved to deployments/avaCell.json");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
