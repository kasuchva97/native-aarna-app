import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';

const getUserFriendlyErrorMessage = (error) => {
  if (!error) return 'An unexpected glitch occurred while loading. Please tap below to try again!';

  const msg = error.toString().toLowerCase();

  if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout') || msg.includes('connection')) {
    return 'We had trouble connecting to our servers. Please check your internet connection and try again.';
  }
  if (msg.includes('storage') || msg.includes('keystore') || msg.includes('space')) {
    return 'We ran into a small issue saving your data. Please check your device storage and try again.';
  }
  if (msg.includes('audio') || msg.includes('sound') || msg.includes('tts')) {
    return 'We had trouble playing the story audio. Please try again in a moment.';
  }

  return 'An unexpected glitch occurred while preparing your experience. Please tap below to refresh!';
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);

    // 1. Report to Firebase Crashlytics
    try {
      crashlytics().recordError(error);
    } catch (e) {
      // ignore if crashlytics is unavailable
    }

    // 2. Report to PostHog Analytics & Session Replay
    try {
      if (this.props.posthog) {
        this.props.posthog.capture('$exception', {
          $exception_message: error?.message || error?.toString(),
          $exception_type: error?.name || 'Error',
          $exception_stack_trace_raw: error?.stack || '',
          componentStack: errorInfo?.componentStack || '',
        });
      }
    } catch (e) {
      // ignore if posthog is unavailable
    }
  }

  render() {
    if (this.state.hasError) {
      const userMessage = __DEV__
        ? 'A developer error occurred during render.'
        : getUserFriendlyErrorMessage(this.state.error);

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.subtitle}>{userMessage}</Text>

          {__DEV__ && this.state.error && (
            <ScrollView style={styles.debugErrorBox} contentContainerStyle={styles.debugErrorBoxContent}>
              <Text style={styles.debugErrorLabel}>[Developer Mode Diagnostics]</Text>
              <Text style={styles.debugErrorText}>
                {this.state.error.toString()}
              </Text>
            </ScrollView>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.buttonText}>Try Again 🔄</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffdf9', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7e22ce', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#4b5563', textAlign: 'center', marginBottom: 24, lineHeight: 24 },
  debugErrorBox: {
    maxHeight: 140,
    width: '100%',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 24,
  },
  debugErrorBoxContent: { padding: 12 },
  debugErrorLabel: { color: '#991b1b', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  debugErrorText: { color: '#991b1b', fontSize: 12, fontFamily: 'monospace' },
  button: { backgroundColor: '#9333ea', paddingHorizontal: 36, paddingVertical: 14, borderRadius: 24 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default ErrorBoundary;
