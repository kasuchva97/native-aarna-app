import { useState, useEffect, useCallback } from 'react';
import { fetchStoriesByCategory } from '../api/storiesApi';
import { Story } from '../types';

interface UseStoriesResult {
  stories: Story[];
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export const useStories = (category: string): UseStoriesResult => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!category) return;
    try {
      setLoading(true);
      setError(false);
      const data = await fetchStoriesByCategory(category);
      setStories(data);
    } catch {
      setError(true);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  return { stories, loading, error, refetch: load };
};
