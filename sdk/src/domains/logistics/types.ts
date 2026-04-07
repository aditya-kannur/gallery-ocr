export interface LogisticsShipment {
  trackingId?: string;
  courier?: string;
  sender?: string;
  receiver?: string;
  pincode?: string;
  date?: string;
  rawText: string;
}