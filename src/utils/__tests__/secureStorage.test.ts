jest.mock('react-native-encrypted-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import EncryptedStorage from 'react-native-encrypted-storage';
import { secureStorage } from '../secureStorage';

const mock = EncryptedStorage as any;

beforeEach(() => jest.clearAllMocks());

describe('secureStorage', () => {
  it('getItem delegates to EncryptedStorage', async () => {
    mock.getItem.mockResolvedValue('stored-value');
    const result = await secureStorage.getItem('my-key');
    expect(mock.getItem).toHaveBeenCalledWith('my-key');
    expect(result).toBe('stored-value');
  });

  it('setItem delegates to EncryptedStorage', async () => {
    mock.setItem.mockResolvedValue(undefined);
    await secureStorage.setItem('my-key', 'my-value');
    expect(mock.setItem).toHaveBeenCalledWith('my-key', 'my-value');
  });

  it('removeItem delegates to EncryptedStorage', async () => {
    mock.removeItem.mockResolvedValue(undefined);
    await secureStorage.removeItem('my-key');
    expect(mock.removeItem).toHaveBeenCalledWith('my-key');
  });
});
