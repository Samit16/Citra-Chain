'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  List,
  ShieldCheck,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { MarketInsights } from '@/components/marketplace/market-insights';
import { getBatchImage } from '@/lib/image-mapper';
import { customerMockBatches, mockTags } from '@/lib/mock-data';
import type { CustomerHarvestBatch } from '@/lib/types';
import { format } from 'date-fns';

import { useWallet } from '@/context/WalletContext';
import { useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contract-config';

const ProductCard = ({ product }: { product: CustomerHarvestBatch }) => (
  <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-white shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <div className="relative h-72 overflow-hidden">
      <Image
        src={product.image.src}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        data-ai-hint={product.image.hint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-60 transition-opacity group-hover:opacity-80" />

      {product.verified && (
        <div className="absolute top-5 left-5 flex items-center gap-2 bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full shadow-sm z-10">
          <ShieldCheck className="w-4 h-4 text-orange-600 fill-orange-100" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-orange-950">Verified</span>
        </div>
      )}

      <div className="absolute bottom-5 left-5 right-5 text-white z-10">
        <h3 className="text-2xl font-black leading-none mb-2 drop-shadow-sm">{product.name}</h3>
        <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
          <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-xs border border-white/20">
            {product.location}
          </span>
          <span className="w-1 h-1 bg-white rounded-full"></span>
          <span>{format(product.harvestDate, 'MMM dd')}</span>
        </div>
      </div>
    </div>

    <CardContent className="p-7">
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Available Volume</p>
          <p className="text-xl font-bold text-gray-800 flex items-baseline gap-1">
            {product.quantity.toLocaleString()}
            <span className="text-sm font-medium text-gray-400">kg</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Grade</p>
          <Badge
            variant="secondary"
            className={`rounded-lg px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${product.grade.color} bg-opacity-50 border-none inline-flex`}
          >
            {product.grade.name}
          </Badge>
        </div>
      </div>

      <div className="flex items-end justify-between pt-6 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Price per kg</p>
          <p className="text-3xl font-black text-orange-600 tracking-tight">{product.pricePerKg} <span className="text-lg text-gray-600 font-bold">ETH</span></p>
        </div>
        <Link href={`/batch/${product.id}`}>
          <Button className="rounded-2xl w-14 h-14 p-0 bg-gray-900 hover:bg-orange-600 text-white shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-110">
            <ArrowRight className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default function MarketplacePage() {
  const [activeFilters, setActiveFilters] = useState(['Nagpur Mandarin']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { contract: walletContract, isConnected } = useWallet();
  const [batches, setBatches] = useState<CustomerHarvestBatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBatches();
  }, [walletContract]);

  const fetchBatches = async () => {
    setLoading(true);
    let contractToUse = walletContract;

    if (!contractToUse) {
      // Fallback: Always use Public RPC (Sepolia) to ensure we read from correct chain
      // regardless of user's wallet state or network.
      try {
        const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
        contractToUse = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      } catch (e) {
        console.error("Public RPC provider failed", e);
      }
    }

    if (!contractToUse) {
      setLoading(false);
      return;
    }

    try {
      const count = await contractToUse.batchCount();
      const fetchedBatches: CustomerHarvestBatch[] = [];
      const promises = [];

      for (let i = Number(count); i >= 1; i--) {
        promises.push(contractToUse.batches(i).then((batch: any) => ({
          id: i,
          raw: batch
        })));
      }

      const results = await Promise.all(promises);

      for (const item of results) {
        const batch = item.raw;
        // batch: [farmer, quantity, price, date, sold, isActive]
        const isActive = batch.isActive !== undefined ? batch.isActive : (batch[5] !== undefined ? batch[5] : true);

        if (!isActive) continue; // Skip deleted items

        const priceWei = batch.pricePerKgWei || batch.pricePerKg || 0;
        fetchedBatches.push({
          id: item.id.toString(),
          name: 'Nagpur Mandarin',
          location: 'Nagpur, IN',
          quantity: Number(batch.quantity),
          harvestDate: new Date(Number(batch.harvestDate) * 1000),
          verified: true,
          grade: { name: 'Grade A', color: 'bg-green-100 text-green-700' },
          image: {
            src: getBatchImage(item.id),
            hint: 'fresh orange harvest'
          },
          pricePerKg: Number(ethers.formatEther(priceWei)),
          farmer: batch.farmer,
          sold: batch.sold,
          isActive: isActive
        });
      }
      setBatches(fetchedBatches);
    } catch (e) {
      console.error("Error fetching marketplace batches", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const paginatedBatches = batches
    .filter(b => !b.sold) // Only show Available in the main grid for clarity (or consistent with old behavior). 
    // Actually, "Total batches listed" (Overview) vs "Sold". 
    // If I filter sold here, the paginated list is "Available".
    // The MarketInsights will receive `batches` which has everything (sold & available).
    // Keep Grid for Available only for UX?  User said "deleted batches do not appear".
    // Sold batches usually appear in "Sold" tab or similar. I'll filter sold out of the main grid for better UX, 
    // BUT passing full list to MarketInsights.
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-orange-50/30">
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center mb-20 text-center">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-4 py-1.5 text-sm font-bold uppercase tracking-widest">
            Sepolia Testnet Live
          </Badge>
          <h1 className="text-5xl font-black text-gray-900 md:text-7xl mb-6 leading-tight tracking-tight">
            Decentralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Orange</span> Markets
          </h1>
          <p className="max-w-2xl text-xl text-gray-500 font-medium leading-relaxed">
            Direct farmer-to-buyer commerece. Verified harvests, fair pricing, and complete transparency powered by Ethereum.
          </p>
        </div>

        <MarketInsights batches={batches} />

        <div className="sticky top-24 z-40 mb-12 py-4 px-2">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl rounded-full shadow-sm border border-white/50 -mx-4" />
          <div className="relative flex items-center justify-between px-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Button
                variant="ghost"
                className="rounded-full h-10 px-4 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-900"
              >
                <List className="h-4 w-4 mr-2" /> Filters
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              {mockTags.map((tag) => (
                <Button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`rounded-full h-10 px-6 font-bold transition-all shadow-sm ${activeFilters.includes(tag)
                    ? 'bg-orange-600 text-white hover:bg-orange-700 border-transparent shadow-orange-200'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                    }`}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-1 bg-gray-100/50 rounded-full p-1 border border-gray-200/50 shadow-inner ml-4 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 rounded-full transition-all ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 text-xl font-medium text-gray-400">Loading live batches...</div>
        ) : batches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-gray-400">
            <p className="text-lg">No active batches available.</p>
            {!isConnected && <p className="text-sm mt-2">Connect wallet to view verified listings.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedBatches.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-12 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Page {currentPage}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={
              currentPage * itemsPerPage >= batches.length
            }
            className="rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
      <footer className="bg-background text-sm text-gray-500">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-8">
          <div className="flex items-center gap-2">
            <span>© 2024 Nagpur Buyer Marketplace.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
