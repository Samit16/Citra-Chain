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

      for (let i = Number(count); i >= 1; i--) {
        const batch = await contract.batches(i);

        if (batch.farmer.toLowerCase() === account.toLowerCase()) {
          const priceWei = batch.pricePerKgWei || batch.pricePerKg || 0;
          // Check for isActive. If undefined (old contract), treat as true
          const isActive = batch.isActive !== undefined ? batch.isActive : (batch[5] !== undefined ? batch[5] : true);

          fetchedBatches.push({
            id: i.toString(),
            cropType: 'Nagpur Orange',
            quantity: Number(batch.quantity),
            harvestDate: new Date(Number(batch.harvestDate) * 1000),
            farmLocation: 'Nagpur',
            status: batch.sold ? 'Sold' : 'Listed',
            isActive: isActive,
            image: {
              src: getBatchImage(i),
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
          <RecentHarvests
            batches={batches}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
