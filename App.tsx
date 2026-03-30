import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

interface Profile {
  kidName: string;
  fatherName: string;
  motherName: string;
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Mock loading profile (in future, use AsyncStorage)
    const loadProfile = async () => {
      // Simulate disk read
      setTimeout(() => {
        setProfile({
          kidName: 'Aarna',
          fatherName: 'Ram',
          motherName: 'Lahari'
        });
        setIsReady(true);
      }, 500);
    };

    loadProfile();
  }, []);

  const handleSplashComplete = (nav: any) => {
    // Navigate to Home after splash
    nav.replace('Home');
  };

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator 
          profile={profile} 
          onSplashComplete={handleSplashComplete} 
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
