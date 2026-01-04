'use client';

import { useWallet } from '@/context/WalletContext';
import { Header } from '@/components/shared/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, ShoppingCart, User, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract-config';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { getBatchImage } from '@/lib/image-mapper';

type BatchDetails = {
    id: string;
    farmer: string;
    quantity: number;
    pricePerKgWei: bigint;
    pricePerKgEth: string;
    harvestDate: Date;
    sold: boolean;
};

export default function BatchDetailPage({ params }: { params: { batchId: string } }) {
    const { batchId } = params;
    const { contract: walletContract, account, isConnected, connectWallet } = useWallet();
    const { toast } = useToast();

    const [batch, setBatch] = useState<BatchDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        fetchBatch();
    }, [batchId, walletContract]);

    const fetchBatch = async () => {
        setLoading(true);
        let contractToUse = walletContract;

        if (!contractToUse && typeof window !== 'undefined' && window.ethereum) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                contractToUse = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            } catch (e) { console.error(e); }
        }

        if (!contractToUse) {
            setLoading(false);
            return;
        }

        try {
            const data = await contractToUse.batches(batchId);

            // Check if batch exists (simple check: non-zero farmer)
            if (data.farmer === ethers.ZeroAddress) {
                toast({ title: "Batch not found", variant: "destructive" });
                setLoading(false);
                return;
            }

            const priceWei = data.pricePerKgWei || data.pricePerKg || BigInt(0);

            setBatch({
                id: batchId,
                farmer: data.farmer,
                quantity: Number(data.quantity),
                pricePerKgWei: BigInt(priceWei),
                pricePerKgEth: ethers.formatEther(priceWei),
                harvestDate: new Date(Number(data.harvestDate) * 1000),
                sold: data.sold
            });
        } catch (error) {
            console.error("Error fetching batch:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBuy = async () => {
        if (!walletContract || !batch) return;

        // ISSUE 2: Prevent buying own batch
        if (account && batch.farmer.toLowerCase() === account.toLowerCase()) {
            toast({
                title: "Action Not Allowed",
                description: "You cannot buy your own batch.",
                variant: "destructive"
            });
            return;
        }

        setPurchasing(true);
        try {
            const totalPrice = BigInt(batch.quantity) * batch.pricePerKgWei;

            const tx = await walletContract.buyBatch(batch.id, {
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
            fetchBatch();
        } catch (error: any) {
            console.error("Purchase error:", error);
            toast({
                title: "Purchase Failed",
                description: error.reason || error.message || "Transaction failed",
                variant: "destructive"
            });
        } finally {
            setPurchasing(false);
        }
    };

    if (!batchId) return <div>Invalid Batch ID</div>;

    const isOwner = account && batch && account.toLowerCase() === batch.farmer.toLowerCase();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">
                {loading || (!batch) ? (
                    <div className="flex items-center gap-2 text-xl text-gray-500">
                        <Loader2 className="animate-spin" /> Loading batch data...
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">
                        {/* Left Side: Image & QR */}
                        <div className="space-y-6">
                            <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src={getBatchImage(batch.id)}
                                    alt="Harvest Image"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                    <ShieldCheck className="text-blue-600 h-5 w-5" />
                                    <span className="font-bold text-blue-900 uppercase tracking-wide text-sm">Blockchain Verified</span>
                                </div>
                            </div>

                            {/* QR Code Section - ONLY here and Verify page as requested */}
                            <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-4">
                                        <QRCodeSVG
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?batchId=${batch.id}`}
                                            size={150}
                                            level="H"
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Crop Passport</h3>
                                    <p className="text-sm text-gray-500">Scan to verify authenticity on Citra-Chain</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side: Details & Actions */}
                        <div className="space-y-8 py-4">
                            <div>
                                <h1 className="text-4xl font-black mb-2 text-foreground">Nagpur Orange Batch #{batch.id}</h1>
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <User className="h-4 w-4" />
                                    <span>Farmer: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700 text-sm">{batch.farmer}</span></span>
                                    {isOwner && <Badge variant="secondary">You (Owner)</Badge>}
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
                                            {parseFloat(ethers.formatEther(BigInt(batch.quantity) * batch.pricePerKgWei)).toFixed(4)} ETH
                                            <span className="text-lg text-gray-400 font-normal ml-2">(@ {batch.pricePerKgEth} ETH/kg)</span>
                                        </div>
                                    </div>
                                    {batch.sold ? (
                                        <Badge variant="destructive" className="text-lg px-4 py-1.5 uppercase tracking-widest">Sold Out</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-lg px-4 py-1.5 bg-green-100 text-green-700 border-green-200 uppercase tracking-widest">Available</Badge>
                                    )}
                                </div>

                                {!isConnected ? (
                                    <Button size="lg" className="w-full h-16 text-lg font-bold rounded-2xl" onClick={connectWallet}>
                                        Connect Wallet to Buy
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20"
                                        disabled={batch.sold || purchasing || !!isOwner}
                                        onClick={handleBuy}
                                    >
                                        {batch.sold ? (
                                            "This batch has been sold"
                                        ) : isOwner ? (
                                            "You cannot buy your own batch"
                                        ) : (
                                            <>
                                                {purchasing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                                                {purchasing ? "Processing Transaction..." : "Buy Now with ETH"}
                                            </>
                                        )}
                                    </Button>
                                )}

                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Secured by Ethereum Blockchain. By purchasing, you agree to the smart contract terms.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
