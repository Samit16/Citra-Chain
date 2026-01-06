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
    const { contract: walletContract, account, isConnected, connectWallet, isWrongNetwork, switchToSepolia } = useWallet();
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

        if (!contractToUse) {
            // Fallback to Public RPC directly for reliability
            try {
                const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
                contractToUse = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            } catch (e) { console.error("Public RPC Error", e); }
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
                                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="text-orange-600 h-5 w-5" />
                                        <span className="font-bold text-orange-950 uppercase tracking-widest text-xs">Blockchain Verified</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-medium pl-7">Data from Sepolia Testnet</span>
                                </div>
                            </div>

                            {/* QR Code Section - ONLY here and Verify page as requested */}
                            {/* QR Code Section */}
                            <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                                <CardContent className="p-6 flex flex-col items-center text-center">
                                    <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100 mb-4">
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                "Product": "Nagpur Orange (GI Tagged)",
                                                "BatchId": batch.id,
                                                "Origin": "Nagpur, Maharashtra, India",
                                                "Farmer": batch.farmer,
                                                "HarvestDate": format(batch.harvestDate, 'yyyy-MM-dd'),
                                                "Quantity": `${batch.quantity} kg`,
                                                "Contract": CONTRACT_ADDRESS,
                                                "Network": "Sepolia Testnet"
                                            }, null, 2)}
                                            size={200}
                                            level="M"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <h3 className="font-bold text-gray-900">Crop Passport</h3>
                                    <p className="text-xs text-gray-500 max-w-[200px] mt-1">
                                        Scan to view full harvest details immediately.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Side: Details & Actions */}
                        <div className="space-y-8 py-4">
                            <div>
                                <h1 className="text-4xl font-black mb-2 text-orange-950 tracking-tight">Nagpur Orange Batch #{batch.id}</h1>
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <User className="h-4 w-4" />
                                    <span>Farmer: <span className="font-mono bg-orange-100/50 px-2.5 py-1 rounded-md text-orange-800 text-sm border border-orange-200/50">{batch.farmer}</span></span>
                                    {isOwner && <Badge variant="secondary" className="bg-orange-100 text-orange-800">You (Owner)</Badge>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-white border-orange-100 shadow-sm rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-bold text-gray-400 tracking-widest uppercase">Harvested On</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black text-gray-800">{format(batch.harvestDate, 'MMMM dd, yyyy')}</div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white border-orange-100 shadow-sm rounded-2xl">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-bold text-gray-400 tracking-widest uppercase">Volume</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-black text-gray-800">{batch.quantity} kg</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="p-8 bg-orange-50/50 rounded-3xl border border-orange-100/50">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Price</p>
                                        <div className="text-4xl font-black text-orange-600 tracking-tight">
                                            {parseFloat(ethers.formatEther(BigInt(batch.quantity) * batch.pricePerKgWei)).toFixed(4)} ETH
                                            <span className="text-lg text-gray-400 font-bold ml-2">(@ {batch.pricePerKgEth} ETH/kg)</span>
                                        </div>
                                    </div>
                                    {batch.sold ? (
                                        <Badge variant="destructive" className="text-lg px-6 py-2 uppercase tracking-widest bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200">Sold Out</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-lg px-6 py-2 bg-emerald-100 text-emerald-800 border-emerald-200 uppercase tracking-widest font-bold shadow-sm">Available</Badge>
                                    )}
                                </div>

                                {!isConnected ? (
                                    <Button size="lg" className="w-full h-16 text-lg font-bold rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-2xl hover:-translate-y-0.5" onClick={connectWallet}>
                                        Connect Wallet to Buy
                                    </Button>
                                ) : isWrongNetwork ? (
                                    <Button size="lg" variant="destructive" className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all" onClick={switchToSepolia}>
                                        Switch to Sepolia Network
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-orange-500/20 bg-gradient-to-r from-orange-600 to-orange-500 hover:to-orange-600 hover:shadow-orange-500/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                        disabled={batch.sold || purchasing || !!isOwner}
                                        onClick={handleBuy}
                                    >
                                        {batch.sold ? (
                                            "This batch has been sold"
                                        ) : isOwner ? (
                                            "You cannot buy your own batch"
                                        ) : (
                                            <>
                                                {purchasing ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <ShoppingCart className="mr-2 h-6 w-6" />}
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
