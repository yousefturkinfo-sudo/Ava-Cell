# Ava//Cell: AI-Native RWA Compliance Layer

**Ava//Cell** is an institutional-grade Asset Tokenization platform built on a dedicated Avalanche Subnet. It integrates real-time AI compliance checks directly into the asset lifecycle, ensuring that every token transfer interacts with a dynamic Regulatory Sentinel.

---

## 🚀 Key Features

### 1. **AI-Driven Compliance (Sentinel)**
   - **Real-Time Risk Scoring**: Every wallet interaction is scored by an AI microservice (Python/FastAPI) before settlement.
   - **Automated KYB/KYC**: Addresses are tagged with verifiable credentials (DID) and checked against global sanctions lists dynamically.
   - **Jurisdiction Aware**: The `AvaComplianceRegistry` smart contract enforces cross-border transfer rules automatically.

### 2. **Institutional Dashboard**
   - **High-Fidelity Visualization**: Real-time 3D Globe visualization of capital flows and risk vectors.
   - **Yield Analytics**: Advanced charting for Treasury and Real Estate yield projections across different compliance zones.
   - **Operator Console**: A unified interface for Asset Managers to Mint, Burn, and Freeze assets.

### 3. **Dedicated Subnet Architecture**
   - **Custom Gas Token ($CELL)**: A fee-abstracted environment where institutions pay for blockspace in native $CELL tokens.
   - **High Throughput**: 4,500 TPS with sub-second finality on the Avalanche Consensus Protocol.
   - **Privacy Preserving**: Optional ZK-proof modules for private balance shielding (Roadmap).

---

## 🛠 Technology Stack

- **Blockchain**: Avalanche Subnet (Fuji Testnet deployed).
- **Contracts**: Solidity (Hardhat), OpenZeppelin 5.0 (ERC20, AccessControl).
- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Recharts, Three.js (R3F).
- **Backend (AI)**: Python, FastAPI, Pandas (Risk Modeling).
- **Database**: Supabase (PostgreSQL) for off-chain metadata.
- **Auth**: Clerk (Enterprise) + Web3 (Viem/Wagmi).

---

## ⚡️ Quick Start

### Prerequisites
- Node.js v18+
- Python 3.9+
- Docker (optional)
- MetaMask or OKX Wallet

### 1. Clone & Setup
```bash
git clone https://github.com/avacell/network.git
cd ava-cell
npm install
```

### 2. Start AI Microservice
```bash
cd ai-service
pip install -r requirements.txt
python src/index.py --port 4000
```

### 3. Launch Console
```bash
cd dashboard
npm run dev
```
Visit `http://localhost:3000` to access the console.

---

## 🔐 Smart Contracts

| Contract | Address (Fuji) | Description |
|----------|----------------|-------------|
| **AvaStablecoin** | `0xE01D2cf5e82d588f4660DB248ccFfaFCAe92309F` | USD-pegged settlement token. |
| **AvaRWAAsset** | `0xE5829Fe92Cf254FF61b6FD19aD6ccE3fca4a2c57` | Tokenized Real World Asset. |
| **AvaRegistry** | `0xc78a185dDC2d862B52A381295Ce24E5E2C98e3c8` | Compliance Logic & Risk Levels. |

---

## 📜 License
Private & Confidential.
Copyright © 2024 Ava//Cell Inc.
