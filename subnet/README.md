# Ava//Cell Subnet Setup

This directory contains configuration to spin up the `ava-cell-subnet`.

## Prerequisites

1. **Avalanche-CLI**: [Installation Guide](https://github.com/ava-labs/avalanche-cli)
2. **Avalanche Network Runner** (Optional, CLI handles local network mostly)

## Getting Started

1. **Make scripts executable**:
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Deploy Local Subnet**:
   ```bash
   ./scripts/deploy-subnet.sh
   ```
   This script uses `avalanche-cli` to create and deploy the subnet locally.

3. **Get RPC URL**:
   After deployment, the CLI will output an RPC URL, typically:
   `http://localhost:9650/ext/bc/<SubnetID>/rpc`

   Copy this URL to your `.env` files in `contracts/` and `dashboard/`.

## Configuration
- `genesis.json`: Defines chain ID (22222) and pre-funded accounts.
- `subnet-config.json`: General settings.
