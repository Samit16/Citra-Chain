'use client';

import {
  ArrowRight,
  CheckCircle2,
  List,
  Tag,
  Pencil,
  Trash2,
  XCircle
} from 'lucide-react';
import type { HarvestBatch } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import Image from 'next/image';

type RecentHarvestsProps = {
  batches: HarvestBatch[];
  onEdit: (batch: HarvestBatch) => void;
  onDelete: (batchId: string) => void;
  onViewHistory: () => void;
  showHistory: boolean;
};

const StatusBadge = ({ status, isActive }: { status: HarvestBatch['status'], isActive?: boolean }) => {
  const isSold = status === 'Sold';
  const isDeactivated = isActive === false;

  let badgeClass = 'bg-green-100 text-green-800';
  let icon = <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>;
  let text: string = status;

  if (isSold) {
    badgeClass = 'bg-gray-800/70 text-white';
    icon = <CheckCircle2 className="mr-2 h-4 w-4 text-white" />;
  } else if (isDeactivated) {
    badgeClass = 'bg-red-100 text-red-800';
    icon = <XCircle className="mr-2 h-4 w-4 text-red-600" />;
    text = 'Deactivated';
  }

  return (
    <Badge
      variant="outline"
      className={`absolute top-4 right-4 rounded-full border-none font-semibold ${badgeClass}`}
    >
      {icon}
      {text}
    </Badge>
  );
};

export function RecentHarvests({ batches, onEdit, onDelete, onViewHistory, showHistory }: RecentHarvestsProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {showHistory ? "Full Harvest History" : "Your Active Harvests"}
          </h2>
          <p className="text-gray-500">
            {showHistory ? "All your past and present batches." : "Track the status of your produce on the marketplace."}
          </p>
        </div>
        <Button variant="link" className="text-primary font-semibold" onClick={onViewHistory}>
          {showHistory ? "View Active Only" : "View History"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {batches.map((batch) => {
          const isSold = batch.status === 'Sold';
          const isActive = batch.isActive !== false; // Default true if undefined

          return (
            <Card key={batch.id} className={`overflow-hidden rounded-2xl shadow-lg border-none bg-card group ${!isActive ? 'opacity-60 grayscale' : ''}`}>
              <div className="relative">
                <Image
                  src={batch.image.src}
                  alt={batch.cropType}
                  width={600}
                  height={400}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={batch.image.hint}
                />
                <StatusBadge status={batch.status} isActive={isActive} />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs font-mono rounded-md px-2 py-1 backdrop-blur-sm">
                  ID: {batch.id}
                </div>
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
                {isSold ? (
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
                ) : isActive ? (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-bold text-lg">{batch.pricePerKg} ETH</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(batch)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(batch.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center font-medium text-red-500">Batch Deactivated</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
