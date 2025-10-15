import { supabase, Article } from './supabase';

export const supabaseClient = {
  async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      throw new Error(error.message);
    }

    return data || [];
  },
};
