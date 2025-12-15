import { Wallet } from "ethers";
import * as fs from "fs";

async function main() {
    const wallet = Wallet.createRandom();

    console.log("\nxxx GENERATED NEW DEPLOYER WALLET xxx");
    console.log("------------------------------------------------");
    console.log(`Address:     ${wallet.address}`);
    console.log(`Private Key: ${wallet.privateKey}`);
    console.log("------------------------------------------------");
    console.log("\nINSTRUCTIONS:");
    console.log("1. Copy the Address above.");
    console.log("2. Go to: https://core.app/tools/testnet-faucet/");
    console.log("3. Select 'Fuji (C-Chain)', paste the address, and request AVAX.");
    console.log("4. Once funded, update your .env file with the Private Key:");
    console.log(`   PRIVATE_KEY="${wallet.privateKey}"`);
    console.log("------------------------------------------------\n");

    // Optional: Save to a file (gitignored) for convenience
    fs.writeFileSync(".deployer-wallet.txt", `Address: ${wallet.address}\nPrivate Key: ${wallet.privateKey}\n`);
    console.log("Saved credentials to .deployer-wallet.txt (Do not commit this file!)");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
