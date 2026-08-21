import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileStore } from '../store/profileStore';
import { useAllStories } from '../hooks/useAllStories';
import Card from '../components/ui/Card';

const { width } = Dimensions.get('window');

// List of all possible badges in the system
const BADGES_CONFIG = [
  { name: 'Ganesha Master', emoji: '🐘', description: 'Ganesha Stories' },
  { name: 'Hanuman Master', emoji: '🐒', description: 'Hanuman Stories' },
  { name: 'Krishna Master', emoji: '🦚', description: 'Krishna Stories' },
  { name: 'Rama Master', emoji: '🏹', description: 'Rama Stories' },
  { name: 'Panchatantra Master', emoji: '🐵', description: 'Panchatantra Stories' },
  { name: 'Fables Master', emoji: '🦊', description: 'Animal Fables' },
  { name: 'Ramayana Master', emoji: '🏰', description: 'Ramayana Stories' },
  { name: 'Adventure Master', emoji: '🌟', description: 'Adventures Stories' },
];

const QuizHubScreen = ({ navigation }) => {
  const { stories, loading, error, refetch } = useAllStories();
  const { completedStories, quizScores, unlockedBadges, theme } = useProfileStore();

  const isDark = theme === 'dark';

  // Calculate total stars earned (sum of all quiz scores)
  const totalStars = Object.values(quizScores).reduce((acc, score) => acc + score, 0);

  const getQuizButtonState = (story) => {
    const isCompleted = completedStories.includes(story.id);
    const score = quizScores[story.id] ?? 0;
    return { isCompleted, score };
  };

  const handleStartQuiz = (story) => {
    if (!story.quiz || story.quiz.length === 0) {
      Alert.alert('Quiz Coming Soon 📝', 'Quiz questions for this story are currently being prepared!');
      return;
    }
    
    // Dynamically map a badge to unlock for this story category
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
  };

  if (loading) {
    return (
      <View style={[styles.center, isDark && styles.darkContainer]}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={[styles.loadingText, isDark && styles.darkText]}>Loading Quizzes & Rewards...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, isDark && styles.darkContainer]} contentContainerStyle={styles.scrollContent}>
      
      {/* Stars and Score Banner */}
      <LinearGradient
        colors={isDark ? ['#3b0764', '#1e1b4b'] : ['#fef08a', '#fbe5a2']}
        style={styles.banner}
      >
        <Text style={styles.bannerTitle}>🏆 Your Trophies</Text>
        <View style={styles.starsRow}>
          <Text style={styles.starsEmoji}>⭐</Text>
          <Text style={[styles.starsCount, isDark && styles.darkText]}>{totalStars} Stars</Text>
        </View>
        <Text style={[styles.bannerSubtitle, isDark && styles.darkTextSecondary]}>
          Earn stars and unlock cool stickers by taking quizzes after reading stories!
        </Text>
      </LinearGradient>

      {/* Stickers / Badge Board */}
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>🎨 Sticker Board</Text>
      <View style={[styles.badgeBoard, isDark && styles.darkBadgeBoard]}>
        {BADGES_CONFIG.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.name);
          return (
            <View key={badge.name} style={styles.badgeWrapper}>
              <View style={[
                styles.badgeCircle,
                isUnlocked ? styles.badgeUnlocked : styles.badgeLocked,
                isDark && styles.darkBadgeCircle
              ]}>
                <Text style={[styles.badgeEmoji, !isUnlocked && styles.badgeEmojiLocked]}>
                  {badge.emoji}
                </Text>
                {!isUnlocked && <Text style={styles.lockBadgeIcon}>🔒</Text>}
              </View>
              <Text style={[styles.badgeName, isDark && styles.darkText]}>{badge.name}</Text>
              <Text style={styles.badgeDesc}>{badge.description}</Text>
            </View>
          );
        })}
      </View>

      {/* Quiz List */}
      <Text style={[styles.sectionTitle, isDark && styles.darkText]}>📝 Available Quizzes</Text>
      {stories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No stories found. Generate some content first!</Text>
        </View>
      ) : (
        stories.map((story) => {
          const { isCompleted, score } = getQuizButtonState(story);
          return (
            <Card
              key={story.id}
              style={[
                styles.quizCard,
                isDark && styles.darkQuizCard,
                !isCompleted && (isDark ? styles.darkQuizCardLocked : styles.quizCardLocked)
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.titleArea}>
                  <Text style={[styles.storyTitle, isDark && styles.darkText]}>{story.title}</Text>
                  <Text style={[styles.storyDesc, isDark && styles.darkStoryDesc]} numberOfLines={1}>{story.description}</Text>
                </View>
                {isCompleted ? (
                  <View style={styles.starsIndicator}>
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Text key={idx} style={styles.starIcon}>
                        {idx < score ? '⭐' : '☆'}
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={[styles.lockText, isDark && styles.darkLockText]}>🔒 Locked</Text>
                )}
              </View>

              <View style={styles.cardActionRow}>
                {isCompleted ? (
                  <TouchableOpacity
                    style={styles.startQuizButton}
                    onPress={() => handleStartQuiz(story)}
                  >
                    <Text style={styles.startQuizText}>
                      {score > 0 ? 'Retry Quiz 🔄' : 'Start Quiz 📝'}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={[styles.unlockHint, isDark && styles.darkUnlockHint]}>Read this story in full to unlock the quiz!</Text>
                )}
              </View>
            </Card>
          );
        })
      )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7e22ce',
    fontWeight: 'bold',
  },
  darkText: {
    color: '#f3e8ff',
  },
  darkTextSecondary: {
    color: '#cbd5e1',
  },
  banner: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7e22ce',
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  starsEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  starsCount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#7e22ce',
  },
  bannerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#5b21b6',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7e22ce',
    marginBottom: 16,
  },
  badgeBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#faf5ff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    marginBottom: 24,
  },
  darkBadgeBoard: {
    backgroundColor: 'rgba(147, 51, 234, 0.05)',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  badgeWrapper: {
    width: (width - 72 - 32) / 3, // fits 3 columns
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
    borderWidth: 2,
  },
  darkBadgeCircle: {
    backgroundColor: '#1c1133',
  },
  badgeUnlocked: {
    backgroundColor: '#fff',
    borderColor: '#fb923c',
  },
  badgeLocked: {
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeEmojiLocked: {
    opacity: 0.15,
  },
  lockBadgeIcon: {
    position: 'absolute',
    fontSize: 14,
    right: -2,
    bottom: -2,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 2,
  },
  quizCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    marginBottom: 16,
  },
  darkQuizCard: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  quizCardLocked: {
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    opacity: 0.8,
  },
  darkQuizCardLocked: {
    backgroundColor: '#160e29',
    borderColor: 'rgba(147, 51, 234, 0.15)',
    opacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleArea: {
    flex: 1,
    paddingRight: 10,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7e22ce',
    marginBottom: 4,
  },
  storyDesc: {
    fontSize: 14,
    color: '#9333ea',
  },
  darkStoryDesc: {
    color: '#c084fc',
  },
  starsIndicator: {
    flexDirection: 'row',
  },
  starIcon: {
    fontSize: 18,
    color: '#fb923c',
    marginHorizontal: 1,
  },
  lockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  darkLockText: {
    backgroundColor: '#2e1854',
    color: '#d8b4fe',
  },
  cardActionRow: {
    marginTop: 8,
  },
  startQuizButton: {
    backgroundColor: '#fb923c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startQuizText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  unlockHint: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  darkUnlockHint: {
    color: '#a855f7',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QuizHubScreen;
