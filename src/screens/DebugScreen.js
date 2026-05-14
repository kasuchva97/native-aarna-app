import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { usePostHog } from 'posthog-react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import LinearGradient from 'react-native-linear-gradient';

const DebugScreen = ({ navigation }) => {
  const posthog = usePostHog();

  const testPostHogEvent = () => {
    console.log('Capturing PostHog event...');
    posthog.capture('test_event_captured', {
      timestamp: new Date().toISOString(),
      source: 'DebugScreen',
      status: 'testing',
    });
    alert('PostHog event captured!');
  };

  const testCrashlyticsLog = () => {
    console.log('Sending Crashlytics log...');
    crashlytics().log('DebugScreen: Testing custom log');
    alert('Crashlytics log sent!');
  };

  const testCrashlyticsError = () => {
    console.log('Recording Crashlytics non-fatal error...');
    crashlytics().recordError(new Error('Test Non-Fatal Error from Debug Screen'));
    alert('Crashlytics non-fatal error recorded!');
  };

  const triggerNativeCrash = () => {
    console.log('Triggering native crash...');
    // This will crash the app immediately.
    crashlytics().crash();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Debug & Testing</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PostHog Analytics</Text>
            <TouchableOpacity style={styles.button} onPress={testPostHogEvent}>
              <Text style={styles.buttonText}>Capture Test Event</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Firebase Crashlytics</Text>
            <TouchableOpacity style={styles.button} onPress={testCrashlyticsLog}>
              <Text style={styles.buttonText}>Send Custom Log</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={testCrashlyticsError}>
              <Text style={styles.buttonText}>Record Non-Fatal Error</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={triggerNativeCrash}>
              <Text style={styles.buttonText}>🔥 Trigger Native Crash</Text>
            </TouchableOpacity>
            <Text style={styles.note}>Note: Triggering a crash will close the app. Re-open it to see the report in Firebase Console (may take a few minutes).</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#4ecca3',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4ecca3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  warningButton: {
    backgroundColor: '#f39c12',
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default DebugScreen;
