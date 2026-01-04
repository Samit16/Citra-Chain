
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerHarvestBatch } from "@/lib/types";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useMemo } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface MarketInsightsProps {
    batches: CustomerHarvestBatch[];
}

export function MarketInsights({ batches }: MarketInsightsProps) {

    const stats = useMemo(() => {
        const totalBatches = batches.length;
        const soldBatches = batches.filter(b => b.sold).length;
        const activeBatches = totalBatches - soldBatches;

        // Farmers
        const farmerCounts: Record<string, number> = {};
        batches.forEach(b => {
            if (b.farmer) {
                const f = b.farmer.substring(0, 6) + '...';
                farmerCounts[f] = (farmerCounts[f] || 0) + 1;
            }
        });

        const topFarmers = Object.entries(farmerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        return { totalBatches, soldBatches, activeBatches, topFarmers };
    }, [batches]);

    const barData = {
        labels: stats.topFarmers.map(f => f[0]),
        datasets: [
            {
                label: 'Batches Listed',
                data: stats.topFarmers.map(f => f[1]),
                backgroundColor: 'rgba(245, 138, 7, 0.5)',
                borderColor: 'rgba(245, 138, 7, 1)',
                borderWidth: 1,
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
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Top Farmers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar
                            data={barData}
                            options={{
                                responsive: true,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
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
