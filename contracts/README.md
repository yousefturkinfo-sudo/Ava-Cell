# Ava//Cell Smart Contracts

## Contracts
- `AvaComplianceRegistry`: Manages KYC states.
- `AvaStablecoin`: Regulated ERC20 stablecoin.
- `AvaRWAAsset`: Regulated RWA token.

## Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Env**:
   Create `.env`:
   ```env
   SUBNET_RPC_URL=http://localhost:9650/ext/bc/22222/rpc
   PRIVATE_KEY=<your-private-key>
   ```

3. **Deploy**:
   ```bash
   npx hardhat run scripts/deployAll.ts --network avaCell
   ```

   This will generate `deployments/avaCell.json` with the deployed addresses.
