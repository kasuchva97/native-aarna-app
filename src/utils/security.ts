import { NativeModules, Platform } from 'react-native';

const { SecurityModule } = NativeModules;

export type SecurityCheckResult =
  | { secure: true }
  | { secure: false; reason: 'rooted' | 'emulator' | 'unsupported' };

export const runSecurityCheck = async (): Promise<SecurityCheckResult> => {
  if (Platform.OS !== 'android') {
    // iOS jailbreak detection can be added via a native Swift module later
    return { secure: true };
  }

  if (!SecurityModule) {
    return { secure: true };
  }

  try {
    const [isRooted, isEmulator] = await Promise.all([
      SecurityModule.isRooted() as Promise<boolean>,
      SecurityModule.isEmulatorRunning() as Promise<boolean>,
    ]);

    if (isRooted) return { secure: false, reason: 'rooted' };
    if (isEmulator) return { secure: false, reason: 'emulator' };

    return { secure: true };
  } catch {
    return { secure: true };
  }
};
