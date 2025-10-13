import { useState, useEffect } from 'react';
import { DynamicPage } from '../types';
import { supabase } from '../utils/supabase';

interface UseArticleReturn {
  article: DynamicPage | null;
  loading: boolean;
  error: string | null;
}

export const useArticle = (id: string | undefined): UseArticleReturn => {
  const [article, setArticle] = useState<DynamicPage | null>(null);
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

        const transformedArticle: DynamicPage = {
          id: data.id,
          title: {
            tamil: data.title_tamil,
            english: data.title_english
          },
          theme: data.theme,
          content: {
            tamil: data.content_tamil,
            english: data.content_english
          }
        };

        setArticle(transformedArticle);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch article');

        try {
          const { default: contentData } = await import('../data/content.json');
          const staticArticle = contentData.pages?.find((p: any) => p.id === id);
          if (staticArticle) {
            setArticle(staticArticle);
            setError(null);
          }
        } catch (fallbackErr) {
          console.error('Error loading fallback data:', fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
};