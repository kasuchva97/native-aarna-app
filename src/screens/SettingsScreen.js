import React, { useState, useEffect } from 'react';
import DeviceInfo from 'react-native-device-info';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileStore } from '../store/profileStore';
import { Button } from '../components/ui/Button';
import { SuccessBanner } from '../components/ui/StateViews';

const SettingsScreen = ({ navigation }) => {
  const { profile, updateProfile, theme } = useProfileStore();
  const [kidName, setKidName] = useState(profile?.kidName || '');
  const [fatherName, setFatherName] = useState(profile?.fatherName || '');
  const [motherName, setMotherName] = useState(profile?.motherName || '');
  const [language, setLanguage] = useState(profile?.language || 'en');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    Promise.all([DeviceInfo.getVersion(), DeviceInfo.getBuildNumber()])
      .then(([version, build]) => setAppVersion(`v${version} (${build})`));
  }, []);

  const hasChanges =
    kidName.trim() !== (profile?.kidName || '') ||
    fatherName.trim() !== (profile?.fatherName || '') ||
    motherName.trim() !== (profile?.motherName || '') ||
    language !== (profile?.language || 'en');

  const handleSave = async () => {
    if (!kidName.trim() || !fatherName.trim() || !motherName.trim()) {
      setError('All three names are required.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await updateProfile({
        kidName: kidName.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        language,
      });
      setSaved(true);
      setTimeout(() => navigation.goBack(), 700);
    } catch {
      setError('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <LinearGradient colors={isDark ? ['#3b0764', '#1c1133'] : ['#7e22ce', '#9333ea']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} disabled={saving}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Settings</Text>
        <View style={styles.backButton} />
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sectionNote, isDark && styles.darkTextSecondary]}>
            Personalize names and settings for your stories and narration.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Kid's Name</Text>
              <TextInput
                style={[styles.input, isDark && styles.darkInput, saving && { opacity: 0.6 }]}
                value={kidName}
                onChangeText={(t) => { setKidName(t); setError(''); setSaved(false); }}
                placeholder="e.g., Aarna"
                placeholderTextColor={isDark ? '#94a3b8' : '#a8a29e'}
                maxLength={30}
                returnKeyType="next"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Father's Name</Text>
              <TextInput
                style={[styles.input, isDark && styles.darkInput, saving && { opacity: 0.6 }]}
                value={fatherName}
                onChangeText={(t) => { setFatherName(t); setError(''); setSaved(false); }}
                placeholder="e.g., Ram"
                placeholderTextColor={isDark ? '#94a3b8' : '#a8a29e'}
                maxLength={30}
                returnKeyType="next"
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Mother's Name</Text>
              <TextInput
                style={[styles.input, isDark && styles.darkInput, saving && { opacity: 0.6 }]}
                value={motherName}
                onChangeText={(t) => { setMotherName(t); setError(''); setSaved(false); }}
                placeholder="e.g., Lahari"
                placeholderTextColor={isDark ? '#94a3b8' : '#a8a29e'}
                maxLength={30}
                returnKeyType="done"
                onSubmitEditing={handleSave}
                editable={!saving}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, isDark && styles.darkLabel]}>Narration Language</Text>
              <View style={styles.langSelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.langSelectorOpt,
                    isDark && styles.darkSelectorOpt,
                    language === 'en' && styles.langSelectorOptSelected,
                    isDark && language === 'en' && styles.darkSelectorOptSelected
                  ]}
                  onPress={() => { setLanguage('en'); setSaved(false); }}
                  disabled={saving}
                >
                  <Text style={styles.langOptEmoji}>🇮🇳</Text>
                  <Text style={[
                    styles.langOptText,
                    isDark && styles.darkTextSecondary,
                    language === 'en' && styles.langOptTextSelected,
                    isDark && language === 'en' && styles.darkText
                  ]}>English</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.langSelectorOpt,
                    isDark && styles.darkSelectorOpt,
                    language === 'te' && styles.langSelectorOptSelected,
                    isDark && language === 'te' && styles.darkSelectorOptSelected
                  ]}
                  onPress={() => { setLanguage('te'); setSaved(false); }}
                  disabled={saving}
                >
                  <Text style={styles.langOptEmoji}>🌺</Text>
                  <Text style={[
                    styles.langOptText,
                    isDark && styles.darkTextSecondary,
                    language === 'te' && styles.langOptTextSelected,
                    isDark && language === 'te' && styles.darkText
                  ]}>తెలుగు</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {saved ? (
              <SuccessBanner message="Settings saved successfully!" isDark={isDark} />
            ) : null}

            {saving ? (
              <View style={styles.savingRow}>
                <ActivityIndicator color={isDark ? '#c084fc' : '#9333ea'} />
                <Text style={[styles.savingText, isDark && styles.darkTextSecondary]}>Saving...</Text>
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

      <View style={styles.versionBottomContainer}>
        <Text style={styles.versionText}>BalaKatha {appVersion}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffdf9' },
  darkContainer: { backgroundColor: '#120b24' },
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
  content: { padding: 24, paddingBottom: 80 },
  sectionNote: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  darkTextSecondary: {
    color: '#cbd5e1',
  },
  darkText: {
    color: '#f3e8ff',
  },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#7e22ce', marginBottom: 8 },
  darkLabel: { color: '#c084fc' },
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
  darkInput: {
    backgroundColor: '#160e29',
    borderColor: 'rgba(147, 51, 234, 0.2)',
    color: '#f3e8ff',
  },
  langSelectorRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  langSelectorOpt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    backgroundColor: '#fff',
  },
  darkSelectorOpt: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  langSelectorOptSelected: {
    borderColor: '#7e22ce',
    backgroundColor: '#ede9fe',
  },
  darkSelectorOptSelected: {
    borderColor: '#c084fc',
    backgroundColor: '#3b0764',
  },
  langOptEmoji: {
    fontSize: 18,
  },
  langOptText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
  langOptTextSelected: {
    color: '#7e22ce',
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
  versionBottomContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: { fontSize: 13, color: '#9ca3af' },
});

export default SettingsScreen;
