// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
import {
    AwaitTransactionSuccessOpts,
    EncoderOverrides,
    ContractFunctionObj,
    ContractTxFunctionObj,
    SendTransactionOpts,
    BaseContract,
    PromiseWithTransactionHash,
    methodAbiToFunctionSignature,
    linkLibrariesInBytecode,
} from '@0x/base-contract';
import { schemas } from '@0x/json-schemas';
import {
    BlockParam,
    BlockParamLiteral,
    BlockRange,
    CallData,
    ContractAbi,
    ContractArtifact,
    DecodedLogArgs,
    MethodAbi,
    TransactionReceiptWithDecodedLogs,
    TxData,
    TxDataPayable,
    TxAccessListWithGas,
    SupportedProvider,
} from 'ethereum-types';
import { AbiEncoder, BigNumber, classUtils, EncodingRules, hexUtils, logUtils, providerUtils } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { assert } from '@0x/assert';
import * as ethers from 'ethers';
// tslint:enable:no-unused-variable



/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class AaveV2SamplerContract extends BaseContract {
    /**
     * @ignore
     */
public static deployedBytecode = '0x608060405234801561001057600080fd5b50600436106100365760003560e01c806377d375f21461003b578063ab80a91014610064575b600080fd5b61004e61004936600461030d565b610077565b60405161005b9190610416565b60405180910390f35b61004e61007236600461030d565b61017f565b80516060908067ffffffffffffffff8111801561009357600080fd5b506040519080825280602002602001820160405280156100bd578160200160208202803683370190505b509150856001600160a01b0316856001600160a01b03161480156100f25750866001600160a01b0316846001600160a01b0316145b156101005782915050610176565b866001600160a01b0316856001600160a01b03161480156101325750856001600160a01b0316846001600160a01b0316145b156101745760005b8181101561016a57600184828151811061015057fe5b60209081029190910101805191909103905260010161013a565b5082915050610176565b505b95945050505050565b80516060908067ffffffffffffffff8111801561019b57600080fd5b506040519080825280602002602001820160405280156101c5578160200160208202803683370190505b509150856001600160a01b0316856001600160a01b03161480156101fa5750866001600160a01b0316846001600160a01b0316145b156102085782915050610176565b866001600160a01b0316856001600160a01b031614801561023a5750856001600160a01b0316846001600160a01b0316145b156101745760005b8181101561016a57600184828151811061025857fe5b602090810291909101018051919091039052600101610242565b803561027d8161049d565b92915050565b600082601f83011261029457600080fd5b81356102a76102a282610455565b61042e565b915081818352602084019350602081019050838560208402820111156102cc57600080fd5b60005b838110156102f857816102e28882610302565b84525060209283019291909101906001016102cf565b5050505092915050565b803561027d816104b4565b600080600080600060a0868803121561032557600080fd5b60006103318888610272565b955050602061034288828901610272565b945050604061035388828901610272565b935050606061036488828901610272565b925050608086013567ffffffffffffffff81111561038157600080fd5b61038d88828901610283565b9150509295509295909350565b60006103a68383610407565b505060200190565b60006103b98261047c565b6103c38185610480565b93506103ce83610476565b8060005b838110156103fc5781516103e6888261039a565b97506103f183610476565b9250506001016103d2565b509495945050505050565b6104108161049a565b82525050565b6020808252810161042781846103ae565b9392505050565b60405181810167ffffffffffffffff8111828210171561044d57600080fd5b604052919050565b600067ffffffffffffffff82111561046c57600080fd5b5060209081020190565b60200190565b5190565b90815260200190565b60006001600160a01b03821661027d565b90565b6104a681610489565b81146104b157600080fd5b50565b6104a68161049a56fea26469706673582212206a8ff4f67e4fcd3020b55fec19d895b650d2c9e4f21cf29e7e7005204389c05e64736f6c634300060c0033';
public static contractName = 'AaveV2Sampler';
    private readonly _methodABIIndex: { [name: string]: number } = {};
public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact | SimpleContractArtifact,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
    ): Promise<AaveV2SamplerContract> {
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema);
        if (artifact.compilerOutput === undefined) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const bytecode = artifact.compilerOutput.evm.bytecode.object;
        const abi = artifact.compilerOutput.abi;
        const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
        if (Object.keys(logDecodeDependencies) !== undefined) {
            for (const key of Object.keys(logDecodeDependencies)) {
                logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
            }
        }
        return AaveV2SamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
    }

    public static async deployWithLibrariesFrom0xArtifactAsync(
        artifact: ContractArtifact,
        libraryArtifacts: { [libraryName: string]: ContractArtifact },
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
    ): Promise<AaveV2SamplerContract> {
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema);
        if (artifact.compilerOutput === undefined) {
            throw new Error('Compiler output not found in the artifact file');
        }
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const abi = artifact.compilerOutput.abi;
        const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
        if (Object.keys(logDecodeDependencies) !== undefined) {
            for (const key of Object.keys(logDecodeDependencies)) {
                logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
            }
        }
        const libraryAddresses = await AaveV2SamplerContract._deployLibrariesAsync(
            artifact,
            libraryArtifacts,
            new Web3Wrapper(provider),
            txDefaults
        );
        const bytecode = linkLibrariesInBytecode(
            artifact,
            libraryAddresses,
        );
        return AaveV2SamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
    }

    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: ContractAbi },
    ): Promise<AaveV2SamplerContract> {
        assert.isHexString('bytecode', bytecode);
        assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema);
        const provider = providerUtils.standardizeOrThrow(supportedProvider);
        const constructorAbi = BaseContract._lookupConstructorAbi(abi);
        [] = BaseContract._formatABIDataItemList(
            constructorAbi.inputs,
            [],
            BaseContract._bigNumberToString,
        );
        const iface = new ethers.utils.Interface(abi);
        const deployInfo = iface.deployFunction;
        const txData = deployInfo.encode(bytecode, []);
        const web3Wrapper = new Web3Wrapper(provider);
        const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
            {
                data: txData,
                ...txDefaults,
            },
            web3Wrapper.estimateGasAsync.bind(web3Wrapper),
        );
        const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
        logUtils.log(`transactionHash: ${txHash}`);
        const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
        logUtils.log(`AaveV2Sampler successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new AaveV2SamplerContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
        contractInstance.constructorArgs = [];
        return contractInstance;
    }

    /**
     * @returns      The contract ABI
     */
    public static ABI(): ContractAbi {
        const abi = [
            { 
                inputs: [
                    {
                        name: 'aToken',
                        type: 'address',
                    },
                    {
                        name: 'underlyingToken',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleBuysFromAaveV2',
                outputs: [
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'pure',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'aToken',
                        type: 'address',
                    },
                    {
                        name: 'underlyingToken',
                        type: 'address',
                    },
                    {
                        name: 'takerToken',
                        type: 'address',
                    },
                    {
                        name: 'makerToken',
                        type: 'address',
                    },
                    {
                        name: 'takerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                name: 'sampleSellsFromAaveV2',
                outputs: [
                    {
                        name: 'makerTokenAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'pure',
                type: 'function',
            },
        ] as ContractAbi;
        return abi;
    }

    protected static async _deployLibrariesAsync(
        artifact: ContractArtifact,
        libraryArtifacts: { [libraryName: string]: ContractArtifact },
        web3Wrapper: Web3Wrapper,
        txDefaults: Partial<TxData>,
        libraryAddresses: { [libraryName: string]: string } = {},
    ): Promise<{ [libraryName: string]: string }> {
        const links = artifact.compilerOutput.evm.bytecode.linkReferences || {};
        // Go through all linked libraries, recursively deploying them if necessary.
        for (const link of Object.values(links)) {
            for (const libraryName of Object.keys(link)) {
                if (!libraryAddresses[libraryName]) {
                    // Library not yet deployed.
                    const libraryArtifact = libraryArtifacts[libraryName];
                    if (!libraryArtifact) {
                        throw new Error(`Missing artifact for linked library "${libraryName}"`);
                    }
                    // Deploy any dependent libraries used by this library.
                    await AaveV2SamplerContract._deployLibrariesAsync(
                        libraryArtifact,
                        libraryArtifacts,
                        web3Wrapper,
                        txDefaults,
                        libraryAddresses,
                    );
                    // Deploy this library.
                    const linkedLibraryBytecode = linkLibrariesInBytecode(
                        libraryArtifact,
                        libraryAddresses,
                    );
                    const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
                        {
                            data: linkedLibraryBytecode,
                            ...txDefaults,
                        },
                        web3Wrapper.estimateGasAsync.bind(web3Wrapper),
                    );
                    const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
                    logUtils.log(`transactionHash: ${txHash}`);
                    const { contractAddress } = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
                    logUtils.log(`${libraryArtifact.contractName} successfully deployed at ${contractAddress}`);
                    libraryAddresses[libraryArtifact.contractName] = contractAddress as string;
                }
            }
        }
        return libraryAddresses;
    }

    public getFunctionSignature(methodName: string): string {
        const index = this._methodABIIndex[methodName];
        const methodAbi = AaveV2SamplerContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
        const functionSignature = methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    }

    public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as AaveV2SamplerContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
        return abiDecodedCallData;
    }

    public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
        if (this._encoderOverrides.decodeOutput) {
            return this._encoderOverrides.decodeOutput(methodName, callData);
        }
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as AaveV2SamplerContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
        return abiDecodedCallData;
    }

    public getSelector(methodName: string): string {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as AaveV2SamplerContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    }

    /**
     * Sample buy quotes from AaveV2.
      * @param aToken address of the aToken.
      * @param underlyingToken address of the underlying collateral token.
      * @param takerToken address of the taker token (what to sell).
      * @param makerToken address of the maker token (what to buy).
      * @param makerTokenAmounts maker token sell amounts for each sample
     */
    public sampleBuysFromAaveV2(
            aToken: string,
            underlyingToken: string,
            takerToken: string,
            makerToken: string,
            makerTokenAmounts: BigNumber[],
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as AaveV2SamplerContract;
            assert.isString('aToken', aToken);
            assert.isString('underlyingToken', underlyingToken);
            assert.isString('takerToken', takerToken);
            assert.isString('makerToken', makerToken);
            assert.isArray('makerTokenAmounts', makerTokenAmounts);
        const functionSignature = 'sampleBuysFromAaveV2(address,address,address,address,uint256[])';

        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async createAccessListAsync(
                txData?: Partial<TxData> | undefined,
                defaultBlock?: BlockParam,
            ): Promise<TxAccessListWithGas> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                let rawCallResult;
                if (self._deployedBytecodeIfExists) {
                    rawCallResult = await self._evmExecAsync(this.getABIEncodedTransactionData());
                } else {
                    rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                }
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [aToken.toLowerCase(),
            underlyingToken.toLowerCase(),
            takerToken.toLowerCase(),
            makerToken.toLowerCase(),
            makerTokenAmounts
            ]);
            },
        }
    };
    /**
     * Sample sell quotes from AaveV2.
      * @param aToken address of the aToken.
      * @param underlyingToken address of the underlying collateral token.
      * @param takerToken address of the taker token (what to sell).
      * @param makerToken address of the maker token (what to buy).
      * @param takerTokenAmounts taker token buy amounts for each sample
     */
    public sampleSellsFromAaveV2(
            aToken: string,
            underlyingToken: string,
            takerToken: string,
            makerToken: string,
            takerTokenAmounts: BigNumber[],
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as AaveV2SamplerContract;
            assert.isString('aToken', aToken);
            assert.isString('underlyingToken', underlyingToken);
            assert.isString('takerToken', takerToken);
            assert.isString('makerToken', makerToken);
            assert.isArray('takerTokenAmounts', takerTokenAmounts);
        const functionSignature = 'sampleSellsFromAaveV2(address,address,address,address,uint256[])';

        return {
            selector: self._lookupAbiEncoder(functionSignature).getSelector(),
            async sendTransactionAsync(
                txData?: Partial<TxData> | undefined,
                opts: SendTransactionOpts = { shouldValidate: true },
            ): Promise<string> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData },
                    this.estimateGasAsync.bind(this),
                );
                if (opts.shouldValidate !== false) {
                    await this.callAsync(txDataWithDefaults);
                }
                return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            },
            awaitTransactionSuccessAsync(
                txData?: Partial<TxData>,
                opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
            ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
                return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
            },
            async estimateGasAsync(
                txData?: Partial<TxData> | undefined,
            ): Promise<number> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            },
            async createAccessListAsync(
                txData?: Partial<TxData> | undefined,
                defaultBlock?: BlockParam,
            ): Promise<TxAccessListWithGas> {
                const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
                    { data: this.getABIEncodedTransactionData(), ...txData }
                );
                return self._web3Wrapper.createAccessListAsync(txDataWithDefaults, defaultBlock);
            },
            async callAsync(
                callData: Partial<CallData> = {},
                defaultBlock?: BlockParam,
            ): Promise<BigNumber[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                let rawCallResult;
                if (self._deployedBytecodeIfExists) {
                    rawCallResult = await self._evmExecAsync(this.getABIEncodedTransactionData());
                } else {
                    rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                }
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [aToken.toLowerCase(),
            underlyingToken.toLowerCase(),
            takerToken.toLowerCase(),
            makerToken.toLowerCase(),
            takerTokenAmounts
            ]);
            },
        }
    };



    constructor(
        address: string,
        supportedProvider: SupportedProvider,
        txDefaults?: Partial<TxData>,
        logDecodeDependencies?: { [contractName: string]: ContractAbi },
        deployedBytecode: string | undefined = AaveV2SamplerContract.deployedBytecode,
        encoderOverrides?: Partial<EncoderOverrides>,
    ) {
        super('AaveV2Sampler', AaveV2SamplerContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode, encoderOverrides);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
AaveV2SamplerContract.ABI().forEach((item, index) => {
            if (item.type === 'function') {
                const methodAbi = item as MethodAbi;
                this._methodABIIndex[methodAbi.name] = index;
            }
        });
    }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
