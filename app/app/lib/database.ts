import * as SQLite from 'expo-sqlite';

const DB_NAME = 'gallery_ocr.db';
let db: SQLite.SQLiteDatabase;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);

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

  await db.execAsync(`
    CREATE VIRTUAL TABLE IF NOT EXISTS ocr_text
    USING fts5(
      image_id,
      text_content,
      tokenize = 'unicode61'
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT);
  `);

  await initHistoryTable();
}

export async function insertImage(
  uri: string,
  filename: string,
  createdAt: number
): Promise<number> {
  const result = await db.runAsync(
    `INSERT OR IGNORE INTO images (uri, filename, created_at) VALUES (?, ?, ?)`,
    [uri, filename, createdAt]
  );
  if (result.changes === 0) {
    const row = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM images WHERE uri = ?`, [uri]
    );
    return row?.id ?? -1;
  }
  return result.lastInsertRowId;
}

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

export type SortOption = 'newest' | 'oldest' | 'most_text';
export type DateFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'this_year';

function getDateThreshold(filter: DateFilter): number {
  const now = Date.now();
  const day = 86400000;
  switch (filter) {
    case 'today':      return now - day;
    case 'this_week':  return now - day * 7;
    case 'this_month': return now - day * 30;
    case 'this_year':  return now - day * 365;
    default:           return 0;
  }
}

export async function searchImages(
  query: string,
  sort: SortOption = 'newest',
  dateFilter: DateFilter = 'all'
): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const threshold = getDateThreshold(dateFilter);

  const orderBy = sort === 'newest' ? 'i.created_at DESC'
    : sort === 'oldest' ? 'i.created_at ASC'
    : 'length(o.text_content) DESC';

  const rows = await db.getAllAsync<{ uri: string; text_content: string }>(
    `SELECT i.uri, o.text_content
     FROM images i
     JOIN ocr_text o ON i.id = CAST(o.image_id AS INTEGER)
     WHERE o.text_content MATCH ?
     ${threshold > 0 ? 'AND i.created_at > ' + threshold : ''}
     ORDER BY ${orderBy}
     LIMIT 50`,
    [query.trim() + '*']
  );

  return rows.map(r => ({
    uri: r.uri,
    snippet: extractSnippet(r.text_content, query),
  }));
}

function extractSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query.toLowerCase().trim());
  if (index === -1) return text.slice(0, 80);
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + 60);
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

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

export async function clearIndex(): Promise<void> {
  await db.execAsync(`DELETE FROM images;`);
  await db.execAsync(`DELETE FROM ocr_text;`);
}

export async function setLastIndexedTime(timestamp: number): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO meta (key, value) VALUES ('last_indexed_at', ?)`,
    [timestamp.toString()]
  );
}

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

async function initHistoryTable(): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT UNIQUE NOT NULL,
      searched_at INTEGER NOT NULL
    );
  `);
}

export async function saveSearchQuery(query: string): Promise<void> {
  await db.runAsync(
    `INSERT OR REPLACE INTO search_history (query, searched_at) VALUES (?, ?)`,
    [query.trim(), Date.now()]
  );
}

export async function getSearchHistory(): Promise<string[]> {
  const rows = await db.getAllAsync<{ query: string }>(
    `SELECT query FROM search_history ORDER BY searched_at DESC LIMIT 10`
  );
  return rows.map(r => r.query);
}

export async function deleteSearchQuery(query: string): Promise<void> {
  await db.runAsync(
    `DELETE FROM search_history WHERE query = ?`,
    [query.trim()]
  );
}

export async function clearSearchHistory(): Promise<void> {
  await db.execAsync(`DELETE FROM search_history;`);
}