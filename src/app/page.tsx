'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { ethers } from 'ethers';
import { RecentHarvests } from '@/components/marketplace/recent-harvests';
import { NewHarvest } from '@/components/marketplace/new-harvest';
import { mockBatches } from '@/lib/mock-data';
import type { HarvestBatch } from '@/lib/types';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/marketplace/footer';

export default function Home() {
  const [batches, setBatches] = useState<HarvestBatch[]>([]);
  const { contract, account } = useWallet();
  const [loading, setLoading] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (contract && account) {
      fetchBatches();
    }
  }, [contract, account]);

  const fetchBatches = async () => {
    if (!contract || !account) return;
    setLoading(true);
    try {
      const count = await contract.batchCount();
      const fetchedBatches: HarvestBatch[] = [];

      // Iterate backwards to show newest first
      for (let i = Number(count); i >= 1; i--) {
        const batch = await contract.batches(i);
        // batch structure in result object depends on ABI names. 
        // User provided ABI has `pricePerKgWei`. 
        // Note: quantities in Solidity are BigInt.

        // Filter: show only batches created by connected farmer
        if (batch.farmer.toLowerCase() === account.toLowerCase()) {
          // Check if ABI uses pricePerKgWei or pricePerKg
          const priceWei = batch.pricePerKgWei || batch.pricePerKg || 0;

          fetchedBatches.push({
            id: i.toString(),
            cropType: 'Nagpur Orange',
            quantity: Number(batch.quantity),
            harvestDate: new Date(Number(batch.harvestDate) * 1000),
            farmLocation: 'Nagpur',
            status: batch.sold ? 'Sold' : 'Listed',
            image: {
              src: `https://picsum.photos/seed/${i}/600/400`,
              hint: 'fresh orange harvest'
            },
            // Format Wei to Ether for UI display (e.g. "0.01")
            pricePerKg: Number(ethers.formatEther(priceWei)),
            // Store original Wei if needed, but UI uses pricePerKg
            blockchainTransaction: 'Verified'
          });
        }
      }
      setBatches(fetchedBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Farmer Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Manage your harvests and track your sales on the marketplace.
        </p>
        <NewHarvest onRefresh={fetchBatches} />
        {loading ? (
          <div className="flex justify-center p-8">Loading blockchain data...</div>
        ) : (
          <RecentHarvests batches={batches} />
        )}
      </main>
      <Footer />
    </div>
  );
}
