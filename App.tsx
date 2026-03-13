import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Image,
  StyleSheet, SafeAreaView, TouchableOpacity, Platform
} from 'react-native';
import { indexGallery, IndexingProgress } from './app/lib/ocr';
import ImageViewer from './app/components/ImageViewer';
import ImageGrid from './app/components/ImageGrid';
import { initDatabase, searchImages, getIndexStats, getTextForImage, SearchResult } from './app/lib/database';


export default function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [progress, setProgress] = useState<IndexingProgress | null>(null);
  const [stats, setStats] = useState({ total: 0, indexed: 0 });
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    async function setup() {
      await initDatabase();
      const s = await getIndexStats();
      setStats(s);

      // Only run indexer on device, not web
      if (Platform.OS !== 'web') {
        indexGallery((p) => {
          setProgress(p);
          if (p.done) {
            getIndexStats().then(setStats);
            setProgress(null);
          }
        });
      }
    }
    setup().catch(console.error);
  }, []);

  // Run search whenever query changes
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    searchImages(query).then(setResults).catch(console.error);
  }, [query]);

  const statusText = () => {
    if (progress) return `Indexing... ${progress.current} / ${progress.total}`;
    if (stats.indexed > 0) return `${stats.indexed} images indexed`;
    return 'Type to search your gallery';
  };


  async function handleImagePress(uri: string) {
  const text = await getTextForImage(uri);
  setSelectedText(text);
  setSelectedUri(uri);
}

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gallery OCR</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search text in images..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.statusText}>{statusText()}</Text>

      {/* Progress bar — shows while indexing */}
      {progress && (
        <View style={styles.progressTrack}>
          <View style={[
            styles.progressFill,
            { width: `${(progress.current / progress.total) * 100}%` }
          ]} />
        </View>
      )}

      <ImageGrid
  results={results}
  query={query}
  onPress={handleImagePress}
/>
      <ImageViewer
  uri={selectedUri}
  extractedText={selectedText}
  onClose={() => setSelectedUri(null)}
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 20, marginHorizontal: 16, marginBottom: 12 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e1e1e', borderRadius: 12, marginHorizontal: 16, paddingHorizontal: 14, marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 12 },
  clearBtn: { padding: 6 },
  clearText: { color: '#666', fontSize: 14 },
  statusText: { color: '#555', fontSize: 13, marginHorizontal: 16, marginBottom: 6 },
  progressTrack: { height: 3, backgroundColor: '#222', marginHorizontal: 16, borderRadius: 2, marginBottom: 10 },
  progressFill: { height: 3, backgroundColor: '#7F77DD', borderRadius: 2 },
  thumb: { width: '33.3%', aspectRatio: 1, padding: 1, backgroundColor: '#1a1a1a' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#444', fontSize: 15 },
});