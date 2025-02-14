import { create } from 'zustand'
import { persist, createJSONStorage, combine } from 'zustand/middleware'
import { networkIDs } from "@avalabs/avalanchejs";

export const initialState = {
    pChainAddress: "",
    networkID: networkIDs.FujiID,
    xpPublicKey: "",
    evmPublicKey: "",
    subnetID: "",
    chainName: "My Chain",
    vmId: "srEXiWaHuhNyGwPUi444Tu47ZEDwxTWrbQiuD7FmgSAQ6X7Dy",
    chainID: "",
    nodePopJsons: [""] as string[],
    managerAddress: "0xfacade0000000000000000000000000000000000",
    L1ID: "",
    L1ConversionSignature: "",
    validatorMessagesLibAddress: "",
    walletChainId: 0,
    evmChainName: "My L1",
    evmChainRpcUrl: "",
    evmChainCoinName: "COIN",
    validatorManagerAddress: "",
    proxyAddress: "0xfacade0000000000000000000000000000000000",
    proxyAdminAddress: "0xdad0000000000000000000000000000000000000" as `0x${string}`,
    walletEVMAddress: "",
}

export const useExampleStore = create(
    persist(
        combine(initialState, (set) => ({
            setPChainAddress: (pChainAddress: string) => set({ pChainAddress }),
            setNetworkID: (networkID: number) => set({ networkID }),
            setXpPublicKey: (xpPublicKey: string) => set({ xpPublicKey }),
            setEvmPublicKey: (evmPublicKey: string) => set({ evmPublicKey }),
            setSubnetID: (subnetID: string) => set({ subnetID }),
            setChainName: (chainName: string) => set({ chainName }),
            setVmId: (vmId: string) => set({ vmId }),
            setChainID: (chainID: string) => set({ chainID }),
            setNodePopJsons: (nodePopJsons: string[]) => set({ nodePopJsons }),
            setManagerAddress: (managerAddress: string) => set({ managerAddress }),
            setL1ID: (L1ID: string) => set({ L1ID }),
            setL1ConversionSignature: (L1ConversionSignature: string) => set({ L1ConversionSignature }),
            setValidatorMessagesLibAddress: (validatorMessagesLibAddress: string) => set({ validatorMessagesLibAddress }),
            setWalletChainId: (walletChainId: number) => set({ walletChainId }),
            setEvmChainName: (evmChainName: string) => set({ evmChainName }),
            setEvmChainRpcUrl: (evmChainRpcUrl: string) => set({ evmChainRpcUrl }),
            setEvmChainCoinName: (evmChainCoinName: string) => set({ evmChainCoinName }),
            setValidatorManagerAddress: (validatorManagerAddress: string) => set({ validatorManagerAddress }),
            setProxyAddress: (proxyAddress: string) => set({ proxyAddress }),
            setProxyAdminAddress: (proxyAdminAddress: `0x${string}`) => set({ proxyAdminAddress }),
            setWalletEVMAddress: (walletEVMAddress: string) => set({ walletEVMAddress }),
            reset: () => set(initialState),
        })),
        {
            name: 'example-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
