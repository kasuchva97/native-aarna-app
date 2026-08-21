import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useProfileStore } from '../store/profileStore';

const PoemViewer = ({ route, navigation }) => {
  const { theme } = useProfileStore();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.flex1, isDark && styles.darkContainer]}>
      <LinearGradient
        colors={isDark ? ['#1e113a', '#120b24', '#0d071c'] : ['#f3e8ff', '#fce7f3']}
        style={styles.centerContainer}
      >
        <Text style={styles.emoji}>🚧</Text>
        <Text style={[styles.title, isDark && styles.darkTitle]}>Poem Viewer Coming Soon!</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  darkContainer: { backgroundColor: '#120b24' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emoji: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#7e22ce', marginBottom: 20 },
  darkTitle: { color: '#c084fc' },
  backButton: { backgroundColor: '#9333ea', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default PoemViewer;
