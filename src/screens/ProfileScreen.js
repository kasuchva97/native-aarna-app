import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../components/ui/Button';

const ProfileScreen = ({ navigation, route }) => {
  const { onComplete } = route.params || {};

  const [kidName, setKidName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSubmit = async () => {
    if (!kidName.trim() || !fatherName.trim() || !motherName.trim()) {
      setValidationError('Please fill in all three names to continue.');
      return;
    }
    setValidationError('');
    setSaveError('');
    setSaving(true);

    const profileInfo = {
      kidName: kidName.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
    };

    try {
      await AsyncStorage.setItem('balakatha.profile', JSON.stringify(profileInfo));
      if (onComplete) {
        onComplete(profileInfo, navigation);
      } else {
        navigation.replace('Home');
      }
    } catch {
      setSaveError('Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#fbcfe8', '#e9d5ff', '#bfdbfe']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.emoji}>🌟</Text>
                <Text style={styles.title}>Welcome to BalaKatha!</Text>
                <Text style={styles.subtitle}>Let's personalize your magical adventure.</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Kid's Name</Text>
                  <TextInput
                    style={styles.input}
                    value={kidName}
                    onChangeText={(t) => { setKidName(t); setValidationError(''); }}
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
                    onChangeText={(t) => { setFatherName(t); setValidationError(''); }}
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
                    onChangeText={(t) => { setMotherName(t); setValidationError(''); }}
                    placeholder="e.g., Lahari"
                    placeholderTextColor="#a8a29e"
                    maxLength={30}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {validationError ? (
                  <Text style={styles.errorText}>{validationError}</Text>
                ) : null}

                {saveError ? (
                  <Text style={styles.errorText}>{saveError}</Text>
                ) : null}

                {saving ? (
                  <View style={styles.savingContainer}>
                    <ActivityIndicator color="#9333ea" />
                    <Text style={styles.savingText}>Saving...</Text>
                  </View>
                ) : (
                  <Button
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    colors={['#ec4899', '#9333ea']}
                  >
                    Start Magic Journey ✨
                  </Button>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 4,
    borderColor: '#d8b4fe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  header: { alignItems: 'center', marginBottom: 30 },
  emoji: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#9333ea', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#4b5563', textAlign: 'center' },
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
  savingContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  savingText: { marginLeft: 10, color: '#9333ea', fontSize: 16, fontWeight: '600' },
  submitButton: { marginTop: 10 },
});

export default ProfileScreen;
