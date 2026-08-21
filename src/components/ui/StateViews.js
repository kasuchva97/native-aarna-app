import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export const LoadingState = ({ message = 'Loading...', isDark = false, size = 'large' }) => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size={size} color={isDark ? '#c084fc' : '#7e22ce'} />
    {message ? (
      <Text style={[styles.loadingText, isDark && styles.darkText]}>{message}</Text>
    ) : null}
  </View>
);

export const ErrorState = ({
  title = "Couldn't load content",
  message = 'Check your connection and try again.',
  emoji = '😔',
  onRetry,
  retryLabel = 'Try Again',
  isDark = false,
}) => (
  <View style={styles.centerContainer}>
    <Text style={styles.stateEmoji}>{emoji}</Text>
    <Text style={[styles.stateTitle, isDark && styles.darkText]}>{title}</Text>
    {message ? (
      <Text style={[styles.stateSubtitle, isDark && styles.darkTextSecondary]}>{message}</Text>
    ) : null}
    {onRetry ? (
      <TouchableOpacity style={styles.retryButton} onPress={onRetry} activeOpacity={0.85}>
        <Text style={styles.retryText}>{retryLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

export const EmptyState = ({
  title = 'Coming Soon!',
  message = 'New stories are being added soon.',
  emoji = '🚧',
  isDark = false,
}) => (
  <View style={styles.centerContainer}>
    <Text style={styles.stateEmoji}>{emoji}</Text>
    <Text style={[styles.stateTitle, isDark && styles.darkText]}>{title}</Text>
    <Text style={[styles.stateSubtitle, isDark && styles.darkTextSecondary]}>{message}</Text>
  </View>
);

export const SuccessBanner = ({ message = 'Successfully saved!', isDark = false }) => (
  <View style={[styles.successBanner, isDark && styles.darkSuccessBanner]}>
    <Text style={styles.successIcon}>✓</Text>
    <Text style={[styles.successText, isDark && styles.darkSuccessText]}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 17,
    fontWeight: '700',
    color: '#7e22ce',
    textAlign: 'center',
  },
  stateEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  stateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#9333ea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  darkText: {
    color: '#f3e8ff',
  },
  darkTextSecondary: {
    color: '#cbd5e1',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  darkSuccessBanner: {
    backgroundColor: '#064e3b',
    borderColor: '#059669',
  },
  successIcon: {
    color: '#16a34a',
    fontWeight: 'bold',
    fontSize: 18,
  },
  successText: {
    color: '#15803d',
    fontWeight: '600',
    fontSize: 15,
  },
  darkSuccessText: {
    color: '#a7f3d0',
  },
});
