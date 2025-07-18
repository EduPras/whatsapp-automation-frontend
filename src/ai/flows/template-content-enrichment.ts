'use server';

/**
 * @fileOverview A flow that uses AI to enrich the content of a message template.
 *
 * - enrichTemplateContent - A function that enriches the content of a template.
 * - EnrichTemplateContentInput - The input type for the enrichTemplateContent function.
 * - EnrichTemplateContentOutput - The return type for the enrichTemplateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnrichTemplateContentInputSchema = z.object({
  templateContent: z
    .string()
    .describe('The content of the message template to be enriched.'),
});
export type EnrichTemplateContentInput = z.infer<
  typeof EnrichTemplateContentInputSchema
>;

const EnrichTemplateContentOutputSchema = z.object({
  enrichedContent: z
    .string()
    .describe('The enriched content of the message template.'),
});
export type EnrichTemplateContentOutput = z.infer<
  typeof EnrichTemplateContentOutputSchema
>;

export async function enrichTemplateContent(
  input: EnrichTemplateContentInput
): Promise<EnrichTemplateContentOutput> {
  return enrichTemplateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enrichTemplateContentPrompt',
  input: {schema: EnrichTemplateContentInputSchema},
  output: {schema: EnrichTemplateContentOutputSchema},
  prompt: `You are an AI assistant specialized in improving message template content. Given the current template content, enrich it to be more engaging and effective.\n\nCurrent Template Content: {{{templateContent}}}\n\nEnriched Template Content:`,
});

const enrichTemplateContentFlow = ai.defineFlow(
  {
    name: 'enrichTemplateContentFlow',
    inputSchema: EnrichTemplateContentInputSchema,
    outputSchema: EnrichTemplateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
