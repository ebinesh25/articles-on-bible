import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Book, Heart, Globe } from 'lucide-react';
import contentData from '../data/content.json';
import { Page, Language } from '../types';
import { useDocumentTitle } from '../hooks/useSEO';
import { getUrlWithLanguage } from '../utils/urlUtils';

interface ArticlePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ language, setLanguage }) => {
  const { id } = useParams<{ id: string }>();
  const pages: Page[] = contentData.pages;

  // Find the page by ID
  const page = pages.find(p => p.id === id);

  // Set SEO meta for article page
  useDocumentTitle({ page, language });

  const getFontClass = () => {
    return language === 'tamil' ? 'font-catamaran' : 'font-inter';
  };

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'gray':
        return 'from-slate-100 to-gray-200 text-gray-800';
      case 'warm':
        return 'from-amber-50 to-orange-100 text-amber-900';
      case 'blue':
        return 'from-blue-50 to-indigo-100 text-blue-900';
      case 'brown':
        return 'from-amber-100 to-yellow-100 text-amber-800';
      case 'light':
        return 'from-gray-50 to-stone-100 text-stone-800';
      case 'dark':
        return 'from-gray-900 to-gray-800 text-white';
      case 'black':
        return 'from-gray-900 to-gray-700 text-white';
      case 'purple':
        return 'from-purple-50 to-purple-100 text-purple-900';
      case 'green':
        return 'from-green-50 to-green-100 text-green-900';
      case 'red':
        return 'from-red-50 to-red-100 text-red-900';
      case 'pink':
        return 'from-pink-50 to-pink-100 text-pink-900';
      case 'yellow':
        return 'from-yellow-50 to-yellow-100 text-yellow-900';
      case 'orange':
        return 'from-orange-50 to-orange-100 text-orange-900';
      case 'teal':
        return 'from-teal-50 to-teal-100 text-teal-900';
      case 'cyan':
        return 'from-cyan-50 to-cyan-100 text-cyan-900';
      case 'lime':
        return 'from-lime-50 to-lime-100 text-lime-900';
      default:
        return 'from-gray-50 to-white text-gray-800';
    }
  };

  const getAccentColor = (theme: string) => {
    switch (theme) {
      case 'gray':
        return 'text-gray-600 border-gray-300';
      case 'warm':
        return 'text-amber-700 border-amber-300';
      case 'blue':
        return 'text-blue-700 border-blue-300';
      case 'brown':
        return 'text-amber-700 border-amber-300';
      case 'light':
        return 'text-stone-600 border-stone-300';
      case 'dark':
        return 'text-white border-gray-600';
      case 'black':
        return 'text-white border-gray-700';
      case 'purple':
        return 'text-purple-700 border-purple-300';
      case 'green':
        return 'text-green-700 border-green-300'; 
      case 'red':
        return 'text-red-700 border-red-300';
      case 'pink':
        return 'text-pink-700 border-pink-300';
      case 'yellow':
        return 'text-yellow-700 border-yellow-300';
      case 'orange':  
        return 'text-orange-700 border-orange-300';
      case 'teal':
        return 'text-teal-700 border-teal-300';
      case 'cyan':
        return 'text-cyan-700 border-cyan-300';
      case 'lime':
        return 'text-lime-700 border-lime-300';
      default:
        return 'text-gray-600 border-gray-300';
    }
  };

  // If page not found, redirect to home
  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeColors(page.theme)}`}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to={getUrlWithLanguage('/', language)}
              className="flex items-center space-x-2 text-gray-700 hover:text-amber-700 transition-colors duration-200"
            >
              <Book className="h-6 w-6" />
              <span className={`text-lg font-semibold ${getFontClass()}`}>
                {language === 'tamil' ? 'ஜெஸ்ஸி ஆனந்த்' : 'Jessie Anand'}
              </span>
            </Link>
            
            <button
              onClick={() => setLanguage(language === 'tamil' ? 'english' : 'tamil')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors duration-200"
            >
              <Globe className="h-4 w-4" />
              <span className={`font-medium ${getFontClass()}`}>
                {language === 'tamil' ? 'English' : 'தமிழ்'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className={`text-4xl md:text-6xl font-light mb-6 tracking-wide ${getFontClass()}`}>
                {page.title[language]}
              </h1>
              <div className={`w-24 h-1 mx-auto rounded-full bg-gradient-to-r ${
                page.theme === 'gray' ? 'from-gray-400 to-gray-600' :
                page.theme === 'warm' ? 'from-amber-400 to-orange-500' :
                page.theme === 'blue' ? 'from-blue-400 to-indigo-500' :
                page.theme === 'brown' ? 'from-amber-400 to-yellow-500' :
                page.theme === 'light' ? 'from-stone-200 to-stone-300' :
                page.theme === 'dark' ? 'from-gray-800 to-gray-900' :
                page.theme === 'black' ? 'from-gray-900 to-gray-800' :
                page.theme === 'purple' ? 'from-purple-400 to-purple-500' :
                page.theme === 'green' ? 'from-green-400 to-green-500' :
                page.theme === 'red' ? 'from-red-400 to-red-500' :
                page.theme === 'pink' ? 'from-pink-400 to-pink-500' :
                page.theme === 'yellow' ? 'from-yellow-400 to-yellow-500' :
                page.theme === 'orange' ? 'from-orange-400 to-orange-500' :
                page.theme === 'teal' ? 'from-teal-400 to-teal-500' :
                page.theme === 'cyan' ? 'from-cyan-400 to-cyan-500' :
                page.theme === 'lime' ? 'from-lime-400 to-lime-500' :
                'from-stone-400 to-gray-500'
              }`}></div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                {page.content[language].mainText}
              </p>

              {page.content[language].habitDefinition && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].habitDefinition}
                </p>
              )}

              {page.content[language].scripture && (
                <div className={`border-l-4 ${getAccentColor(page.theme)} pl-6 my-8`}>
                  <blockquote className={`text-xl italic text-gray-800 mb-2 ${getFontClass()}`}>
                    "{page.content[language].scripture}"
                  </blockquote>
                </div>
              )}

              {page.content[language].scriptureReflection && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].scriptureReflection}
                </p>
              )}

              {page.content[language].promise && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify font-medium ${getFontClass()}`}>
                  {page.content[language].promise}
                </p>
              )}

              {page.content[language].encouragement && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].encouragement}
                </p>
              )}

              {page.content[language].consistency && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].consistency}
                </p>
              )}

              {page.content[language].importance && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].importance}
                </p>
              )}

              {page.content[language].comfort && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].comfort}
                </p>
              )}

              {page.content[language].loveDescription && (
                <p className={`text-gray-700 leading-relaxed mb-8 text-justify ${getFontClass()}`}>
                  {page.content[language].loveDescription}
                </p>
              )}

              {/* Reflection */}
             { page.content[language].reflection && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mt-12">
                <h3 className={`text-2xl font-semibold text-amber-800 mb-4 flex items-center ${getFontClass()}`}>
                  <Heart className="h-6 w-6 mr-2" />
                  {language === 'tamil' ? 'சிந்தனை' : 'Reflection'}
                </h3>
                <p className={`text-amber-900 leading-relaxed italic ${getFontClass()}`}>
                  {page.content[language].reflection}
                </p>
              </div>)}
            </div>

            {/* Author */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className={`text-lg text-gray-600 ${getFontClass()}`}>
                — {contentData.author[language]}
              </p>
            </div>

            {/* Navigation to other articles */}
            {/* <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className={`text-xl font-semibold text-gray-800 mb-6 ${getFontClass()}`}>
                {language === 'tamil' ? 'மற்ற கட்டுரைகள்' : 'Other Articles'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {pages
                  .filter(p => p.id !== page.id)
                  .slice(0, 4)
                  .map((otherPage) => (
                    <Link
                      key={otherPage.id}
                      to={getUrlWithLanguage(`/article/${otherPage.id}`, language)}
                      className="block p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <h4 className={`font-medium text-gray-800 mb-2 ${getFontClass()}`}>
                        {otherPage.title[language]}
                      </h4>
                      <p className={`text-sm text-gray-600 line-clamp-2 ${getFontClass()}`}>
                        {otherPage.content[language].mainText.substring(0, 100)}...
                      </p>
                    </Link>
                  ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
