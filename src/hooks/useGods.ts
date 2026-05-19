import { useState, useEffect, useCallback } from 'react';
import { fetchGods } from '../api/storiesApi';
import { God } from '../types';

interface UseGodsResult {
  gods: God[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export const useGods = (): UseGodsResult => {
  const [gods, setGods] = useState<God[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchGods();
      setGods(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { gods, loading, error, refetch: load };
};
