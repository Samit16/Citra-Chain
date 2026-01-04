'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, ShoppingCart, User } from 'lucide-react';
import { format } from 'date-fns';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type BatchDetails = {
    id: string;
    farmer: string;
    quantity: number;
    pricePerKg: number;
    harvestDate: Date;
    sold: boolean;
};

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const batchId = searchParams.get('batchId');
    const { contract, isConnected, connectWallet } = useWallet();
    const { toast } = useToast();

    const [batch, setBatch] = useState<BatchDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        if (contract && batchId) {
            fetchBatch();
        }
    }, [contract, batchId]);

    const fetchBatch = async () => {
        if (!contract || !batchId) return;
        setLoading(true);
        try {
            // batches(id) => [farmer, quantity, price, date, sold]
            const data = await contract.batches(batchId);
            setBatch({
                id: batchId,
                farmer: data.farmer,
                quantity: Number(data.quantity),
                pricePerKg: Number(data.pricePerKg),
                harvestDate: new Date(Number(data.harvestDate) * 1000),
                sold: data.sold
            });
        } catch (error) {
            console.error("Error fetching batch:", error);
            toast({
                title: "Error",
                description: "Failed to load batch details.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        if (!contract || !batch) return;
        setPurchasing(true);
        try {
            const totalPrice = BigInt(batch.quantity) * BigInt(batch.pricePerKg);

            const tx = await contract.buyBatch(batch.id, {
                value: totalPrice
            });

            toast({
                title: "Transaction Sent",
                description: "Processing your purchase...",
            });

            await tx.wait();

            toast({
                title: "Purchase Successful!",
                description: "You have successfully bought this batch.",
            });
            fetchBatch(); // Refresh status
        } catch (error: any) {
            console.error("Purchase error:", error);
            toast({
                title: "Purchase Failed",
                description: error.reason || "Transaction failed",
                variant: "destructive"
            });
        } finally {
            setPurchasing(false);
        }
    };

    if (!batchId) return <div>Invalid URL</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">

                {loading || (!batch && !contract) ? (
                    <div className="text-center">
                        {!isConnected ? (
                            <div className="space-y-4">
                                <p className="text-xl font-semibold">Connect wallet to verify batch</p>
                                <Button onClick={connectWallet}>Connect Wallet</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Loading blockchain data...
                            </div>
                        )}
                    </div>
                ) : batch ? (
                    <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">
                        <div className="relative h-[400px] md:h-auto rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={`https://picsum.photos/seed/${batch.id}/800/800`}
                                alt="Harvest Image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                <ShieldCheck className="text-blue-600 h-5 w-5" />
                                <span className="font-bold text-blue-900 upercase tracking-wide text-sm">Blockchain Verified</span>
                            </div>
                        </div>

                        <div className="space-y-8 py-4">
                            <div>
                                <h1 className="text-4xl font-black mb-2 text-foreground">Nagpur Orange Batch #{batch.id}</h1>
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <User className="h-4 w-4" />
                                    <span>Farmer: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-sm">{batch.farmer}</span></span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-card border-none shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground tracking-widest uppercase">Harvested On</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{format(batch.harvestDate, 'MMMM dd, yyyy')}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-card border-none shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground tracking-widest uppercase">Volume</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{batch.quantity} kg</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="p-6 bg-secondary/30 rounded-3xl border border-border">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Price</p>
                                        <div className="text-4xl font-black text-primary">
                                            ETH {ethers.formatEther(BigInt(batch.quantity) * BigInt(batch.pricePerKg))}
                                            <span className="text-lg text-gray-400 font-normal ml-2">(@ {batch.pricePerKg} wei/kg)</span>
                                        </div>
                                    </div>
                                    {batch.sold ? (
                                        <Badge variant="destructive" className="text-lg px-4 py-1.5 uppercase tracking-widest">Sold Out</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-lg px-4 py-1.5 bg-green-100 text-green-700 border-green-200 uppercase tracking-widest">Available</Badge>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20"
                                    disabled={batch.sold || purchasing || !isConnected}
                                    onClick={handleBuy}
                                >
                                    {batch.sold ? (
                                        "This batch has been sold"
                                    ) : (
                                        <>
                                            {purchasing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                                            {purchasing ? "Processing Transaction..." : "Buy Now with Type Payment"}
                                        </>
                                    )}
                                </Button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Secured by Ethereum Blockchain. By purchasing, you agree to the smart contract terms.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
