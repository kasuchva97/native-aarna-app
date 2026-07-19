import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  mergeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
  getAllKeys: jest.fn().mockResolvedValue([]),
}));

jest.mock('react-native-config', () => ({
  POSTHOG_API_KEY: 'mock-posthog-key',
  POSTHOG_HOST: 'https://mock-posthog-host',
  SUPABASE_URL: 'https://mock-supabase-url',
  SUPABASE_ANON_KEY: 'mock-supabase-key',
}));

jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('react-native-device-info', () => ({
  getUniqueId: jest.fn().mockResolvedValue('mock-device-id'),
  getBrand: jest.fn().mockReturnValue('mock-brand'),
  getModel: jest.fn().mockReturnValue('mock-model'),
  getSystemName: jest.fn().mockReturnValue('mock-system-name'),
  getSystemVersion: jest.fn().mockReturnValue('mock-system-version'),
  getVersion: jest.fn().mockReturnValue('1.0.0'),
  getBuildNumber: jest.fn().mockReturnValue('1'),
  isEmulator: jest.fn().mockResolvedValue(false),
}));

jest.mock('posthog-react-native', () => {
  const React = require('react');
  return {
    PostHogProvider: ({ children }) => children,
    usePostHog: () => ({
      screen: jest.fn(),
      capture: jest.fn(),
    }),
  };
});

jest.mock('react-native-tts', () => ({
  stop: jest.fn(),
  speak: jest.fn(),
  setDefaultLanguage: jest.fn(),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock SecurityModule
import { NativeModules } from 'react-native';
NativeModules.SecurityModule = {
  isRooted: jest.fn().mockResolvedValue(false),
  isEmulatorRunning: jest.fn().mockResolvedValue(false),
};

// Mock Firebase Crashlytics
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  log: jest.fn(),
  recordError: jest.fn(),
  crash: jest.fn(),
  setUserId: jest.fn(),
  setAttribute: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  initializeApp: jest.fn(),
}));
