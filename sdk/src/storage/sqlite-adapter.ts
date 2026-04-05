import type { BaseStorage } from './base-storage';
import type { SearchResult, IndexStats, SortOption, DateFilter } from '../types';

export class SqliteAdapter implements BaseStorage {
  async init(): Promise<void> {
    throw new Error('Not implemented');
  }

  async saveResult(uri: string, text: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async isIndexed(uri: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  async search(query: string, sort?: SortOption, dateFilter?: DateFilter): Promise<SearchResult[]> {
    throw new Error('Not implemented');
  }

  async getStats(): Promise<IndexStats> {
    throw new Error('Not implemented');
  }

  async clear(): Promise<void> {
    throw new Error('Not implemented');
  }
}