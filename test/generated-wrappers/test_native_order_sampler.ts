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
export class TestNativeOrderSamplerContract extends BaseContract {
    /**
     * @ignore
     */
public static deployedBytecode: string | undefined;
public static contractName = 'TestNativeOrderSampler';
    private readonly _methodABIIndex: { [name: string]: number } = {};
public static async deployFrom0xArtifactAsync(
        artifact: ContractArtifact | SimpleContractArtifact,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
    ): Promise<TestNativeOrderSamplerContract> {
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
        return TestNativeOrderSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
    }

    public static async deployWithLibrariesFrom0xArtifactAsync(
        artifact: ContractArtifact,
        libraryArtifacts: { [libraryName: string]: ContractArtifact },
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
    ): Promise<TestNativeOrderSamplerContract> {
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
        const libraryAddresses = await TestNativeOrderSamplerContract._deployLibrariesAsync(
            artifact,
            libraryArtifacts,
            new Web3Wrapper(provider),
            txDefaults
        );
        const bytecode = linkLibrariesInBytecode(
            artifact,
            libraryAddresses,
        );
        return TestNativeOrderSamplerContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
    }

    public static async deployAsync(
        bytecode: string,
        abi: ContractAbi,
        supportedProvider: SupportedProvider,
        txDefaults: Partial<TxData>,
        logDecodeDependencies: { [contractName: string]: ContractAbi },
    ): Promise<TestNativeOrderSamplerContract> {
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
        logUtils.log(`TestNativeOrderSampler successfully deployed at ${txReceipt.contractAddress}`);
        const contractInstance = new TestNativeOrderSamplerContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
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
                        name: 'count',
                        type: 'uint256',
                    },
                ],
                name: 'createTokens',
                outputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                    {
                        name: 'account',
                        type: 'address',
                    },
                    {
                        name: 'spender',
                        type: 'address',
                    },
                ],
                name: 'getAllowanceOf',
                outputs: [
                    {
                        name: 'allowances',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'getBalanceOf',
                outputs: [
                    {
                        name: 'balances',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                ],
                name: 'getBlockNumber',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                ],
                name: 'getGasLeft',
                outputs: [
                    {
                        name: '',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'orders',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'orderSignatures',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ]
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getLimitOrderFillableMakerAssetAmounts',
                outputs: [
                    {
                        name: 'orderFillableMakerAssetAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'order',
                        type: 'tuple',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'signature',
                        type: 'tuple',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ]
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getLimitOrderFillableTakerAmount',
                outputs: [
                    {
                        name: 'fillableTakerAmount',
                        type: 'uint256',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'orders',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'orderSignatures',
                        type: 'tuple[]',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ]
                    },
                    {
                        name: 'exchange',
                        type: 'address',
                    },
                ],
                name: 'getLimitOrderFillableTakerAssetAmounts',
                outputs: [
                    {
                        name: 'orderFillableTakerAssetAmounts',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'order',
                        type: 'tuple',
                        components: [
                            {
                                name: 'makerToken',
                                type: 'address',
                            },
                            {
                                name: 'takerToken',
                                type: 'address',
                            },
                            {
                                name: 'makerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'takerTokenFeeAmount',
                                type: 'uint128',
                            },
                            {
                                name: 'maker',
                                type: 'address',
                            },
                            {
                                name: 'taker',
                                type: 'address',
                            },
                            {
                                name: 'sender',
                                type: 'address',
                            },
                            {
                                name: 'feeRecipient',
                                type: 'address',
                            },
                            {
                                name: 'pool',
                                type: 'bytes32',
                            },
                            {
                                name: 'expiry',
                                type: 'uint64',
                            },
                            {
                                name: 'salt',
                                type: 'uint256',
                            },
                        ]
                    },
                    {
                        name: 'signature',
                        type: 'tuple',
                        components: [
                            {
                                name: 'signatureType',
                                type: 'uint8',
                            },
                            {
                                name: 'v',
                                type: 'uint8',
                            },
                            {
                                name: 'r',
                                type: 'bytes32',
                            },
                            {
                                name: 's',
                                type: 'bytes32',
                            },
                        ]
                    },
                ],
                name: 'getLimitOrderRelevantState',
                outputs: [
                    {
                        name: 'orderInfo',
                        type: 'tuple',
                        components: [
                            {
                                name: 'orderHash',
                                type: 'bytes32',
                            },
                            {
                                name: 'status',
                                type: 'uint8',
                            },
                            {
                                name: 'takerTokenFilledAmount',
                                type: 'uint128',
                            },
                        ]
                    },
                    {
                        name: 'actualFillableTakerTokenAmount',
                        type: 'uint128',
                    },
                    {
                        name: 'isSignatureValid',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'tokens',
                        type: 'address[]',
                    },
                ],
                name: 'getTokenDecimals',
                outputs: [
                    {
                        name: 'decimals',
                        type: 'uint256[]',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'account',
                        type: 'address',
                    },
                ],
                name: 'isContract',
                outputs: [
                    {
                        name: '',
                        type: 'bool',
                    },
                ],
                stateMutability: 'view',
                type: 'function',
            },
            { 
                inputs: [
                    {
                        name: 'token',
                        type: 'address',
                    },
                    {
                        name: 'owner',
                        type: 'address',
                    },
                    {
                        name: 'spender',
                        type: 'address',
                    },
                    {
                        name: 'balance',
                        type: 'uint256',
                    },
                    {
                        name: 'allowance',
                        type: 'uint256',
                    },
                ],
                name: 'setTokenBalanceAndAllowance',
                outputs: [
                ],
                stateMutability: 'nonpayable',
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
                    await TestNativeOrderSamplerContract._deployLibrariesAsync(
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
        const methodAbi = TestNativeOrderSamplerContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
        const functionSignature = methodAbiToFunctionSignature(methodAbi);
        return functionSignature;
    }

    public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as TestNativeOrderSamplerContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
        return abiDecodedCallData;
    }

    public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
        if (this._encoderOverrides.decodeOutput) {
            return this._encoderOverrides.decodeOutput(methodName, callData);
        }
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as TestNativeOrderSamplerContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
        return abiDecodedCallData;
    }

    public getSelector(methodName: string): string {
        const functionSignature = this.getFunctionSignature(methodName);
        const self = (this as any) as TestNativeOrderSamplerContract;
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        return abiEncoder.getSelector();
    }

    public createTokens(
            count: BigNumber,
    ): ContractTxFunctionObj<string[]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isBigNumber('count', count);
        const functionSignature = 'createTokens(uint256)';

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
            ): Promise<string[]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<string[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [count
            ]);
            },
        }
    };
    public getAllowanceOf(
            tokens: string[],
            account: string,
            spender: string,
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isArray('tokens', tokens);
            assert.isString('account', account);
            assert.isString('spender', spender);
        const functionSignature = 'getAllowanceOf(address[],address,address)';

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
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [tokens,
            account.toLowerCase(),
            spender.toLowerCase()
            ]);
            },
        }
    };
    public getBalanceOf(
            tokens: string[],
            account: string,
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isArray('tokens', tokens);
            assert.isString('account', account);
        const functionSignature = 'getBalanceOf(address[],address)';

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
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [tokens,
            account.toLowerCase()
            ]);
            },
        }
    };
    public getBlockNumber(
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as TestNativeOrderSamplerContract;
        const functionSignature = 'getBlockNumber()';

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
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    public getGasLeft(
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as TestNativeOrderSamplerContract;
        const functionSignature = 'getGasLeft()';

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
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, []);
            },
        }
    };
    /**
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
      * @param orders Native orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V4 exchange.
     */
    public getLimitOrderFillableMakerAssetAmounts(
            orders: Array<{makerToken: string;takerToken: string;makerAmount: BigNumber;takerAmount: BigNumber;takerTokenFeeAmount: BigNumber;maker: string;taker: string;sender: string;feeRecipient: string;pool: string;expiry: BigNumber;salt: BigNumber}>,
            orderSignatures: Array<{signatureType: number|BigNumber;v: number|BigNumber;r: string;s: string}>,
            exchange: string,
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isArray('orders', orders);
            assert.isArray('orderSignatures', orderSignatures);
            assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableMakerAssetAmounts((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256)[],(uint8,uint8,bytes32,bytes32)[],address)';

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
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [orders,
            orderSignatures,
            exchange.toLowerCase()
            ]);
            },
        }
    };
    /**
     * Get the fillable taker amount of an order, taking into account
 * order state, maker fees, and maker balances.
     */
    public getLimitOrderFillableTakerAmount(
            order: {makerToken: string;takerToken: string;makerAmount: BigNumber;takerAmount: BigNumber;takerTokenFeeAmount: BigNumber;maker: string;taker: string;sender: string;feeRecipient: string;pool: string;expiry: BigNumber;salt: BigNumber},
            signature: {signatureType: number|BigNumber;v: number|BigNumber;r: string;s: string},
            exchange: string,
    ): ContractTxFunctionObj<BigNumber
> {
        const self = this as any as TestNativeOrderSamplerContract;
            
            
            assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableTakerAmount((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256),(uint8,uint8,bytes32,bytes32),address)';

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
            ): Promise<BigNumber
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [order,
            signature,
            exchange.toLowerCase()
            ]);
            },
        }
    };
    /**
     * Queries the fillable taker asset amounts of native orders.
 * Effectively ignores orders that have empty signatures or
 * maker/taker asset amounts (returning 0).
      * @param orders Native limit orders to query.
      * @param orderSignatures Signatures for each respective order in `orders`.
      * @param exchange The V4 exchange.
     */
    public getLimitOrderFillableTakerAssetAmounts(
            orders: Array<{makerToken: string;takerToken: string;makerAmount: BigNumber;takerAmount: BigNumber;takerTokenFeeAmount: BigNumber;maker: string;taker: string;sender: string;feeRecipient: string;pool: string;expiry: BigNumber;salt: BigNumber}>,
            orderSignatures: Array<{signatureType: number|BigNumber;v: number|BigNumber;r: string;s: string}>,
            exchange: string,
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isArray('orders', orders);
            assert.isArray('orderSignatures', orderSignatures);
            assert.isString('exchange', exchange);
        const functionSignature = 'getLimitOrderFillableTakerAssetAmounts((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256)[],(uint8,uint8,bytes32,bytes32)[],address)';

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
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [orders,
            orderSignatures,
            exchange.toLowerCase()
            ]);
            },
        }
    };
    public getLimitOrderRelevantState(
            order: {makerToken: string;takerToken: string;makerAmount: BigNumber;takerAmount: BigNumber;takerTokenFeeAmount: BigNumber;maker: string;taker: string;sender: string;feeRecipient: string;pool: string;expiry: BigNumber;salt: BigNumber},
            signature: {signatureType: number|BigNumber;v: number|BigNumber;r: string;s: string},
    ): ContractTxFunctionObj<[{orderHash: string;status: number;takerTokenFilledAmount: BigNumber}, BigNumber, boolean]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            
            
        const functionSignature = 'getLimitOrderRelevantState((address,address,uint128,uint128,uint128,address,address,address,address,bytes32,uint64,uint256),(uint8,uint8,bytes32,bytes32))';

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
            ): Promise<[{orderHash: string;status: number;takerTokenFilledAmount: BigNumber}, BigNumber, boolean]
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<[{orderHash: string;status: number;takerTokenFilledAmount: BigNumber}, BigNumber, boolean]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [order,
            signature
            ]);
            },
        }
    };
    public getTokenDecimals(
            tokens: string[],
    ): ContractTxFunctionObj<BigNumber[]
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isArray('tokens', tokens);
        const functionSignature = 'getTokenDecimals(address[])';

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
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<BigNumber[]
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [tokens
            ]);
            },
        }
    };
    public isContract(
            account: string,
    ): ContractTxFunctionObj<boolean
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isString('account', account);
        const functionSignature = 'isContract(address)';

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
            ): Promise<boolean
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<boolean
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [account.toLowerCase()
            ]);
            },
        }
    };
    public setTokenBalanceAndAllowance(
            token: string,
            owner: string,
            spender: string,
            balance: BigNumber,
            allowance: BigNumber,
    ): ContractTxFunctionObj<void
> {
        const self = this as any as TestNativeOrderSamplerContract;
            assert.isString('token', token);
            assert.isString('owner', owner);
            assert.isString('spender', spender);
            assert.isBigNumber('balance', balance);
            assert.isBigNumber('allowance', allowance);
        const functionSignature = 'setTokenBalanceAndAllowance(address,address,address,uint256,uint256)';

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
            ): Promise<void
            > {
                BaseContract._assertCallParams(callData, defaultBlock);
                const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
                const abiEncoder = self._lookupAbiEncoder(functionSignature);
                BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
                return abiEncoder.strictDecodeReturnValue<void
            >(rawCallResult);
            },
            getABIEncodedTransactionData(): string {
                return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
            owner.toLowerCase(),
            spender.toLowerCase(),
            balance,
            allowance
            ]);
            },
        }
    };



    constructor(
        address: string,
        supportedProvider: SupportedProvider,
        txDefaults?: Partial<TxData>,
        logDecodeDependencies?: { [contractName: string]: ContractAbi },
        deployedBytecode: string | undefined = TestNativeOrderSamplerContract.deployedBytecode,
        encoderOverrides?: Partial<EncoderOverrides>,
    ) {
        super('TestNativeOrderSampler', TestNativeOrderSamplerContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode, encoderOverrides);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
TestNativeOrderSamplerContract.ABI().forEach((item, index) => {
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
