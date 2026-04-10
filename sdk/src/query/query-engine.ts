export function matchesQuery(text: string, query: string): boolean {
  if (!query.trim()) return false;
  return text.toLowerCase().includes(query.toLowerCase().trim());
}

export function extractSnippet(text: string, query: string): string {
  const lower = text.toLowerCase();
  const index = lower.indexOf(query.toLowerCase().trim());
  if (index === -1) return text.slice(0, 80);
  const start = Math.max(0, index - 30);
  const end = Math.min(text.length, index + 60);
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}