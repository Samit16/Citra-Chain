'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract-config';

// Add Ethereum to window
declare global {
    interface Window {
        ethereum: any;
    }
}

type WalletContextType = {
    account: string | null;
    provider: ethers.BrowserProvider | null;
    contract: ethers.Contract | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    isConnected: boolean;
    isWrongNetwork: boolean;
    switchToSepolia: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);

    const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111

    const checkNetwork = async (prov: ethers.BrowserProvider) => {
        const network = await prov.getNetwork();
        const chainId = network.chainId;
        // 11155111n is BigInt
        const isSepolia = chainId === BigInt(11155111);
        setIsWrongNetwork(!isSepolia);
        return isSepolia;
    };

    const switchToSepolia = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: SEPOLIA_CHAIN_ID }],
            });
            window.location.reload();
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: SEPOLIA_CHAIN_ID,
                                chainName: 'Sepolia Test Network',
                                nativeCurrency: {
                                    name: 'Sepolia ETH',
                                    symbol: 'SEP',
                                    decimals: 18,
                                },
                                rpcUrls: ['https://sepolia.drpc.org'],
                                blockExplorerUrls: ['https://sepolia.etherscan.io'],
                            },
                        ],
                    });
                    window.location.reload();
                } catch (addError) {
                    console.error(addError);
                }
            }
            console.error(switchError);
        }
    };

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await _provider.send("eth_accounts", []);

                await checkNetwork(_provider);

                if (accounts.length > 0) {
                    setupConnection(accounts[0], _provider);
                }
            } catch (err) {
                console.error("Error checking connection:", err);
            }
        }
    };

    const setupConnection = async (acc: string, prov: ethers.BrowserProvider) => {
        setAccount(acc);
        setProvider(prov);

        const isSepolia = await checkNetwork(prov);
        if (!isSepolia) return;

        try {
            const signer = await prov.getSigner();
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            setContract(_contract);
        } catch (e) {
            console.error("Error setting up contract:", e);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setContract(null);
        setIsWrongNetwork(false);
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await _provider.send("eth_requestAccounts", []);

                const isSepolia = await checkNetwork(_provider);
                if (!isSepolia) {
                    await switchToSepolia();
                } else {
                    setupConnection(accounts[0], _provider);
                }
            } catch (err) {
                console.error("User rejected request:", err);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    useEffect(() => {
        checkConnection();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                window.location.reload();
            });
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                account,
                provider,
                contract,
                connectWallet,
                disconnectWallet,
                isConnected: !!account,
                isWrongNetwork,
                switchToSepolia
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};
