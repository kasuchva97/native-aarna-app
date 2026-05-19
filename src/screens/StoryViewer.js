import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Tts from 'react-native-tts';
import { personalizeText } from '../utils/text';
import { Button } from '../components/ui/Button';
import { useStory } from '../hooks/useStory';

const StoryViewer = ({ route, navigation }) => {
  const { storyId, profile } = route.params || {};
  const { story, loading, error } = useStory(storyId);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const ttsListener = useRef(null);
  const touchStartX = useRef(0);

  const cleanupTts = () => {
    if (ttsListener.current) {
      ttsListener.current.remove();
      ttsListener.current = null;
    }
    Tts.stop();
  };

  useEffect(() => () => cleanupTts(), []);

  const handlePersonalize = (text) => personalizeText(text, profile);

  const playEnglish = async (text) => {
    try {
      await Tts.setDefaultLanguage('en-US');
      ttsListener.current = Tts.addEventListener('tts-finish', () => {
        setIsPlaying(false);
        cleanupTts();
      });
      Tts.speak(text);
    } catch {
      setIsPlaying(false);
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

    const slide = story.slides[currentSlide];
    const teluguText = handlePersonalize(slide.telugu);
    const englishText = handlePersonalize(slide.english);

    try {
      await Tts.setDefaultLanguage('te-IN');
      ttsListener.current = Tts.addEventListener('tts-finish', () => {
        if (ttsListener.current) {
          ttsListener.current.remove();
          ttsListener.current = null;
        }
        playEnglish(englishText);
      });
      Tts.speak(teluguText);
    } catch {
      playEnglish(englishText);
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
        <LinearGradient colors={['#dbeafe', '#f3e8ff']} style={styles.centerContainer}>
          <Text style={styles.loadingEmoji}>📖</Text>
          <ActivityIndicator size="large" color="#2563eb" style={{ marginBottom: 16 }} />
          <Text style={styles.loadingTitle}>Loading Story...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error || !story?.slides) {
    return (
      <SafeAreaView style={styles.flex1}>
        <LinearGradient colors={['#fee2e2', '#fce7f3']} style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorTitle}>Story Not Found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
            <Text style={styles.goBackText}>Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const currentSlideData = story.slides[currentSlide];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#f3e8ff', '#fce7f3', '#dbeafe']} style={styles.flex1}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{handlePersonalize(story.title)}</Text>
          <Text style={styles.slideCounter}>{currentSlide + 1} / {story.slides.length}</Text>
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
          <View style={styles.card}>
            {currentSlideData.image ? (
              <Image source={{ uri: currentSlideData.image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>📖</Text>
              </View>
            )}

            <View style={styles.teluguSection}>
              <Text style={styles.sectionTitle}>📖 తెలుగు:</Text>
              <Text style={styles.teluguText}>{handlePersonalize(currentSlideData.telugu)}</Text>
            </View>

            <View style={styles.englishSection}>
              <Text style={styles.sectionTitleBlue}>📖 English:</Text>
              <Text style={styles.englishText}>{handlePersonalize(currentSlideData.english)}</Text>
            </View>

            <View style={styles.audioControls}>
              <Button
                onPress={toggleAudio}
                colors={isPlaying ? ['#dc2626', '#b91c1c'] : ['#16a34a', '#15803d']}
              >
                {isPlaying ? '⏹ Stop Story' : '▶ Play Story'}
              </Button>
            </View>

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
});

export default StoryViewer;
