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

import { EditBatchDialog } from '@/components/marketplace/edit-batch-dialog';
import { getBatchImage } from '@/lib/image-mapper';

export default function Home() {
  const [batches, setBatches] = useState<HarvestBatch[]>([]);
  const { contract, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [editingBatch, setEditingBatch] = useState<{ id: string, quantity: number, pricePerKg?: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

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
      const promises = [];

      // Create an array of promises to fetch batches in parallel
      for (let i = Number(count); i >= 1; i--) {
        promises.push(contract.batches(i).then((batch: any) => ({
          ...batch,
          id: i, // Preserve ID
          // Need to manually map array-like return from ethers to objects if not returned as struct, 
          // but strictly: ethers contracts return Result object that acts like array & object.
          // We'll pass the whole result for processing.
          raw: batch
        })));
      }

      const results = await Promise.all(promises);

      for (const item of results) {
        const batch = item.raw;

        if (batch.farmer.toLowerCase() === account.toLowerCase()) {
          const priceWei = batch.pricePerKgWei || batch.pricePerKg || 0;
          const isActive = batch.isActive !== undefined ? batch.isActive : (batch[5] !== undefined ? batch[5] : true);

          fetchedBatches.push({
            id: item.id.toString(),
            cropType: 'Nagpur Orange',
            quantity: Number(batch.quantity),
            harvestDate: new Date(Number(batch.harvestDate) * 1000),
            farmLocation: 'Nagpur',
            status: batch.sold ? 'Sold' : 'Listed',
            isActive: isActive,
            image: {
              src: getBatchImage(item.id),
              hint: 'fresh orange harvest'
            },
            pricePerKg: Number(ethers.formatEther(priceWei)),
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

  const handleEdit = (batch: HarvestBatch) => {
    setEditingBatch({
      id: batch.id,
      quantity: batch.quantity,
      pricePerKg: batch.pricePerKg
    });
  };

  const handleSaveEdit = async (batchId: string, quantity: number, pricePerKg: string) => {
    if (!contract) return;
    try {
      const priceWei = ethers.parseEther(pricePerKg);
      const tx = await contract.updateBatch(batchId, quantity, priceWei);
      await tx.wait();
      fetchBatches(); // Refresh
    } catch (e) {
      console.error("Update failed", e);
      alert("Failed to update batch. See console.");
    }
  };

  const handleDelete = async (batchId: string) => {
    if (!contract) return;
    if (!confirm("Are you sure you want to deactivate this batch? This cannot be undone.")) return;

    try {
      const tx = await contract.deactivateBatch(batchId);
      await tx.wait();
      fetchBatches();
    } catch (e) {
      console.error("Deactivation failed", e);
      alert("Failed to deactivate batch. See console.");
    }
  };

  const displayedBatches = showHistory
    ? batches
    : batches.filter(b => b.status !== 'Sold' && b.isActive !== false);

  return (
    <div className="flex min-h-screen flex-col bg-orange-50/30 text-foreground">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl font-medium">
            Manage your harvests, track sales, and ensure transparency for your customers directly on the blockchain.
          </p>
        </div>
        <NewHarvest onRefresh={fetchBatches} />
        {loading ? (
          <div className="flex justify-center p-8">Loading blockchain data...</div>
        ) : (
          <RecentHarvests
            batches={displayedBatches}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewHistory={() => setShowHistory(!showHistory)}
            showHistory={showHistory}
          />
        )}
        <EditBatchDialog
          isOpen={!!editingBatch}
          onClose={() => setEditingBatch(null)}
          onSave={handleSaveEdit}
          batch={editingBatch}
        />
      </main>
      <Footer />
    </div>
  );
}
