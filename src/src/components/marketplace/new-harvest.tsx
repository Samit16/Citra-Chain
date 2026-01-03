'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  ShieldCheck,
  Calendar,
  MapPin,
  Target,
  Check,
  Scale,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { HarvestBatch } from '@/lib/types';

const formSchema = z.object({
  cropType: z.string().min(1, 'Crop type is required'),
  quantity: z.coerce.number().positive(),
  harvestDate: z.date(),
  farmLocation: z.string().min(1, 'Farm location is required'),
});

type NewHarvestProps = {
  onBatchAdd: (newBatch: Omit<HarvestBatch, 'id'|'status'|'bids'|'finalPrice'>) => void;
};

export function NewHarvest({ onBatchAdd }: NewHarvestProps) {
  const { control, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: 'Nagpur Orange',
      quantity: 1000,
      harvestDate: new Date(),
      farmLocation: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onBatchAdd(values);
    reset();
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white rounded-2xl mb-12">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-1 bg-[#FFF5E5] p-8 flex flex-col justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
              <Plus className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-[#3D3D3D]">New Harvest</h2>
            <p className="text-gray-500 mb-6">
              Register your latest batch on the blockchain. Ensure data accuracy for better trust score.
            </p>
            <div className="mt-auto">
              <Button variant="outline" className="bg-white/50 border-white rounded-full">
                <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                Secure & Transparent
              </Button>
            </div>
          </div>
          <div className="md:col-span-2 p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Crop Type</label>
                  <div className="mt-1">
                    <Button type="button" variant="outline" className="w-full justify-between bg-[#F9F9F9] border-[#E0E0E0] rounded-lg h-12">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">🍊</span>
                        Nagpur Orange
                      </div>
                      <Check className="h-5 w-5 text-green-500" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-500">
                    Quantity (kg)
                  </label>
                  <div className="relative mt-1">
                     <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Controller
                      name="quantity"
                      control={control}
                      render={({ field }) => (
                        <Input id="quantity" type="number" placeholder="e.g. 1000" {...field} className="pl-10 bg-[#F9F9F9] border-[#E0E0E0] rounded-lg h-12"/>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="harvestDate" className="text-sm font-medium text-gray-500">
                    Harvest Date
                  </label>
                  <div className="mt-1">
                    <Controller
                      name="harvestDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal bg-[#F9F9F9] border-[#E0E0E0] rounded-lg h-12',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'MM/dd/yyyy') : <span>mm/dd/yyyy</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="farmLocation" className="text-sm font-medium text-gray-500">
                    Farm Location
                  </label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Controller
                      name="farmLocation"
                      control={control}
                      render={({ field }) => (
                        <Input id="farmLocation" placeholder="Select area" {...field} className="pl-10 bg-[#F9F9F9] border-[#E0E0E0] rounded-lg h-12"/>
                      )}
                    />
                    <Target className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4">
                 <p className="text-sm text-gray-500">All data is recorded immutably.</p>
                <Button type="submit" className="bg-primary text-white rounded-lg h-12 px-8 font-bold hover:bg-primary/90">
                  <Plus className="mr-2 h-5 w-5" />
                  Register Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
