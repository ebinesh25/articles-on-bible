/**
 * API React Hooks
 * Provides React hooks for API interactions
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, articleService, contentService, ApiError, type ArticleData, type RequestData } from '../utils/apiClient';
import { getApiStatus } from '../utils/apiConfig';

/**
 * Generic API state interface
 */
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to manage API state
 */
export const useApiState = <T>(): [ApiState<T>, (data: T | null, loading?: boolean, error?: string | null) => void] => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const updateState = useCallback((data: T | null, loading = false, error: string | null = null) => {
    setState({ data, loading, error });
  }, []);

  return [state, updateState];
};

/**
 * Hook for API health check
 */
export const useApiHealth = () => {
  const [state, updateState] = useApiState<{ status: string; timestamp: string }>();

  const checkHealth = useCallback(async () => {
    updateState(null, true);
    try {
      const data = await apiClient.healthCheck();
      updateState(data, false);
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Unknown error';
      updateState(null, false, errorMessage);
      throw error;
    }
  }, [updateState]);

  return {
    ...state,
    checkHealth,
    apiStatus: getApiStatus(),
  };
};

/**
 * Hook for fetching articles
 */
export const useArticles = () => {
  const [state, updateState] = useApiState<ArticleData[]>();

  const fetchArticles = useCallback(async () => {
    updateState(null, true);
    try {
      const data = await articleService.getArticles();
      updateState(data, false);
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch articles';
      updateState(null, false, errorMessage);
      throw error;
    }
  }, [updateState]);

  const createArticle = useCallback(async (articleData: Omit<ArticleData, 'id'>) => {
    try {
      const data = await articleService.createArticle(articleData);
      // Refresh the articles list
      await fetchArticles();
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to create article';
      updateState(state.data, false, errorMessage);
      throw error;
    }
  }, [updateState, fetchArticles, state.data]);

  const updateArticle = useCallback(async (id: string, articleData: Partial<ArticleData>) => {
    try {
      const data = await articleService.updateArticle(id, articleData);
      // Update the local state
      if (state.data) {
        const updatedArticles = state.data.map(article => 
          article.id === id ? { ...article, ...data } : article
        );
        updateState(updatedArticles, false);
      }
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to update article';
      updateState(state.data, false, errorMessage);
      throw error;
    }
  }, [updateState, state.data]);

  const deleteArticle = useCallback(async (id: string) => {
    try {
      const result = await articleService.deleteArticle(id);
      // Remove from local state
      if (state.data) {
        const filteredArticles = state.data.filter(article => article.id !== id);
        updateState(filteredArticles, false);
      }
      return result;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete article';
      updateState(state.data, false, errorMessage);
      throw error;
    }
  }, [updateState, state.data]);

  return {
    ...state,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
  };
};

/**
 * Hook for fetching a single article
 */
export const useArticle = (id: string) => {
  const [state, updateState] = useApiState<ArticleData>();

  const fetchArticle = useCallback(async () => {
    if (!id) return;
    
    updateState(null, true);
    try {
      const data = await articleService.getArticle(id);
      updateState(data, false);
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch article';
      updateState(null, false, errorMessage);
      throw error;
    }
  }, [id, updateState]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  return {
    ...state,
    fetchArticle,
  };
};

/**
 * Hook for content management
 */
export const useContent = () => {
  const [state, updateState] = useApiState<{ pages: ArticleData[]; author: { tamil: string; english: string } }>();

  const fetchContent = useCallback(async () => {
    updateState(null, true);
    try {
      const data = await contentService.getContent();
      updateState(data, false);
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch content';
      updateState(null, false, errorMessage);
      throw error;
    }
  }, [updateState]);

  const updateContent = useCallback(async (contentData: RequestData) => {
    try {
      const result = await contentService.updateContent(contentData);
      // Refresh content after update
      await fetchContent();
      return result;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to update content';
      updateState(state.data, false, errorMessage);
      throw error;
    }
  }, [updateState, fetchContent, state.data]);

  return {
    ...state,
    fetchContent,
    updateContent,
  };
};

/**
 * Hook for making custom API calls
 */
export const useApiCall = <T>() => {
  const [state, updateState] = useApiState<T>();

  const makeCall = useCallback(async (apiFunction: () => Promise<T>) => {
    updateState(null, true);
    try {
      const data = await apiFunction();
      updateState(data, false);
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : 'API call failed';
      updateState(null, false, errorMessage);
      throw error;
    }
  }, [updateState]);

  return {
    ...state,
    makeCall,
  };
};
