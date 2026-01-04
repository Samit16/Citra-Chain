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
  <Card className="group relative overflow-hidden rounded-3xl border-none bg-white/70 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 backdrop-blur-sm">
    <div className="relative h-56 overflow-hidden">
      <Image
        src={product.image.src}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        data-ai-hint={product.image.hint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />

      {product.verified && (
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-bold tracking-wide uppercase text-blue-900">Verified</span>
        </div>
      )}
    </div>

    <CardContent className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            {product.location}
          </p>
        </div>
        <Badge
          variant="secondary"
          className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${product.grade.color} bg-opacity-50 border-none`}
        >
          {product.grade.name}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Volume</p>
          <p className="text-base font-semibold text-gray-700">{product.quantity.toLocaleString()} kg</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Harvested</p>
          <p className="text-base font-semibold text-gray-700">{format(product.harvestDate, 'MMM dd')}</p>
        </div>
      </div>

      <div className="flex items-end justify-between pt-4 border-t border-gray-100/50">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-0.5">Price per kg</p>
          <p className="text-2xl font-black text-gray-900">₹{product.pricePerKg}</p>
        </div>
        <Button className="rounded-full w-12 h-12 p-0 bg-gray-900 hover:bg-primary text-white shadow-lg hover:shadow-primary/30 transition-all duration-300">
          <ArrowRight className="h-5 w-5" />
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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest text-green-700 uppercase">Live Marketplace</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tight leading-none">
              Fresh<span className="text-primary">.</span><br />
              Harvest
            </h1>
          </div>

          <div className="flex items-center gap-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-stone-100">
            <div className="text-right">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Rolling Volume</p>
              <p className="text-xl font-bold text-gray-900">42,000 kg</p>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Market Index</p>
              <p className="text-xl font-bold text-primary">₹24.50</p>
            </div>
          </div>
        </div>

        <div className="sticky top-20 z-40 mb-10 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Button
                variant="outline"
                className="rounded-full h-10 px-4 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium"
              >
                <List className="h-4 w-4 mr-2" /> Filters
              </Button>
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              {mockTags.map((tag) => (
                <Button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`rounded-full h-10 px-5 font-medium transition-all ${activeFilters.includes(tag)
                    ? 'bg-gray-900 text-white hover:bg-gray-800 border border-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                >
                  {tag}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white rounded-full p-1 border border-gray-200 shadow-sm ml-4 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 rounded-full ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setViewMode('list')}
                className={`w-9 h-9 rounded-full ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

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
