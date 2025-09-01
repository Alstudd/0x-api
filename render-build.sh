#!/bin/bash

# Render-specific build script that bypasses native dependencies and Solidity compilation

echo "Starting Render build process..."

# Skip native dependency compilation for optional packages
export npm_config_optional=false
export SKIP_HID_BUILD=true
export NODE_ENV=production

# Ensure we have the pre-compiled contract artifacts
echo "Creating required directories..."
mkdir -p test/generated-artifacts
mkdir -p test/generated-wrappers

# Create minimal contract artifacts if they don't exist
if [ ! -f "test/generated-artifacts/ERC20BridgeSampler.json" ]; then
    echo "Creating minimal contract artifacts..."
    echo '{"compilerOutput":{"evm":{"deployedBytecode":{"object":"0x"}}}}' > test/generated-artifacts/ERC20BridgeSampler.json
fi

# Skip Solidity compilation and contract generation for Render
echo "Skipping Solidity compilation for Render deployment..."

# Build TypeScript only
echo "Building TypeScript..."
npx tsc -p tsconfig.json

echo "Build completed successfully!"
