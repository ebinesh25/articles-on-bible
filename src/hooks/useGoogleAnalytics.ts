import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: Record<string, unknown>[];
    GA_TRACKING_DISABLED?: boolean; // Global flag to disable tracking
  }
}

// Configuration for Google Analytics
const GA_CONFIG = {
  // Set to true to disable all Google Analytics tracking
  // Can be controlled via environment variables or user preferences
  DISABLE_TRACKING: import.meta.env.MODE === 'development' || 
                   import.meta.env.VITE_DISABLE_GA === 'true' ||
                   (typeof window !== 'undefined' && window.GA_TRACKING_DISABLED === true),
  
  // Tracking ID from environment variable
  GA_ID: import.meta.env.VITE_GA_TRACKING_ID || 'G-CVRLXZ6V3C' // Fallback to hardcoded ID
};

/**
 * Helper function to check if tracking is enabled
 */
const isTrackingEnabled = (): boolean => {
  return !GA_CONFIG.DISABLE_TRACKING && 
         typeof window !== 'undefined' && 
         typeof window.gtag !== 'undefined';
};

/**
 * Custom hook for Google Analytics tracking
 * Tracks page views, time spent on pages, and provides utility functions
 */
export const useGoogleAnalytics = () => {
  const location = useLocation();
  const pageStartTime = useRef<number>(Date.now());
  const previousPath = useRef<string>('');

  // Track page views and time spent on previous page
  useEffect(() => {
    if (!isTrackingEnabled()) return;

    const currentTime = Date.now();
    const currentPath = location.pathname + location.search;

    // Track time spent on previous page (if there was one)
    if (previousPath.current && previousPath.current !== currentPath) {
      const timeSpent = Math.round((currentTime - pageStartTime.current) / 1000); // in seconds
      
      window.gtag('event', 'page_time_spent', {
        event_category: 'engagement',
        event_label: previousPath.current,
        value: timeSpent,
        page_path: previousPath.current,
        time_seconds: timeSpent
      });
    }

    // Track virtual page view for SPA
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: currentPath
    });

    // Also send to config for proper tracking
    window.gtag('config', GA_CONFIG.GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: currentPath
    });

    // Update tracking variables
    pageStartTime.current = currentTime;
    previousPath.current = currentPath;
  }, [location]);

  // Track time spent when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isTrackingEnabled() || !previousPath.current) return;
      
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000);
      
      window.gtag('event', 'page_time_spent_final', {
        event_category: 'engagement',
        event_label: previousPath.current,
        value: timeSpent,
        page_path: previousPath.current,
        time_seconds: timeSpent
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isTrackingEnabled() && previousPath.current) {
        const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000);
        
        window.gtag('event', 'page_time_spent_visibility', {
          event_category: 'engagement',
          event_label: previousPath.current,
          value: timeSpent,
          page_path: previousPath.current,
          time_seconds: timeSpent
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Utility functions for manual tracking
  const trackEvent = (eventName: string, parameters: Record<string, string | number | boolean> = {}) => {
    if (!isTrackingEnabled()) return;
    
    window.gtag('event', eventName, {
      event_category: 'user_interaction',
      page_path: location.pathname + location.search,
      ...parameters
    });
  };

  const trackButtonClick = (buttonName: string, additionalData: Record<string, string | number | boolean> = {}) => {
    if (!isTrackingEnabled()) return;
    
    trackEvent('button_click', {
      event_category: 'button_interaction',
      event_label: buttonName,
      button_name: buttonName,
      page_path: location.pathname + location.search,
      ...additionalData
    });
  };

  const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
    trackEvent('language_change', {
      event_category: 'language',
      event_label: `${fromLanguage}_to_${toLanguage}`,
      from_language: fromLanguage,
      to_language: toLanguage
    });
  };

  const trackArticleView = (articleId: string, articleTitle: string) => {
    trackEvent('article_view', {
      event_category: 'content',
      event_label: articleId,
      article_id: articleId,
      article_title: articleTitle
    });
  };

  const trackSearchQuery = (query: string, resultsCount: number = 0) => {
    trackEvent('search', {
      event_category: 'search',
      event_label: query,
      search_term: query,
      results_count: resultsCount
    });
  };

  const trackPerformance = (metricName: string, value: number, unit: 'ms' | 'bytes' | 'count' = 'ms') => {
    trackEvent('performance_metric', {
      event_category: 'performance',
      event_label: metricName,
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit
    });
  };

  const trackPageLoadTime = () => {
    if (typeof window !== 'undefined' && window.performance) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      if (loadTime > 0) {
        trackPerformance('page_load_time', loadTime, 'ms');
      }
    }
  };

  return {
    trackEvent,
    trackButtonClick,
    trackLanguageChange,
    trackArticleView,
    trackSearchQuery,
    trackPerformance,
    trackPageLoadTime
  };
};
