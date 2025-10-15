import { useState, useEffect } from 'react';
import { Article, supabase } from '../utils/supabase';

interface UseArticleReturn {
  article: Article | null;
  loading: boolean;
  error: string | null;
}

export const useArticle = (id: string | undefined): UseArticleReturn => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('No article ID provided');
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (supabaseError) {
          throw supabaseError;
        }

        if (!data) {
          throw new Error('Article not found');
        }

        setArticle(data as Article);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
};