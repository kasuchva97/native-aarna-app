import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Tts from 'react-native-tts';
import FastImage from '@d11/react-native-fast-image';
import { personalizeText, splitIntoSentences } from '../utils/text';
import { Button } from '../components/ui/Button';
import { useStory } from '../hooks/useStory';
import { useProfileStore } from '../store/profileStore';
import { LoadingState, ErrorState } from '../components/ui/StateViews';

const MOOD_PROFILES = {
  calm:     { rate: 0.42, pitch: 0.95, pauseAfterMs: 400 },
  excited:  { rate: 0.55, pitch: 1.18, pauseAfterMs: 200 },
  sad:      { rate: 0.36, pitch: 0.85, pauseAfterMs: 600 },
  suspense: { rate: 0.34, pitch: 0.90, pauseAfterMs: 700 },
  curious:  { rate: 0.44, pitch: 1.08, pauseAfterMs: 350 },
  happy:    { rate: 0.50, pitch: 1.10, pauseAfterMs: 300 },
};

const StoryViewer = ({ route, navigation }) => {
  const { storyId, profile } = route.params || {};
  const { story, loading, error } = useStory(storyId);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const ttsListener = useRef(null);
  const touchStartX = useRef(0);

  const { completeStory, theme, profile: storeProfile } = useProfileStore();
  const isDark = theme === 'dark';

  const isPlayingRef = useRef(false);
  const audioTimerRef = useRef(null);

  const cleanupTts = () => {
    isPlayingRef.current = false;
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }
    if (ttsListener.current) {
      ttsListener.current.remove();
      ttsListener.current = null;
    }
    Tts.stop();
  };

  useEffect(() => () => cleanupTts(), []);

  // Unlock quiz when on the last slide
  useEffect(() => {
    if (story && currentSlide === story.slides.length - 1) {
      completeStory(storyId);
    }
  }, [currentSlide, story]);

  const handlePersonalize = (text) => {
    if (!story || story.category !== 'aarna-adventures') {
      return text;
    }
    return personalizeText(text, profile || storeProfile);
  };

  const setBestVoice = async (languageCode) => {
    try {
      const voices = await Tts.voices();
      const candidates = voices.filter(v => v.language.startsWith(languageCode) && !v.networkConnectionRequired);
      const best = candidates.sort((a, b) => (b.quality ?? 0) - (a.quality ?? 0))[0];
      if (best) {
        await Tts.setDefaultVoice(best.id);
      } else {
        const langMap = { te: 'te-IN', en: 'en-US' };
        await Tts.setDefaultLanguage(langMap[languageCode] || 'en-US');
      }
    } catch (e) {
      console.warn('Error setting best voice:', e);
      const langMap = { te: 'te-IN', en: 'en-US' };
      try {
        await Tts.setDefaultLanguage(langMap[languageCode] || 'en-US');
      } catch (err) {}
    }
  };

  const toggleAudio = async () => {
    if (!story?.slides?.[currentSlide]) return;

    if (isPlaying) {
      cleanupTts();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    cleanupTts();
    isPlayingRef.current = true;

    const slide = story.slides[currentSlide];
    const chosenLanguage = profile?.language || storeProfile?.language || 'en';

    let sentences = [];
    let langCode = 'en';

    if (chosenLanguage === 'te') {
      sentences = slide.teluguSentences || splitIntoSentences(slide.telugu, 'calm');
      langCode = 'te';
    } else {
      sentences = slide.englishSentences || splitIntoSentences(slide.english, 'calm');
      langCode = 'en';
    }

    try {
      await setBestVoice(langCode);

      for (let i = 0; i < sentences.length; i++) {
        if (!isPlayingRef.current) break;

        const sentence = sentences[i];
        const rawText = handlePersonalize(sentence.text);
        const profileMood = MOOD_PROFILES[sentence.mood] ?? MOOD_PROFILES.calm;

        await Tts.setDefaultRate(profileMood.rate);

        const kidName = profile?.kidName || storeProfile?.kidName;

        const playSentencePromise = new Promise(async (resolve) => {
          let queuedCount = 0;
          let finishedCount = 0;

          if (ttsListener.current) {
            ttsListener.current.remove();
          }

          ttsListener.current = Tts.addEventListener('tts-finish', () => {
            finishedCount++;
            if (finishedCount >= queuedCount) {
              resolve();
            }
          });

          // Highlight / Emphasize character name by splitting the sentence
          if (kidName && rawText.includes(kidName)) {
            const parts = rawText.split(kidName);
            if (parts.length === 2) {
              const [before, after] = parts;
              if (before.trim().length > 0) {
                await Tts.setDefaultPitch(profileMood.pitch);
                await Tts.speak(before);
                queuedCount++;
              }
              await Tts.setDefaultPitch(profileMood.pitch * 1.15);
              await Tts.speak(kidName);
              queuedCount++;

              if (after.trim().length > 0) {
                await Tts.setDefaultPitch(profileMood.pitch);
                await Tts.speak(after);
                queuedCount++;
              }
              return;
            }
          }

          await Tts.setDefaultPitch(profileMood.pitch);
          await Tts.speak(rawText);
          queuedCount++;
        });

        await playSentencePromise;

        if (!isPlayingRef.current) break;

        await new Promise((resolve) => {
          audioTimerRef.current = setTimeout(resolve, profileMood.pauseAfterMs);
        });
      }
    } catch (e) {
      console.warn('Error in audio playback loop:', e);
    } finally {
      setIsPlaying(false);
      isPlayingRef.current = false;
      cleanupTts();
    }
  };

  const nextSlide = () => {
    if (story && currentSlide < story.slides.length - 1) {
      cleanupTts();
      setIsPlaying(false);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      cleanupTts();
      setIsPlaying(false);
      setCurrentSlide(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex1}>
        <LinearGradient colors={isDark ? ['#1e1b4b', '#120b24'] : ['#dbeafe', '#f3e8ff']} style={styles.flex1}>
          <LoadingState message="Loading Story..." isDark={isDark} />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error || !story?.slides) {
    return (
      <SafeAreaView style={styles.flex1}>
        <LinearGradient colors={isDark ? ['#3b0764', '#120b24'] : ['#fee2e2', '#fce7f3']} style={styles.flex1}>
          <ErrorState
            title="Story Not Found"
            message={typeof error === 'string' ? error : "Couldn't find the requested story."}
            onRetry={() => navigation.goBack()}
            retryLabel="Go Back"
            isDark={isDark}
          />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const currentSlideData = story.slides[currentSlide];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={isDark ? ['#1e1b4b', '#120b24', '#0f0a1c'] : ['#f3e8ff', '#fce7f3', '#dbeafe']} style={styles.flex1}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, isDark && styles.darkBackButton]}>
            <Text style={[styles.backText, isDark && styles.darkBackText]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkTitle]} numberOfLines={1}>{handlePersonalize(story.title)}</Text>
          <Text style={[styles.slideCounter, isDark && styles.darkCounter]}>{currentSlide + 1} / {story.slides.length}</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          onTouchStart={(e) => { touchStartX.current = e.nativeEvent.pageX; }}
          onTouchEnd={(e) => {
            const dx = e.nativeEvent.pageX - touchStartX.current;
            if (dx < -50) nextSlide();
            else if (dx > 50) prevSlide();
          }}
        >
          <View style={[styles.card, isDark && styles.darkCard]}>
            {currentSlideData.image || currentSlideData.imagePrompt ? (
              <FastImage
                source={{
                  uri: currentSlideData.image || `https://image.pollinations.ai/prompt/${encodeURIComponent(currentSlideData.imagePrompt)}?width=1024&height=1024&nologo=true&seed=42`,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            ) : (
              <View style={[styles.imagePlaceholder, isDark && styles.darkImagePlaceholder]}>
                <Text style={styles.imagePlaceholderText}>📖</Text>
              </View>
            )}

            <View style={[styles.teluguSection, isDark && styles.darkTeluguSection]}>
              <Text style={[styles.sectionTitle, isDark && styles.darkTeluguTitle]}>📖 తెలుగు:</Text>
              <Text style={[styles.teluguText, isDark && styles.darkTeluguText]}>{handlePersonalize(currentSlideData.telugu)}</Text>
            </View>

            <View style={[styles.englishSection, isDark && styles.darkEnglishSection]}>
              <Text style={[styles.sectionTitleBlue, isDark && styles.darkEnglishTitle]}>📖 English:</Text>
              <Text style={[styles.englishText, isDark && styles.darkEnglishText]}>{handlePersonalize(currentSlideData.english)}</Text>
            </View>

            <View style={styles.audioControls}>
              <Button
                onPress={toggleAudio}
                colors={isPlaying ? ['#dc2626', '#b91c1c'] : ['#16a34a', '#15803d']}
              >
                {isPlaying ? '⏹ Stop Story' : '▶ Play Story'}
              </Button>
            </View>

            {currentSlide === story.slides.length - 1 && story.quiz && (
              <View style={styles.quizButtonContainer}>
                <Button
                  onPress={() => {
                    let badgeToUnlock = 'Adventure Master';
                    if (story.category === 'krishna') badgeToUnlock = 'Krishna Master';
                    else if (story.category === 'hanuman') badgeToUnlock = 'Hanuman Master';
                    else if (story.category === 'ganesha') badgeToUnlock = 'Ganesha Master';
                    else if (story.category === 'rama') badgeToUnlock = 'Rama Master';
                    else if (story.category === 'panchatantra') badgeToUnlock = 'Panchatantra Master';
                    else if (story.category === 'animal-fables') badgeToUnlock = 'Fables Master';
                    else if (story.category === 'ramayana') badgeToUnlock = 'Ramayana Master';

                    navigation.navigate('QuizScreen', {
                      storyId: story.id,
                      storyTitle: story.title,
                      quizQuestions: story.quiz,
                      badgeToUnlock,
                    });
                  }}
                  colors={['#fb923c', '#ea580c']}
                >
                  Take Quiz 📝
                </Button>
              </View>
            )}

            <View style={styles.navControls}>
              <TouchableOpacity onPress={prevSlide} disabled={currentSlide === 0} style={[styles.navButton, currentSlide === 0 && styles.navButtonDisabled]}>
                <Text style={styles.navButtonText}>← Prev</Text>
              </TouchableOpacity>

              <View style={styles.dots}>
                {story.slides.map((_, i) => (
                  <View key={i} style={[styles.dot, i === currentSlide && styles.dotActive]} />
                ))}
              </View>

              <TouchableOpacity onPress={nextSlide} disabled={currentSlide === story.slides.length - 1} style={[styles.navButton, currentSlide === story.slides.length - 1 && styles.navButtonDisabled]}>
                <Text style={styles.navButtonText}>Next →</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.swipeHint}>Swipe left or right to navigate slides</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingEmoji: { fontSize: 60, marginBottom: 16 },
  loadingTitle: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  errorEmoji: { fontSize: 60, marginBottom: 16 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#dc2626', marginBottom: 20 },
  goBackButton: { backgroundColor: '#dc2626', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  goBackText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, justifyContent: 'space-between' },
  backButton: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: '#d8b4fe' },
  backText: { color: '#7e22ce', fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#7e22ce', flex: 1, textAlign: 'center', marginHorizontal: 10 },
  slideCounter: { fontSize: 14, color: '#9333ea', fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 8 },
  image: { width: '100%', height: 250, borderRadius: 16, marginBottom: 20 },
  imagePlaceholder: { width: '100%', height: 250, borderRadius: 16, marginBottom: 20, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { fontSize: 60 },
  teluguSection: { backgroundColor: '#fff7ed', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#fb923c', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#9a3412', marginBottom: 8 },
  teluguText: { fontSize: 18, color: '#9a3412', lineHeight: 32 },
  englishSection: { backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#60a5fa', marginBottom: 20 },
  sectionTitleBlue: { fontSize: 18, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 },
  englishText: { fontSize: 18, color: '#1e40af', lineHeight: 28 },
  audioControls: { alignItems: 'center', marginBottom: 24 },
  navControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navButton: { backgroundColor: '#9333ea', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  navButtonDisabled: { backgroundColor: '#d1d5db' },
  navButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#d1d5db', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#9333ea', transform: [{ scale: 1.2 }] },
  swipeHint: { textAlign: 'center', color: '#9ca3af', fontSize: 13, marginTop: 16 },
  darkCard: { backgroundColor: '#1c1133', shadowColor: '#000' },
  darkTitle: { color: '#f3e8ff' },
  darkCounter: { color: '#c084fc' },
  darkBackButton: { backgroundColor: '#1c1133', borderColor: 'rgba(147, 51, 234, 0.4)' },
  darkBackText: { color: '#c084fc' },
  darkImagePlaceholder: { backgroundColor: '#160e29' },
  darkTeluguSection: { backgroundColor: '#2a1a10', borderLeftColor: '#f97316' },
  darkTeluguTitle: { color: '#fed7aa' },
  darkTeluguText: { color: '#ffedd5' },
  darkEnglishSection: { backgroundColor: '#111827', borderLeftColor: '#3b82f6' },
  darkEnglishTitle: { color: '#93c5fd' },
  darkEnglishText: { color: '#dbeafe' },
  quizButtonContainer: { marginVertical: 10, alignItems: 'center' },
});

export default StoryViewer;
