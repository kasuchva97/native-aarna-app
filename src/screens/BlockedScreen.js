import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, BackHandler } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MESSAGES = {
  rooted: {
    icon: '🔓',
    title: 'Device Not Secure',
    body: 'BalaKatha detected that your device is rooted. To protect your child\'s data and our content, the app cannot run on rooted devices.',
  },
  emulator: {
    icon: '🖥️',
    title: 'Emulator Detected',
    body: 'BalaKatha cannot run on emulators or simulators. Please install the app on a real device.',
  },
};

const BlockedScreen = ({ reason = 'rooted' }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // Disable Android back button — user cannot bypass this screen
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const { icon, title, body } = MESSAGES[reason] || MESSAGES.rooted;

  return (
    <LinearGradient colors={['#1c1917', '#292524', '#1c1917']} style={styles.container}>
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
        <View style={styles.divider} />
        <Text style={styles.footer}>
          If you believe this is a mistake, please contact{'\n'}
          <Text style={styles.email}>support@balakatha.app</Text>
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: '#292524',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ef4444',
    width: '100%',
  },
  icon: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fef2f2', textAlign: 'center', marginBottom: 16 },
  body: { fontSize: 15, color: '#d1d5db', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
  divider: { width: '100%', height: 1, backgroundColor: '#44403c', marginBottom: 20 },
  footer: { fontSize: 13, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
  email: { color: '#f87171', fontWeight: '600' },
});

export default BlockedScreen;
