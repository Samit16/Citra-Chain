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
    isConnected: boolean;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    const checkConnection = async () => {
        if (window.ethereum) {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await _provider.send("eth_accounts", []);
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
        try {
            const signer = await prov.getSigner();
            const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            setContract(_contract);
        } catch (e) {
            // If contract initialization fails (e.g. wrong network), we still set account but no contract
            console.error("Error setting up contract:", e);
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await _provider.send("eth_requestAccounts", []);
                setupConnection(accounts[0], _provider);
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
                if (accounts.length > 0) {
                    // Re-instantiate provider? Actually existing provider stays valid usually, just needs signer refresh
                    // But simpler to reload page or re-run setup
                    window.location.reload();
                } else {
                    setAccount(null);
                    setContract(null);
                }
            });
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
        return () => {
            // cleanup listeners if needed
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                account,
                provider,
                contract,
                connectWallet,
                isConnected: !!account
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
