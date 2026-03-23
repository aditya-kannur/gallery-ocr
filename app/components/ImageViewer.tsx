import {
  Modal, View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, SafeAreaView,
  Dimensions, Share, Platform
} from 'react-native';

type Props = {
  uri: string | null;
  extractedText: string;
  onClose: () => void;
};

const { width } = Dimensions.get('window');

export default function ImageViewer({ uri, extractedText, onClose }: Props) {
  if (!uri) return null;

  async function handleShare() {
    try {
      if (Platform.OS === 'web') return;
      await Share.share({
        url: uri!,
        message: extractedText.trim().length > 0
          ? `Text found in image:\n\n${extractedText}`
          : 'Shared from Gallery OCR',
      });
    } catch (err) {
      console.warn('Share failed', err);
    }
  }

  async function handleCopyText() {
    try {
      const Clipboard = await import('expo-clipboard');
      await Clipboard.setStringAsync(extractedText);
    } catch {
      console.warn('Copy not available');
    }
  }

  return (
    <Modal visible={!!uri} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
            <Text style={styles.iconText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Image Text</Text>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <Text style={styles.shareText}>Share</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <Image source={{ uri }} style={styles.image} resizeMode="contain" />

          <View style={styles.textCard}>
            <View style={styles.textCardHeader}>
              <Text style={styles.textLabel}>Text found in image</Text>
              {extractedText.trim().length > 0 && (
                <TouchableOpacity onPress={handleCopyText}>
                  <Text style={styles.copyBtn}>Copy</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.extractedText}>
              {extractedText.trim().length > 0
                ? extractedText
                : 'No text detected in this image'}
            </Text>
          </View>
        </ScrollView>

      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  iconBtn: { width: 52, height: 36, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#888', fontSize: 18 },
  shareText: { color: '#a89ff5', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  image: { width, height: width, backgroundColor: '#111' },
  textCard: {
    margin: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  textCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  textLabel: { color: '#555', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  copyBtn: { color: '#a89ff5', fontSize: 12 },
  extractedText: { color: '#ccc', fontSize: 15, lineHeight: 24 },
});