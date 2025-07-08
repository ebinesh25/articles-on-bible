import { useState, useEffect } from 'react';
import { DynamicPage } from '../types';

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
        
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const response = await fetch(`${apiUrl}/articles/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Article not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform API data to match our DynamicPage interface
        const transformedArticle: DynamicPage = {
          id: data.id || id,
          title: {
            tamil: data.title?.tamil || data.title_tamil || data.title || 'தலைப்பு இல்லை',
            english: data.title?.english || data.title_english || data.title || 'No Title'
          },
          theme: data.theme || 'gray',
          content: {
            tamil: data.content?.tamil || data.content_tamil || [
              { type: 'mainText', value: data.description?.tamil || data.description || 'உள்ளடக்கம் இல்லை' }
            ],
            english: data.content?.english || data.content_english || [
              { type: 'mainText', value: data.description?.english || data.description || 'No content available' }
            ]
          }
        };
        
        setArticle(transformedArticle);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
        
        // Fallback to static data if API fails
        try {
          const { default: contentData } = await import('../data/content.json');
          const staticArticle = contentData.pages?.find((p: any) => p.id === id);
          if (staticArticle) {
            setArticle(staticArticle);
            setError(null); // Clear error since we found fallback data
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