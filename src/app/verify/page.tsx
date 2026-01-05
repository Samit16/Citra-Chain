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
import { getBatchImage } from '@/lib/image-mapper';
import { Textarea } from '@/components/ui/textarea'; // Assuming it exists or I use standard
import { ArrowRight, QrCode } from 'lucide-react';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract-config';

type BatchDetails = {
    id: string;
    farmer: string;
    quantity: number;
    pricePerKgWei: bigint;
    pricePerKgEth: string;
    harvestDate: Date;
    sold: boolean;
};

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const paramBatchId = searchParams.get('batchId');
    const { contract: walletContract, account, isConnected, connectWallet } = useWallet();
    const { toast } = useToast();

    const [batch, setBatch] = useState<BatchDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(false);
    const [qrInput, setQrInput] = useState('');

    useEffect(() => {
        if (paramBatchId) {
            fetchBatch(paramBatchId);
        }
    }, [paramBatchId, walletContract]);

    const fetchBatch = async (idToFetch: string) => {
        setLoading(true);
        let contractToUse = walletContract;

        // Try read-only if not connected
        if (!contractToUse) {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    contractToUse = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
                } catch (e) { console.error(e); }
            }
            // Fallback to Public RPC
            if (!contractToUse) {
                try {
                    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
                    contractToUse = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
                } catch (e) { console.error("Public RPC Error", e); }
            }
        }

        if (!contractToUse) {
            setLoading(false);
            return;
        }

        try {
            const data = await contractToUse.batches(idToFetch);

            if (data.farmer === ethers.ZeroAddress) {
                toast({ title: "Batch not found", variant: "destructive" });
                setLoading(false);
                return;
            }

            const priceWei = data.pricePerKgWei || data.pricePerKg || BigInt(0);

            setBatch({
                id: idToFetch,
                farmer: data.farmer,
                quantity: Number(data.quantity),
                pricePerKgWei: BigInt(priceWei),
                pricePerKgEth: ethers.formatEther(priceWei),
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

    const handleVerify = () => {
        try {
            const data = JSON.parse(qrInput);

            // Support new human-readable format
            if (data.BatchId) {
                if (data.Network && !data.Network.toLowerCase().includes('sepolia')) {
                    toast({ title: "Network Mismatch", description: "Not on Sepolia.", variant: "destructive" });
                    return;
                }
                fetchBatch(data.BatchId.toString());
                return;
            }

            // Support old strict format
            if (data.type === "CITRA_CHAIN_BATCH") {
                if (data.network !== "sepolia") {
                    toast({ title: "Network Mismatch", description: "This batch is not on Sepolia.", variant: "destructive" });
                    return;
                }
                fetchBatch(data.batchId);
                return;
            }

            toast({ title: "Invalid Data", description: "QR code does not contain a valid Batch ID.", variant: "destructive" });
        } catch (e) {
            toast({ title: "Parse Error", description: "Invalid JSON data.", variant: "destructive" });
        }
    };

    const handleBuy = async () => {
        if (!walletContract || !batch) return;

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
            // Calculate total price in Wei
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
            fetchBatch(batch.id); // Refresh status
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

    // If no batch loaded yet, show the Verification Form
    if (!batch && !loading) {
        // ... (previous content for QR form)
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center max-w-lg">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                            <QrCode className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Verify Crop Passport</h1>
                        <p className="text-gray-500 mt-2">
                            Paste the JSON data from your scanned QR code below to verify authenticity on the blockchain.
                        </p>
                    </div>

                    <Card className="w-full shadow-lg border-none bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            <Textarea
                                placeholder='Paste QR JSON here... e.g. {"type": "CITRA_CHAIN_BATCH", ...}'
                                className="min-h-[120px] font-mono text-xs bg-gray-50/50"
                                value={qrInput}
                                onChange={(e) => setQrInput(e.target.value)}
                            />
                            <Button className="w-full h-12 text-lg font-bold" onClick={handleVerify} disabled={!qrInput}>
                                Verify Authenticity <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            No website required. Data is verified directly against the Sepolia Ethereum Testnet.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    // Logic for displaying batch (continues below)
    const isOwner = account && batch && account.toLowerCase() === batch.farmer.toLowerCase();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-12 flex-1 flex items-center justify-center">

                {loading || !batch ? (
                    <div className="flex items-center gap-2 text-xl text-gray-500">
                        <Loader2 className="animate-spin" /> Loading batch data...
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">
                        <div className="relative h-[400px] md:h-auto rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src={getBatchImage(batch.id)}
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

                                <div className="mt-6 text-center space-y-2">
                                    <p className="text-xs text-gray-400">
                                        Data fetched directly from Sepolia Testnet.
                                    </p>
                                    <a
                                        href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
                                    >
                                        View Contract on Etherscan
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
