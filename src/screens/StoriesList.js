import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { personalizeText } from '../utils/text';
import Card from '../components/ui/Card';
import { useStories } from '../hooks/useStories';
import { CATEGORY_NAMES } from '../constants';

const StoriesList = ({ route, navigation }) => {
  const { category, profile } = route.params || {};
  const { stories, loading, error, refetch } = useStories(category);

  const screenTitle = category === 'aarna-adventures' && profile?.kidName
    ? `${profile.kidName}'s Adventures`
    : CATEGORY_NAMES[category] || category;

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('StoryViewer', { storyId: item.id, profile })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardIcon}>📖</Text>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{personalizeText(item.title, profile)}</Text>
          <Text style={styles.cardDesc}>{personalizeText(item.description, profile)}</Text>
          <Text style={styles.cardMeta}>
            {item.slides?.length ? `${item.slides.length} slides` : 'Read now'}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#fef08a', '#ffedd5', '#fce7f3']} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{screenTitle}</Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#7e22ce" />
            <Text style={styles.loadingText}>Loading stories...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.stateEmoji}>😔</Text>
            <Text style={styles.stateTitle}>Couldn't load stories</Text>
            <Text style={styles.stateSubtitle}>Check your connection and try again.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refetch}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : stories.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.stateEmoji}>🚧</Text>
            <Text style={styles.stateTitle}>Coming Soon!</Text>
            <Text style={styles.stateSubtitle}>New stories are being added soon.</Text>
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
  gradient: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backButton: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: '#d8b4fe', marginRight: 16 },
  backText: { color: '#7e22ce', fontWeight: 'bold' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7e22ce', flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 16, fontSize: 18, color: '#7e22ce', fontWeight: 'bold' },
  stateEmoji: { fontSize: 60, marginBottom: 16 },
  stateTitle: { fontSize: 22, fontWeight: 'bold', color: '#374151', marginBottom: 8, textAlign: 'center' },
  stateSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#9333ea', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  retryText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listContent: { padding: 20, paddingTop: 0 },
  card: { padding: 20, marginBottom: 16, backgroundColor: 'white', borderRadius: 16, borderWidth: 2, borderColor: '#e9d5ff' },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 36, marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#7e22ce', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#9333ea', marginBottom: 8 },
  cardMeta: { fontSize: 12, color: '#a855f7' },
});

export default StoriesList;
