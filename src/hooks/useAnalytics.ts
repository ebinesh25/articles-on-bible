import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackTimeOnPage, trackNavigation } from '../utils/analytics';

export const usePageTracking = (pageTitle?: string) => {
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    const currentTime = Date.now();
    const currentPath = location.pathname + location.search;

    // Track navigation if there was a previous page
    if (previousPathRef.current && previousPathRef.current !== currentPath) {
      trackNavigation(previousPathRef.current, currentPath);
    }

    // Track time spent on previous page
    if (previousPathRef.current && startTimeRef.current) {
      const timeSpent = (currentTime - startTimeRef.current) / 1000; // Convert to seconds
      if (timeSpent > 1) { // Only track if user spent more than 1 second
        trackTimeOnPage(timeSpent, previousPathRef.current);
      }
    }

    // Track current page view
    trackPageView({
      page_title: pageTitle || document.title,
      page_path: currentPath,
    });

    // Update refs for next navigation
    startTimeRef.current = currentTime;
    previousPathRef.current = currentPath;

    // Track time when component unmounts or page changes
    return () => {
      const endTime = Date.now();
      const timeSpent = (endTime - startTimeRef.current) / 1000;
      if (timeSpent > 1) {
        trackTimeOnPage(timeSpent, currentPath);
      }
    };
  }, [location, pageTitle]);

  // Return the start time for other components to use if needed
  return startTimeRef.current;
};

export const useTimeTracking = (eventName: string) => {
  const startTimeRef = useRef<number>(Date.now());

  const trackElapsedTime = (label?: string) => {
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    trackTimeOnPage(elapsed, label || eventName);
  };

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  return trackElapsedTime;
};
