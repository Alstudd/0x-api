import * as heartbeats from 'heartbeats';

import { constants } from '../constants';
import { SwapQuoterError } from '../types';

const MAX_ERROR_COUNT = 5;

interface GasPrices {
    // gas price in wei
    fast: number;
    l1CalldataPricePerUnit?: number;
}
interface GasInfoResponse {
    result: GasPrices;
}

// Fallback gas prices for when oracle fails
const FALLBACK_GAS_PRICES: GasPrices = {
    fast: 20000000000, // 20 gwei
    l1CalldataPricePerUnit: 0,
};

export class GasPriceUtils {
    private static _instances = new Map<string, GasPriceUtils>();
    private readonly _zeroExGasApiUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix me!
    private readonly _gasPriceHeart: any;
    private _gasPriceEstimation: GasPrices | undefined;
    private _errorCount = 0;

    public static getInstance(
        gasPricePollingIntervalInMs: number,
        zeroExGasApiUrl: string = constants.ZERO_EX_GAS_API_URL,
    ): GasPriceUtils {
        if (!GasPriceUtils._instances.has(zeroExGasApiUrl)) {
            GasPriceUtils._instances.set(
                zeroExGasApiUrl,
                new GasPriceUtils(gasPricePollingIntervalInMs, zeroExGasApiUrl),
            );
        }

        const instance = GasPriceUtils._instances.get(zeroExGasApiUrl);
        if (instance === undefined) {
            // should not be reachable
            throw new Error(`Singleton for ${zeroExGasApiUrl} was not initialized`);
        }

        return instance;
    }

    public async getGasPriceEstimationOrDefault(defaultGasPrices: GasPrices): Promise<GasPrices> {
        if (this._gasPriceEstimation === undefined) {
            return defaultGasPrices;
        }

        return {
            ...defaultGasPrices,
            ...this._gasPriceEstimation,
        };
    }

    /** @returns gas price (in wei) */
    public async getGasPriceEstimationOrThrowAsync(): Promise<GasPrices> {
        if (this._gasPriceEstimation === undefined) {
            await this._updateGasPriceFromOracleOrThrow();
        }
        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        return this._gasPriceEstimation!;
    }

    /**
     * Destroys any subscriptions or connections.
     */
    public async destroyAsync(): Promise<void> {
        this._gasPriceHeart.kill();
    }

    private constructor(gasPricePollingIntervalInMs: number, zeroExGasApiUrl: string) {
        this._gasPriceHeart = heartbeats.createHeart(gasPricePollingIntervalInMs);
        this._zeroExGasApiUrl = zeroExGasApiUrl;
        this._initializeHeartBeat();
    }

    private async _updateGasPriceFromOracleOrThrow(): Promise<void> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const res = await fetch(this._zeroExGasApiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': '0x-api/1.0.0'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!res.ok) {
                throw new Error(`Gas API returned ${res.status}: ${res.statusText}`);
            }
            
            const responseData = await res.json();
            
            if (responseData.medium && responseData.medium.suggestedMaxFeePerGas) {
                const gasPriceInWei = parseInt(responseData.medium.suggestedMaxFeePerGas, 10);
                this._gasPriceEstimation = {
                    fast: gasPriceInWei,
                    l1CalldataPricePerUnit: 0,
                };
            } else if (responseData.result && responseData.result.fast) {
                this._gasPriceEstimation = responseData.result;
            } else {
                throw new Error('Unexpected gas API response format');
            }
            
            this._errorCount = 0;
        } catch (e) {
            this._errorCount++;
            
            if (e instanceof Error && e.message.includes('self-signed certificate')) {
                console.warn(`Gas price oracle SSL certificate error (attempt ${this._errorCount}): ${e.message}`);
                console.warn('This is likely due to corporate network or proxy SSL interception');
                console.warn('Consider setting NODE_TLS_REJECT_UNAUTHORIZED=0 for development (NOT recommended for production)');
            } else if (e instanceof Error && e.name === 'AbortError') {
                console.warn(`Gas price oracle timeout error (attempt ${this._errorCount}): Request timed out`);
            } else {
                console.warn(`Gas price oracle error (attempt ${this._errorCount}):`, e);
            }
            
            // If we've reached our max error count then use fallback
            if (this._errorCount > MAX_ERROR_COUNT || this._gasPriceEstimation === undefined) {
                this._errorCount = 0;
                console.warn('Using fallback gas prices due to oracle failures');
                this._gasPriceEstimation = FALLBACK_GAS_PRICES;
                return; // Don't throw, use fallback instead
            }
        }
    }

    private _initializeHeartBeat(): void {
        this._gasPriceHeart.createEvent(1, async () => {
            try {
                await this._updateGasPriceFromOracleOrThrow();
            } catch (e) {
                console.warn('Heartbeat gas price update failed:', e);
            }
        });
    }
}
