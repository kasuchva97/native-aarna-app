import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { runSecurityCheck } from './src/utils/security';
import BlockedScreen from './src/screens/BlockedScreen';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import Config from 'react-native-config';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { useProfileStore } from './src/store/profileStore';
import { SecurityReason } from './src/types';

const ErrorBoundaryWithPostHog = ({ children }: { children: React.ReactNode }) => {
  const posthog = usePostHog();
  return <ErrorBoundary posthog={posthog}>{children}</ErrorBoundary>;
};

function App() {
  const { profile, loadProfile } = useProfileStore();
  const [isReady, setIsReady] = useState(false);
  const [securityBlock, setSecurityBlock] = useState<SecurityReason | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const [securityResult] = await Promise.all([
          runSecurityCheck(),
          loadProfile(),
        ]);

        if (!securityResult.secure) {
          setSecurityBlock(securityResult.reason);
          return;
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setIsReady(true);
      }
    };

    init();
  }, []);

  const handleProfileComplete = (nav: any) => {
    nav.replace('Home');
  };

  const handleSplashComplete = (nav: any) => {
    nav.replace(profile ? 'Home' : 'Onboarding');
  };

  if (securityBlock) {
    return <BlockedScreen reason={securityBlock} />;
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#9333ea' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const apiKey = Config.POSTHOG_API_KEY || '';
  const isPostHogEnabled = Boolean(apiKey && apiKey.trim().length > 0);

  return (
    <SafeAreaProvider>
      <PostHogProvider
        apiKey={apiKey || 'phc_disabled'}
        options={{
          host: Config.POSTHOG_HOST || 'https://us.i.posthog.com',
          disabled: !isPostHogEnabled,
          enableSessionReplay: isPostHogEnabled,
          sessionReplayConfig: {
            androidDebouncerDelayMs: 500,
            iOSdebouncerDelayMs: 500,
          },
        }}
        autocapture={{
          captureScreens: false,
          captureTouches: isPostHogEnabled,
        }}
      >
        <ErrorBoundaryWithPostHog>
          <NavigationContainer>
            <AppNavigator
              profile={profile}
              onSplashComplete={handleSplashComplete}
              onProfileComplete={handleProfileComplete}
            />
          </NavigationContainer>
        </ErrorBoundaryWithPostHog>
      </PostHogProvider>
    </SafeAreaProvider>
  );
}

export default App;
