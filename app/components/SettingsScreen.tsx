import { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Platform
} from 'react-native';
import { getIndexStats, clearIndex } from '../lib/database';
import { indexGallery, forceFullReIndex, IndexingProgress } from '../lib/ocr';


type Props = {
  onReindexStart: (progress: IndexingProgress) => void;
};

export default function SettingsScreen({ onReindexStart }: Props) {
  const [stats, setStats] = useState({ total: 0, indexed: 0 });
  const [isReindexing, setIsReindexing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  async function refreshStats() {
    const s = await getIndexStats();
    setStats(s);
    setLastRefreshed(new Date().toLocaleTimeString());
  }

  // Call refreshStats when screen mounts
  useState(() => { refreshStats(); });

  async function handleReindex() {
    Alert.alert(
      'Re-index Gallery',
      'This will clear all existing index data and re-scan your entire gallery. This may take a while.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Re-index',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS === 'web') {
              Alert.alert('Not available on web', 'Re-indexing only works on device.');
              return;
            }
            setIsReindexing(true);
            await clearIndex();
            forceFullReIndex((p) => {
              onReindexStart(p);
              if (p.done) {
                setIsReindexing(false);
                refreshStats();
              }
            });
          }
        }
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Stats card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Index Stats</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total images</Text>
          <Text style={styles.statValue}>{stats.total}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Indexed</Text>
          <Text style={styles.statValue}>{stats.indexed}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>With text</Text>
          <Text style={[styles.statValue, { color: '#a89ff5' }]}>
            {stats.indexed}
          </Text>
        </View>

        <TouchableOpacity onPress={refreshStats} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>↻  Refresh stats</Text>
          {lastRefreshed ? <Text style={styles.refreshSub}>Last updated {lastRefreshed}</Text> : null}
        </TouchableOpacity>
      </View>

      {/* Re-index button */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Re-index Gallery</Text>
        <Text style={styles.cardDesc}>
          Use this if you think some images were missed, or if you want to clear and rebuild the entire index from scratch.
        </Text>
        <TouchableOpacity
          style={[styles.reindexBtn, isReindexing && styles.reindexBtnDisabled]}
          onPress={handleReindex}
          disabled={isReindexing}
        >
          <Text style={styles.reindexText}>
            {isReindexing ? 'Re-indexing...' : 'Clear & Re-index'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* About card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardDesc}>
          Gallery OCR scans your photos for text using on-device ML — nothing leaves your phone.
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  title: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginTop: 20, marginHorizontal: 16, marginBottom: 20 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, marginHorizontal: 16, marginBottom: 16, padding: 16, borderWidth: 1, borderColor: '#2a2a2a' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '500', marginBottom: 12 },
  cardDesc: { color: '#555', fontSize: 13, lineHeight: 20 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  statLabel: { color: '#888', fontSize: 14 },
  statValue: { color: '#fff', fontSize: 14, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#2a2a2a' },
  refreshBtn: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#2a2a2a' },
  refreshText: { color: '#a89ff5', fontSize: 13 },
  refreshSub: { color: '#444', fontSize: 11, marginTop: 3 },
  reindexBtn: { marginTop: 14, backgroundColor: '#2a1a1a', borderRadius: 8, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#5a2a2a' },
  reindexBtnDisabled: { opacity: 0.4 },
  reindexText: { color: '#e06060', fontSize: 14, fontWeight: '500' },
});