import React from 'react';
import { getTrackingStatus } from '../utils/analyticsControl';
import { shouldLoadAnalytics, getTrackingId } from '../utils/gtagLoader';

/**
 * Debug component to show current Google Analytics configuration
 * Only renders in development mode
 */
const AnalyticsDebug: React.FC = () => {
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  const status = getTrackingStatus();
  const trackingId = getTrackingId();
  const shouldLoad = shouldLoadAnalytics();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm">
      <h4 className="font-bold text-yellow-400 mb-2">🔍 GA Debug</h4>
      <div className="space-y-1">
        <div>ID: <span className="text-green-400">{trackingId}</span></div>
        <div>Status: <span className={status.enabled ? 'text-green-400' : 'text-red-400'}>
          {status.enabled ? 'Enabled' : 'Disabled'}
        </span></div>
        <div>Mode: <span className="text-blue-400">{import.meta.env.MODE}</span></div>
        <div>Should Load: <span className={shouldLoad ? 'text-green-400' : 'text-red-400'}>
          {shouldLoad ? 'Yes' : 'No'}
        </span></div>
        <div>gtag Available: <span className={status.gtagAvailable ? 'text-green-400' : 'text-red-400'}>
          {status.gtagAvailable ? 'Yes' : 'No'}
        </span></div>
      </div>
    </div>
  );
};

export default AnalyticsDebug;
