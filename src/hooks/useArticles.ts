import { useState, useEffect } from 'react';
import { DynamicPage } from '../types';
import { supabase } from '../utils/supabase';

interface UseArticlesReturn {
  articles: DynamicPage[];
  loading: boolean;
  error: string | null;
}

export const useArticles = (): UseArticlesReturn => {
  const [articles, setArticles] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw supabaseError;
        }

        const transformedArticles: DynamicPage[] = (data || []).map((article) => ({
          id: article.id,
          title: {
            tamil: article.title_tamil,
            english: article.title_english
          },
          theme: article.theme,
          content: {
            tamil: article.content_tamil,
            english: article.content_english
          }
        }));

        setArticles(transformedArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');

        try {
          const { default: contentData } = await import('../data/content.json');
          const fallbackArticles = (contentData.pages || []).map(page => ({
            ...page,
            theme: page.theme || 'gray'
          }));
          setArticles(fallbackArticles);
        } catch (fallbackErr) {
          console.error('Error loading fallback data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading, error };
};