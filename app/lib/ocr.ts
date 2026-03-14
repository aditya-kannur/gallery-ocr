import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {
  insertImage, saveOcrResult, isIndexed,
  setLastIndexedTime, getLastIndexedTime
} from './database';

const BATCH_SIZE = 10;

export type IndexingProgress = {
  current: number;
  total: number;
  done: boolean;
  isIncremental: boolean; // true = only new photos, false = full scan
};

async function requestPermission(): Promise<boolean> {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
}

async function fetchAssetsSince(since: number): Promise<MediaLibrary.Asset[]> {
  let after: string | undefined = undefined;
  let assets: MediaLibrary.Asset[] = [];

  while (true) {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 100,
      after,
      sortBy: MediaLibrary.SortBy.creationTime,
      createdAfter: since > 0 ? since : undefined,
    });

    assets = assets.concat(page.assets);
    if (!page.hasNextPage) break;
    after = page.endCursor;
  }

  return assets;
}

async function processAsset(asset: MediaLibrary.Asset): Promise<void> {
  // Skip if already indexed
  const alreadyDone = await isIndexed(asset.uri);
  if (alreadyDone) return;

  // Save image record first
  const imageId = await insertImage(asset.uri, asset.filename, asset.creationTime);
  if (imageId === -1) return;

  // Downscale before OCR
  const resized = await ImageManipulator.manipulateAsync(
    asset.uri,
    [{ resize: { width: 1000 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  // Run OCR
  const result = await TextRecognition.recognize(resized.uri);

  // Flatten text blocks
  const fullText = result.blocks
    .map(block => block.text)
    .join(' ')
    .toLowerCase()
    .trim();

  await saveOcrResult(imageId, asset.uri, fullText);
}

// Main export — call this on every app open
// Automatically decides full scan vs incremental
export async function indexGallery(
  onProgress: (progress: IndexingProgress) => void
): Promise<void> {
  const hasPermission = await requestPermission();
  if (!hasPermission) {
    console.warn('Gallery permission denied');
    return;
  }

  const lastIndexedAt = await getLastIndexedTime();
  const isIncremental = lastIndexedAt > 0;

  // Fetch only new photos if we've indexed before
  const assets = await fetchAssetsSince(lastIndexedAt);

  if (assets.length === 0) {
    // Nothing new — report done immediately
    onProgress({ current: 0, total: 0, done: true, isIncremental });
    return;
  }

  const total = assets.length;
  let current = 0;

  for (let i = 0; i < assets.length; i += BATCH_SIZE) {
    const batch = assets.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (asset) => {
        try {
          await processAsset(asset);
        } catch (err) {
          console.warn('OCR failed for asset:', asset.filename, err);
        }
        current++;
      })
    );

    onProgress({ current, total, done: false, isIncremental });
  }

  // Save current time as last indexed
  await setLastIndexedTime(Date.now());
  onProgress({ current: total, total, done: true, isIncremental });
}

// Force full re-index — called from settings re-index button
export async function forceFullReIndex(
  onProgress: (progress: IndexingProgress) => void
): Promise<void> {
  // Reset timestamp so fetchAssetsSince fetches everything
  await setLastIndexedTime(0);
  await indexGallery(onProgress);
}