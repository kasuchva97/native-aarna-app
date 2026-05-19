import { supabase } from '../lib/supabaseClient';
import { God, Story, Poem } from '../types';

export const fetchGods = async (): Promise<God[]> => {
  const { data, error } = await supabase
    .from('gods')
    .select('*')
    .order('name');
  if (error) throw error;
  return data ?? [];
};

export const fetchStoriesByCategory = async (category: string): Promise<Story[]> => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const fetchStoryById = async (id: string): Promise<Story> => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const fetchPoemsByCategory = async (category: string): Promise<Poem[]> => {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
};
