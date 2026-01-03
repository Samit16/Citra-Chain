'use server';

/**
 * @fileOverview Analyzes historical harvest data and generates a report identifying potential inaccuracies or discrepancies.
 *
 * - analyzeHarvestData - A function that analyzes harvest data for inaccuracies.
 * - AnalyzeHarvestDataInput - The input type for the analyzeHarvestData function.
 * - AnalyzeHarvestDataOutput - The return type for the analyzeHarvestData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeHarvestDataInputSchema = z.object({
  batchId: z.string().describe('The ID of the harvest batch to analyze.'),
  historicalData: z.string().describe('Historical data of harvest batches.'),
  blockchainData: z.string().describe('Data from the blockchain related to the harvest batch.'),
  timestamp: z.string().describe('The timestamp of the harvest batch registration.'),
});
export type AnalyzeHarvestDataInput = z.infer<typeof AnalyzeHarvestDataInputSchema>;

const AnalyzeHarvestDataOutputSchema = z.object({
  report: z.string().describe('A report highlighting potential inaccuracies or discrepancies in the harvest data.'),
});
export type AnalyzeHarvestDataOutput = z.infer<typeof AnalyzeHarvestDataOutputSchema>;

export async function analyzeHarvestData(input: AnalyzeHarvestDataInput): Promise<AnalyzeHarvestDataOutput> {
  return analyzeHarvestDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeHarvestDataPrompt',
  input: {schema: AnalyzeHarvestDataInputSchema},
  output: {schema: AnalyzeHarvestDataOutputSchema},
  prompt: `You are a data analyst specializing in identifying inaccuracies and discrepancies in harvest data.

You will analyze the provided harvest data, considering historical trends, blockchain records, and timestamp information to generate a report.

Highlight any potential issues that could indicate data integrity problems, promoting transparency and trust within the CitraChain platform.

Batch ID: {{{batchId}}}
Historical Data: {{{historicalData}}}
Blockchain Data: {{{blockchainData}}}
Timestamp: {{{timestamp}}}

Generate a detailed report outlining potential inaccuracies or discrepancies in the harvest data.
`,
});

const analyzeHarvestDataFlow = ai.defineFlow(
  {
    name: 'analyzeHarvestDataFlow',
    inputSchema: AnalyzeHarvestDataInputSchema,
    outputSchema: AnalyzeHarvestDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
