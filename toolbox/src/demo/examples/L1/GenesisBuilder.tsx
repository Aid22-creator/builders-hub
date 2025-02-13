// FIXME: This is a quick implementation and will be replaced with a genesis builder component later on.

import TransparentUpgradableProxy from "../../../../contracts/openzeppelin-4.9/compiled/TransparentUpgradeableProxy.json"
import ProxyAdmin from "../../../../contracts/openzeppelin-4.9/compiled/ProxyAdmin.json"
const quickAndDirtyGenesisBuilder = (ownerAddress: `${string}`, chainID: number) => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(ownerAddress)) {
        throw new Error("Invalid ownerAddress format. It should be '0x' followed by 20 hex bytes (40 characters).");
    }
    const ownerAddressNo0x = ownerAddress.replace("0x", "");
    const now = Math.floor(Date.now() / 1000);
    const genesis = {
        "airdropAmount": null,
        "airdropHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "alloc": {
            "facade0000000000000000000000000000000000": {
                "balance": "0x0",
                "code": TransparentUpgradableProxy.deployedBytecode.object
                ,
                "storage": {
                    "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc": "0x0000000000000000000000001212121212121212121212121212121212121212",
                    "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103": "0x000000000000000000000000dad0000000000000000000000000000000000000"
                },
                "nonce": "0x1"
            },
            "dad0000000000000000000000000000000000000": {
                "balance": "0x0",
                "code": ProxyAdmin.deployedBytecode.object,
                "nonce": "0x1",
                "storage": {
                    "0x0000000000000000000000000000000000000000000000000000000000000000": "0x000000000000000000000000" + ownerAddressNo0x
                }
            },
        },
        "baseFeePerGas": null,
        "blobGasUsed": null,
        "coinbase": "0x0000000000000000000000000000000000000000",
        "config": {
            "berlinBlock": 0,
            "byzantiumBlock": 0,
            "chainId": chainID,
            "constantinopleBlock": 0,
            "eip150Block": 0,
            "eip155Block": 0,
            "eip158Block": 0,
            "feeConfig": {
                "baseFeeChangeDenominator": 36,
                "blockGasCostStep": 200000,
                "gasLimit": 12000000,
                "maxBlockGasCost": 1000000,
                "minBaseFee": 25000000000,
                "minBlockGasCost": 0,
                "targetBlockRate": 2,
                "targetGas": 60000000
            },
            "homesteadBlock": 0,
            "istanbulBlock": 0,
            "londonBlock": 0,
            "muirGlacierBlock": 0,
            "petersburgBlock": 0,
            "warpConfig": {
                "blockTimestamp": now,
                "quorumNumerator": 67,
                "requirePrimaryNetworkSigners": true
            }
        },
        "difficulty": "0x0",
        "excessBlobGas": null,
        "extraData": "0x",
        "gasLimit": "0xb71b00",
        "gasUsed": "0x0",
        "mixHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "nonce": "0x0",
        "number": "0x0",
        "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "timestamp": `0x${now.toString(16)}`
    } as (Record<string, unknown> & { alloc: Record<string, unknown> })

    //add some coins to the owner address
    genesis.alloc[ownerAddressNo0x] = {
        "balance": "0xd3c21bcecceda1000000"//1000000000000000000000000 coins
    }

    return JSON.stringify(genesis, null, 2)
}

import { useEffect, useState } from "react";
import { Input } from "../../ui";
import { useExampleStore } from "../../utils/store";
import { CodeHighlighter } from "../../ui/CodeHighlighter";

export const GenesisBuilder = () => {
    const { walletEVMAddress } = useExampleStore()
    const [ownerAddress, setOwnerAddress] = useState<string>("")
    const [genesisOutput, setGenesisOutput] = useState<string>("")
    const [desiredChainID, setDesiredChainID] = useState<string>(Math.floor(Math.random() * (100000 - 1000 + 1) + 1000).toString())

    useEffect(() => {
        if (ownerAddress) return
        setOwnerAddress(walletEVMAddress)
    }, [walletEVMAddress, ownerAddress])

    useEffect(() => {
        if (!ownerAddress || !desiredChainID) {
            setGenesisOutput("")
            return
        }
        try {
            setGenesisOutput(quickAndDirtyGenesisBuilder(ownerAddress, parseInt(desiredChainID)))
        } catch (error) {
            setGenesisOutput(error instanceof Error ? error.message : "Invalid owner address")
        }
    }, [ownerAddress, desiredChainID])

    return (
        <div className="space-y-4">
            <Input
                label="Owner Address"
                value={ownerAddress}
                onChange={setOwnerAddress}
                placeholder="0x..."
                error={genesisOutput.includes("Invalid") ? genesisOutput : null}
                notes="The address that will own the subnet's initial funds"
            />
            <Input
                label="Desired Chain ID"
                value={desiredChainID}
                onChange={setDesiredChainID}
                placeholder="Enter desired chain ID"
                type="number"
            />
            {genesisOutput && !genesisOutput.includes("Invalid") && (
                <CodeHighlighter
                    code={genesisOutput}
                    language="typescript"
                />
            )}
        </div>
    )
}
