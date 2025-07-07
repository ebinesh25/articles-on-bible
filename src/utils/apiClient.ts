/**
 * API Client Utilities
 * Provides standardized methods for making API calls
 */

import { getApiUrl, getApiEndpoint, API_CONFIG } from './apiConfig';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public url: string;

  constructor(message: string, status: number, statusText: string, url: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
  }
}

/**
 * Generic request data type
 */
export type RequestData = Record<string, unknown> | FormData | string | null;

/**
 * Default request options
 */
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Enhanced fetch wrapper with error handling and timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText,
        url
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'Request Timeout', url);
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    throw new ApiError(
      errorMessage,
      0,
      'Network Error',
      url
    );
  }
};

/**
 * Generic API client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = getApiEndpoint(endpoint);
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'GET',
    });
    return response.json();
  },

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: RequestData, options: RequestInit = {}): Promise<T> {
    const url = getApiEndpoint(endpoint);
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: RequestData, options: RequestInit = {}): Promise<T> {
    const url = getApiEndpoint(endpoint);
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = getApiEndpoint(endpoint);
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'DELETE',
    });
    return response.json();
  },

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: RequestData, options: RequestInit = {}): Promise<T> {
    const url = getApiEndpoint(endpoint);
    const response = await fetchWithTimeout(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
    return response.json();
  },

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get(API_CONFIG.ENDPOINTS.HEALTH);
  },

  /**
   * Get API base URL
   */
  getBaseUrl(): string {
    return getApiUrl();
  }
};

/**
 * Article data types
 */
export interface ArticleData {
  id?: string;
  title: {
    tamil: string;
    english: string;
  };
  content: {
    tamil: Array<{ type: string; value: string }>;
    english: Array<{ type: string; value: string }>;
  };
  theme?: string;
}

/**
 * Specific API service methods
 */
export const articleService = {
  /**
   * Fetch all articles
   */
  async getArticles(): Promise<ArticleData[]> {
    return apiClient.get(API_CONFIG.ENDPOINTS.ARTICLES);
  },

  /**
   * Fetch single article by ID
   */
  async getArticle(id: string): Promise<ArticleData> {
    return apiClient.get(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`);
  },

  /**
   * Create new article
   */
  async createArticle(articleData: Omit<ArticleData, 'id'>): Promise<ArticleData> {
    return apiClient.post(API_CONFIG.ENDPOINTS.ARTICLES, articleData);
  },

  /**
   * Update article
   */
  async updateArticle(id: string, articleData: Partial<ArticleData>): Promise<ArticleData> {
    return apiClient.put(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`, articleData);
  },

  /**
   * Delete article
   */
  async deleteArticle(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`${API_CONFIG.ENDPOINTS.ARTICLES}/${id}`);
  }
};

/**
 * Content service methods
 */
export const contentService = {
  /**
   * Fetch content data
   */
  async getContent(): Promise<{ pages: ArticleData[]; author: { tamil: string; english: string } }> {
    return apiClient.get(API_CONFIG.ENDPOINTS.CONTENT);
  },

  /**
   * Update content data
   */
  async updateContent(contentData: RequestData): Promise<{ success: boolean }> {
    return apiClient.put(API_CONFIG.ENDPOINTS.CONTENT, contentData);
  }
};
