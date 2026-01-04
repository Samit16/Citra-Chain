'use client';

import { useState } from 'react';
import { RecentHarvests } from '@/components/marketplace/recent-harvests';
import { NewHarvest } from '@/components/marketplace/new-harvest';
import { mockBatches } from '@/lib/mock-data';
import type { HarvestBatch } from '@/lib/types';
import { Header } from '@/components/shared/header';
import { Footer } from '@/components/marketplace/footer';

export default function Home() {
  const [batches, setBatches] = useState<HarvestBatch[]>(mockBatches);

  const handleAddBatch = (
    newBatch: Omit<
      HarvestBatch,
      'id' | 'status' | 'finalPrice' | 'image' | 'blockchainTransaction'
    >
  ) => {
    const newId = `ORG-2023-${Math.floor(Math.random() * 1000 + 8800)}`;
    setBatches((prevBatches) => [
      {
        ...newBatch,
        id: newId,
        status: 'Listed',
        image: {
          src: `https://picsum.photos/seed/${newId}/600/400`,
          hint: 'fresh harvest',
        },
        blockchainTransaction:
          '0x' +
          [...Array(64)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(''),
      },
      ...prevBatches,
    ]);
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
        <NewHarvest onBatchAdd={handleAddBatch} />
        <RecentHarvests batches={batches} />
      </main>
      <Footer />
    </div>
  );
}
