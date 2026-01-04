'use client';

import {
  ArrowRight,
  CheckCircle2,
  List,
  Tag,
  QrCode,
  ExternalLink
} from 'lucide-react';
import type { HarvestBatch } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import Link from 'next/link';

type RecentHarvestsProps = {
  batches: HarvestBatch[];
};

const StatusBadge = ({ status }: { status: HarvestBatch['status'] }) => {
  const isSold = status === 'Sold';

  return (
    <Badge
      variant="outline"
      className={`absolute top-4 right-4 rounded-full border-none font-semibold ${isSold ? 'bg-gray-800/70 text-white' : 'bg-green-100 text-green-800'
        }`}
    >
      {isSold ? (
        <CheckCircle2 className="mr-2 h-4 w-4 text-white" />
      ) : (
        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
      )}
      {status}
    </Badge>
  );
};

export function RecentHarvests({ batches }: RecentHarvestsProps) {
  const [selectedBatch, setSelectedBatch] = useState<HarvestBatch | null>(null);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Your Recent Harvests</h2>
          <p className="text-gray-500">
            Track the status of your produce on the marketplace.
          </p>
        </div>
        <Button variant="link" className="text-primary font-semibold">
          View History <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => (
          <Card key={batch.id} className="overflow-hidden rounded-2xl shadow-lg border-none bg-card group">
            <div className="relative">
              <Image
                src={batch.image.src}
                alt={batch.cropType}
                width={600}
                height={400}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={batch.image.hint}
              />
              <StatusBadge status={batch.status} />
              <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs font-mono rounded-md px-2 py-1 backdrop-blur-sm">
                ID: {batch.id}
              </div>
              <Button
                size="icon"
                className="absolute bottom-4 right-4 bg-white/90 text-gray-900 hover:bg-white shadow-lg rounded-full"
                onClick={() => setSelectedBatch(batch)}
              >
                <QrCode className="h-5 w-5" />
              </Button>
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center"><List className="w-4 h-4 mr-2" />Quantity</p>
                  <p className="font-bold text-lg">{batch.quantity.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center"><Tag className="w-4 h-4 mr-2" />Date</p>
                  <p className="font-bold text-lg">{format(batch.harvestDate, 'MMM dd')}</p>
                </div>
              </div>
              <div className="border-t border-dashed border-gray-200 my-4"></div>
              {batch.status === 'Sold' ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle2 className="h-5 w-5" />
                    Sold
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TOTAL REVENUE</p>
                    <p className="text-green-600 font-bold text-lg">
                      {Number((batch.quantity * (batch.pricePerKg || 0)).toFixed(4))} ETH
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Listing Price</p>
                    <p className="font-semibold text-xl">{batch.pricePerKg} ETH/kg</p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100">
                    Active Listing
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedBatch} onOpenChange={(open) => !open && setSelectedBatch(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Batch Verification</DialogTitle>
          </DialogHeader>
          {selectedBatch && (
            <div className="flex flex-col items-center space-y-6 py-6">
              <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                <QRCodeSVG
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/verify?batchId=${selectedBatch.id}`}
                  size={200}
                  level="H"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-500">Scan to verify authenticity</p>
                <p className="text-xs text-gray-400 font-mono">ID: {selectedBatch.id}</p>
              </div>
              <div className="flex gap-2 w-full">
                <Link href={`/verify?batchId=${selectedBatch.id}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" /> Open Verify Page
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
