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

export { GalleryOcr } from './core/GalleryOcr';