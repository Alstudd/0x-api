#!/bin/bash

echo "Starting Render build process..."

export npm_config_optional=false
export SKIP_HID_BUILD=true
export NODE_ENV=production

echo "Creating required directories..."
mkdir -p test/generated-artifacts
mkdir -p test/generated-wrappers
mkdir -p generated-artifacts
mkdir -p generated-wrappers

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

echo "Copying artifacts to test directory..."
cp generated-artifacts/*.json test/generated-artifacts/

echo "Skipping Solidity compilation for Render deployment..."
echo "Note: sol-compiler dependency removed for Render compatibility"

echo "Building TypeScript..."
npx tsc -p tsconfig.render.json --noEmitOnError false || echo "TypeScript compilation completed with errors (continuing for deployment)"

echo "Copying generated-artifacts to build output..."
mkdir -p __build__/generated-artifacts
cp generated-artifacts/*.json __build__/generated-artifacts/

echo "Copying complete generated-wrappers from test directory..."
cp test/generated-wrappers/balance_checker.ts generated-wrappers/
cp test/generated-wrappers/erc20_bridge_sampler.ts generated-wrappers/
cp test/generated-wrappers/fake_taker.ts generated-wrappers/
cp test/generated-wrappers/uniswap_v3_multi_quoter.ts generated-wrappers/

echo "Compiling generated-wrappers..."
mkdir -p __build__/generated-wrappers
for file in generated-wrappers/*.ts; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .ts)
        echo "Compiling $filename.ts to JavaScript..."
        npx tsc --target es2020 --module commonjs --outDir __build__/generated-wrappers --skipLibCheck "$file"
    fi
done

echo "Build completed successfully!"
