/**
 * Google Analytics Script Loader
 * Dynamically loads gtag script with environment-based tracking ID
 */

export const loadGoogleAnalytics = () => {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID || 'G-CVRLXZ6V3C';
  const isDisabled = import.meta.env.VITE_DISABLE_GA === 'true' || 
                    import.meta.env.MODE === 'development';

  // Don't load if tracking is disabled
  if (isDisabled) {
    console.log('Google Analytics disabled via environment variables');
    return;
  }

  // Check if already loaded
  if (document.querySelector(`script[src*="gtag/js?id=${trackingId}"]`)) {
    console.log('Google Analytics already loaded');
    return;
  }

  // Create and load gtag script
  const gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
  document.head.appendChild(gtagScript);

  // Initialize gtag
  const initScript = document.createElement('script');
  initScript.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${trackingId}', {
      anonymize_ip: true,
      send_page_view: false
    });
  `;
  document.head.appendChild(initScript);

  console.log(`Google Analytics loaded with tracking ID: ${trackingId}`);
};

/**
 * Get the current tracking ID from environment
 */
export const getTrackingId = (): string => {
  return import.meta.env.VITE_GA_TRACKING_ID || 'G-CVRLXZ6V3C';
};

/**
 * Check if Google Analytics should be loaded
 */
export const shouldLoadAnalytics = (): boolean => {
  return !(import.meta.env.VITE_DISABLE_GA === 'true' || 
          import.meta.env.MODE === 'development');
};
