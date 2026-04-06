export const RX_PATTERNS = {
  drugName: /(?:tab|cap|syp|inj|drug)[.\s]+([A-Za-z]+(?:\s[A-Za-z]+)?)/i,
  dosage: /(\d+\s*(?:mg|ml|mcg|g))/i,
  frequency: /(\d+\s*(?:times?|x)\s*(?:a\s*)?(?:day|daily|week|month))/i,
  doctor: /(?:dr|doctor)[.\s]+([A-Za-z]+(?:\s[A-Za-z]+)?)/i,
  date: /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/,
};