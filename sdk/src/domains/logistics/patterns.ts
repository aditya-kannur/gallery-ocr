export const LOGISTICS_PATTERNS = {
  trackingId: /(?:tracking|awb|docket|shipment)\s*(?:no|id|#)?[:\s]*([A-Z0-9]{8,20})/i,
  courier: /(?:bluedart|delhivery|fedex|dhl|ekart|dtdc|xpressbees|shadowfax)/i,
  sender: /(?:from|sender|ship\s*from)[:\s]+([A-Za-z\s]{3,30})/i,
  receiver: /(?:to|receiver|ship\s*to)[:\s]+([A-Za-z\s]{3,30})/i,
  pincode: /\b([1-9][0-9]{5})\b/,
  date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
};