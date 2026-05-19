import { useState, useEffect } from 'react';
import { fetchStoryById } from '../api/storiesApi';
import { Story } from '../types';

interface UseStoryResult {
  story: Story | null;
  loading: boolean;
  error: string | null;
}

export const useStory = (storyId: string): UseStoryResult => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storyId) return;
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStoryById(storyId);
        if (!cancelled) setStory(data);
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? 'Failed to load story');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [storyId]);

  return { story, loading, error };
};
