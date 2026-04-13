import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Card from '../components/ui/Card';

const HomeScreen = ({ navigation, profile }) => {
  const childName = profile?.kidName || 'Aarna';
  const fatherName = profile?.fatherName || 'Ram';
  const motherName = profile?.motherName || 'Lahari';

  const categories = [
    { id: 'aarna', title: `${childName}'s Adventures`, icon: '🌟', color: '#fdf2f2', description: `Amazing adventures with ${childName}, ${fatherName}, and ${motherName}!` },
    { id: 'mythology', title: 'Mythology Stories', icon: '🏛️', color: '#eff6ff', description: 'Discover amazing tales of gods and heroes!' },
    { id: 'moral', title: 'Moral Stories', icon: '🦁', color: '#ecfdf5', description: 'Learn valuable lessons through fun tales!' },
    { id: 'history', title: 'History Stories', icon: '📚', color: '#fffbeb', description: 'Epic tales from Ramayana and Mahabharata!' },
    { id: 'poems', title: 'Poems', icon: '🎵', color: '#f5f3ff', description: 'Beautiful poems in Telugu and English!' },
    { id: 'funzone', title: 'Fun Zone', icon: '🎮', color: '#f0fdfa', description: 'Puzzles and games for little ones!' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>My Little Storybook</Text>
          <Text style={styles.subtitle}>Choose your adventure!</Text>
        </View>

        <View style={styles.grid}>
          {categories.map((cat) => (
            <Card
              key={cat.id}
              style={[styles.card, { backgroundColor: cat.color }]}
              onPress={() => {
                const routeMap = {
                  'aarna': 'AarnaGrid',
                  'mythology': 'MythologyGrid',
                  'moral': 'MoralGrid',
                  'history': 'HistoryGrid',
                  'poems': 'PoemsGrid',
                  'funzone': 'FunZoneGrid',
                };
                navigation.navigate(routeMap[cat.id]);
              }}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={styles.cardTitle}>{cat.title}</Text>
              <Text style={styles.cardDescription}>{cat.description}</Text>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf9', // Ivory/Light yellow tint
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7e22ce', // purple-700
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#9333ea', // purple-600
    fontWeight: '500',
    marginTop: 8,
  },
  grid: {
    width: '100%',
  },
  card: {
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen;
