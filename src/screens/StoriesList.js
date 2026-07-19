import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { personalizeText } from '../utils/text';
import Card from '../components/ui/Card';
import { useStories } from '../hooks/useStories';
import { CATEGORY_NAMES } from '../constants';
import { useProfileStore } from '../store/profileStore';

const StoriesList = ({ route, navigation }) => {
  const { category, profile } = route.params || {};
  const { stories, loading, error, refetch } = useStories(category);
  const { theme } = useProfileStore();
  const isDark = theme === 'dark';

  const screenTitle = category === 'aarna-adventures' && profile?.kidName
    ? `${profile.kidName}'s Adventures`
    : CATEGORY_NAMES[category] || category;

  const isPersonalized = category === 'aarna-adventures';

  const renderItem = ({ item }) => (
    <Card
      style={[styles.card, isDark && styles.darkCard]}
      onPress={() => navigation.navigate('StoryViewer', { storyId: item.id, profile })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>📖</Text>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.cardTitle, isDark && styles.darkText]}>
            {isPersonalized ? personalizeText(item.title, profile) : item.title}
          </Text>
          <Text style={[styles.cardDesc, isDark && styles.darkTextSecondary]}>
            {isPersonalized ? personalizeText(item.description, profile) : item.description}
          </Text>
          <Text style={[styles.cardMeta, isDark && styles.darkMeta]}>
            {item.slides?.length ? `${item.slides.length} slides` : 'Read now'}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <LinearGradient
        colors={isDark ? ['#1e113a', '#120b24', '#0d071c'] : ['#fef08a', '#ffedd5', '#fce7f3']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, isDark && styles.darkBackButton]}
          >
            <Text style={[styles.backText, isDark && styles.darkSettingsLabel]}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, isDark && styles.darkTitle]} numberOfLines={1}>
            {screenTitle}
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={isDark ? '#c084fc' : '#7e22ce'} />
            <Text style={[styles.loadingText, isDark && styles.darkTitle]}>Loading stories...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.stateEmoji}>😔</Text>
            <Text style={[styles.stateTitle, isDark && styles.darkText]}>Couldn't load stories</Text>
            <Text style={[styles.stateSubtitle, isDark && styles.darkTextSecondary]}>Check your connection and try again.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : stories.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.stateEmoji}>🚧</Text>
            <Text style={[styles.stateTitle, isDark && styles.darkText]}>Coming Soon!</Text>
            <Text style={[styles.stateSubtitle, isDark && styles.darkTextSecondary]}>New stories are being added soon.</Text>
          </View>
        ) : (
          <FlatList
            data={stories}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkContainer: { backgroundColor: '#120b24' },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: '#d8b4fe', marginRight: 16 },
  darkBackButton: { backgroundColor: '#1c1133', borderColor: 'rgba(147, 51, 234, 0.2)' },
  backText: { color: '#7e22ce', fontWeight: 'bold' },
  darkSettingsLabel: { color: '#c084fc' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7e22ce', flex: 1 },
  darkTitle: { color: '#c084fc' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 16, fontSize: 18, color: '#7e22ce', fontWeight: 'bold' },
  stateEmoji: { fontSize: 60, marginBottom: 16 },
  stateTitle: { fontSize: 22, fontWeight: 'bold', color: '#374151', marginBottom: 8, textAlign: 'center' },
  stateSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#9333ea', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  retryText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 20, paddingTop: 0 },
  card: { padding: 20, marginBottom: 16, backgroundColor: 'white', borderRadius: 16, borderWidth: 2, borderColor: '#e9d5ff' },
  darkCard: { backgroundColor: '#1c1133', borderColor: 'rgba(147, 51, 234, 0.2)' },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 36, marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#7e22ce', marginBottom: 4 },
  darkText: { color: '#f3e8ff' },
  cardDesc: { fontSize: 14, color: '#9333ea', marginBottom: 8 },
  darkTextSecondary: { color: '#cbd5e1' },
  cardMeta: { fontSize: 12, color: '#a855f7' },
  darkMeta: { color: '#c084fc' },
});

export default StoriesList;
