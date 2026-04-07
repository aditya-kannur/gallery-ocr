import { LOGISTICS_PATTERNS } from './patterns';
import type { LogisticsShipment } from './types';

export function extractLogistics(rawText: string): LogisticsShipment {
  return {
    trackingId: LOGISTICS_PATTERNS.trackingId.exec(rawText)?.[1]?.trim(),
    courier: LOGISTICS_PATTERNS.courier.exec(rawText)?.[0]?.trim(),
    sender: LOGISTICS_PATTERNS.sender.exec(rawText)?.[1]?.trim(),
    receiver: LOGISTICS_PATTERNS.receiver.exec(rawText)?.[1]?.trim(),
    pincode: LOGISTICS_PATTERNS.pincode.exec(rawText)?.[1]?.trim(),
    date: LOGISTICS_PATTERNS.date.exec(rawText)?.[1]?.trim(),
    rawText,
  };
}