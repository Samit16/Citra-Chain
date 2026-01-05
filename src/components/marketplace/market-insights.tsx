'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerHarvestBatch } from "@/lib/types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useMemo } from "react";
import { format } from "date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

interface MarketInsightsProps {
    batches: CustomerHarvestBatch[];
}

export function MarketInsights({ batches }: MarketInsightsProps) {

    const stats = useMemo(() => {
        const totalBatches = batches.length;
        const soldBatches = batches.filter(b => b.sold).length;
        const activeBatches = totalBatches - soldBatches;

        // Price Trend Data
        // Sort by date ascending
        const sortedBatches = [...batches].sort((a, b) => a.harvestDate.getTime() - b.harvestDate.getTime());

        // Take the last 10-20 data points to avoid overcrowding if many
        // For now, just take all or slice? Let's take all but group by date?
        // Simple approach: Map each batch to a point. If same date, well, multiple points or average.
        // Let's just list them in sequence.

        const priceHistory = sortedBatches.map(b => ({
            date: format(b.harvestDate, 'MMM dd'),
            price: b.pricePerKg
        }));

        return { totalBatches, soldBatches, activeBatches, priceHistory };
    }, [batches]);

    const lineData = {
        labels: stats.priceHistory.map(p => p.date),
        datasets: [
            {
                label: 'Price per Kg (ETH)',
                data: stats.priceHistory.map(p => p.price),
                borderColor: 'rgb(34, 197, 94)', // Green-500
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.4, // Smooth curves
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: 'rgb(34, 197, 94)',
            },
        ],
    };

    const pieData = {
        labels: ['Available', 'Sold'],
        datasets: [
            {
                data: [stats.activeBatches, stats.soldBatches],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-800">Market Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Market Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-primary">{stats.totalBatches}</div>
                        <p className="text-xs text-gray-400">Total Batches Listed</p>

                        <div className="mt-4 flex justify-between text-sm">
                            <div>
                                <span className="font-bold text-green-600">{stats.activeBatches}</span> Available
                            </div>
                            <div>
                                <span className="font-bold text-red-600">{stats.soldBatches}</span> Sold
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Price Trend (ETH/kg)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        mode: 'index',
                                        intersect: false,
                                    }
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: 'rgba(0,0,0,0.05)' }
                                    },
                                    x: {
                                        grid: { display: false }
                                    }
                                },
                                interaction: {
                                    mode: 'nearest',
                                    axis: 'x',
                                    intersect: false
                                }
                            }}
                        />
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Availability</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px] flex justify-center">
                        <Pie
                            data={pieData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } }
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
