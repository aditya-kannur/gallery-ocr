import {
  View, Text, TouchableOpacity,
  FlatList, StyleSheet
} from 'react-native';

type Props = {
  history: string[];
  onSelect: (query: string) => void;
  onDelete: (query: string) => void;
  onClearAll: () => void;
};

export default function SearchHistory({
  history, onSelect, onDelete, onClearAll
}: Props) {
  if (history.length === 0) return null;

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Recent searches</Text>
        <TouchableOpacity onPress={onClearAll}>
          <Text style={styles.clearAll}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.queryBtn}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.clockIcon}>↺</Text>
              <Text style={styles.queryText}>{item}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(item)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    color: '#555',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  clearAll: {
    color: '#a89ff5',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },
  queryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clockIcon: {
    color: '#444',
    fontSize: 14,
  },
  queryText: {
    color: '#888',
    fontSize: 15,
  },
  deleteBtn: {
    padding: 6,
  },
  deleteText: {
    color: '#333',
    fontSize: 13,
  },
});