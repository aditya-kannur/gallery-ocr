import * as SQLite from 'expo-sqlite';

const DB_NAME = 'gallery_ocr.db';
let db: SQLite.SQLiteDatabase;

// Call this once when the app starts
export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);

  // images table — tracks every photo we've seen
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uri TEXT UNIQUE NOT NULL,
      filename TEXT,
      hash TEXT,
      has_text INTEGER DEFAULT 0,
      indexed_at INTEGER,
      created_at INTEGER
    );
  `);

  // FTS5 virtual table — this is what makes search instant
  await db.execAsync(`
    CREATE VIRTUAL TABLE IF NOT EXISTS ocr_text
    USING fts5(
      image_id,
      text_content,
      tokenize = 'unicode61'
    );
  `);
}

// Save a new image record (before OCR runs)
export async function insertImage(
  uri: string,
  filename: string,
  createdAt: number
): Promise<number> {
  const result = await db.runAsync(
    `INSERT OR IGNORE INTO images (uri, filename, created_at) VALUES (?, ?, ?)`,
    [uri, filename, createdAt]
  );
  // If already exists, get its id
  if (result.changes === 0) {
    const row = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM images WHERE uri = ?`, [uri]
    );
    return row?.id ?? -1;
  }
  return result.lastInsertRowId;
}

// After OCR runs, save extracted text + mark image as indexed
export async function saveOcrResult(
  imageId: number,
  uri: string,
  text: string
): Promise<void> {
  await db.runAsync(
    `UPDATE images SET has_text = ?, indexed_at = ? WHERE id = ?`,
    [text.length > 0 ? 1 : 0, Date.now(), imageId]
  );

  if (text.length > 0) {
    await db.runAsync(
      `INSERT INTO ocr_text (image_id, text_content) VALUES (?, ?)`,
      [imageId.toString(), text]
    );
  }
}

// Check if an image was already indexed
export async function isIndexed(uri: string): Promise<boolean> {
  const row = await db.getFirstAsync<{ indexed_at: number | null }>(
    `SELECT indexed_at FROM images WHERE uri = ?`, [uri]
  );
  return row?.indexed_at != null;
}

export type SearchResult = {
  uri: string;
  snippet: string;
};

// THE MAIN SEARCH — runs against FTS5, returns image URIs instantly
export async function searchImages(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const rows = await db.getAllAsync<{ uri: string; text_content: string }>(
    `SELECT i.uri, o.text_content
     FROM images i
     JOIN ocr_text o ON i.id = CAST(o.image_id AS INTEGER)
     WHERE o.text_content MATCH ?
     ORDER BY i.created_at DESC
     LIMIT 50`,
    [query.trim() + '*']
  );

  return rows.map(r => ({
    uri: r.uri,
    snippet: extractSnippet(r.text_content, query),
  }));
}

// Pulls ~60 chars of context around the matched word
function extractSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query.toLowerCase().trim());
  if (index === -1) return text.slice(0, 80);
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + 60);
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

// How many images have been indexed so far
export async function getIndexStats(): Promise<{ total: number; indexed: number }> {
  const total = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM images`
  );
  const indexed = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM images WHERE indexed_at IS NOT NULL`
  );
  return {
    total: total?.count ?? 0,
    indexed: indexed?.count ?? 0,
  };
}

// Get the OCR text for a specific image URI
export async function getTextForImage(uri: string): Promise<string> {
  const row = await db.getFirstAsync<{ text_content: string }>(
    `SELECT o.text_content
     FROM images i
     JOIN ocr_text o ON i.id = CAST(o.image_id AS INTEGER)
     WHERE i.uri = ?`,
    [uri]
  );
  return row?.text_content ?? '';
}

// Wipes all indexed data so re-indexing starts fresh
export async function clearIndex(): Promise<void> {
  await db.execAsync(`DELETE FROM images;`);
  await db.execAsync(`DELETE FROM ocr_text;`);
}

// Save the timestamp of when we last finished indexing
export async function setLastIndexedTime(timestamp: number): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
  `);
  await db.runAsync(
    `INSERT OR REPLACE INTO meta (key, value) VALUES ('last_indexed_at', ?)`,
    [timestamp.toString()]
  );
}

// Get the last indexed timestamp — returns 0 if never indexed before
export async function getLastIndexedTime(): Promise<number> {
  try {
    const row = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM meta WHERE key = 'last_indexed_at'`
    );
    return row ? parseInt(row.value) : 0;
  } catch {
    return 0;
  }
}