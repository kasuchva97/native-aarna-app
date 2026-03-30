import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen'; // To be migrated later

const Stack = createStackNavigator();

const AppNavigator = ({ profile, onSplashComplete }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash">
        {(props) => <SplashScreen {...props} onComplete={onSplashComplete} />}
      </Stack.Screen>
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} profile={profile} />}
      </Stack.Screen>
      {/* Add more screens here as they are migrated */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
