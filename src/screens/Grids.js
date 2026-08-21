import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from '@d11/react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../components/ui/Card';
import { useGods } from '../hooks/useGods';
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews';

const GridHeader = ({ title, onBack, colorClass }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>
    <Text style={[styles.title, { color: colorClass || '#7e22ce' }]}>{title}</Text>
  </View>
);

export const MythologyGrid = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const { gods, loading, error, refetch } = useGods();

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#dbeafe', '#fae8ff', '#fce7f3']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title="Choose Your God" onBack={() => navigation.goBack()} />
          {loading ? (
            <LoadingState message="Loading Gods..." />
          ) : error ? (
            <ErrorState title="Couldn't load content" message="Check your connection and try again." onRetry={refetch} />
          ) : gods.length === 0 ? (
            <EmptyState title="Coming Soon!" message="New stories are being added soon." />
          ) : (
            <View style={styles.grid2Col}>
              {gods.map((god) => (
                <Card
                  key={god.id}
                  style={styles.gridCard}
                  onPress={() => navigation.navigate('StoriesList', { category: god.id, profile })}
                >
                  <View style={[styles.imagePlaceholder, { backgroundColor: '#f3e8ff' }]}>
                    {god.image ? (
                      <FastImage
                        source={{ uri: god.image, priority: FastImage.priority.normal, cache: FastImage.cacheControl.immutable }}
                        style={styles.image}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    ) : null}
                    <Text style={styles.cardEmoji}>{god.emoji || '✨'}</Text>
                  </View>
                  <Text style={styles.cardText}>{god.name}</Text>
                </Card>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export const AarnaGrid = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const childName = profile?.kidName || 'Aarna';
  const categories = [
    { id: 'aarna-adventures', name: `${childName}'s Adventures`, emoji: '🌟', colors: ['#fce7f3', '#fecdd3'] },
  ];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#fce7f3', '#ffe4e6', '#fee2e2']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title={`${childName}'s Adventures`} colorClass="#be185d" onBack={() => navigation.goBack()} />
          <View style={styles.grid1Col}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('StoriesList', { category: cat.id, profile })}>
                <LinearGradient colors={cat.colors} style={styles.bigCard}>
                  <Text style={styles.bigEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.bigCardText, { color: '#be185d' }]}>{cat.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export const HistoryGrid = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const categories = [
    { id: 'ramayana', name: 'Ramayana Stories', emoji: '🏹', colors: ['#fef3c7', '#fde68a'] },
    { id: 'mahabharata', name: 'Mahabharata Stories', emoji: '⚔️', colors: ['#fef9c3', '#fde047'] },
  ];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#fef3c7', '#fef08a', '#ffedd5']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title="Epic History Stories" colorClass="#b45309" onBack={() => navigation.goBack()} />
          <View style={styles.grid1Col}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('StoriesList', { category: cat.id, profile })}>
                <LinearGradient colors={cat.colors} style={styles.bigCard}>
                  <Text style={styles.bigEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.bigCardText, { color: '#b45309' }]}>{cat.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export const PoemsGrid = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const categories = [
    { id: 'telugu-poems', name: 'Telugu Poems', emoji: '🇮🇳', colors: ['#ffedd5', '#fecaca'] },
    { id: 'english-poems', name: 'English Poems', emoji: '🎼', colors: ['#dbeafe', '#e9d5ff'] },
  ];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#f3e8ff', '#ede9fe', '#fce7f3']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title="Beautiful Poems" colorClass="#7e22ce" onBack={() => navigation.goBack()} />
          <View style={styles.grid1Col}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('PoemsList', { category: cat.id, profile })}>
                <LinearGradient colors={cat.colors} style={styles.bigCard}>
                  <Text style={styles.bigEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.bigCardText, { color: '#7e22ce' }]}>{cat.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export const MoralGrid = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const categories = [
    { id: 'panchatantra', name: 'Panchatantra', emoji: '🐒', colors: ['#d1fae5', '#a7f3d0'] },
    { id: 'animal-fables', name: 'Animal Fables', emoji: '🦊', colors: ['#ccfbf1', '#99f6e4'] },
    { id: 'classic-moral', name: 'Classic Tales', emoji: '🧚', colors: ['#dbeafe', '#c7d2fe'] },
    { id: 'friendship-stories', name: 'Friendship', emoji: '🤝', colors: ['#ffe4e6', '#fbcfe8'] },
    { id: 'kindness-stories', name: 'Kindness', emoji: '❤️', colors: ['#fee2e2', '#ffedd5'] },
  ];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#d1fae5', '#a7f3d0', '#ccfbf1']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title="Moral Stories" colorClass="#15803d" onBack={() => navigation.goBack()} />
          <View style={styles.grid2Col}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.bigCardContainer, { width: '48%' }]} onPress={() => navigation.navigate('StoriesList', { category: cat.id, profile })}>
                <LinearGradient colors={cat.colors} style={[styles.bigCard, { padding: 20 }]}>
                  <Text style={[styles.bigEmoji, { fontSize: 40 }]}>{cat.emoji}</Text>
                  <Text style={[styles.bigCardText, { color: '#15803d', fontSize: 18 }]}>{cat.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export const FunZoneGrid = ({ navigation }) => {
  const games = [
    { id: 'memory-match', name: 'Memory Match', desc: 'Find the matching pairs!', emoji: '🧠', colors: ['#f472b6', '#f43f5e'] },
    { id: 'color-pop', name: 'Color Pop', desc: 'Pop the colorful balloons!', emoji: '🎈', colors: ['#60a5fa', '#6366f1'] },
    { id: 'animal-sounds', name: 'Animal Sounds', desc: 'Guess who makes this sound!', emoji: '🐶', colors: ['#4ade80', '#10b981'] },
    { id: 'shape-sorter', name: 'Shape Sorter', desc: 'Put shapes in right places!', emoji: '⭐', colors: ['#facc15', '#f59e0b'] },
  ];

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#cffafe', '#dbeafe', '#e0e7ff']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title="Fun Zone" colorClass="#1d4ed8" onBack={() => navigation.goBack()} />
          <View style={styles.grid1Col}>
            {games.map((game) => (
              <TouchableOpacity key={game.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('GameViewer', { gameId: game.id })}>
                <LinearGradient colors={game.colors} style={styles.gameCard}>
                  <View style={styles.gameEmojiContainer}>
                    <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  </View>
                  <View style={styles.gameTextContainer}>
                    <Text style={styles.gameTitle}>{game.name}</Text>
                    <Text style={styles.gameDesc}>{game.desc}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200, padding: 20 },
  loadingText: { marginTop: 16, fontSize: 18, color: '#7e22ce', fontWeight: 'bold' },
  stateEmoji: { fontSize: 60, marginBottom: 16 },
  stateTitle: { fontSize: 22, fontWeight: 'bold', color: '#374151', marginBottom: 8, textAlign: 'center' },
  stateSubtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#9333ea', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },
  retryText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, marginTop: 10 },
  backButton: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: '#d8b4fe', marginRight: 16 },
  backText: { color: '#7e22ce', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 26, fontWeight: 'bold', flex: 1 },
  grid2Col: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  grid1Col: { flex: 1 },
  gridCard: { width: '48%', marginBottom: 16, padding: 16, borderRadius: 16, backgroundColor: 'white', borderWidth: 2, borderColor: '#e9d5ff' },
  imagePlaceholder: { height: 120, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 12, position: 'relative' },
  image: { width: '100%', height: '100%', position: 'absolute' },
  cardEmoji: { fontSize: 40, position: 'absolute' },
  cardText: { fontSize: 18, fontWeight: 'bold', color: '#7e22ce', textAlign: 'center' },
  bigCardContainer: { marginVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  bigCard: { padding: 30, borderRadius: 20, alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  bigEmoji: { fontSize: 60, marginBottom: 16 },
  bigCardText: { fontSize: 24, fontWeight: 'bold' },
  gameCard: { padding: 24, borderRadius: 20, flexDirection: 'row', alignItems: 'center', borderWidth: 3, borderColor: 'white' },
  gameEmojiContainer: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 16, borderRadius: 16, marginRight: 16 },
  gameEmoji: { fontSize: 48 },
  gameTextContainer: { flex: 1 },
  gameTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  gameDesc: { fontSize: 16, color: 'rgba(255,255,255,0.9)', fontWeight: '500' },
});
