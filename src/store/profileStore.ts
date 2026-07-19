import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';
import { STORAGE_KEYS } from '../constants';
import { Profile } from '../types';

interface ProfileState {
  profile: Profile | null;
  theme: 'light' | 'dark';
  completedStories: string[];
  quizScores: Record<string, number>;
  unlockedBadges: string[];
  setProfile: (profile: Profile) => Promise<void>;
  updateProfile: (partial: Partial<Profile>) => Promise<void>;
  loadProfile: () => Promise<Profile | null>;
  clearProfile: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  completeStory: (storyId: string) => Promise<void>;
  saveQuizScore: (storyId: string, score: number, badgeToUnlock?: string) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  theme: 'light',
  completedStories: [],
  quizScores: {},
  unlockedBadges: [],

  setProfile: async (profile) => {
    set({ profile });
    try {
      await secureStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('SecureStorage write failed:', e);
    }
  },

  updateProfile: async (partial) => {
    const current = get().profile;
    const updated: Profile = { ...(current as Profile), ...partial };
    set({ profile: updated });
    try {
      await secureStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    } catch (e) {
      console.warn('SecureStorage update failed:', e);
    }
  },

  loadProfile: async () => {
    try {
      const raw = await secureStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) return null;
      const profile: Profile = JSON.parse(raw);

      // Load theme and rewards
      const theme = (await secureStorage.getItem('BALAKATHA_THEME') as 'light' | 'dark') || 'light';
      const completed = JSON.parse((await secureStorage.getItem('BALAKATHA_COMPLETED')) || '[]');
      const scores = JSON.parse((await secureStorage.getItem('BALAKATHA_SCORES')) || '{}');
      const badges = JSON.parse((await secureStorage.getItem('BALAKATHA_BADGES')) || '[]');

      set({
        profile,
        theme,
        completedStories: completed,
        quizScores: scores,
        unlockedBadges: badges
      });
      return profile;
    } catch {
      return null;
    }
  },

  clearProfile: async () => {
    await secureStorage.removeItem(STORAGE_KEYS.PROFILE);
    await secureStorage.removeItem('BALAKATHA_THEME');
    await secureStorage.removeItem('BALAKATHA_COMPLETED');
    await secureStorage.removeItem('BALAKATHA_SCORES');
    await secureStorage.removeItem('BALAKATHA_BADGES');
    set({
      profile: null,
      theme: 'light',
      completedStories: [],
      quizScores: {},
      unlockedBadges: [],
    });
  },

  toggleTheme: async () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    await secureStorage.setItem('BALAKATHA_THEME', newTheme);
    set({ theme: newTheme });
  },

  completeStory: async (storyId) => {
    const current = get().completedStories;
    if (current.includes(storyId)) return;
    const updated = [...current, storyId];
    await secureStorage.setItem('BALAKATHA_COMPLETED', JSON.stringify(updated));
    set({ completedStories: updated });
  },

  saveQuizScore: async (storyId, score, badgeToUnlock) => {
    const currentScores = get().quizScores;
    const updatedScores = { ...currentScores, [storyId]: score };
    await secureStorage.setItem('BALAKATHA_SCORES', JSON.stringify(updatedScores));

    const currentBadges = get().unlockedBadges;
    let updatedBadges = [...currentBadges];
    if (score === 3 && badgeToUnlock && !currentBadges.includes(badgeToUnlock)) {
      updatedBadges.push(badgeToUnlock);
      await secureStorage.setItem('BALAKATHA_BADGES', JSON.stringify(updatedBadges));
    }

    set({
      quizScores: updatedScores,
      unlockedBadges: updatedBadges
    });
  },
}));
