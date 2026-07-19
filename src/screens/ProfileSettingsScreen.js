import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useProfileStore } from '../store/profileStore';
import LinearGradient from 'react-native-linear-gradient';

const ProfileSettingsScreen = ({ navigation }) => {
  const { profile, theme, updateProfile, toggleTheme, clearProfile, quizScores } = useProfileStore();

  const [kidName, setKidName] = useState(profile?.kidName ?? '');
  const [fatherName, setFatherName] = useState(profile?.fatherName ?? '');
  const [motherName, setMotherName] = useState(profile?.motherName ?? '');
  const [gender, setGender] = useState(profile?.gender ?? 'boy');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isDark = theme === 'dark';
  const totalStars = Object.values(quizScores).reduce((acc, score) => acc + score, 0);

  useEffect(() => {
    if (profile) {
      setKidName(profile.kidName ?? '');
      setFatherName(profile.fatherName ?? '');
      setMotherName(profile.motherName ?? '');
      setGender(profile.gender ?? 'boy');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!kidName.trim() || !fatherName.trim() || !motherName.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all names.');
      return;
    }
    await updateProfile({
      kidName: kidName.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      gender,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to clear your profile, quizzes, and earned badges? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset Everything', 
          style: 'destructive',
          onPress: async () => {
            await clearProfile();
            navigation.replace('Onboarding');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]} contentContainerStyle={styles.scrollContent}>
      
      {/* Profile Header Card */}
      <LinearGradient
        colors={isDark ? ['#3b0764', '#1c1133'] : ['#ec4899', '#9333ea']}
        style={styles.profileHeader}
      >
        <Text style={styles.avatarEmoji}>{gender === 'boy' ? '🦁' : '🦄'}</Text>
        <Text style={styles.profileTitle}>{profile?.kidName ?? 'Young Reader'}</Text>
        <Text style={styles.profileSubtitle}>BalaKatha Adventurer • ⭐ {totalStars} Stars</Text>
      </LinearGradient>

      {/* Bedtime Theme Toggle Option */}
      <View style={[styles.settingsGroup, isDark && styles.darkSettingsGroup]}>
        <View style={styles.settingsRow}>
          <View style={styles.settingsLabelContainer}>
            <Text style={[styles.settingsRowEmoji]}>🌙</Text>
            <View>
              <Text style={[styles.settingsRowTitle, isDark && styles.darkText]}>Bedtime Dark Mode</Text>
              <Text style={styles.settingsRowSub}>Warm colors to protect eyes at night</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#cbd5e1', true: '#a855f7' }}
            thumbColor={isDark ? '#d8b4fe' : '#f1f5f9'}
          />
        </View>
      </View>

      {/* Profile Edit Form Card */}
      <View style={[styles.card, isDark && styles.darkCard]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>Profile Details</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editLink}>Edit Details ✏️</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveLink}>Save Details 💾</Text>
            </TouchableOpacity>
          )}
        </View>

        {saveSuccess && <Text style={styles.successLabel}>Profile successfully updated! ✨</Text>}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reader's Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput, isDark && styles.darkInput]}
              value={kidName}
              onChangeText={setKidName}
              editable={isEditing}
              placeholder="e.g., Aarna"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reader's Gender</Text>
            <View style={styles.genderSelectorRow}>
              {['boy', 'girl'].map((g) => {
                const isActive = gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    disabled={!isEditing}
                    onPress={() => setGender(g)}
                    style={[
                      styles.genderButton,
                      isDark && styles.darkGenderButton,
                      isActive && styles.genderButtonActive,
                      isDark && isActive && styles.darkGenderButtonActive,
                      !isEditing && styles.genderButtonDisabled,
                    ]}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      isDark && styles.darkTextSecondary,
                      isActive && styles.genderButtonTextActive,
                      isDark && isActive && styles.darkText
                    ]}>
                      {g === 'boy' ? '🦁 Boy' : '🦄 Girl'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Father's Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput, isDark && styles.darkInput]}
              value={fatherName}
              onChangeText={setFatherName}
              editable={isEditing}
              placeholder="e.g., Ram"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mother's Name</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.disabledInput, isDark && styles.darkInput]}
              value={motherName}
              onChangeText={setMotherName}
              editable={isEditing}
              placeholder="e.g., Lahari"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>
      </View>

      {/* Account Settings / Reset Card */}
      <View style={[styles.card, isDark && styles.darkCard]}>
        <Text style={[styles.cardTitle, isDark && styles.darkText]}>System Controls</Text>
        <Text style={styles.resetSubText}>
          Clearing profile wipes local caches and resets the onboarding setup.
        </Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Text style={styles.resetButtonText}>Reset Application ⚠️</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf9',
  },
  darkContainer: {
    backgroundColor: '#120b24',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  profileHeader: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarEmoji: {
    fontSize: 70,
    marginBottom: 8,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  settingsGroup: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    marginBottom: 20,
  },
  darkSettingsGroup: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsRowEmoji: {
    fontSize: 26,
  },
  settingsRowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
  },
  darkText: {
    color: '#f3e8ff',
  },
  settingsRowSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    marginBottom: 20,
  },
  darkCard: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  editLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ec4899',
  },
  saveLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
  },
  successLabel: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e9d5ff',
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  darkInput: {
    backgroundColor: '#160e29',
    borderColor: 'rgba(147, 51, 234, 0.2)',
    color: '#f3e8ff',
  },
  disabledInput: {
    opacity: 0.75,
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    color: '#64748b',
  },
  genderSelectorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  darkGenderButton: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.1)',
  },
  genderButtonActive: {
    borderColor: '#9333ea',
    borderBottomWidth: 2.5,
    backgroundColor: '#faf5ff',
    transform: [{ translateY: 3.5 }],
  },
  darkGenderButtonActive: {
    borderColor: '#c084fc',
    backgroundColor: '#3b0764',
  },
  genderButtonDisabled: {
    opacity: 0.8,
  },
  genderButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#475569',
  },
  genderButtonTextActive: {
    color: '#9333ea',
  },
  resetSubText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 16,
    lineHeight: 18,
  },
  resetButton: {
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ProfileSettingsScreen;
