export type SortOption = 'newest' | 'oldest' | 'most_text';

export type DateFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'this_year';

export type Domain = 'gst_invoice' | 'medical_rx' | 'logistics' | 'general';

export interface OcrResult {
  uri: string;
  text: string;
  confidence: number;
  domain?: Domain;
  indexedAt: number;
}

export interface SearchResult {
  uri: string;
  snippet: string;
  domain?: Domain;
}

export interface IndexStats {
  total: number;
  indexed: number;
}

export interface GalleryOcrConfig {
  domain?: Domain;
  storage?: 'sqlite' | 'mongo';
}