import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Home } from 'lucide-react';
import { Language } from '../types';
import { useDocumentTitle } from '../hooks/useSEO';
import { getUrlWithLanguage } from '../utils/urlUtils';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

interface NotFoundPageProps {
  language: Language;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ language }) => {
  const { trackEvent } = useGoogleAnalytics();
  
  // Set SEO meta for 404 page
  useDocumentTitle({
    title: language === 'tamil' ? 'பக்கம் கிடைக்கவில்லை | ஜெஸ்ஸி ஆனந்த்' : 'Page Not Found | Jessie Anand',
    description: language === 'tamil' 
      ? 'நீங்கள் தேடும் பக்கம் இருக்காது அல்லது நகர்த்தப்பட்டிருக்கலாம்.'
      : 'The page you are looking for might not exist or has been moved.',
    language
  });

  // Track 404 page views
  useEffect(() => {
    trackEvent('page_not_found', {
      event_category: 'error',
      event_label: window.location.pathname,
      error_type: '404',
      page_path: window.location.pathname,
      referrer: document.referrer || 'direct'
    });
  }, [trackEvent]);

  const getFontClass = () => {
    return language === 'tamil' ? 'font-catamaran' : 'font-inter';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Book className="h-24 w-24 text-amber-600 mx-auto mb-6" />
          <h1 className={`text-6xl font-light text-gray-800 mb-4 ${getFontClass()}`}>
            404
          </h1>
          <h2 className={`text-3xl font-medium text-gray-700 mb-6 ${getFontClass()}`}>
            {language === 'tamil' ? 'பக்கம் கிடைக்கவில்லை' : 'Page Not Found'}
          </h2>
          <p className={`text-xl text-gray-600 mb-8 ${getFontClass()}`}>
            {language === 'tamil' 
              ? 'நீங்கள் தேடும் பக்கம் இருக்காது அல்லது நகர்த்தப்பட்டிருக்கலாம்.'
              : 'The page you are looking for might not exist or has been moved.'
            }
          </p>
        </div>
        
        <Link 
          to={getUrlWithLanguage('/', language)}
          className={`inline-flex items-center space-x-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors duration-200 ${getFontClass()}`}
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">
            {language === 'tamil' ? 'முகப்புக்கு திரும்பு' : 'Back to Home'}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
