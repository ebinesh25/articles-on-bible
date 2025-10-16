import { useState, useEffect } from 'react';
import { supabaseClient } from '../utils/supabaseClient';
import { Article } from '../utils/supabase';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true);
        const data = await supabaseClient.getArticles();
        setArticles(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return { articles, loading, error };
}
