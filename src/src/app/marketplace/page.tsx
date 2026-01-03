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
import { customerMockBatches, mockTags } from '@/lib/mock-data';
import type { CustomerHarvestBatch } from '@/lib/types';
import { format } from 'date-fns';

const ProductCard = ({ product }: { product: CustomerHarvestBatch }) => (
  <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-lg transition-transform hover:-translate-y-1">
    <div className="relative">
      <Image
        src={product.image.src}
        alt={product.name}
        width={400}
        height={250}
        className="h-48 w-full object-cover"
        data-ai-hint={product.image.hint}
      />
      {product.verified && (
        <Badge
          variant="outline"
          className="absolute left-3 top-3 flex items-center gap-1 rounded-full border-none bg-blue-100 text-blue-800"
        >
          <ShieldCheck className="h-3 w-3" />
          Verified Farmer
        </Badge>
      )}
      <Badge
        variant="outline"
        className="absolute bottom-3 right-3 rounded-full border-none bg-green-500/80 px-4 py-2 text-sm font-bold text-white"
      >
        BIDDING OPEN
      </Badge>
      {product.timeLeft && (
        <Badge
          variant="outline"
          className="absolute right-3 top-3 rounded-full border-none bg-black/50 text-white"
        >
          {product.timeLeft}
        </Badge>
      )}
    </div>
    <CardContent className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-bold">{product.name}</h3>
        <Badge
          variant="outline"
          className={`rounded-md border-none px-3 py-1 text-xs font-semibold ${product.grade.color}`}
        >
          {product.grade.name}
        </Badge>
      </div>
      <p className="mb-4 text-sm text-gray-500">{product.location}</p>

      <div className="mb-4 flex justify-between text-sm">
        <div className="text-gray-500">
          QUANTITY
          <p className="font-bold text-gray-800">
            {product.quantity.toLocaleString()} kg
          </p>
        </div>
        <div className="text-right text-gray-500">
          HARVEST DATE
          <p className="font-bold text-gray-800">
            {format(product.harvestDate, 'MMM dd')}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Highest Bid</p>
          <p className="text-lg font-bold text-primary">
            ₹{product.highestBid.toFixed(2)}{' '}
            <span className="text-sm font-normal text-gray-500">/kg</span>
          </p>
        </div>
        <Button className="rounded-lg bg-gray-800 px-6 py-3 font-bold text-white hover:bg-gray-700">
          Place Bid
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function MarketplacePage() {
  const [activeFilters, setActiveFilters] = useState(['Nagpur Mandarin']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const paginatedBatches = customerMockBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-600">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              BLOCKCHAIN VERIFIED MARKETPLACE
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-800">
              Nagpur Oranges
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Directly connect with verified farmers. Ensure fair pricing and
              provenance tracking for every batch of Nagpur&apos;s finest
              produce.
            </p>
          </div>
          <Card className="w-full shrink-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm md:w-auto">
            <div className="flex items-center justify-between border-b border-dashed pb-2">
              <p className="text-sm text-gray-500">Market Volume (24h)</p>
              <p className="font-bold text-gray-800">42 Tons</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-sm text-gray-500">Avg. Grade A Price</p>
              <p className="font-bold text-primary">
                ₹24.50
                <span className="text-sm font-normal text-gray-500">/kg</span>
              </p>
            </div>
          </Card>
        </div>

        <Card className="mb-8 rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-stone-300"
            >
              <List className="h-4 w-4" /> Filters
            </Button>
            <div className="mx-2 h-6 w-px bg-stone-200"></div>
            {mockTags.map((tag) => (
              <Button
                key={tag}
                variant={activeFilters.includes(tag) ? 'default' : 'ghost'}
                onClick={() => toggleFilter(tag)}
                className={`rounded-lg ${
                  activeFilters.includes(tag)
                    ? 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                    : 'text-stone-600'
                }`}
              >
                {tag}
                {activeFilters.includes(tag) && (
                  <span className="ml-2 text-stone-500">×</span>
                )}
              </Button>
            ))}
            <div className="flex-grow" />
            <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-1">
              <Button
                size="icon"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 rounded-md bg-white data-[state=active]:bg-white"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                onClick={() => setViewMode('list')}
                className="h-8 w-8 rounded-md data-[state=active]:bg-white"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedBatches.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setCurrentPage(page)}
              className="rounded-full"
            >
              {page}
            </Button>
          ))}
          <span className="text-gray-500">...</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={
              currentPage * itemsPerPage >= customerMockBatches.length
            }
            className="rounded-full"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </main>
      <footer className="bg-[#FFFBF5] text-sm text-gray-500">
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
