import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileStore } from '../store/profileStore';
import { EmptyState, ErrorState } from '../components/ui/StateViews';

const { width, height } = Dimensions.get('window');

// Custom falling emoji particles for zero-dependency celebration
const CelebrateConfetti = () => {
  const animations = useRef(
    Array.from({ length: 25 }).map(() => ({
      x: Math.random() * width,
      y: new Animated.Value(-50),
      scale: Math.random() * 0.8 + 0.6,
      rotate: Math.random() * 360,
      emoji: ['⭐', '✨', '🎈', '🎉', '🍎'][Math.floor(Math.random() * 5)],
    }))
  ).current;

  React.useEffect(() => {
    const animationSequence = animations.map((anim) =>
      Animated.timing(anim.y, {
        toValue: height + 50,
        duration: Math.random() * 2500 + 2000,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animationSequence).start();
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {animations.map((anim, idx) => (
        <Animated.Text
          key={idx}
          style={[
            styles.confettiParticle,
            {
              left: anim.x,
              transform: [
                { translateY: anim.y },
                { scale: anim.scale },
                { rotate: `${anim.rotate}deg` },
              ],
            },
          ]}
        >
          {anim.emoji}
        </Animated.Text>
      ))}
    </View>
  );
};

const QuizScreen = ({ route, navigation }) => {
  const { storyId, storyTitle, quizQuestions = [], badgeToUnlock } = route.params || {};
  const { saveQuizScore, theme } = useProfileStore();

  const isDark = theme === 'dark';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Animations for correct/incorrect feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = quizQuestions[currentIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;
    
    setSelectedIdx(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      // Bounce animation on correct
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      ]).start();
    } else {
      // Shake animation on incorrect
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  };

  const handleNext = async () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setSavingScore(true);
      setSaveError('');
      try {
        await saveQuizScore(storyId, score, score === quizQuestions.length ? badgeToUnlock : undefined);
        setQuizDone(true);
      } catch (e) {
        setSaveError('Failed to save score. Please try again.');
        setQuizDone(true);
      } finally {
        setSavingScore(false);
      }
    }
  };

  const getOptionStyle = (idx) => {
    if (!isAnswered) {
      return [styles.optionCard, isDark && styles.darkOptionCard];
    }
    
    const isCorrectOption = idx === currentQuestion.correctAnswerIndex;
    const isSelectedOption = idx === selectedIdx;

    if (isCorrectOption) {
      return [styles.optionCard, styles.optionCorrect];
    }
    if (isSelectedOption && !isCorrectOption) {
      return [styles.optionCard, styles.optionIncorrect];
    }
    return [styles.optionCard, styles.optionDisabled, isDark && styles.darkOptionCardDisabled];
  };

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
        <LinearGradient colors={isDark ? ['#1e1b4b', '#120b24'] : ['#faf5ff', '#f3e8ff']} style={styles.flex1}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, isDark && styles.darkText]} numberOfLines={1}>
              {storyTitle || 'Quiz'}
            </Text>
          </View>
          <EmptyState
            title="No Questions Available"
            message="This quiz doesn't have any questions yet."
            isDark={isDark}
          />
          <TouchableOpacity
            style={[styles.nextButton, { marginHorizontal: 24, marginBottom: 24 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.nextButtonText}>Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <LinearGradient colors={isDark ? ['#1e1b4b', '#120b24'] : ['#faf5ff', '#f3e8ff']} style={styles.flex1}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, isDark && styles.darkText]} numberOfLines={1}>
            {storyTitle} - Quiz
          </Text>
        </View>

        {!quizDone ? (
          <View style={styles.quizArea}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={[styles.progressText, isDark && styles.darkTextSecondary]}>
                Question {currentIndex + 1} of {quizQuestions.length}
              </Text>
              <View style={[styles.progressBarBg, isDark && styles.darkProgressBarBg]}>
                <View style={[
                  styles.progressBarFill, 
                  { width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }
                ]} />
              </View>
            </View>

            {/* Question Text */}
            <View style={[styles.questionCard, isDark && styles.darkQuestionCard]}>
              <Text style={[styles.questionText, isDark && styles.darkText]}>
                {currentQuestion.question}
              </Text>
            </View>

            {/* Options list */}
            <Animated.View style={[
              styles.optionsContainer,
              { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }] }
            ]}>
              {currentQuestion.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => handleSelectOption(idx)}
                  disabled={isAnswered || savingScore}
                  style={getOptionStyle(idx)}
                >
                  <Text style={[
                    styles.optionText,
                    isAnswered && idx === currentQuestion.correctAnswerIndex && styles.optionTextCorrect,
                    isAnswered && idx === selectedIdx && idx !== currentQuestion.correctAnswerIndex && styles.optionTextIncorrect,
                    isDark && !isAnswered && styles.darkText
                  ]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            {/* Action Button */}
            {isAnswered && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={savingScore}>
                {savingScore ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.nextButtonText}>
                    {currentIndex === quizQuestions.length - 1 ? 'Finish Quiz 🎉' : 'Next Question →'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.resultArea}>
            {score === quizQuestions.length && <CelebrateConfetti />}

            <Text style={styles.resultEmoji}>
              {score === quizQuestions.length ? '🥳' : '👍'}
            </Text>
            <Text style={[styles.resultTitle, isDark && styles.darkText]}>
              {score === quizQuestions.length ? 'Perfect Score!' : 'Well Played!'}
            </Text>
            <Text style={[styles.resultSubtitle, isDark && styles.darkTextSecondary]}>
              You scored {score} out of {quizQuestions.length} stars!
            </Text>

            {score === quizQuestions.length && badgeToUnlock && (
              <View style={[styles.badgeShowcase, isDark && styles.darkBadgeShowcase]}>
                <Text style={styles.unlockedLabel}>🏆 Badge Unlocked!</Text>
                <Text style={styles.unlockedName}>{badgeToUnlock}</Text>
                <Text style={styles.unlockedSub}>Check your Sticker Board in the Quiz Hub!</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.finishButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.finishButtonText}>Back to Home 🏡</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#120b24',
  },
  flex1: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7e22ce',
  },
  darkText: {
    color: '#f3e8ff',
  },
  darkTextSecondary: {
    color: '#cbd5e1',
  },
  quizArea: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333ea',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: '#e9d5ff',
    borderRadius: 6,
    overflow: 'hidden',
  },
  darkProgressBarBg: {
    backgroundColor: 'rgba(147, 51, 234, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fb923c',
    borderRadius: 6,
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    marginBottom: 24,
    justifyContent: 'center',
    minHeight: 120,
  },
  darkQuestionCard: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9d5ff',
    alignItems: 'center',
  },
  darkOptionCard: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
  },
  optionCorrect: {
    backgroundColor: '#d1fae5',
    borderColor: '#10b981',
  },
  optionTextCorrect: {
    color: '#065f46',
  },
  optionIncorrect: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  optionTextIncorrect: {
    color: '#991b1b',
  },
  optionDisabled: {
    opacity: 0.6,
  },
  darkOptionCardDisabled: {
    backgroundColor: '#160e29',
    borderColor: 'rgba(147, 51, 234, 0.1)',
  },
  nextButton: {
    backgroundColor: '#9333ea',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7e22ce',
    marginBottom: 10,
  },
  resultSubtitle: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 30,
  },
  badgeShowcase: {
    backgroundColor: '#faf5ff',
    borderColor: '#fb923c',
    borderWidth: 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  darkBadgeShowcase: {
    backgroundColor: '#1c1133',
    borderColor: 'rgba(251, 146, 60, 0.4)',
  },
  unlockedLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fb923c',
    marginBottom: 6,
  },
  unlockedName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#7e22ce',
    marginBottom: 6,
  },
  unlockedSub: {
    fontSize: 12,
    color: '#94a3b8',
  },
  finishButton: {
    backgroundColor: '#fb923c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confettiParticle: {
    position: 'absolute',
    fontSize: 24,
  },
});

export default QuizScreen;
