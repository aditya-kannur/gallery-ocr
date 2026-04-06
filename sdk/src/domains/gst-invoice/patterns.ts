export const GST_PATTERNS = {
  invoiceNo: /invoice\s*no[:\s#]*([A-Z0-9/-]+)/i,
  gstin: /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/,
  amount: /(?:total|grand\s*total|amount)[:\s₹Rs.]*([0-9,]+(?:\.[0-9]{2})?)/i,
  date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
};