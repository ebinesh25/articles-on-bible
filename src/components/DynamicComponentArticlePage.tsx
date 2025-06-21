import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Book, Globe, Heart } from 'lucide-react';
import contentData from '../data/content.json';
import { Language, DynamicContentData, ContentEntry } from '../types';
import { useDocumentTitle } from '../hooks/useSEO';
import { getUrlWithLanguage } from '../utils/urlUtils';
import MarkdownRenderer from './MarkdownRenderer';

interface DynamicComponentArticlePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const DynamicComponentArticlePage: React.FC<DynamicComponentArticlePageProps> = ({ language, setLanguage }) => {
  const { id } = useParams<{ id: string }>();
  const data = contentData as DynamicContentData;
  const pages = data.pages;
  const page = pages.find(p => p.id === id);
  
  // Set page title for SEO - the hook already handles both formats
  useDocumentTitle({ page: page, language });

  // Redirect if not found
  if (!page) return <Navigate to="/" replace />;

  // Helpers for styling based on theme
  const getFontClass = () => language === 'tamil' ? 'font-catamaran' : 'font-inter';
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'gray':  return 'from-slate-100 to-gray-200 text-gray-800';
      case 'warm':  return 'from-amber-50 to-orange-100 text-amber-900';
      case 'blue':  return 'from-blue-50 to-indigo-100 text-blue-900';
      case 'brown': return 'from-amber-100 to-yellow-100 text-amber-800';
      case 'light': return 'from-gray-50 to-stone-100 text-stone-800';
      case 'dark':  return 'from-gray-900 to-gray-800 text-white';
      case 'black': return 'from-gray-900 to-gray-700 text-white';
      case 'purple':return 'from-purple-50 to-purple-100 text-purple-900';
      case 'green': return 'from-green-50 to-green-100 text-green-900';
      case 'red':   return 'from-red-50 to-red-100 text-red-900';
      case 'pink':  return 'from-pink-50 to-pink-100 text-pink-900';
      case 'yellow':return 'from-yellow-50 to-yellow-100 text-yellow-900';
      case 'orange':return 'from-orange-50 to-orange-100 text-orange-900';
      case 'teal':  return 'from-teal-50 to-teal-100 text-teal-900';
      case 'cyan':  return 'from-cyan-50 to-cyan-100 text-cyan-900';
      case 'lime':  return 'from-lime-50 to-lime-100 text-lime-900';
      default:      return 'from-gray-50 to-white text-gray-800';
    }
  };
  const getAccentColor = (theme: string) => {
    switch (theme) {
      case 'gray':  return 'text-gray-600 border-gray-300';
      case 'warm':  return 'text-amber-700 border-amber-300';
      case 'blue':  return 'text-blue-700 border-blue-300';
      case 'brown': return 'text-amber-700 border-amber-300';
      case 'light': return 'text-stone-600 border-stone-300';
      case 'dark':  return 'text-white border-gray-600';
      case 'black': return 'text-white border-gray-700';
      case 'purple':return 'text-purple-700 border-purple-300';
      case 'green': return 'text-green-700 border-green-300';
      case 'red':   return 'text-red-700 border-red-300';
      case 'pink':  return 'text-pink-700 border-pink-300';
      case 'yellow':return 'text-yellow-700 border-yellow-300';
      case 'orange':return 'text-orange-700 border-orange-300';
      case 'teal':  return 'text-teal-700 border-teal-300';
      case 'cyan':  return 'text-cyan-700 border-cyan-300';
      case 'lime':  return 'text-lime-700 border-lime-300';
      default:      return 'text-gray-600 border-gray-300';
    }
  };

  // Extract entries for the selected language
  const entries: ContentEntry[] = page.content[language];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeColors(page.theme)}`}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={getUrlWithLanguage('/', language)}
              className="flex items-center space-x-2 text-gray-700 hover:text-amber-700"
            >
              <Book className="h-6 w-6" />
              <span className={`text-lg font-semibold ${getFontClass()}`}>{data.author[language]}</span>
            </Link>
            <button
              onClick={() => setLanguage(language === 'tamil' ? 'english' : 'tamil')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800"
            >
              <Globe className="h-4 w-4" />
              <span className={getFontClass()}>{language === 'tamil' ? 'English' : 'தமிழ்'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <h1 className={`text-4xl md:text-6xl font-light mb-6 text-center ${getFontClass()}`}>{page.title[language]}</h1>
            {/* Render each entry based on its type */}
            <div className="prose prose-lg max-w-none">
              {entries.map((entry, idx) => {
                switch (entry.type) {
                  case 'scripture':
                    return (
                      <div key={idx} className={`border-l-4 ${getAccentColor(page.theme)} pl-6 my-8`}>
                        <blockquote className={`text-xl italic ${getFontClass()}`}>"{entry.value}"</blockquote>
                      </div>
                    );
                  case 'reflection':
                    return (
                      <div key={idx} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mt-12">
                        <h3 className={`text-2xl font-semibold text-amber-800 mb-4 flex items-center ${getFontClass()}`}>
                          <Heart className="h-6 w-6 mr-2" />
                          {language === 'tamil' ? 'சிந்தனை' : 'Reflection'}
                        </h3>
                        <MarkdownRenderer text={entry.value} className={getFontClass()} />
                      </div>
                    );
                  default:
                    return (
                      <MarkdownRenderer
                        key={idx}
                        text={entry.value}
                        className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}
                      />
                    );
                }
              })}
            </div>
            {/* Back link */}
            {/* <div className="mt-8 text-center">
              <Link to={getUrlWithLanguage('/', language)} className="text-amber-700 hover:underline">
                {language === 'tamil' ? 'மீண்டும் தளத்திற்கு' : 'Back to Home'}
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicComponentArticlePage;