import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import { insertImage, saveOcrResult, isIndexed, getIndexStats } from './database';

// How many images to OCR in one batch
const BATCH_SIZE = 10;

export type IndexingProgress = {
  current: number;
  total: number;
  done: boolean;
};

// Main function — call this to index the whole gallery
// onProgress fires after each image so you can update the UI
export async function indexGallery(
  onProgress: (progress: IndexingProgress) => void
): Promise<void> {
  // 1. Ask for gallery permission
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Gallery permission denied');
    return;
  }

  // 2. Fetch all photos from device
  let after: string | undefined = undefined;
  let allAssets: MediaLibrary.Asset[] = [];

  // MediaLibrary returns photos in pages — we loop until we have all of them
  while (true) {
    const page = await MediaLibrary.getAssetsAsync({
      mediaType: 'photo',
      first: 100,           // fetch 100 at a time
      after,
      sortBy: MediaLibrary.SortBy.creationTime,
    });

    allAssets = allAssets.concat(page.assets);

    if (!page.hasNextPage) break;
    after = page.endCursor;
  }

  const total = allAssets.length;
  let current = 0;

  // 3. Process in batches so we don't freeze the app
  for (let i = 0; i < allAssets.length; i += BATCH_SIZE) {
    const batch = allAssets.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (asset) => {
        try {
          // Skip if already indexed
          const alreadyDone = await isIndexed(asset.uri);
          if (alreadyDone) {
            current++;
            return;
          }

          // Save image to DB first
          const imageId = await insertImage(asset.uri, asset.filename, asset.creationTime);
          if (imageId === -1) {
            current++;
            return;
          }

          // Downscale before OCR — huge speedup, no accuracy loss
          const resized = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1200 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );

          // Run OCR
          const result = await TextRecognition.recognize(resized.uri);

          // Flatten all detected text blocks into one string
          const fullText = result.blocks
            .map(block => block.text)
            .join(' ')
            .toLowerCase()
            .trim();

          // Save result to DB
          await saveOcrResult(imageId, asset.uri, fullText);

        } catch (err) {
          // Never let one failed image stop the whole indexer
          console.warn('OCR failed for asset:', asset.filename, err);
        }

        current++;
      })
    );

    // Report progress after each batch
    onProgress({ current, total, done: current >= total });
  }

  onProgress({ current: total, total, done: true });
}