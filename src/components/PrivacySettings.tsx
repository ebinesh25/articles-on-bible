import React from 'react';
import { useGoogleAnalyticsControl } from '../utils/analyticsControl';

/**
 * Privacy Settings Component
 * Allows users to control Google Analytics tracking
 */
const PrivacySettings: React.FC = () => {
  const { isEnabled, toggle, status } = useGoogleAnalyticsControl();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md">
      <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggle}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm">Allow Analytics Tracking</span>
        </label>
        
        <p className="text-xs text-gray-600">
          {isEnabled 
            ? "Analytics tracking is enabled. We collect anonymous usage data to improve your experience."
            : "Analytics tracking is disabled. No usage data is being collected."
          }
        </p>

        {/* Debug information (only in development) */}
        {import.meta.env.MODE === 'development' && (
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500">Debug Info</summary>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
              {JSON.stringify(status, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default PrivacySettings;
