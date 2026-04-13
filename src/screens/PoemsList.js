import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const PoemsList = ({ route, navigation }) => {
  const { category } = route.params || {};

  return (
    <SafeAreaView style={styles.flex1}>
      <LinearGradient colors={['#ede9fe', '#ddd6fe', '#fce7f3']} style={styles.centerContainer}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.title}>Poems List Coming Soon!</Text>
        <Text style={styles.subtitle}>Category: {category}</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#7e22ce', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#9333ea', marginBottom: 20 },
  backButton: { backgroundColor: '#9333ea', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  backText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default PoemsList;
