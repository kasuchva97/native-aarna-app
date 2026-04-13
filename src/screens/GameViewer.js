import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GameViewer = ({ route, navigation }) => {
  const { gameId } = route.params || {};

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#cffafe', '#dbeafe', '#e0e7ff']} style={styles.centerContainer}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.title}>Game Coming Soon!</Text>
        <Text style={styles.subtitle}>Game ID: {gameId}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emoji: { fontSize: 60, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1d4ed8', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#2563eb', marginBottom: 20 },
  backButton: { backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default GameViewer;
