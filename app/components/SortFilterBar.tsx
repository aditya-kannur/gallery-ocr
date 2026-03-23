import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export type SortOption = 'newest' | 'oldest' | 'most_text';
export type DateFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'this_year';

type Props = {
  sort: SortOption;
  dateFilter: DateFilter;
  onSortChange: (sort: SortOption) => void;
  onDateFilterChange: (filter: DateFilter) => void;
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most_text', label: 'Most text' },
];

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'All time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'this_year', label: 'This year' },
];

export default function SortFilterBar({
  sort, dateFilter, onSortChange, onDateFilterChange
}: Props) {
  return (
    <View style={styles.container}>

      {/* Sort row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        <Text style={styles.label}>Sort</Text>
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pill, sort === opt.value && styles.pillActive]}
            onPress={() => onSortChange(opt.value)}
          >
            <Text style={[styles.pillText, sort === opt.value && styles.pillTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Date filter row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.row}>
        <Text style={styles.label}>Date</Text>
        {DATE_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.pill, dateFilter === opt.value && styles.pillActive]}
            onPress={() => onDateFilterChange(opt.value)}
          >
            <Text style={[styles.pillText, dateFilter === opt.value && styles.pillTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 8 },
  row: { paddingHorizontal: 16, marginBottom: 6 },
  label: {
    color: '#444',
    fontSize: 12,
    marginRight: 8,
    alignSelf: 'center',
    minWidth: 30,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginRight: 6,
    backgroundColor: '#1a1a1a',
  },
  pillActive: {
    backgroundColor: '#2d2a4a',
    borderColor: '#7F77DD',
  },
  pillText: {
    color: '#555',
    fontSize: 13,
  },
  pillTextActive: {
    color: '#a89ff5',
  },
});