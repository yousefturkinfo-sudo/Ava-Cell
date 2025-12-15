import { Wallet } from "ethers";

const mnemonic = "bag almost cloth sister pony senior clarify rule join grow quarter bachelor quick indoor tonight board bracket desk neither boss muffin initial mean brass";
const expectedAddress = "0x5AA73Db840A338003c6E9201def431d48F27bb05";

async function main() {
    try {
        const wallet = Wallet.fromPhrase(mnemonic);
        console.log("Derived Address:", wallet.address);
        console.log("Expected Address:", expectedAddress);

        if (wallet.address.toLowerCase() === expectedAddress.toLowerCase()) {
            console.log("MATCH! Private Key:", wallet.privateKey);
        } else {
            console.error("MISMATCH! The mnemonic does not generate the expected address.");
        }
    } catch (error) {
        console.error("Error deriving wallet:", error);
    }
}

main();
