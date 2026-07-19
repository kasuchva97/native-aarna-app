import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useProfileStore } from '../store/profileStore';
import HomeScreen from './HomeScreen';
import QuizHubScreen from './QuizHubScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';

const { width } = Dimensions.get('window');

const HomeIcon = ({ color }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10.5Z"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 21V12H15V21"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const QuizIcon = ({ color }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9H4.5C3.67 9 3 9.67 3 10.5V12C3 12.83 3.67 13.5 4.5 13.5H6"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18 9H19.5C20.33 9 21 9.67 21 10.5V12C21 12.83 20.33 13.5 19.5 13.5H18"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 6H18V15C18 18.3 15.3 21 12 21C8.7 21 6 18.3 6 15V6Z"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileIcon = ({ color }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 21C4 17.13 7.58 14 12 14C16.42 14 20 17.13 20 21"
      stroke={color}
      strokeWidth={4.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MainShell = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');
  const { profile, theme } = useProfileStore();
  
  const isDark = theme === 'dark';

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen navigation={navigation} profile={profile} />;
      case 'quiz':
        return <QuizHubScreen navigation={navigation} profile={profile} />;
      case 'profile':
        return <ProfileSettingsScreen navigation={navigation} profile={profile} />;
      default:
        return <HomeScreen navigation={navigation} profile={profile} />;
    }
  };

  const tabs = [
    { id: 'home', iconComponent: HomeIcon, color: '#9333ea' },
    { id: 'quiz', iconComponent: QuizIcon, color: '#fb923c' },
    { id: 'profile', iconComponent: ProfileIcon, color: '#ec4899' },
  ];

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <View style={styles.contentArea}>
        {renderActiveScreen()}
      </View>
      
      {/* Floating Bottom Tab Bar */}
      <View style={[styles.bottomBar, isDark && styles.darkBottomBar]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.iconComponent;
          const iconColor = isActive ? tab.color : (isDark ? '#a855f7' : '#94a3b8');

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabButton}
            >
              <View style={[
                styles.iconContainer,
                isActive && { backgroundColor: tab.color + '15' },
                isActive && styles.activeTab3D,
                isDark && styles.darkIconContainer
              ]}>
                <Icon color={iconColor} />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf9',
  },
  darkContainer: {
    backgroundColor: '#120b24',
  },
  contentArea: {
    flex: 1,
    paddingBottom: 0, // screens use contentContainer padding instead of shell blocking container
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#7e22ce',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  darkBottomBar: {
    backgroundColor: 'rgba(28, 17, 51, 0.95)',
    borderColor: 'rgba(147, 51, 234, 0.2)',
    shadowColor: '#000',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  activeTab3D: {
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.15)',
    transform: [{ translateY: 2 }],
  },
  darkIconContainer: {
    borderColor: 'transparent',
  },
});

export default MainShell;
