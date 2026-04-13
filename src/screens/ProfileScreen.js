import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from '../components/ui/Button';

const ProfileScreen = ({ navigation, route }) => {
  const { onComplete } = route.params || {};

  const [kidName, setKidName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');

  const handleSubmit = async () => {
    if (kidName && fatherName && motherName) {
      const profileInfo = { kidName, fatherName, motherName };
      try {
        await AsyncStorage.setItem('aarnaAppProfile', JSON.stringify(profileInfo));
        if (onComplete) {
            onComplete(profileInfo, navigation);
        } else {
            navigation.replace('Home');
        }
      } catch (error) {
        console.error('Failed to save profile', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#fbcfe8', '#e9d5ff', '#bfdbfe']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.emoji}>🌟</Text>
                <Text style={styles.title}>Welcome to Storybook!</Text>
                <Text style={styles.subtitle}>Let's personalize your magical adventure.</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Kid's Name</Text>
                  <TextInput
                    style={styles.input}
                    value={kidName}
                    onChangeText={setKidName}
                    placeholder="e.g., Aarna"
                    placeholderTextColor="#a8a29e"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Father's Name</Text>
                  <TextInput
                    style={styles.input}
                    value={fatherName}
                    onChangeText={setFatherName}
                    placeholder="e.g., Ram"
                    placeholderTextColor="#a8a29e"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mother's Name</Text>
                  <TextInput
                    style={styles.input}
                    value={motherName}
                    onChangeText={setMotherName}
                    placeholder="e.g., Lahari"
                    placeholderTextColor="#a8a29e"
                  />
                </View>

                <Button 
                  onPress={handleSubmit} 
                  style={styles.submitButton}
                  colors={['#ec4899', '#9333ea']}
                >
                  Start Magic Journey ✨
                </Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#9333ea',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7e22ce',
    marginBottom: 8,
  },
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
  submitButton: {
    marginTop: 10,
  },
});

export default ProfileScreen;
