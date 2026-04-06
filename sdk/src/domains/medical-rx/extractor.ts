import { RX_PATTERNS } from './patterns';
import type { MedicalRx } from './types';

export function extractMedicalRx(rawText: string): MedicalRx {
  return {
    drugName: RX_PATTERNS.drugName.exec(rawText)?.[1]?.trim(),
    dosage: RX_PATTERNS.dosage.exec(rawText)?.[1]?.trim(),
    frequency: RX_PATTERNS.frequency.exec(rawText)?.[1]?.trim(),
    doctor: RX_PATTERNS.doctor.exec(rawText)?.[1]?.trim(),
    date: RX_PATTERNS.date.exec(rawText)?.[1]?.trim(),
    rawText,
  };
}