'use server';

import { analyzeHarvestData } from '@/ai/flows/data-accuracy-audit';
import type { HarvestBatch } from '@/lib/types';

export async function getAuditReport(batch: HarvestBatch, historicalData: HarvestBatch[]) {
  try {
    const result = await analyzeHarvestData({
      batchId: batch.id,
      timestamp: batch.harvestDate.toISOString(),
      historicalData: `Historical Data for similar batches: ${JSON.stringify(
        historicalData.filter(b => b.id !== batch.id).slice(0, 5)
      )}`,
      blockchainData: `Blockchain record for batch ${batch.id}: Transaction Hash ${
        batch.blockchainTransaction
      }, Status: Confirmed, Block Height: ${Math.floor(Math.random() * 10000) + 50000}`,
    });
    return { success: true, report: result.report };
  } catch (error) {
    console.error('Error getting audit report:', error);
    return { success: false, error: 'Failed to generate audit report.' };
  }
}
