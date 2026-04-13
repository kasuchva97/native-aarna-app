import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../components/ui/Card';

const GridHeader = ({ title, onBack, colorClass }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Text style={styles.backText}>← Back</Text>
    </TouchableOpacity>
    <Text style={[styles.title, { color: colorClass || '#7e22ce' }]}>{title}</Text>
  </View>
);

import { supabase } from '../lib/supabaseClient';

export const MythologyGrid = ({ navigation }) => {
  const [gods, setGods] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchGods = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('gods').select('*').order('name');
        if (error) throw error;
        
        // If data is empty or fails, we inject some fallbacks to avoid a completely broken screen
        if (data && data.length > 0) {
          setGods(data);
        } else {
          setGods([
             { id: 'krishna', name: 'Krishna (Fallback)', image: 'https://images.unsplash.com/photo-1641730259879-ad98e7db7bcb', emoji: '🦚' }
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch gods:', err);
        setGods([
           { id: 'krishna', name: 'Krishna (Offline)', image: 'https://images.unsplash.com/photo-1641730259879-ad98e7db7bcb', emoji: '🦚' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchGods();
  }, []);

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#dbeafe', '#fae8ff', '#fce7f3']} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <GridHeader title="Choose Your God" onBack={() => navigation.goBack()} />
          
          {loading ? (
             <View style={styles.centerContainer}>
               <ActivityIndicator size="large" color="#7e22ce" />
               <Text style={styles.loadingText}>Loading Gods...</Text>
             </View>
          ) : (
            <View style={styles.grid2Col}>
              {gods.map((god) => (
                <Card
                  key={god.id}
                  style={styles.gridCard}
                  onPress={() => navigation.navigate('StoriesList', { category: god.id })}
                >
                  <View style={[styles.imagePlaceholder, { backgroundColor: '#f3e8ff' }]}>
                    {god.image ? (
                       <Image source={{ uri: god.image }} style={styles.image} />
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
              <TouchableOpacity key={cat.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('StoriesList', { category: cat.id })}>
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

export const HistoryGrid = ({ navigation }) => {
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
              <TouchableOpacity key={cat.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('StoriesList', { category: cat.id })}>
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

export const PoemsGrid = ({ navigation }) => {
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
              <TouchableOpacity key={cat.id} style={styles.bigCardContainer} onPress={() => navigation.navigate('PoemsList', { category: cat.id })}>
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

export const MoralGrid = ({ navigation }) => {
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
              <TouchableOpacity key={cat.id} style={[styles.bigCardContainer, { width: '48%' }]} onPress={() => navigation.navigate('StoriesList', { category: cat.id })}>
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 200 },
  loadingText: { marginTop: 16, fontSize: 18, color: '#7e22ce', fontWeight: 'bold' },
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
