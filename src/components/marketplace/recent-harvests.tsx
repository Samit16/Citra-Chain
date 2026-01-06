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
    <section className="mb-20">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            {showHistory ? "Full History" : "Active Harvests"}
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            {showHistory ? "Archive of all your production cycles." : "Track and manage your current market listings."}
          </p>
        </div>
        <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold group" onClick={onViewHistory}>
          {showHistory ? "Switch to Active View" : "View Past Harvests"}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {batches.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-gray-200/60 text-center">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-6 rounded-full mb-6 shadow-orange-100 shadow-xl">
            <Tag className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Harvests Listed Yet</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
            Your future harvests will appear here. Start by registering a new batch above.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => {
            const isSold = batch.status === 'Sold';
            const isActive = batch.isActive !== false;

            return (
              <Card key={batch.id} className={`overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white group ${!isActive ? 'opacity-70 bg-gray-50' : ''}`}>
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60" />
                  <Image
                    src={batch.image.src}
                    alt={batch.cropType}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint={batch.image.hint}
                  />
                  <StatusBadge status={batch.status} isActive={isActive} />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white/80 text-xs font-bold tracking-widest uppercase mb-1">Batch ID</p>
                    <p className="text-white text-2xl font-black font-mono">#{batch.id}</p>
                  </div>
                </div>

                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <List className="w-3.5 h-3.5" /> Volume
                      </p>
                      <p className="font-black text-2xl text-gray-800">{batch.quantity.toLocaleString()} <span className="text-base font-medium text-gray-400">kg</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-end gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Harvested
                      </p>
                      <p className="font-bold text-xl text-gray-800">{format(batch.harvestDate, 'MMM dd, yyyy')}</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mb-6"></div>

                  {isSold ? (
                    <div className="bg-emerald-50 rounded-2xl p-4 flex items-center justify-between border border-emerald-100">
                      <div className="flex items-center gap-3 text-emerald-800 font-bold">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span>Sold Out</span>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-wider">Revenue</p>
                        <p className="text-emerald-900 font-black text-lg">
                          {Number((batch.quantity * (batch.pricePerKg || 0)).toFixed(4))} ETH
                        </p>
                      </div>
                    </div>
                  ) : isActive ? (
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Listing Price</p>
                        <p className="font-black text-2xl text-orange-600">{batch.pricePerKg} <span className="text-sm text-orange-400 font-bold">ETH/kg</span></p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors" onClick={() => onEdit(batch)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors" onClick={() => onDelete(batch.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                      <p className="font-bold text-gray-500 flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" /> Batch Deactivated
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
