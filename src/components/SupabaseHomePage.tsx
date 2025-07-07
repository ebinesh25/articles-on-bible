import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { useContent } from '../hooks/useContent';
import LoadingSpinner from './LoadingSpinner';

interface SupabaseHomePageProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const SupabaseHomePage: React.FC<SupabaseHomePageProps> = ({ language, setLanguage }) => {
  const { contentData, loading, error } = useContent();

  if (loading) {
    return <LoadingSpinner message="Loading content..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <p className="text-gray-600">Please check your Supabase configuration.</p>
      </div>
    );
  }

  if (!contentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">No content available.</p>
      </div>
    );
  }

  const getFontClass = () => {
    return language === 'tamil' ? 'font-tamil' : 'font-english';
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'warm':
        return 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-300';
      case 'cool':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300';
      case 'nature':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className={`text-2xl font-bold text-gray-800 ${getFontClass()}`}>
              {language === 'tamil' ? 'ஆன்மீக பயணம்' : 'Spiritual Journey'}
            </h1>
            
            {/* Language Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('tamil')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  language === 'tamil'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                தமிழ்
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  language === 'english'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold text-gray-800 mb-4 ${getFontClass()}`}>
            {language === 'tamil' 
              ? 'வரவேற்கிறோம்' 
              : 'Welcome'
            }
          </h2>
          <p className={`text-xl text-gray-600 max-w-2xl mx-auto ${getFontClass()}`}>
            {language === 'tamil'
              ? 'ஆன்மீக வளர்ச்சி மற்றும் அமைதிக்கான உங்கள் பயணத்தில் எங்களுடன் சேருங்கள்'
              : 'Join us on your journey of spiritual growth and peace'
            }
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {contentData.pages.map((page) => (
            <Link
              key={page.id}
              to={`/article/${page.id}`}
              className={`block p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${getThemeClasses(page.theme)}`}
            >
              <h3 className={`text-xl font-semibold text-gray-800 mb-3 ${getFontClass()}`}>
                {page.title[language]}
              </h3>
              <p className={`text-gray-600 text-sm ${getFontClass()}`}>
                {language === 'tamil' ? 'மேலும் படிக்க...' : 'Read more...'}
              </p>
            </Link>
          ))}
        </div>

        {/* Author Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-200">
          <h3 className={`text-2xl font-semibold text-gray-800 mb-4 ${getFontClass()}`}>
            {language === 'tamil' ? 'ஆசிரியர்' : 'Author'}
          </h3>
          <p className={`text-lg text-gray-600 ${getFontClass()}`}>
            {contentData.author[language]}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className={`${getFontClass()}`}>
            {language === 'tamil'
              ? '© 2024 ஆன்மீக பயணம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'
              : '© 2024 Spiritual Journey. All rights reserved.'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SupabaseHomePage;