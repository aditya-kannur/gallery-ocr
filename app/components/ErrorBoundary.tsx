import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: string;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error) {
    console.warn('App error caught:', error.message);
  }

  handleRetry() {
    this.setState({ hasError: false, error: '' });
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <Text style={styles.icon}>○</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>{this.state.error}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => this.handleRetry()}>
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f', alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 48, color: '#333', marginBottom: 20 },
  title: { color: '#fff', fontSize: 18, fontWeight: '500', marginBottom: 10, textAlign: 'center' },
  message: { color: '#555', fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 30 },
  btn: { backgroundColor: '#2d2a4a', borderRadius: 10, paddingHorizontal: 28, paddingVertical: 12, borderWidth: 1, borderColor: '#7F77DD' },
  btnText: { color: '#a89ff5', fontSize: 14, fontWeight: '500' },
});