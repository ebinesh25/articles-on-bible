import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { usePage } from '../hooks/useContent';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

interface SupabaseArticlePageProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const SupabaseArticlePage: React.FC<SupabaseArticlePageProps> = ({ language, setLanguage }) => {
  const { id } = useParams<{ id: string }>();
  const { page, loading, error } = usePage(id || '');

  if (loading) {
    return <LoadingSpinner message="Loading article..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  const getFontClass = () => {
    return language === 'tamil' ? 'font-tamil' : 'font-english';
  };

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'warm':
        return 'bg-gradient-to-br from-orange-50 to-red-50';
      case 'cool':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50';
      case 'nature':
        return 'bg-gradient-to-br from-green-50 to-emerald-50';
      default:
        return 'bg-gradient-to-br from-gray-50 to-slate-50';
    }
  };

  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <MarkdownRenderer content={content} />;
    }

    return (
      <div className="space-y-6">
        {content.map((item: any, index: number) => {
          switch (item.type) {
            case 'mainText':
              return (
                <div key={index} className={`text-lg leading-relaxed text-gray-700 ${getFontClass()}`}>
                  <MarkdownRenderer content={item.value} />
                </div>
              );
            case 'scripture':
              return (
                <blockquote key={index} className={`border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg ${getFontClass()}`}>
                  <div className="text-lg italic text-blue-800">
                    <MarkdownRenderer content={item.value} />
                  </div>
                </blockquote>
              );
            case 'scriptureReflection':
              return (
                <div key={index} className={`bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-400 ${getFontClass()}`}>
                  <h4 className="font-semibold text-indigo-800 mb-2">
                    {language === 'tamil' ? 'வேத சிந்தனை' : 'Scripture Reflection'}
                  </h4>
                  <div className="text-indigo-700">
                    <MarkdownRenderer content={item.value} />
                  </div>
                </div>
              );
            case 'promise':
              return (
                <div key={index} className={`bg-green-50 p-6 rounded-lg border-l-4 border-green-400 ${getFontClass()}`}>
                  <h4 className="font-semibold text-green-800 mb-2">
                    {language === 'tamil' ? 'வாக்குறுதி' : 'Promise'}
                  </h4>
                  <div className="text-green-700">
                    <MarkdownRenderer content={item.value} />
                  </div>
                </div>
              );
            case 'reflection':
              return (
                <div key={index} className={`bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400 ${getFontClass()}`}>
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {language === 'tamil' ? 'சிந்தனை' : 'Reflection'}
                  </h4>
                  <div className="text-purple-700">
                    <MarkdownRenderer content={item.value} />
                  </div>
                </div>
              );
            case 'habitDefinition':
              return (
                <div key={index} className={`bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400 ${getFontClass()}`}>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {language === 'tamil' ? 'பழக்க வரையறை' : 'Habit Definition'}
                  </h4>
                  <div className="text-yellow-700">
                    <MarkdownRenderer content={item.value} />
                  </div>
                </div>
              );
            case 'encouragement':
              return (
                <div key={index} className={`bg-pink-50 p-6 rounded-lg border-l-4 border-pink-400 ${getFontClass()}`}>
                  <h4 className="font-semibold text-pink-800 mb-2">
                    {language === 'tamil' ? 'ஊக்கம்' : 'Encouragement'}
                  </h4>
                  <div className="text-pink-700">
                    <MarkdownRenderer content={item.value} />
                  </div>
                </div>
              );
            default:
              return (
                <div key={index} className={`text-lg leading-relaxed text-gray-700 ${getFontClass()}`}>
                  <MarkdownRenderer content={item.value} />
                </div>
              );
          }
        })}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${getThemeClasses(page.theme)}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className={getFontClass()}>
                {language === 'tamil' ? 'முகப்புக்கு திரும்பு' : 'Back to Home'}
              </span>
            </Link>
            
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white/60 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200">
          {/* Title */}
          <h1 className={`text-4xl font-bold text-gray-800 mb-8 text-center ${getFontClass()}`}>
            {page.title[language]}
          </h1>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {renderContent(page.content[language])}
          </div>
        </article>
      </main>
    </div>
  );
};

export default SupabaseArticlePage;