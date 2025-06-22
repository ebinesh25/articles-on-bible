/**
 * Google Analytics Control Utilities
 * Provides functions to dynamically enable/disable tracking
 */

import { getTrackingId } from './gtagLoader';

/**
 * Disable Google Analytics tracking globally
 * This will stop all event tracking immediately
 */
export const disableGoogleAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    window.GA_TRACKING_DISABLED = true;
    console.log('Google Analytics tracking disabled');
  }
};

/**
 * Enable Google Analytics tracking globally
 * This will resume event tracking if gtag is available
 */
export const enableGoogleAnalytics = (): void => {
  if (typeof window !== 'undefined') {
    window.GA_TRACKING_DISABLED = false;
    console.log('Google Analytics tracking enabled');
  }
};

/**
 * Check if Google Analytics tracking is currently enabled
 */
export const isGoogleAnalyticsEnabled = (): boolean => {
  const disableTracking = import.meta.env.MODE === 'development' || 
                         import.meta.env.VITE_DISABLE_GA === 'true' ||
                         (typeof window !== 'undefined' && window.GA_TRACKING_DISABLED === true);
  
  return !disableTracking && 
         typeof window !== 'undefined' && 
         typeof window.gtag !== 'undefined';
};

/**
 * Get current tracking status information
 */
export const getTrackingStatus = () => {
  return {
    enabled: isGoogleAnalyticsEnabled(),
    trackingId: getTrackingId(),
    gtagAvailable: typeof window !== 'undefined' && typeof window.gtag !== 'undefined',
    environmentDisabled: import.meta.env.VITE_DISABLE_GA === 'true',
    developmentMode: import.meta.env.MODE === 'development',
    manuallyDisabled: typeof window !== 'undefined' && window.GA_TRACKING_DISABLED === true
  };
};

/**
 * React hook to manage Google Analytics tracking state
 */
import { useState, useCallback } from 'react';

export const useGoogleAnalyticsControl = () => {
  const [isEnabled, setIsEnabled] = useState(isGoogleAnalyticsEnabled());

  const enable = useCallback(() => {
    enableGoogleAnalytics();
    setIsEnabled(true);
  }, []);

  const disable = useCallback(() => {
    disableGoogleAnalytics();
    setIsEnabled(false);
  }, []);

  const toggle = useCallback(() => {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
  }, [isEnabled, enable, disable]);

  return {
    isEnabled,
    enable,
    disable,
    toggle,
    status: getTrackingStatus()
  };
};
