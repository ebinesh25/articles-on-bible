import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Heart, Star, Sparkles, Globe, Loader2 } from 'lucide-react';
import contentData from '../data/content.json';
import { Language, DynamicContentData, ContentEntry } from '../types';
import { useDocumentTitle } from '../hooks/useSEO';
import { getUrlWithLanguage } from '../utils/urlUtils';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { useArticles } from '../hooks/useArticles';

interface HomePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const HomePage: React.FC<HomePageProps> = ({ language, setLanguage }) => {
  const data = contentData as DynamicContentData;
  const { articles, loading, error } = useArticles();
  const { trackButtonClick } = useGoogleAnalytics();
  
  // Use API articles if available, otherwise fallback to static data
  const pages = articles.length > 0 ? articles : data.pages;

  // Set SEO meta for home page
  useDocumentTitle({ language });

  // Helper function to extract preview text from dynamic content
  const getPreviewText = (pageContent: { tamil: ContentEntry[]; english: ContentEntry[] }, language: Language): string => {
    const entries = pageContent[language];
    const mainTextEntry = entries.find((entry: ContentEntry) => entry.type === 'mainText');
    return mainTextEntry ? mainTextEntry.value.substring(0, 120) : '';
  };

  const getFontClass = () => {
    return language === 'tamil' ? 'font-catamaran' : 'font-inter';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-amber-700" />
              <span className={`text-xl font-semibold text-gray-800 ${getFontClass()}`}>
                {data.author[language]}
              </span>
            </Link>
            
            <button
              onClick={() => {
                trackButtonClick('language_toggle', { 
                  current_language: language,
                  target_language: language === 'tamil' ? 'english' : 'tamil'
                });
                setLanguage(language === 'tamil' ? 'english' : 'tamil');
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors duration-200"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">
                {language === 'tamil' ? 'English' : 'தமிழ்'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {/* Decorative elements */}
            <div className="absolute top-20 left-10 opacity-20">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-200 to-orange-200"></div>
            </div>
            <div className="absolute top-40 right-20 opacity-20">
              <Sparkles className="h-16 w-16 text-amber-400" />
            </div>
            <div className="absolute bottom-20 left-1/4 opacity-15">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-200 to-pink-200"></div>
            </div>

            <h1 className={`text-5xl md:text-7xl font-light text-gray-800 mb-6 tracking-wide ${getFontClass()}`}>
              {language === 'tamil' ? (
                <>
                  ஊக்கமளிக்கும்
                  <span className="block text-amber-700 font-medium">சிந்தனைகள்</span>
                </>
              ) : (
                <>
                  Inspirational
                  <span className="block text-amber-700 font-medium">Reflections</span>
                </>
              )}
            </h1>
            
            <p className={`text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed ${getFontClass()}`}>
              {language === 'tamil' 
                ? 'நம்பிக்கை, நம்பிக்கை மற்றும் தெய்வீக அன்பின் மூலம் பயணம் செய்யுங்கள், இதயத்தில் பேசும் மற்றும் ஆன்மாவை வளர்க்கும் சிந்தனைமிக்க பிரதிபலிப்புகளுடன்.'
                : 'Journey through faith, hope, and divine love with thoughtful reflections that speak to the heart and nurture the soul.'
              }
            </p>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                <span className={`ml-3 text-gray-600 ${getFontClass()}`}>
                  {language === 'tamil' ? 'கட்டுரைகள் ஏற்றப்படுகின்றன...' : 'Loading articles...'}
                </span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className={`text-red-700 text-center ${getFontClass()}`}>
                  {language === 'tamil' 
                    ? 'கட்டுரைகளை ஏற்ற முடியவில்லை. நிலையான உள்ளடக்கம் காட்டப்படுகிறது.' 
                    : 'Failed to load articles. Showing static content.'}
                </p>
              </div>
            )}

            {/* Articles Grid */}
            {!loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {pages.slice(0, 3).map((page) => (
                <Link
                  key={page.id}
                  to={getUrlWithLanguage(`/article/${page.id}`, language)}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/50"
                  onClick={() => trackButtonClick('article_card_click', { 
                    article_id: page.id,
                    article_title: page.title[language],
                    card_position: 'featured'
                  })}
                >
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-800 mb-3 ${getFontClass()}`}>
                    {page.title[language]}
                  </h3>
                  <p className={`text-gray-600 text-sm line-clamp-3 ${getFontClass()}`}>
                    {getPreviewText(page.content, language)}...
                  </p>
                  </Link>
                ))}
              </div>
            )}

            {/* Additional Articles */}
            {!loading && pages.length > 3 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mt-6">
                {pages.slice(3).map((page) => (
                  <Link
                    key={page.id}
                    to={getUrlWithLanguage(`/article/${page.id}`, language)}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/50"
                    onClick={() => trackButtonClick('article_card_click', { 
                      article_id: page.id,
                      article_title: page.title[language],
                      card_position: 'additional'
                    })}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <h3 className={`text-xl font-semibold text-gray-800 mb-3 ${getFontClass()}`}>
                      {page.title[language]}
                    </h3>
                    <p className={`text-gray-600 text-sm line-clamp-3 ${getFontClass()}`}>
                      {getPreviewText(page.content, language)}...
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
