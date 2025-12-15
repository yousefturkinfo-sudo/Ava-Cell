#!/bin/bash

# Check if avalanche-network-runner is installed
if command -v avalanche-network-runner &> /dev/null; then
    runner="avalanche-network-runner"
elif [ -f "./bin/avalanche-network-runner" ]; then
    runner="./bin/avalanche-network-runner"
elif [ -f "$HOME/bin/avalanche-network-runner" ]; then
    runner="$HOME/bin/avalanche-network-runner"
else
    echo "avalanche-network-runner could not be found."
    echo "Please install it from: https://github.com/ava-labs/avalanche-network-runner"
    exit 1
fi

echo "Starting local Avalanche network with 5 nodes..."
$runner server \
--log-level debug \
--log-level debug \
--port=":8080" \
--grpc-gateway-port=":8081"
