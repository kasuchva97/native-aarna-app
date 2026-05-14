/**
 * @format
 */

import crashlytics from '@react-native-firebase/crashlytics';

// Enable Crashlytics collection (true in production, can be toggled in debug)
crashlytics().setCrashlyticsCollectionEnabled(true);

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
