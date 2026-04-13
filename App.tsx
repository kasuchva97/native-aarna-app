import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('aarnaAppProfile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadProfile();
  }, []);

  const handleProfileComplete = async (profileInfo: Profile, nav: any) => {
    setProfile(profileInfo);
    nav.replace('Home');
  };

  const handleSplashComplete = (nav: any) => {
    if (profile) {
      nav.replace('Home');
    } else {
      nav.replace('Profile');
    }
  };

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator 
          profile={profile} 
          onSplashComplete={handleSplashComplete} 
          onProfileComplete={handleProfileComplete}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
