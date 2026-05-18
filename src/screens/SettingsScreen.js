import React, { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../components/ui/Button';

const SettingsScreen = ({ navigation, profile, onProfileUpdate }) => {
  const [kidName, setKidName] = useState(profile?.kidName || '');
  const [fatherName, setFatherName] = useState(profile?.fatherName || '');
  const [motherName, setMotherName] = useState(profile?.motherName || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    Promise.all([DeviceInfo.getVersion(), DeviceInfo.getBuildNumber()])
      .then(([version, build]) => setAppVersion(`v${version} (${build})`));
  }, []);

  const hasChanges =
    kidName.trim() !== (profile?.kidName || '') ||
    fatherName.trim() !== (profile?.fatherName || '') ||
    motherName.trim() !== (profile?.motherName || '');

  const handleSave = async () => {
    if (!kidName.trim() || !fatherName.trim() || !motherName.trim()) {
      setError('All three names are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const updated = {
        kidName: kidName.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
      };
      await AsyncStorage.setItem('balakatha.profile', JSON.stringify(updated));
      onProfileUpdate(updated);
      setSaved(true);
      setTimeout(() => navigation.goBack(), 800);
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#7e22ce', '#9333ea']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Names</Text>
        <View style={styles.backButton} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.sectionNote}>
            These names appear throughout your stories and adventures.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kid's Name</Text>
              <TextInput
                style={styles.input}
                value={kidName}
                onChangeText={(t) => { setKidName(t); setError(''); setSaved(false); }}
                placeholder="e.g., Aarna"
                placeholderTextColor="#a8a29e"
                maxLength={30}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Father's Name</Text>
              <TextInput
                style={styles.input}
                value={fatherName}
                onChangeText={(t) => { setFatherName(t); setError(''); setSaved(false); }}
                placeholder="e.g., Ram"
                placeholderTextColor="#a8a29e"
                maxLength={30}
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mother's Name</Text>
              <TextInput
                style={styles.input}
                value={motherName}
                onChangeText={(t) => { setMotherName(t); setError(''); setSaved(false); }}
                placeholder="e.g., Lahari"
                placeholderTextColor="#a8a29e"
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSave}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {saved ? (
              <View style={styles.savedBanner}>
                <Text style={styles.savedText}>✓ Names saved successfully!</Text>
              </View>
            ) : null}

            <View style={styles.versionRow}>
              <Text style={styles.versionText}>BalaKatha {appVersion}</Text>
            </View>

            {saving ? (
              <View style={styles.savingRow}>
                <ActivityIndicator color="#9333ea" />
                <Text style={styles.savingText}>Saving...</Text>
              </View>
            ) : (
              <Button
                onPress={handleSave}
                colors={hasChanges ? ['#7e22ce', '#9333ea'] : ['#c4b5fd', '#c4b5fd']}
              >
                Save Changes
              </Button>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffdf9' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: { width: 40, alignItems: 'center' },
  backArrow: { fontSize: 24, color: 'white', fontWeight: 'bold' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  content: { padding: 24, paddingBottom: 48 },
  sectionNote: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#7e22ce', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e9d5ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1f2937',
  },
  errorText: { color: '#dc2626', fontSize: 14, textAlign: 'center', marginBottom: 12, fontWeight: '500' },
  savedBanner: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  savedText: { color: '#16a34a', fontWeight: '600', fontSize: 15 },
  savingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  savingText: { marginLeft: 10, color: '#9333ea', fontSize: 16, fontWeight: '600' },
  versionRow: { alignItems: 'center', marginBottom: 16 },
  versionText: { fontSize: 13, color: '#9ca3af' },
});

export default SettingsScreen;
