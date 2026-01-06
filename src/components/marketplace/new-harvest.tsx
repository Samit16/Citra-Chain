'use client';
import { ethers } from 'ethers';
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
  BadgeIndianRupee, // Added this import based on the JSX usage
} from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

// ... other imports ...
import { Button } from '@/components/ui/button'; // Assuming these are needed based on JSX
import { Card, CardContent } from '@/components/ui/card'; // Assuming these are needed based on JSX
import { Input } from '@/components/ui/input'; // Assuming these are needed based on JSX
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'; // Assuming these are needed based on JSX
import { Calendar as CalendarComponent } from '@/components/ui/calendar'; // Assuming this is needed based on JSX
import { cn } from '@/lib/utils'; // Assuming this is needed for cn utility
import { format } from 'date-fns'; // Assuming this is needed for date formatting

const formSchema = z.object({
  cropType: z.string().min(1, 'Crop type is required'),
  quantity: z.coerce.number().positive(),
  harvestDate: z.date(),
  farmLocation: z.string().min(1, 'Farm location is required'),
  pricePerKg: z.coerce.number().positive('Price must be greater than 0'),
});

type NewHarvestProps = {
  onRefresh: () => void;
};

export function NewHarvest({ onRefresh }: NewHarvestProps) {
  const { contract, isConnected, isWrongNetwork, switchToSepolia } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: 'Nagpur Orange',
      quantity: 1000,
      harvestDate: new Date(),
      farmLocation: '',
      pricePerKg: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isWrongNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to Sepolia Testnet to continue.",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={switchToSepolia}>
            Switch
          </Button>
        )
      });
      return;
    }

    if (!isConnected || !contract) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register a batch.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Contract expects price in Wei. Input is in ETH (or base unit).
      const priceInWei = ethers.parseEther(values.pricePerKg.toString());

      console.log("Creating batch with:", {
        quantity: values.quantity,
        priceWei: priceInWei.toString(),
        date: Math.floor(values.harvestDate.getTime() / 1000)
      });

      const tx = await contract.createBatch(
        values.quantity,
        priceInWei,
        Math.floor(values.harvestDate.getTime() / 1000)
      );

      toast({
        title: "Transaction Sent",
        description: "Waiting for confirmation...",
      });

      await tx.wait();

      toast({
        title: "Batch Registered",
        description: "Your harvest has been recorded on the blockchain.",
      });

      reset();
      onRefresh();
    } catch (error: any) {
      console.error("Transaction Error:", error);
      toast({
        title: "Error",
        description: error.reason || error.message || "Failed to create batch",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-3xl mb-16 ring-1 ring-black/5">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3 min-h-[500px]">
          <div className="md:col-span-1 bg-gradient-to-br from-orange-50 to-orange-100 p-10 flex flex-col justify-between border-r border-orange-100/50">
            <div>
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 ring-4 ring-orange-500/10 transition-transform hover:scale-105 duration-300">
                <Plus className="text-orange-600 w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-orange-950 tracking-tight">New Harvest</h2>
              <p className="text-orange-800/70 leading-relaxed font-medium">
                Register a new batch on the blockchain. Precise data ensures better trust scores and faster sales.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur rounded-xl p-4 mt-8 border border-orange-200/50">
              <div className="flex items-center gap-3 text-orange-900/80 mb-2 font-semibold">
                <ShieldCheck className="h-5 w-5 text-orange-600" />
                <span>Secure & Verified</span>
              </div>
              <p className="text-xs text-orange-800/60 leading-normal">
                Every entry is permanently recorded on the blockchain network.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 p-10 bg-white">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Crop Type</label>
                  <Button type="button" variant="outline" className="w-full justify-between bg-orange-50/30 border-orange-100 hover:bg-orange-50 h-14 text-lg font-medium transition-all group">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">🍊</span>
                      <span className="text-gray-900">Nagpur Orange</span>
                    </div>
                    <Check className="h-5 w-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label htmlFor="quantity" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Quantity (kg)
                  </label>
                  <div className="relative group">
                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Controller
                      name="quantity"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="quantity"
                          type="number"
                          placeholder="e.g. 1000"
                          {...field}
                          className="pl-12 bg-gray-50 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-14 text-lg transition-all shadow-sm rounded-xl"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="pricePerKg" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price per Kg (ETH)
                  </label>
                  <div className="relative group">
                    <BadgeIndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Controller
                      name="pricePerKg"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="pricePerKg"
                          type="number"
                          placeholder="e.g. 0.005"
                          {...field}
                          className="pl-12 bg-gray-50 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-14 text-lg transition-all shadow-sm rounded-xl"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="harvestDate" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Harvest Date
                  </label>
                  <div className="relative">
                    <Controller
                      name="harvestDate"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal bg-gray-50 border-gray-200 hover:bg-white hover:border-orange-300 h-14 text-lg rounded-xl transition-all shadow-sm group',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <Calendar className="mr-3 h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                              {field.value ? format(field.value, 'MMMM dd, yyyy') : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 border-none shadow-xl rounded-xl">
                            <CalendarComponent mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="p-4 bg-white rounded-xl" />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="farmLocation" className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Farm Location
                  </label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Controller
                      name="farmLocation"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="farmLocation"
                          placeholder="Specific area or region (e.g. Kalmeshwar, Nagpur)"
                          {...field}
                          className="pl-12 pr-12 bg-gray-50 border-gray-200 focus-visible:ring-orange-500 focus-visible:border-orange-500 h-14 text-lg transition-all shadow-sm rounded-xl"
                        />
                      )}
                    />
                    <Target className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex flex-col">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">✨ Immutable Record</p>
                  <p className="text-[10px] text-gray-400">Data cannot be changed once on-chain.</p>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !isConnected}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 rounded-xl h-14 px-10 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Plus className="mr-2 h-5 w-5 stroke-[3]" />}
                  {loading ? 'Processing on Chain...' : 'Register Batch on Chain'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
