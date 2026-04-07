export type {
  OcrResult,
  SearchResult,
  IndexStats,
  GalleryOcrConfig,
  SortOption,
  DateFilter,
  Domain,
} from './types';
export type { BaseStorage } from './storage/base-storage';
export { SqliteAdapter } from './storage/sqlite-adapter';
export { extractGstInvoice } from './domains/gst-invoice/extractor';
export type { GstInvoice } from './domains/gst-invoice/types';
export { extractMedicalRx } from './domains/medical-rx/extractor';
export type { MedicalRx } from './domains/medical-rx/types';
export { extractLogistics } from './domains/logistics/extractor';
export type { LogisticsShipment } from './domains/logistics/types';
export { classifyDocument } from './core/classifier';

export { GalleryOcr } from './core/GalleryOcr';