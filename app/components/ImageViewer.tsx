import {
  Modal, View, Text, Image, ScrollView,
  TouchableOpacity, StyleSheet, SafeAreaView, Dimensions
} from 'react-native';

type Props = {
  uri: string | null;
  extractedText: string;
  onClose: () => void;
};

const { width } = Dimensions.get('window');

export default function ImageViewer({ uri, extractedText, onClose }: Props) {
  if (!uri) return null;

  return (
    <Modal visible={!!uri} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Image Text</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView>
          {/* Full image */}
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="contain"
          />

          {/* Extracted text */}
          <View style={styles.textCard}>
            <Text style={styles.textLabel}>Text found in this image</Text>
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
  closeBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#888', fontSize: 18 },
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
  textLabel: { color: '#555', fontSize: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  extractedText: { color: '#ccc', fontSize: 15, lineHeight: 24 },
});