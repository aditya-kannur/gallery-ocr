import { View, Text, StyleSheet } from 'react-native';

type Props = {
  type: 'no-results' | 'not-indexed' | 'no-query';
  query?: string;
};

export default function EmptyState({ type, query }: Props) {
  const content = {
    'no-query': {
      icon: '◎',
      title: 'Search your gallery',
      sub: 'Find any image by the text inside it',
    },
    'no-results': {
      icon: '○',
      title: `No results for "${query}"`,
      sub: 'Try a different word or check spelling',
    },
    'not-indexed': {
      icon: '◷',
      title: 'Indexing in progress',
      sub: 'Search will be available once indexing completes',
    },
  }[type];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{content.icon}</Text>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.sub}>{content.sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 36,
    color: '#333',
    marginBottom: 16,
  },
  title: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    color: '#444',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});