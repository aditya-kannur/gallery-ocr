import { GST_PATTERNS } from './patterns';
import type { GstInvoice } from './types';

export function extractGstInvoice(rawText: string): GstInvoice {
  return {
    invoiceNo: GST_PATTERNS.invoiceNo.exec(rawText)?.[1]?.trim(),
    gstin: GST_PATTERNS.gstin.exec(rawText)?.[0]?.trim(),
    amount: parseAmount(GST_PATTERNS.amount.exec(rawText)?.[1]),
    date: GST_PATTERNS.date.exec(rawText)?.[1]?.trim(),
    rawText,
  };
}

function parseAmount(raw?: string): number | undefined {
  if (!raw) return undefined;
  return parseFloat(raw.replace(/,/g, ''));
}