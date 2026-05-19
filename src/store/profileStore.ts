import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';
import { STORAGE_KEYS } from '../constants';
import { Profile } from '../types';

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => Promise<void>;
  updateProfile: (partial: Partial<Profile>) => Promise<void>;
  loadProfile: () => Promise<Profile | null>;
  clearProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,

  setProfile: async (profile) => {
    await secureStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    set({ profile });
  },

  updateProfile: async (partial) => {
    const current = get().profile;
    const updated: Profile = { ...(current as Profile), ...partial };
    await secureStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    set({ profile: updated });
  },

  loadProfile: async () => {
    try {
      const raw = await secureStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) return null;
      const profile: Profile = JSON.parse(raw);
      set({ profile });
      return profile;
    } catch {
      return null;
    }
  },

  clearProfile: async () => {
    await secureStorage.removeItem(STORAGE_KEYS.PROFILE);
    set({ profile: null });
  },
}));
