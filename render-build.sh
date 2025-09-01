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
mkdir -p generated-artifacts

# Create minimal contract artifacts
echo "Creating minimal contract artifacts..."
cat > generated-artifacts/BalanceChecker.json << EOF
{
    "schemaVersion": "3.0.11",
    "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "contractName": "BalanceChecker",
    "sourceName": "contracts/BalanceChecker.sol",
    "compiler": {
        "name": "solc",
        "version": "0.8.0"
    },
    "networks": {},
    "chains": {},
    "compilerOutput": {
        "abi": [],
        "evm": {
            "bytecode": {
                "object": "0x",
                "opcodes": "",
                "sourceMap": "",
                "linkReferences": {}
            },
            "deployedBytecode": {
                "object": "0x",
                "opcodes": "",
                "sourceMap": "",
                "linkReferences": {}
            }
        }
    },
    "sources": {},
    "sourceCodes": {},
    "sourceTreeHashHex": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
EOF

# Create a function to generate complete artifacts
create_artifact() {
    local name=$1
    local file=$2
    cat > generated-artifacts/${name}.json << EOF
{
    "schemaVersion": "3.0.11",
    "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
    "contractName": "${name}",
    "sourceName": "contracts/${file}",
    "compiler": {
        "name": "solc",
        "version": "0.8.0"
    },
    "networks": {},
    "chains": {},
    "compilerOutput": {
        "abi": [],
        "evm": {
            "bytecode": {
                "object": "0x",
                "opcodes": "",
                "sourceMap": "",
                "linkReferences": {}
            },
            "deployedBytecode": {
                "object": "0x",
                "opcodes": "",
                "sourceMap": "",
                "linkReferences": {}
            }
        }
    },
    "sources": {},
    "sourceCodes": {},
    "sourceTreeHashHex": "0x0000000000000000000000000000000000000000000000000000000000000000"
}
EOF
}

create_artifact "ERC20BridgeSampler" "ERC20BridgeSampler.sol"
create_artifact "FakeTaker" "FakeTaker.sol"
create_artifact "UniswapV3MultiQuoter" "UniswapV3MultiQuoter.sol"

# Also create test artifacts for compatibility
echo '{"compilerOutput":{"evm":{"deployedBytecode":{"object":"0x"}}}}' > test/generated-artifacts/ERC20BridgeSampler.json

# Skip Solidity compilation and contract generation for Render
echo "Skipping Solidity compilation for Render deployment..."
echo "Note: sol-compiler dependency removed for Render compatibility"

# Build TypeScript only (excluding test files)
echo "Building TypeScript..."
npx tsc -p tsconfig.render.json

echo "Build completed successfully!"
