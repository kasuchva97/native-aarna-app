import { useState, useEffect, useCallback } from 'react';
import { fetchAllStories } from '../api/storiesApi';
import { Story } from '../types';

interface UseAllStoriesResult {
  stories: Story[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export const useAllStories = (): UseAllStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await fetchAllStories();
      setStories(data);
    } catch {
      setError(true);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { stories, loading, error, refetch: load };
};
