import { useProfileStore } from '../profileStore';
import { secureStorage } from '../../utils/secureStorage';
import { STORAGE_KEYS } from '../../constants';

jest.mock('../../utils/secureStorage', () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockStorage = secureStorage as jest.Mocked<typeof secureStorage>;

const sampleProfile = {
  kidName: 'Aarna',
  fatherName: 'Ram',
  motherName: 'Lahari',
};

beforeEach(() => {
  jest.clearAllMocks();
  useProfileStore.setState({ profile: null });
});

describe('setProfile', () => {
  it('persists to secure storage and updates state', async () => {
    mockStorage.setItem.mockResolvedValue(undefined);

    await useProfileStore.getState().setProfile(sampleProfile);

    expect(mockStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.PROFILE,
      JSON.stringify(sampleProfile),
    );
    expect(useProfileStore.getState().profile).toEqual(sampleProfile);
  });
});

describe('loadProfile', () => {
  it('returns null when nothing stored', async () => {
    mockStorage.getItem.mockResolvedValue(null);

    const result = await useProfileStore.getState().loadProfile();

    expect(result).toBeNull();
    expect(useProfileStore.getState().profile).toBeNull();
  });

  it('parses stored JSON, sets state, and returns profile', async () => {
    mockStorage.getItem.mockResolvedValue(JSON.stringify(sampleProfile));

    const result = await useProfileStore.getState().loadProfile();

    expect(result).toEqual(sampleProfile);
    expect(useProfileStore.getState().profile).toEqual(sampleProfile);
  });

  it('returns null and does not throw on storage error', async () => {
    mockStorage.getItem.mockRejectedValue(new Error('disk error'));

    const result = await useProfileStore.getState().loadProfile();

    expect(result).toBeNull();
  });
});

describe('updateProfile', () => {
  it('merges partial fields and preserves existing ones', async () => {
    const initial = { ...sampleProfile, language: 'te', gender: 'girl' };
    useProfileStore.setState({ profile: initial });
    mockStorage.setItem.mockResolvedValue(undefined);

    await useProfileStore.getState().updateProfile({ kidName: 'Nyra' });

    const expected = { ...initial, kidName: 'Nyra' };
    expect(useProfileStore.getState().profile).toEqual(expected);
    expect(mockStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.PROFILE,
      JSON.stringify(expected),
    );
  });
});

describe('clearProfile', () => {
  it('removes from storage and resets state to null', async () => {
    useProfileStore.setState({ profile: sampleProfile });
    mockStorage.removeItem.mockResolvedValue(undefined);

    await useProfileStore.getState().clearProfile();

    expect(mockStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.PROFILE);
    expect(useProfileStore.getState().profile).toBeNull();
  });
});

describe('theme and rewards state', () => {
  beforeEach(() => {
    useProfileStore.setState({
      theme: 'light',
      completedStories: [],
      quizScores: {},
      unlockedBadges: [],
    });
  });

  it('toggles theme correctly', async () => {
    mockStorage.setItem.mockResolvedValue(undefined);

    expect(useProfileStore.getState().theme).toBe('light');

    await useProfileStore.getState().toggleTheme();
    expect(useProfileStore.getState().theme).toBe('dark');

    await useProfileStore.getState().toggleTheme();
    expect(useProfileStore.getState().theme).toBe('light');
  });

  it('marks story as completed', async () => {
    mockStorage.setItem.mockResolvedValue(undefined);

    expect(useProfileStore.getState().completedStories).toEqual([]);

    await useProfileStore.getState().completeStory('krishna-story-1');
    expect(useProfileStore.getState().completedStories).toEqual(['krishna-story-1']);

    // Should not add duplicates
    await useProfileStore.getState().completeStory('krishna-story-1');
    expect(useProfileStore.getState().completedStories).toEqual(['krishna-story-1']);
  });

  it('saves quiz score and unlocks badges', async () => {
    mockStorage.setItem.mockResolvedValue(undefined);

    expect(useProfileStore.getState().quizScores).toEqual({});
    expect(useProfileStore.getState().unlockedBadges).toEqual([]);

    await useProfileStore.getState().saveQuizScore('krishna-story-1', 3, 'Krishna Master');
    expect(useProfileStore.getState().quizScores['krishna-story-1']).toBe(3);
    expect(useProfileStore.getState().unlockedBadges).toContain('Krishna Master');

    // Perfect score of 3 awards badge, lower score of 1 does not award duplicate/incorrect badge
    await useProfileStore.getState().saveQuizScore('krishna-story-2', 1, 'Krishna Hero');
    expect(useProfileStore.getState().quizScores['krishna-story-2']).toBe(1);
    expect(useProfileStore.getState().unlockedBadges).not.toContain('Krishna Hero');
  });
});

