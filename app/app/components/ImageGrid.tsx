import {
  FlatList, View, Text, Image,
  TouchableOpacity, StyleSheet, Dimensions
} from 'react-native';

type ResultItem = {
  uri: string;
  snippet: string;
};

type Props = {
  results: ResultItem[];
  query: string;
  onPress: (uri: string) => void;
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function ImageGrid({ results, query, onPress }: Props) {
  if (results.length === 0) return null;

  return (
    <FlatList
      data={results}
      numColumns={2}
      keyExtractor={(item) => item.uri}
      contentContainerStyle={styles.grid}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPress(item.uri)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.uri }} style={styles.thumb} />
          <View style={styles.snippet}>
            <HighlightedText text={item.snippet} query={query} />
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

// Bolds the matched word inside the snippet
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) {
    return <Text style={styles.snippetText} numberOfLines={2}>{text}</Text>;
  }

  const lower = text.toLowerCase();
  const queryLower = query.toLowerCase().trim();
  const index = lower.indexOf(queryLower);

  if (index === -1) {
    return <Text style={styles.snippetText} numberOfLines={2}>{text}</Text>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <Text style={styles.snippetText} numberOfLines={2}>
      {before}
      <Text style={styles.highlight}>{match}</Text>
      {after}
    </Text>
  );
}

const styles = StyleSheet.create({
  grid: { padding: 12 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  thumb: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    backgroundColor: '#111',
  },
  snippet: {
    padding: 8,
  },
  snippetText: {
    color: '#888',
    fontSize: 12,
    lineHeight: 17,
  },
  highlight: {
    color: '#a89ff5',
    fontWeight: '500',
  },
});