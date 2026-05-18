import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { usePostHog } from 'posthog-react-native';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import { MythologyGrid, AarnaGrid, HistoryGrid, PoemsGrid, MoralGrid, FunZoneGrid } from '../screens/Grids';
import StoriesList from '../screens/StoriesList';
import StoryViewer from '../screens/StoryViewer';
import PoemsList from '../screens/PoemsList';
import PoemViewer from '../screens/PoemViewer';
import GameViewer from '../screens/GameViewer';
import SettingsScreen from '../screens/SettingsScreen';
import DebugScreen from '../screens/DebugScreen';

const Stack = createStackNavigator();

const AppNavigator = ({ profile, onSplashComplete, onProfileComplete, onProfileUpdate }) => {
  const posthog = usePostHog();

  const screenListeners = {
    state: (e) => {
      const state = e.data.state;
      if (state) {
        const route = state.routes[state.index];
        if (route?.name) posthog?.screen(route.name);
      }
    },
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} screenListeners={screenListeners}>
      <Stack.Screen name="Splash">
        {(props) => <SplashScreen {...props} onComplete={onSplashComplete} />}
      </Stack.Screen>
      <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onComplete={onProfileComplete} />}
      </Stack.Screen>
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} profile={profile} />}
      </Stack.Screen>
      <Stack.Screen name="MythologyGrid" component={MythologyGrid} />
      <Stack.Screen name="AarnaGrid" component={AarnaGrid} />
      <Stack.Screen name="HistoryGrid" component={HistoryGrid} />
      <Stack.Screen name="PoemsGrid" component={PoemsGrid} />
      <Stack.Screen name="MoralGrid" component={MoralGrid} />
      <Stack.Screen name="FunZoneGrid" component={FunZoneGrid} />
      <Stack.Screen name="StoriesList" component={StoriesList} />
      <Stack.Screen name="StoryViewer" component={StoryViewer} />
      <Stack.Screen name="PoemsList" component={PoemsList} />
      <Stack.Screen name="PoemViewer" component={PoemViewer} />
      <Stack.Screen name="GameViewer" component={GameViewer} />
      <Stack.Screen name="Settings">
        {(props) => <SettingsScreen {...props} profile={profile} onProfileUpdate={onProfileUpdate} />}
      </Stack.Screen>
      {__DEV__ && <Stack.Screen name="Debug" component={DebugScreen} />}
    </Stack.Navigator>
  );
};

export default AppNavigator;
