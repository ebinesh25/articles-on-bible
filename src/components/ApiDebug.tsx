import React, { useState } from 'react';
import { useApiHealth } from '../hooks/useApi';

/**
 * API Debug Component
 * Provides debugging information and API testing capabilities
 */
const ApiDebug: React.FC = () => {
  const { data: healthData, loading, error, checkHealth, apiStatus } = useApiHealth();
  const [testEndpoint, setTestEndpoint] = useState('/api/health');
  const [testResult, setTestResult] = useState<string>('');

  const handleHealthCheck = async () => {
    try {
      await checkHealth();
      setTestResult('Health check successful');
    } catch (err) {
      setTestResult(`Health check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const testCustomEndpoint = async () => {
    try {
      const response = await fetch(`${apiStatus.baseUrl}${testEndpoint}`);
      const data = await response.json();
      setTestResult(`Success: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">API Debug Panel</h3>
      
      {/* API Status */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">API Configuration</h4>
        <div className="text-sm space-y-1">
          <div>Base URL: <span className="text-blue-600 font-mono">{apiStatus.baseUrl}</span></div>
          <div>Environment: <span className="text-green-600">{apiStatus.environment}</span></div>
          <div>Configured: <span className={apiStatus.isConfigured ? 'text-green-600' : 'text-red-600'}>
            {apiStatus.isConfigured ? 'Yes' : 'No'}
          </span></div>
        </div>
      </div>

      {/* Health Check */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Health Check</h4>
        <button 
          onClick={handleHealthCheck}
          disabled={loading}
          className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check API Health'}
        </button>
        
        {healthData && (
          <div className="mt-2 p-2 bg-green-50 rounded text-sm">
            <div>Status: <span className="text-green-600 font-medium">{healthData.status}</span></div>
            <div>Time: <span className="text-gray-600">{healthData.timestamp}</span></div>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-2 bg-red-50 rounded text-sm">
            <div className="text-red-600">Error: {error}</div>
          </div>
        )}
      </div>

      {/* Custom Endpoint Test */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Test Endpoint</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={testEndpoint}
            onChange={(e) => setTestEndpoint(e.target.value)}
            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="/api/endpoint"
          />
          <button 
            onClick={testCustomEndpoint}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Test
          </button>
        </div>
        
        {testResult && (
          <div className="p-2 bg-gray-50 rounded text-xs">
            <pre className="whitespace-pre-wrap overflow-auto max-h-32">{testResult}</pre>
          </div>
        )}
      </div>

      {/* Available Endpoints */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Available Endpoints</h4>
        <div className="text-xs space-y-1">
          {Object.entries(apiStatus.endpoints).map(([key, endpoint]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{key}:</span>
              <span className="text-blue-600 font-mono">{endpoint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiDebug;
