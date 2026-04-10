import type { DateFilter, SortOption } from '../types';

export function getDateThreshold(filter: DateFilter): number {
  const now = Date.now();
  const day = 86400000;
  switch (filter) {
    case 'today': return now - day;
    case 'this_week': return now - day * 7;
    case 'this_month': return now - day * 30;
    case 'this_year': return now - day * 365;
    default: return 0;
  }
}

export function getSortComparator(sort: SortOption) {
  switch (sort) {
    case 'newest': return (a: number, b: number) => b - a;
    case 'oldest': return (a: number, b: number) => a - b;
    case 'most_text': return (a: number, b: number) => b - a;
  }
}