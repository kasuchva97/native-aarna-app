module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-linear-gradient|@d11/react-native-fast-image|posthog-react-native|@react-navigation|react-native-config|@react-native-async-storage|react-native-url-polyfill|@react-native-firebase)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};

