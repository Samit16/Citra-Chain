'use client';

import { Header } from '@/components/shared/header';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet as WalletIcon, CreditCard, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/context/WalletContext';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function WalletPage() {
    const { account, provider, disconnectWallet } = useWallet();
    const [balance, setBalance] = useState<string>('0');

    useEffect(() => {
        if (provider && account) {
            provider.getBalance(account).then((bal) => {
                setBalance(ethers.formatEther(bal));
            });
        }
    }, [provider, account]);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="container mx-auto flex-1 px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">My Wallet</h1>
                <p className="text-gray-500 mb-8">
                    Manage your earnings and transactions on Citra Chain.
                </p>

                {!account ? (
                    <Card className="rounded-2xl border-none shadow-sm bg-card p-8 text-center">
                        <p>Please connect your wallet to view your balance.</p>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="rounded-2xl border-none shadow-lg bg-gradient-to-br from-primary to-orange-600 text-white">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-white/20 rounded-full">
                                        <WalletIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm opacity-90">Total Balance</p>
                                        <p className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} ETH</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                                    Refresh Balance
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="rounded-2xl border-none shadow-lg bg-card">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Connected Account</p>
                                        <p className="text-lg font-bold text-gray-800 break-all leading-tight">
                                            {account.substring(0, 12)}...
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-gray-200" onClick={disconnectWallet}>
                                    Disconnect
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
