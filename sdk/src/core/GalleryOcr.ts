import type { GalleryOcrConfig, SearchResult, IndexStats, OcrResult } from '../types';
import { classifyDocument } from './classifier';
import { extractGstInvoice } from '../domains/gst-invoice/extractor';
import { extractMedicalRx } from '../domains/medical-rx/extractor';
import { extractLogistics } from '../domains/logistics/extractor';

export class GalleryOcr {
  private config: GalleryOcrConfig;

  constructor(config: GalleryOcrConfig = {}) {
    this.config = config;
  }

  async indexImages(
    paths: string[],
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    throw new Error('Not implemented — needs storage adapter');
  }

  async search(query: string): Promise<SearchResult[]> {
    throw new Error('Not implemented — needs storage adapter');
  }

  async getStats(): Promise<IndexStats> {
    throw new Error('Not implemented — needs storage adapter');
  }

  parseText(rawText: string): OcrResult {
    const domain = this.config.domain ?? classifyDocument(rawText);

    let extracted: object = {};
    if (domain === 'gst_invoice') extracted = extractGstInvoice(rawText);
    else if (domain === 'medical_rx') extracted = extractMedicalRx(rawText);
    else if (domain === 'logistics') extracted = extractLogistics(rawText);

    return {
      uri: '',
      text: rawText,
      confidence: 1,
      domain,
      indexedAt: Date.now(),
      ...extracted,
    };
  }
}