import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import Card from '../components/ui/Card';
import { useProfileStore } from '../store/profileStore';

const HomeScreen = ({ navigation, profile }) => {
  const childName = profile?.kidName || 'Aarna';
  const fatherName = profile?.fatherName || 'Ram';
  const motherName = profile?.motherName || 'Lahari';
  const { theme } = useProfileStore();
  const isDark = theme === 'dark';

  const categories = [
    { id: 'aarna', title: `${childName}'s Adventures`, icon: '🌟', color: '#fdf2f2', description: `Amazing adventures with ${childName}, ${fatherName}, and ${motherName}!` },
    { id: 'mythology', title: 'Mythology Stories', icon: '🏛️', color: '#eff6ff', description: 'Discover amazing tales of gods and heroes!' },
    { id: 'moral', title: 'Moral Stories', icon: '🦁', color: '#ecfdf5', description: 'Learn valuable lessons through fun tales!' },
    { id: 'history', title: 'History Stories', icon: '📚', color: '#fffbeb', description: 'Epic tales from Ramayana and Mahabharata!' },
    { id: 'poems', title: 'Poems', icon: '🎵', color: '#f5f3ff', description: 'Beautiful poems in Telugu and English!' },
    { id: 'funzone', title: 'Fun Zone', icon: '🎮', color: '#f0fdfa', description: 'Puzzles and games for little ones!' },
  ];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, isDark && styles.darkTitle]}>BalaKatha</Text>
          <Text style={[styles.subtitle, isDark && styles.darkSubtitle]}>Choose your adventure!</Text>
          <TouchableOpacity
            style={[styles.settingsButton, isDark && styles.darkSettingsButton]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
            <Text style={[styles.settingsLabel, isDark && styles.darkSettingsLabel]}>Edit Names</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {categories.map((cat) => (
            <Card
              key={cat.id}
              style={[
                styles.card,
                { backgroundColor: isDark ? '#1c1133' : cat.color },
                isDark && { borderColor: 'rgba(147, 51, 234, 0.2)' }
              ]}
              onPress={() => {
                const routeMap = {
                  'aarna': 'AarnaGrid',
                  'mythology': 'MythologyGrid',
                  'moral': 'MoralGrid',
                  'history': 'HistoryGrid',
                  'poems': 'PoemsGrid',
                  'funzone': 'FunZoneGrid',
                };
                navigation.navigate(routeMap[cat.id], { profile });
              }}
            >
              <Text style={styles.icon}>{cat.icon}</Text>
              <Text style={[styles.cardTitle, isDark && styles.darkText]}>{cat.title}</Text>
              <Text style={[styles.cardDescription, isDark && styles.darkTextSecondary]}>{cat.description}</Text>
            </Card>
          ))}
        </View>

        {__DEV__ && (
          <TouchableOpacity
            style={[styles.debugButton, isDark && styles.darkDebugButton]}
            onPress={() => navigation.navigate('Debug')}
          >
            <Text style={[styles.debugButtonText, isDark && styles.darkSettingsLabel]}>🛠️ System Diagnostics</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf9', // Ivory/Light yellow tint
  },
  darkContainer: {
    backgroundColor: '#120b24',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110, // leave room for floating tab bar
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
  darkTitle: {
    color: '#c084fc',
  },
  subtitle: {
    fontSize: 18,
    color: '#9333ea', // purple-600
    fontWeight: '500',
    marginTop: 8,
  },
  darkSubtitle: {
    color: '#a855f7',
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
  darkText: {
    color: '#f3e8ff',
  },
  cardDescription: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 22,
  },
  darkTextSecondary: {
    color: '#cbd5e1',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(147, 51, 234, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  darkSettingsButton: {
    backgroundColor: 'rgba(192, 132, 252, 0.08)',
    borderColor: 'rgba(192, 132, 252, 0.2)',
  },
  settingsIcon: { fontSize: 16, marginRight: 6 },
  settingsLabel: { fontSize: 14, color: '#7e22ce', fontWeight: '600' },
  darkSettingsLabel: { color: '#c084fc' },
  debugButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: 'rgba(126, 34, 206, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.2)',
    alignItems: 'center',
  },
  darkDebugButton: {
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    borderColor: 'rgba(192, 132, 252, 0.2)',
  },
  debugButtonText: {
    color: '#7e22ce',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
