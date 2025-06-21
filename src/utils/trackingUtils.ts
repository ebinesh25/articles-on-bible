import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

/**
 * Utility functions for easy Google Analytics tracking
 */

export const useEasyTracking = () => {
  const { trackEvent, trackButtonClick } = useGoogleAnalytics();

  /**
   * Add this to any button's onClick to track it
   * Usage: onClick={() => trackButton('my-button-name')}
   */
  const trackButton = (buttonName: string, additionalData?: Record<string, string | number | boolean>) => {
    trackButtonClick(buttonName, additionalData);
  };

  /**
   * Track form submissions
   * Usage: onSubmit={(e) => { trackForm('contact-form'); handleSubmit(e); }}
   */
  const trackForm = (formName: string, additionalData?: Record<string, string | number | boolean>) => {
    trackEvent('form_submission', {
      event_category: 'form',
      event_label: formName,
      form_name: formName,
      ...additionalData
    });
  };

  /**
   * Track file downloads
   * Usage: onClick={() => trackDownload('my-file.pdf')}
   */
  const trackDownload = (fileName: string, fileType?: string) => {
    trackEvent('file_download', {
      event_category: 'download',
      event_label: fileName,
      file_name: fileName,
      file_type: fileType || fileName.split('.').pop() || 'unknown'
    });
  };

  /**
   * Track video/audio interactions
   * Usage: onPlay={() => trackMedia('my-video', 'play')}
   */
  const trackMedia = (mediaName: string, action: 'play' | 'pause' | 'ended' | 'seeked') => {
    trackEvent('media_interaction', {
      event_category: 'media',
      event_label: `${mediaName}_${action}`,
      media_name: mediaName,
      media_action: action
    });
  };

  /**
   * Track user engagement milestones
   * Usage: trackEngagement('read_full_article', { article_id: 'my-article' })
   */
  const trackEngagement = (milestone: string, additionalData?: Record<string, string | number | boolean>) => {
    trackEvent('user_engagement', {
      event_category: 'engagement',
      event_label: milestone,
      milestone,
      ...additionalData
    });
  };

  return {
    trackButton,
    trackForm,
    trackDownload,
    trackMedia,
    trackEngagement,
    trackEvent, // For custom events
  };
};

export default useEasyTracking;
