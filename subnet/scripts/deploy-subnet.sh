#!/bin/bash
set -e
set -x

# Configuration
SUBNET_NAME="avaCellSubnet"

echo "Deploying $SUBNET_NAME to local network..."

# NOTE: This assumes using avalanche-cli which is easier for subnets
# Check for avalanche-cli
if [ -f "$HOME/bin/avalanche" ]; then
    AVALANCHE="$HOME/bin/avalanche"
elif command -v avalanche &> /dev/null; then
    AVALANCHE="avalanche"
else
    echo "avalanche-cli could not be found"
    echo "Install: curl -sSfL https://raw.githubusercontent.com/ava-labs/avalanche-cli/main/scripts/install.sh | sh"
    exit 1
fi

echo "Using Avalanche CLI: $AVALANCHE"
$AVALANCHE --version

# Create subnet/blockchain configuration
echo "Creating blockchain definition..."
$AVALANCHE blockchain create $SUBNET_NAME --force --genesis ./genesis.json

echo "Deploying blockchain..."
$AVALANCHE blockchain deploy $SUBNET_NAME --local

echo "Done! check output for RPC URL."
