import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, Animated, TouchableOpacity,
  Dimensions, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileStore } from '../store/profileStore';

const { width, height } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'en', native: 'English', emoji: '🇮🇳' },
  { code: 'te', native: 'తెలుగు', emoji: '🌺' },
  { code: 'hi', native: 'हिंदी', emoji: '🪔' },
  { code: 'ta', native: 'தமிழ்', emoji: '🌸' },
];

const PURPOSES = [
  { id: 'bedtime', icon: '🌙', title: 'Bedtime Stories', desc: 'Calm stories before sleep' },
  { id: 'learning', icon: '🎓', title: 'Learning', desc: 'Educational adventures' },
  { id: 'mythology', icon: '🏛️', title: 'Mythology', desc: 'Gods, heroes & legends' },
  { id: 'family', icon: '👨‍👩‍👧', title: 'Family Time', desc: 'Stories for everyone' },
];

const STEPS = [
  {
    character: '📖',
    decorators: [
      { emoji: '⭐', pos: { top: 18, left: '18%' }, delay: 0 },
      { emoji: '✨', pos: { top: 8, right: '14%' }, delay: 600 },
      { emoji: '💫', pos: { bottom: 18, left: '10%' }, delay: 1100 },
      { emoji: '🌟', pos: { bottom: 28, right: '18%' }, delay: 350 },
    ],
    gradient: ['#2e1065', '#4c1d95', '#6d28d9'],
    title: 'Welcome to\nBalaKatha!',
    subtitle: 'Choose your preferred language',
  },
  {
    character: '🌟',
    decorators: [
      { emoji: '📚', pos: { top: 14, left: '16%' }, delay: 200 },
      { emoji: '✨', pos: { top: 6, right: '20%' }, delay: 750 },
      { emoji: '💫', pos: { bottom: 22, left: '14%' }, delay: 450 },
      { emoji: '🎯', pos: { bottom: 12, right: '14%' }, delay: 100 },
    ],
    gradient: ['#3b0764', '#581c87', '#7e22ce'],
    title: 'What brings\nyou here?',
    subtitle: 'Pick what describes you best',
  },
  {
    character: '🧸',
    decorators: [
      { emoji: '🌸', pos: { top: 20, left: '18%' }, delay: 0 },
      { emoji: '⭐', pos: { top: 6, right: '16%' }, delay: 650 },
      { emoji: '💕', pos: { bottom: 20, left: '12%' }, delay: 950 },
      { emoji: '🌈', pos: { bottom: 28, right: '20%' }, delay: 320 },
    ],
    gradient: ['#1e1b4b', '#3730a3', '#4f46e5'],
    title: 'Your child is a...',
    subtitle: 'Help us personalise every story',
  },
  {
    character: '🏡',
    decorators: [
      { emoji: '💫', pos: { top: 22, left: '20%' }, delay: 120 },
      { emoji: '⭐', pos: { top: 10, right: '16%' }, delay: 520 },
      { emoji: '✨', pos: { bottom: 18, left: '10%' }, delay: 820 },
      { emoji: '🌙', pos: { bottom: 26, right: '18%' }, delay: 260 },
    ],
    gradient: ['#2e1065', '#4c1d95', '#7c3aed'],
    title: "Let's personalise!",
    subtitle: 'Your names appear in every story',
  },
];

// ─── Floating decorator star ──────────────────────────────────────────────────
const FloatingDeco = ({ emoji, pos, delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 1900, delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 1900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.deco,
        pos,
        {
          opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.4, 1, 0.4] }),
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -16] }) }],
        },
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

// ─── Language chip ─────────────────────────────────────────────────────────────
const LangChip = ({ item, selected, onSelect }) => {
  const scaleAnim = useRef(new Animated.Value(selected ? 1.05 : 1)).current;

  const handlePress = () => {
    Animated.spring(scaleAnim, { toValue: 1.08, tension: 80, friction: 4, useNativeDriver: true }).start(() =>
      Animated.spring(scaleAnim, { toValue: selected ? 1.05 : 1, tension: 80, friction: 6, useNativeDriver: true }).start(),
    );
    onSelect(item.code);
  };

  const translateY = selected ? 4 : 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <Animated.View style={[styles.langChip, selected && styles.langChipSelected, { transform: [{ scale: scaleAnim }, { translateY }] }]}>
        <Text style={styles.langEmoji}>{item.emoji}</Text>
        <Text style={[styles.langText, selected && styles.langTextSelected]}>{item.native}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Purpose card ──────────────────────────────────────────────────────────────
const PurposeCard = ({ item, selected, onSelect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, tension: 120, friction: 5, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }),
    ]).start();
    onSelect(item.id);
  };

  const translateY = selected ? 4 : 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.purposeCardWrap}>
      <Animated.View style={[styles.purposeCard, selected && styles.purposeCardSelected, { transform: [{ scale: scaleAnim }, { translateY }] }]}>
        <Text style={styles.purposeIcon}>{item.icon}</Text>
        <Text style={[styles.purposeTitle, selected && styles.purposeTitleSelected]}>{item.title}</Text>
        <Text style={[styles.purposeDesc, selected && styles.purposeDescSelected]}>{item.desc}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Gender option ─────────────────────────────────────────────────────────────
const GenderOption = ({ emoji, label, selected, onSelect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.18, tension: 80, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 70, friction: 6, useNativeDriver: true }),
    ]).start();
    onSelect();
  };

  const translateY = selected ? 4 : 0;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={styles.genderWrap}>
      <Animated.View style={[styles.genderOption, selected && styles.genderOptionSelected, { transform: [{ scale: scaleAnim }, { translateY }] }]}>
        <Text style={styles.genderEmoji}>{emoji}</Text>
        <Text style={[styles.genderLabel, selected && styles.genderLabelSelected]}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─── Main screen ───────────────────────────────────────────────────────────────
const OnboardingScreen = ({ navigation, route }) => {
  const { onComplete } = route.params || {};
  const { setProfile } = useProfileStore();

  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('en');
  const [purpose, setPurpose] = useState(null);
  const [gender, setGender] = useState(null);
  const [kidName, setKidName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Main character float
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Entrance (per step)
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const cardSlideAnim = useRef(new Animated.Value(30)).current;
  // Character pop (when gender changes)
  const charScaleAnim = useRef(new Animated.Value(1)).current;
  // Progress bar animation
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Continuous float
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -14, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Step entrance
  useEffect(() => {
    entranceAnim.setValue(0);
    cardSlideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(entranceAnim, { toValue: 1, duration: 380, useNativeDriver: true }),
      Animated.spring(cardSlideAnim, { toValue: 0, tension: 100, friction: 6, useNativeDriver: true }),
    ]).start();
  }, [step]);

  // Character pop on gender change
  useEffect(() => {
    if (gender) {
      Animated.sequence([
        Animated.spring(charScaleAnim, { toValue: 1.3, tension: 80, friction: 4, useNativeDriver: true }),
        Animated.spring(charScaleAnim, { toValue: 1, tension: 70, friction: 6, useNativeDriver: true }),
      ]).start();
    }
  }, [gender]);

  // Smooth progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (step + 1) / STEPS.length,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [step]);

  const currentStep = STEPS[step];

  const getCharacter = () => {
    if (step === 0) {
      return language ? '👋' : '📖';
    }
    if (step === 1) {
      return purpose ? '🥳' : '🌟';
    }
    if (step === 2) {
      if (gender === 'boy') return '🦁';
      if (gender === 'girl') return '🦄';
      return '🧸';
    }
    if (step === 3) {
      const allFilled = kidName.trim() && fatherName.trim() && motherName.trim();
      return allFilled ? '🦄' : '🏡';
    }
    return currentStep.character;
  };

  const canProceed = () => {
    if (step === 0) return true;
    if (step === 1) return purpose !== null;
    if (step === 2) return gender !== null;
    if (step === 3) return kidName.trim() && fatherName.trim() && motherName.trim();
    return false;
  };

  const handleNext = async () => {
    setError('');
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      return;
    }
    if (!kidName.trim() || !fatherName.trim() || !motherName.trim()) {
      setError('Please fill in all three names.');
      return;
    }
    setSaving(true);
    try {
      const profile = {
        kidName: kidName.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        language,
        purpose,
        gender,
      };
      await setProfile(profile);
      if (onComplete) onComplete(navigation);
    } catch {
      setError('Could not save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <LinearGradient colors={currentStep.gradient} style={styles.screen}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>

          {/* Top bar */}
          <View style={styles.topBar}>
            {step > 0 ? (
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(s => s - 1)}>
                <Text style={styles.backIcon}>←</Text>
              </TouchableOpacity>
            ) : <View style={styles.backBtn} />}
            <View style={styles.progressBarTrack}>
              <Animated.View style={[styles.progressBarFill, {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }]} />
            </View>
            <View style={styles.backBtn} />
          </View>

          {/* Character stage */}
          <View style={styles.stage}>
            {currentStep.decorators.map((d, i) => (
              <FloatingDeco key={`${step}-${i}`} emoji={d.emoji} pos={d.pos} delay={d.delay} />
            ))}
            <Animated.Text
              style={[
                styles.character,
                {
                  transform: [
                    { translateY: floatAnim },
                    { scale: charScaleAnim },
                  ],
                },
              ]}
            >
              {getCharacter()}
            </Animated.Text>
          </View>

          {/* Card */}
          <Animated.View
            style={[
              styles.card,
              {
                opacity: entranceAnim,
                transform: [{ translateY: cardSlideAnim }],
              },
            ]}
          >
            <ScrollView
              contentContainerStyle={styles.cardContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>{currentStep.title}</Text>
              <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

              {/* Step 1 — Language */}
              {step === 0 && (
                <View style={styles.grid2}>
                  {LANGUAGES.map(lang => (
                    <LangChip
                      key={lang.code}
                      item={lang}
                      selected={language === lang.code}
                      onSelect={setLanguage}
                    />
                  ))}
                </View>
              )}

              {/* Step 2 — Purpose */}
              {step === 1 && (
                <View style={styles.grid2}>
                  {PURPOSES.map(p => (
                    <PurposeCard
                      key={p.id}
                      item={p}
                      selected={purpose === p.id}
                      onSelect={setPurpose}
                    />
                  ))}
                </View>
              )}

              {/* Step 3 — Gender */}
              {step === 2 && (
                <View style={styles.genderRow}>
                  <GenderOption
                    emoji="🦁"
                    label="Boy"
                    selected={gender === 'boy'}
                    onSelect={() => setGender('boy')}
                  />
                  <GenderOption
                    emoji="🦄"
                    label="Girl"
                    selected={gender === 'girl'}
                    onSelect={() => setGender('girl')}
                  />
                </View>
              )}

              {/* Step 4 — Names */}
              {step === 3 && (
                <View style={styles.namesForm}>
                  {[
                    { label: "Kid's Name", value: kidName, setter: setKidName, placeholder: 'e.g., Aarna' },
                    { label: "Father's Name", value: fatherName, setter: setFatherName, placeholder: 'e.g., Ram' },
                    { label: "Mother's Name", value: motherName, setter: setMotherName, placeholder: 'e.g., Lahari' },
                  ].map(({ label, value, setter, placeholder }) => (
                    <View key={label} style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{label}</Text>
                      <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={t => { setter(t); setError(''); }}
                        placeholder={placeholder}
                        placeholderTextColor="#a8a29e"
                        maxLength={30}
                        returnKeyType="next"
                      />
                    </View>
                  ))}
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>
              )}

              {/* Continue button */}
              <TouchableOpacity
                onPress={handleNext}
                disabled={!canProceed() || saving}
                activeOpacity={0.85}
                style={styles.nextBtnWrap}
              >
                <LinearGradient
                  colors={canProceed() ? ['#ec4899', '#9333ea'] : ['#e5e7eb', '#e5e7eb']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextBtn}
                >
                  <Text style={[styles.nextBtnText, !canProceed() && styles.nextBtnTextDisabled]}>
                    {step === STEPS.length - 1
                      ? (saving ? 'Starting…' : 'Start Reading! 📖')
                      : 'Continue →'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </Animated.View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: { width: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 26, color: 'rgba(255,255,255,0.9)', fontWeight: 'bold' },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },

  // Character stage
  stage: {
    height: height * 0.26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  character: { fontSize: 90, textAlign: 'center' },
  deco: { position: 'absolute', fontSize: 22 },

  // Card
  card: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardContent: { padding: 28, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },

  // Language chips
  grid2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 8 },
  langChip: {
    width: (width - 56 - 12) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: '#e9d5ff',
    backgroundColor: '#faf5ff',
  },
  langChipSelected: {
    borderColor: '#7e22ce',
    borderBottomWidth: 2,
    backgroundColor: '#ede9fe',
  },
  langEmoji: { fontSize: 22 },
  langText: { fontSize: 16, fontWeight: '600', color: '#4b5563' },
  langTextSelected: { color: '#7e22ce' },

  // Purpose cards
  purposeCardWrap: { width: (width - 56 - 12) / 2 },
  purposeCard: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 6,
    borderColor: '#e9d5ff',
    backgroundColor: '#faf5ff',
    alignItems: 'center',
  },
  purposeCardSelected: {
    borderColor: '#7e22ce',
    borderBottomWidth: 2,
    backgroundColor: '#ede9fe',
  },
  purposeIcon: { fontSize: 30, marginBottom: 6 },
  purposeTitle: { fontSize: 13, fontWeight: '700', color: '#374151', textAlign: 'center', marginBottom: 3 },
  purposeTitleSelected: { color: '#7e22ce' },
  purposeDesc: { fontSize: 11, color: '#6b7280', textAlign: 'center', lineHeight: 15 },
  purposeDescSelected: { color: '#6d28d9' },

  // Gender
  genderRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 8 },
  genderWrap: { flex: 1 },
  genderOption: {
    alignItems: 'center',
    paddingVertical: 24,
    borderRadius: 20,
    borderWidth: 2.5,
    borderBottomWidth: 6,
    borderColor: '#e9d5ff',
    backgroundColor: '#faf5ff',
  },
  genderOptionSelected: {
    borderColor: '#7e22ce',
    borderBottomWidth: 2.5,
    backgroundColor: '#ede9fe',
  },
  genderEmoji: { fontSize: 56, marginBottom: 10 },
  genderLabel: { fontSize: 16, fontWeight: '700', color: '#374151' },
  genderLabelSelected: { color: '#7e22ce' },

  // Names form
  namesForm: { marginBottom: 4 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#f3e8ff', marginBottom: 6 },
  input: {
    backgroundColor: '#faf5ff',
    borderWidth: 2,
    borderColor: '#e9d5ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: '#1f2937',
  },
  errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center', marginBottom: 8, fontWeight: '500' },

  // Button
  nextBtnWrap: { borderRadius: 16, overflow: 'hidden', marginTop: 16 },
  nextBtn: { paddingVertical: 17, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  nextBtnTextDisabled: { color: '#9ca3af' },
});

export default OnboardingScreen;
