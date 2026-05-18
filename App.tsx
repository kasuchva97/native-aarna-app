import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PostHogProvider } from 'posthog-react-native';
import Config from 'react-native-config';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

interface Profile {
  kidName: string;
  fatherName: string;
  motherName: string;
  language?: string;
  purpose?: string;
  gender?: string;
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem('balakatha.profile');
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

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
  };

  const handleSplashComplete = (nav: any) => {
    if (profile) {
      nav.replace('Home');
    } else {
      nav.replace('Onboarding');
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#9333ea' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PostHogProvider
          apiKey={Config.POSTHOG_API_KEY ?? ''}
          options={{
            host: Config.POSTHOG_HOST ?? 'https://us.i.posthog.com',
          }}
          autocapture={{
            captureScreens: false,
            captureTouches: true,
          }}
        >
          <NavigationContainer>
            <AppNavigator
              profile={profile}
              onSplashComplete={handleSplashComplete}
              onProfileComplete={handleProfileComplete}
              onProfileUpdate={handleProfileUpdate}
            />
          </NavigationContainer>
        </PostHogProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default App;
