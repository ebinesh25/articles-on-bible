/**
 * API Configuration Utilities
 * Manages API URL configuration from environment variables
 */

/**
 * Get the API base URL from environment variables
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:8000';
};

/**
 * API configuration object
 */
export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    // Add your API endpoints here
    ARTICLES: '/api/articles',
    CONTENT: '/api/content',
    HEALTH: '/api/health',
  },
  TIMEOUT: 10000, // 10 seconds
};

/**
 * Get full API URL for an endpoint
 */
export const getApiEndpoint = (endpoint: string): string => {
  const baseUrl = getApiUrl();
  // Remove leading slash from endpoint if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

/**
 * Check if API URL is configured
 */
export const isApiConfigured = (): boolean => {
  const apiUrl = getApiUrl();
  return Boolean(apiUrl && apiUrl.trim().length > 0);
};

/**
 * Get API configuration status for debugging
 */
export const getApiStatus = () => {
  return {
    baseUrl: getApiUrl(),
    isConfigured: isApiConfigured(),
    environment: import.meta.env.MODE,
    endpoints: API_CONFIG.ENDPOINTS,
  };
};
