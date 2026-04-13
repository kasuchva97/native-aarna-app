import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { supabase } from '../lib/supabaseClient';
import { personalizeText } from '../utils/text';
import Card from '../components/ui/Card';

const StoriesList = ({ route, navigation }) => {
  const { category, profile } = route.params || {};
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .eq('category', category)
          .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        setStories(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };
    if (category) fetchStories();
  }, [category]);

  const categoryNames = {
      'aarna-adventures': personalizeText("Aarna's Adventures", profile),
      'krishna': 'Krishna Stories',
      'hanuman': 'Hanuman Stories',
      'ganesha': 'Ganesha Stories',
      'rama': 'Rama Stories',
      'shiva': 'Shiva Stories',
      'durga': 'Durga Stories',
      'lakshmi': 'Lakshmi Stories',
      'saraswati': 'Saraswati Stories',
      'panchatantra': 'Panchatantra Tales',
      'animal-fables': 'Animal Fables',
      'classic-moral': 'Moral Stories',
      'friendship-stories': 'Friendship Stories',
      'kindness-stories': 'Kindness Stories',
      'ramayana': 'Ramayana Stories',
      'mahabharata': 'Mahabharata Stories'
  };

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
          <Text style={styles.cardMeta}>{item.slides ? `${item.slides.length} slides` : '8 slides'}</Text>
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
          <Text style={styles.title} numberOfLines={1}>
            {categoryNames[category] || category}
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#7e22ce" />
            <Text style={styles.loadingText}>Loading stories...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorEmoji}>😔</Text>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : stories.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorEmoji}>🚧</Text>
            <Text style={styles.errorTitle}>Coming Soon!</Text>
            <Text style={styles.errorText}>New stories are being added soon.</Text>
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
  errorEmoji: { fontSize: 60, marginBottom: 16 },
  errorTitle: { fontSize: 24, fontWeight: 'bold', color: '#b91c1c', marginBottom: 8, textAlign: 'center' },
  errorText: { fontSize: 16, color: '#b91c1c', textAlign: 'center' },
  listContent: { padding: 20, paddingTop: 0 },
  card: { padding: 20, marginBottom: 16, backgroundColor: 'white', borderRadius: 16, borderWidth: 2, borderColor: '#e9d5ff' },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardIcon: { fontSize: 36, marginRight: 16 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#7e22ce', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#9333ea', marginBottom: 8 },
  cardMeta: { fontSize: 12, color: '#a855f7' }
});

export default StoriesList;
