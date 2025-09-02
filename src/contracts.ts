import { ContractFunctionObj, ContractTxFunctionObj } from '@0x/base-contract';
import { BigNumber } from '@0x/utils';

declare module '../generated-wrappers/erc20_bridge_sampler' {
    interface ERC20BridgeSamplerContract {
        getTokenDecimals(tokens: string[]): ContractFunctionObj<BigNumber[]>;
        isContract(address: string): ContractFunctionObj<boolean>;
        getGasLeft(): ContractFunctionObj<BigNumber>;
        getBlockNumber(): ContractFunctionObj<BigNumber>;
        
        batchCall(callDatas: string[]): ContractTxFunctionObj<Array<{ data: string; success: boolean }>>;
        
        sampleSellsFromKyberDmm(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromKyberDmm(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromUniswap(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromUniswap(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromUniswapV2(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromUniswapV2(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromUniswapV3(factory: string, router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromUniswapV3(factory: string, router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromCurve(exchange: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromCurve(exchange: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleMultihopSellsFromBalancerV2(vault: string, path: string[], takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleMultihopBuysFromBalancerV2(vault: string, path: string[], takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromBalancerV2(vault: string, poolId: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromBalancerV2(vault: string, poolId: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromBalancer(exchange: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromBalancer(exchange: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromMStable(mStableAddress: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromMStable(mStableAddress: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromBancor(bancorNetwork: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromBancor(bancorNetwork: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromBancorV3(bancorV3Network: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromBancorV3(bancorV3Network: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromMooniswap(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromMooniswap(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleTwoHopSell(firstHopSource: string, secondHopSource: string, intermediateToken: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleTwoHopBuy(firstHopSource: string, secondHopSource: string, intermediateToken: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromShell(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromShell(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromDODO(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromDODO(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromDODOV2(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromDODOV2(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromMakerPsm(psm: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromMakerPsm(psm: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromLido(lido: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromLido(lido: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromAaveV2(lendingPool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromAaveV2(lendingPool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromAaveV3(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromAaveV3(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromCompound(comptroller: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromCompound(comptroller: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromGMX(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromGMX(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromPlatypus(pool: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromPlatypus(pool: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromVelodrome(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromVelodrome(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromSynthetix(exchange: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromSynthetix(exchange: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        sampleSellsFromWooPP(router: string, takerToken: string, makerToken: string, takerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        sampleBuysFromWooPP(router: string, takerToken: string, makerToken: string, makerTokenAmounts: BigNumber[]): ContractFunctionObj<BigNumber[]>;
        
        getLimitOrderFillableTakerAssetAmounts(orders: any[], takerAssetFillAmount: BigNumber): ContractFunctionObj<BigNumber[]>;
        getLimitOrderFillableMakerAssetAmounts(orders: any[], makerAssetFillAmount: BigNumber): ContractFunctionObj<BigNumber[]>;
    }
}

declare module '../generated-wrappers/balance_checker' {
    interface BalanceCheckerContract {
        getMinOfBalancesOrAllowances(owners: string[], tokens: string[], spender: string): ContractFunctionObj<BigNumber[]>;
    }
}

declare module '../generated-wrappers/fake_taker' {
    interface FakeTakerContract {
        execute(to: string, data: string): ContractFunctionObj<any>;
    }
}
