export interface GstInvoice {
  invoiceNo?: string;
  gstin?: string;
  vendor?: string;
  amount?: number;
  date?: string;
  rawText: string;
}