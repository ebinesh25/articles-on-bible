import React, { useEffect } from 'react';
import { useArticles, useApiHealth } from '../hooks/useApi';

/**
 * Example component demonstrating API usage
 */
const ApiExample: React.FC = () => {
  const { 
    data: articles, 
    loading: articlesLoading, 
    error: articlesError, 
    fetchArticles 
  } = useArticles();
  
  const { 
    data: healthData, 
    loading: healthLoading, 
    error: healthError, 
    checkHealth,
    apiStatus 
  } = useApiHealth();

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Check API health on component mount
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Integration Example</h1>
      
      {/* API Status Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">API Status</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Base URL:</strong> 
              <span className="ml-2 font-mono text-blue-600">{apiStatus.baseUrl}</span>
            </div>
            <div>
              <strong>Environment:</strong> 
              <span className="ml-2 text-green-600">{apiStatus.environment}</span>
            </div>
            <div>
              <strong>Configured:</strong> 
              <span className={`ml-2 ${apiStatus.isConfigured ? 'text-green-600' : 'text-red-600'}`}>
                {apiStatus.isConfigured ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Health Check Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Health Check</h2>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <button 
            onClick={checkHealth}
            disabled={healthLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
          >
            {healthLoading ? 'Checking...' : 'Check API Health'}
          </button>
          
          {healthData && (
            <div className="p-3 bg-green-50 rounded">
              <div className="text-green-800">
                <strong>Status:</strong> {healthData.status}
              </div>
              <div className="text-green-600 text-sm">
                <strong>Timestamp:</strong> {healthData.timestamp}
              </div>
            </div>
          )}
          
          {healthError && (
            <div className="p-3 bg-red-50 rounded">
              <div className="text-red-800">
                <strong>Error:</strong> {healthError}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Articles Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Articles from API</h2>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <button 
            onClick={fetchArticles}
            disabled={articlesLoading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
          >
            {articlesLoading ? 'Loading...' : 'Fetch Articles'}
          </button>
          
          {articlesLoading && (
            <div className="text-gray-600">Loading articles...</div>
          )}
          
          {articlesError && (
            <div className="p-3 bg-red-50 rounded mb-4">
              <div className="text-red-800">
                <strong>Error:</strong> {articlesError}
              </div>
              <div className="text-red-600 text-sm mt-1">
                This is expected if you don't have an API server running at {apiStatus.baseUrl}
              </div>
            </div>
          )}
          
          {articles && articles.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Found {articles.length} articles:</h3>
              <div className="space-y-2">
                {articles.map((article, index) => (
                  <div key={article.id || index} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">
                      {article.title.english} / {article.title.tamil}
                    </div>
                    {article.id && (
                      <div className="text-sm text-gray-600">ID: {article.id}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {articles && articles.length === 0 && (
            <div className="text-gray-600">No articles found.</div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-800 space-y-2">
            <p>
              <strong>1. Start your API server:</strong> Make sure you have an API server running at 
              <code className="bg-blue-100 px-1 rounded mx-1">{apiStatus.baseUrl}</code>
            </p>
            <p>
              <strong>2. Configure endpoints:</strong> The API expects these endpoints:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              {Object.entries(apiStatus.endpoints).map(([key, endpoint]) => (
                <li key={key}>
                  <code className="bg-blue-100 px-1 rounded">{endpoint}</code> - {key}
                </li>
              ))}
            </ul>
            <p>
              <strong>3. Environment variables:</strong> Set <code className="bg-blue-100 px-1 rounded">VITE_API_URL</code> in your .env file
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiExample;
