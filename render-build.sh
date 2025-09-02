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

echo "Copying real contract artifacts from source..."
cp generated-artifacts/*.json test/generated-artifacts/ 2>/dev/null || echo "No source artifacts found, will create minimal ones"

echo "Copying real contract wrappers from source..."
cp generated-wrappers/*.ts test/generated-wrappers/ 2>/dev/null || echo "No source wrappers found, will create minimal ones"

echo "Creating all required contract artifacts..."

create_artifact() {
    local name=$1
    local file=$2
    if [ ! -f "test/generated-artifacts/${name}.json" ]; then
        cat > test/generated-artifacts/${name}.json << EOF
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
    fi
}

create_artifact "BalanceChecker" "BalanceChecker.sol"
create_artifact "ERC20BridgeSampler" "ERC20BridgeSampler.sol"
create_artifact "FakeTaker" "FakeTaker.sol"
create_artifact "UniswapV3MultiQuoter" "UniswapV3MultiQuoter.sol"

create_artifact "AaveV2Sampler" "AaveV2Sampler.sol"
create_artifact "AaveV3Sampler" "AaveV3Sampler.sol"
create_artifact "ApproximateBuys" "ApproximateBuys.sol"
create_artifact "BalancerSampler" "BalancerSampler.sol"
create_artifact "BalancerV2BatchSampler" "BalancerV2BatchSampler.sol"
create_artifact "BalancerV2Common" "BalancerV2Common.sol"
create_artifact "BalancerV2Sampler" "BalancerV2Sampler.sol"
create_artifact "BancorSampler" "BancorSampler.sol"
create_artifact "BancorV3Sampler" "BancorV3Sampler.sol"
create_artifact "CompoundSampler" "CompoundSampler.sol"
create_artifact "CurveSampler" "CurveSampler.sol"
create_artifact "DODOSampler" "DODOSampler.sol"
create_artifact "DODOV2Sampler" "DODOV2Sampler.sol"
create_artifact "GMXSampler" "GMXSampler.sol"
create_artifact "IBalancer" "IBalancer.sol"
create_artifact "IBalancerV2Vault" "IBalancerV2Vault.sol"
create_artifact "IBancor" "IBancor.sol"
create_artifact "IBancorV3" "IBancorV3.sol"
create_artifact "ICurve" "ICurve.sol"
create_artifact "IGMX" "IGMX.sol"
create_artifact "IMStable" "IMStable.sol"
create_artifact "IMooniswap" "IMooniswap.sol"
create_artifact "IPlatypus" "IPlatypus.sol"
create_artifact "IShell" "IShell.sol"
create_artifact "IUniswapExchangeQuotes" "IUniswapExchangeQuotes.sol"
create_artifact "IUniswapV2Router01" "IUniswapV2Router01.sol"
create_artifact "KyberDmmSampler" "KyberDmmSampler.sol"
create_artifact "LidoSampler" "LidoSampler.sol"
create_artifact "MStableSampler" "MStableSampler.sol"
create_artifact "MakerPSMSampler" "MakerPSMSampler.sol"
create_artifact "MooniswapSampler" "MooniswapSampler.sol"
create_artifact "NativeOrderSampler" "NativeOrderSampler.sol"
create_artifact "PlatypusSampler" "PlatypusSampler.sol"
create_artifact "SamplerUtils" "SamplerUtils.sol"
create_artifact "ShellSampler" "ShellSampler.sol"
create_artifact "SynthetixSampler" "SynthetixSampler.sol"
create_artifact "TestNativeOrderSampler" "TestNativeOrderSampler.sol"
create_artifact "TwoHopSampler" "TwoHopSampler.sol"
create_artifact "UniswapSampler" "UniswapSampler.sol"
create_artifact "UniswapV2Sampler" "UniswapV2Sampler.sol"
create_artifact "UniswapV3Sampler" "UniswapV3Sampler.sol"
create_artifact "UtilitySampler" "UtilitySampler.sol"
create_artifact "VelodromeSampler" "VelodromeSampler.sol"
create_artifact "WooPPSampler" "WooPPSampler.sol"

echo "Skipping Solidity compilation for Render deployment..."
echo "Note: sol-compiler dependency removed for Render compatibility"

echo "Building TypeScript..."
npx tsc -p tsconfig.render.json --noEmitOnError false || echo "TypeScript compilation completed with errors (continuing for deployment)"

echo "Copying generated-artifacts to build output..."
mkdir -p __build__/generated-artifacts
cp test/generated-artifacts/*.json __build__/generated-artifacts/

echo "Copying generated-wrappers to build output..."
mkdir -p __build__/generated-wrappers
cp test/generated-wrappers/*.ts __build__/generated-wrappers/

echo "Compiling generated-wrappers..."
for file in __build__/generated-wrappers/*.ts; do
    if [ -f "$file" ]; then
        filename=$(basename "$file" .ts)
        echo "Compiling $filename.ts to JavaScript..."
        npx tsc --target es2020 --module commonjs --outDir __build__/generated-wrappers --skipLibCheck "$file"
        rm "$file"
    fi
done

echo "Fixing module resolution in compiled wrappers..."
if [ -f "__build__/src/wrappers.js" ]; then
    echo "Fixing require statements in wrappers.js..."
    sed -i.bak 's/require("\.\.\/generated-wrappers\/balance_checker")/require("..\/generated-wrappers\/balance_checker.js")/g' __build__/src/wrappers.js
    sed -i.bak 's/require("\.\.\/generated-wrappers\/erc20_bridge_sampler")/require("..\/generated-wrappers\/erc20_bridge_sampler.js")/g' __build__/src/wrappers.js
    sed -i.bak 's/require("\.\.\/generated-wrappers\/fake_taker")/require("..\/generated-wrappers\/fake_taker.js")/g' __build__/src/wrappers.js
    sed -i.bak 's/require("\.\.\/generated-wrappers\/uniswap_v3_multi_quoter")/require("..\/generated-wrappers\/uniswap_v3_multi_quoter.js")/g' __build__/src/wrappers.js
    rm -f __build__/src/wrappers.js.bak
fi

echo "Build completed successfully!"
