import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MythologyGrid, AarnaGrid, HistoryGrid, PoemsGrid, MoralGrid, FunZoneGrid } from '../screens/Grids';
import StoriesList from '../screens/StoriesList';
import StoryViewer from '../screens/StoryViewer';
import PoemsList from '../screens/PoemsList';
import PoemViewer from '../screens/PoemViewer';
import GameViewer from '../screens/GameViewer';

const Stack = createStackNavigator();

const AppNavigator = ({ profile, onSplashComplete, onProfileComplete }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash">
        {(props) => <SplashScreen {...props} onComplete={onSplashComplete} />}
      </Stack.Screen>
      <Stack.Screen name="Profile" initialParams={{ onComplete: onProfileComplete }} component={ProfileScreen} />
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
