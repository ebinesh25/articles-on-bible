import { useEffect } from 'react';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

/**
 * Check if Google Analytics tracking is enabled
 */
const isTrackingEnabled = (): boolean => {
  const disableTracking = import.meta.env.MODE === 'development' || 
                         import.meta.env.VITE_DISABLE_GA === 'true' ||
                         (typeof window !== 'undefined' && window.GA_TRACKING_DISABLED === true);
  
  return !disableTracking && 
         typeof window !== 'undefined' && 
         typeof window.gtag !== 'undefined';
};

/**
 * Global click tracker component that automatically tracks clicks on specific elements
 * Add this to your main App component to track all button and link clicks
 */
export const GlobalClickTracker: React.FC = () => {
  const { trackEvent } = useGoogleAnalytics();

  useEffect(() => {
    // Early return if tracking is disabled
    if (!isTrackingEnabled()) {
      return;
    }
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        const buttonText = button?.textContent?.trim() || 'unknown';
        const buttonClass = button?.className || '';
        
        trackEvent('global_button_click', {
          button_text: buttonText,
          button_class: buttonClass,
          element_type: 'button'
        });
      }
      
      // Track link clicks (excluding router Link components which are handled separately)
      else if (target.tagName === 'A' && (target as HTMLAnchorElement).href.startsWith('http')) {
        const link = target as HTMLAnchorElement;
        const linkText = link.textContent?.trim() || 'unknown';
        const href = link.href;
        
        trackEvent('external_link_click', {
          link_text: linkText,
          link_url: href,
          element_type: 'external_link'
        });
      }
      
      // Track clicks on elements with data-track attributes
      else if (target.hasAttribute('data-track') || target.closest('[data-track]')) {
        const trackElement = target.hasAttribute('data-track') ? target : target.closest('[data-track]');
        const trackName = trackElement?.getAttribute('data-track') || 'unknown';
        const trackData = trackElement?.getAttribute('data-track-data');
        
        let additionalData = {};
        if (trackData) {
          try {
            additionalData = JSON.parse(trackData);
          } catch {
            // If parsing fails, just use the string as is
            additionalData = { data: trackData };
          }
        }
        
        trackEvent('custom_element_click', {
          track_name: trackName,
          element_type: 'custom',
          ...additionalData
        });
      }
    };

    // Add event listener for clicks
    document.addEventListener('click', handleGlobalClick);

    // Track scroll events for engagement with improved debouncing
    let scrollTimeout: number;
    let lastMilestone = 0;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollPercent = Math.floor(
          ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
        );
        
        // Define milestones
        const milestones = [25, 50, 75, 90];
        const nextMilestone = milestones.find(m => scrollPercent >= m && m > lastMilestone);
        
        if (nextMilestone) {
          trackEvent('scroll_milestone', { 
            event_category: 'engagement',
            event_label: `${nextMilestone}%`,
            milestone: `${nextMilestone}%`,
            scroll_percentage: scrollPercent
          });
          lastMilestone = nextMilestone;
        }
      }, 500); // Reduced debounce time for better responsiveness
    };

    window.addEventListener('scroll', handleScroll);

    // Track JavaScript errors
    const handleError = (event: ErrorEvent) => {
      trackEvent('js_error', {
        event_category: 'error',
        event_label: event.message,
        error_message: event.message,
        filename: event.filename || 'unknown',
        line_number: event.lineno || 0,
        column_number: event.colno || 0
      });
    };

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackEvent('promise_rejection', {
        event_category: 'error',
        event_label: 'Unhandled Promise Rejection',
        error_reason: event.reason?.toString() || 'Unknown error'
      });
    };

    // Track network errors (fetch failures)
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      return originalFetch(...args).catch((error) => {
        trackEvent('network_error', {
          event_category: 'error',
          event_label: 'Fetch Error',
          error_message: error.message,
          url: args[0]?.toString() || 'unknown'
        });
        throw error; // Re-throw to maintain original behavior
      });
    };

    // Add error event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      clearTimeout(scrollTimeout);
    };
  }, [trackEvent]);

  return null; // This component doesn't render anything
};

export default GlobalClickTracker;
