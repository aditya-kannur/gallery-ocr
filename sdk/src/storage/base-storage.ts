import type { SearchResult, IndexStats, SortOption, DateFilter } from '../types';

export interface BaseStorage {
  init(): Promise<void>;
  saveResult(uri: string, text: string): Promise<void>;
  isIndexed(uri: string): Promise<boolean>;
  search(query: string, sort?: SortOption, dateFilter?: DateFilter): Promise<SearchResult[]>;
  getStats(): Promise<IndexStats>;
  clear(): Promise<void>;
}