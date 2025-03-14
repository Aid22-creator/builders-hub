"use client";

import { useToolboxStore, useWalletStore } from "../../utils/store";
import { useErrorBoundary } from "react-error-boundary";
import { useState, useEffect } from "react";
import { Button, Input, Select } from "../../ui";
import { createPublicClient, http } from 'viem';


export default function SwitchChain() {
    const { showBoundary } = useErrorBoundary();
    const [isSwitching, setIsSwitching] = useState(false);
    const [targetChainId, setTargetChainId] = useState<number>(0);
    const [isTestnet, setIsTestnet] = useState<boolean>(true);
    const {
        evmChainName,
        evmChainRpcUrl,
        evmChainCoinName,
        setEvmChainName,
        setEvmChainRpcUrl,
        setEvmChainCoinName,
    } = useToolboxStore();
    const { coreWalletClient, walletChainId } = useWalletStore();
    const [isCheckingRpc, setIsCheckingRpc] = useState(false);


    async function handleSwitchChain() {
        setIsSwitching(true);
        try {
            await coreWalletClient!.addChain({
                chain: {
                    id: targetChainId,
                    name: evmChainName,
                    nativeCurrency: {
                        name: evmChainCoinName,
                        symbol: evmChainCoinName,
                        decimals: 18,
                    },
                    rpcUrls: {
                        default: {
                            http: [evmChainRpcUrl],
                        },
                    },
                    isTestnet: isTestnet,
                }
            });

            await coreWalletClient!.switchChain({
                id: targetChainId,
            });
        } catch (error) {
            showBoundary(error);
        } finally {
            setIsSwitching(false);
        }
    }

    async function checkRpc() {
        setIsCheckingRpc(true);
        try {
            const publicClient = createPublicClient({
                transport: http(evmChainRpcUrl)
            });

            const chainId = await publicClient.getChainId();
            setTargetChainId(chainId);
        } catch (error) {
            showBoundary(error);
            setTargetChainId(0);
        } finally {
            setIsCheckingRpc(false);
        }
    }

    useEffect(() => {
        setTargetChainId(0);
    }, [evmChainRpcUrl]);


    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Switch Chain</h2>
            <div className="space-y-4">
                <div className="mb-4">
                    Current Chain ID: {walletChainId}
                </div>
                <Input
                    label="Chain Name"
                    value={evmChainName}
                    onChange={setEvmChainName}
                    placeholder="Enter chain name"
                />
                <Input
                    label="RPC URL"
                    value={evmChainRpcUrl}
                    onChange={setEvmChainRpcUrl}
                    placeholder="Enter RPC URL"
                />
                <Input
                    label="Coin Name"
                    value={evmChainCoinName}
                    onChange={setEvmChainCoinName}
                    placeholder="Enter coin name"
                />
                <Select
                    label="Is Testnet"
                    value={isTestnet.toString()}
                    onChange={(value) => setIsTestnet(value === "true")}
                    options={[
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" }
                    ]}
                />
                <Input
                    label="Target Chain ID"
                    value={targetChainId.toString()}
                    disabled={true}
                    type="text"
                />
                {targetChainId === 0 && (
                    <Button
                        type="secondary"
                        onClick={checkRpc}
                        loading={isCheckingRpc}
                        disabled={evmChainRpcUrl === ""}
                    >
                        Load Chain ID from RPC
                    </Button>
                )}
                {targetChainId > 0 && (
                    <Button
                        type="primary"
                        onClick={handleSwitchChain}
                        loading={isSwitching}
                    >
                        Switch Chain
                    </Button>
                )}
            </div>
        </div>
    );
};
