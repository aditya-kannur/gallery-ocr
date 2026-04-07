import type { Domain } from '../types';

const GST_HINTS = ['gstin', 'invoice', 'igst', 'cgst', 'sgst', 'tax invoice'];
const RX_HINTS = ['tab.', 'cap.', 'syrup', 'dosage', 'prescription', 'dr.', 'mg', 'ml'];
const LOGISTICS_HINTS = ['tracking', 'awb', 'shipment', 'delhivery', 'bluedart', 'pincode'];

export function classifyDocument(rawText: string): Domain {
  const lower = rawText.toLowerCase();

  const gstScore = GST_HINTS.filter(h => lower.includes(h)).length;
  const rxScore = RX_HINTS.filter(h => lower.includes(h)).length;
  const logisticsScore = LOGISTICS_HINTS.filter(h => lower.includes(h)).length;

  const max = Math.max(gstScore, rxScore, logisticsScore);
  if (max === 0) return 'general';
  if (max === gstScore) return 'gst_invoice';
  if (max === rxScore) return 'medical_rx';
  return 'logistics';
}