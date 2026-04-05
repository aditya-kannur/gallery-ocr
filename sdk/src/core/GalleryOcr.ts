import type { GalleryOcrConfig, SearchResult, IndexStats } from '../types';

export class GalleryOcr {
  private config: GalleryOcrConfig;

  constructor(config: GalleryOcrConfig = {}) {
    this.config = config;
  }

  async indexImages(
    paths: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    // TODO: implement in next step
    throw new Error('Not implemented yet');
  }

  async search(query: string): Promise<SearchResult[]> {
    // TODO: implement in next step
    throw new Error('Not implemented yet');
  }

  async getStats(): Promise<IndexStats> {
    // TODO: implement in next step
    throw new Error('Not implemented yet');
  }
}