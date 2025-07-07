import { useState, useEffect } from 'react';
import { DynamicPage } from '../types';

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
        
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error('API URL not configured');
        }

        const response = await fetch(`${apiUrl}/articles/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle the API response structure - it has an "articles" array
        const articlesArray = data.articles || data;
        
        // Transform API data to match our DynamicPage interface
        const transformedArticles: DynamicPage[] = Array.isArray(articlesArray) 
          ? articlesArray.map((article: any) => ({
              id: article.id || article._id || Math.random().toString(36).substr(2, 9),
              title: {
                tamil: article.title?.tamil || article.title_tamil || article.title || 'தலைப்பு இல்லை',
                english: article.title?.english || article.title_english || article.title || 'No Title'
              },
              theme: article.theme || 'gray',
              content: {
                tamil: article.content?.tamil || article.content_tamil || [
                  { type: 'mainText', value: article.excerpt?.tamil || article.description?.tamil || article.description || 'உள்ளடக்கம் இல்லை' }
                ],
                english: article.content?.english || article.content_english || [
                  { type: 'mainText', value: article.excerpt?.english || article.description?.english || article.description || 'No content available' }
                ]
              }
            }))
          : [];
        
        setArticles(transformedArticles);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        
        // Fallback to static data if API fails
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