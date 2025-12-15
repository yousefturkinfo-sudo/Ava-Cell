# Ava//Cell User Tutorial

Welcome to the **Ava//Cell Asset Console**. This guide explains how to operate the platform and interact with the dedicated Subnet.

## 1. Understanding the $CELL Token
The Ava//Cell network runs on its own dedicated blockchain (Subnet).
- **$CELL** is the "Gas Token". Just like you need ETH to use Ethereum or AVAX to use Avalanche C-Chain, you need **CELL** to pay for transactions on this network.
- **Why?** This ensures that our institutional network is not affected by congestion on the main public chains.
- **How to get it?**: For this Testnet version, your pre-configured Account #0 comes pre-loaded with CELL tokens.

## 2. Getting Started
1.  **Open the Console**: Navigate to the Landing Page (`/`).
2.  **Sign In**: Click "Sign In" to authenticate via our secure portal (Clerk).
3.  **Connect Wallet**:
    - Once in the dashboard, look at the sidebar bottom left.
    - If you have **OKX Wallet**, click "Connect OKX".
    - Otherwise, it will prompt for **MetaMask**.
    - *Note: The app will automatically ask to add the "Ava//Cell Subnet" to your wallet.*

## 3. Dashboard Overview
- **Yield Projection**: Shows the estimated annual return of your RWA portfolio based on current risk parameters.
- **Live Compliance Globe**: Visualizes real-time transactions occurring on the network.
    - *Green Dot*: Low Risk / Safe Jurisdiction.
    - *Red Dot*: High Risk / Sanctioned Jurisdiction.
    - **Try it**: Hover over a dot to see the AI Risk Score.

## 4. Minting Assets (The Core Action)
1.  Scroll down to **"Asset Management"**.
2.  Click **"Mint New Asset"**.
3.  **Recipient**: Enter the wallet address that will receive the tokens (or keep the default).
4.  **Amount**: Enter the amount of Real Estate or Treasury tokens to fractionalize.
5.  **Confirm**: Click "Mint". Your wallet will pop up.
6.  **Sign**: Confirm the transaction in your wallet.
    - *Under the hood*: The `AvaRWAAsset` contract checks your compliance status with the Registry before allowing this.

## 5. Troubleshooting
- **"Wrong Network"**: If the mint fails, double-check your wallet is on **Chain ID 22222** (Ava//Cell).
- **"Insufficient Funds"**: You need $CELL tokens for gas.
