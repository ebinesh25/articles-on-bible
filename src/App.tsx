import React, { useState } from 'react';
import { Book, Heart, Star, Sparkles, Globe } from 'lucide-react';
import contentData from './data/content.json';

interface Page {
  id: string;
  title: {
    tamil: string;
    english: string;
  };
  theme: string;
  content: {
    tamil: {
      mainText: string;
      scripture?: string;
      scriptureReflection?: string;
      promise?: string;
      reflection: string;
      habitDefinition?: string;
      encouragement?: string;
      consistency?: string;
      importance?: string;
      comfort?: string;
      loveDescription?: string;
    };
    english: {
      mainText: string;
      scripture?: string;
      scriptureReflection?: string;
      promise?: string;
      reflection: string;
      habitDefinition?: string;
      encouragement?: string;
      consistency?: string;
      importance?: string;
      comfort?: string;
      loveDescription?: string;
    };
  };
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [language, setLanguage] = useState<'tamil' | 'english'>('tamil');

  const pages: Page[] = contentData.pages;

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
      default:
        return 'text-gray-600 border-gray-300';
    }
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-amber-700" />
              <span className="font-serif text-xl font-semibold text-gray-800">
                {language === 'tamil' ? 'ஜெஸ்ஸி ஆனந்த்' : 'Jessie Anand'}
              </span>
            </div>
            
            <button
              onClick={() => setLanguage(language === 'tamil' ? 'english' : 'tamil')}
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

            <h1 className="font-serif text-5xl md:text-7xl font-light text-gray-800 mb-6 tracking-wide">
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
            
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {language === 'tamil' 
                ? 'நம்பிக்கை, நம்பிக்கை மற்றும் தெய்வீக அன்பின் மூலம் பயணம் செய்யுங்கள், இதயத்தில் பேசும் மற்றும் ஆன்மாவை வளர்க்கும் சிந்தனைமிக்க பிரதிபலிப்புகளுடன்.'
                : 'Journey through faith, hope, and divine love with thoughtful reflections that speak to the heart and nurture the soul.'
              }
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {pages.slice(0, 3).map((page) => (
                <div
                  key={page.id}
                  onClick={() => setCurrentPage(page.id)}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/50"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-gray-800 mb-3">
                    {page.title[language]}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {page.content[language].mainText.substring(0, 120)}...
                  </p>
                </div>
              ))}
            </div>

            {pages.length > 3 && (
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
                {pages.slice(3).map((page) => (
                  <div
                    key={page.id}
                    onClick={() => setCurrentPage(page.id)}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-white/50"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-amber-600 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-gray-800 mb-3">
                      {page.title[language]}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {page.content[language].mainText.substring(0, 120)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentPage = (page: Page) => (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeColors(page.theme)}`}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center space-x-2 text-gray-700 hover:text-amber-700 transition-colors duration-200"
            >
              <Book className="h-6 w-6" />
              <span className="font-serif text-lg font-semibold">
                {language === 'tamil' ? 'ஜெஸ்ஸி ஆனந்த்' : 'Jessie Anand'}
              </span>
            </button>
            
            <button
              onClick={() => setLanguage(language === 'tamil' ? 'english' : 'tamil')}
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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-6xl font-light mb-6 tracking-wide">
                {page.title[language]}
              </h1>
              <div className={`w-24 h-1 mx-auto rounded-full bg-gradient-to-r ${
                page.theme === 'gray' ? 'from-gray-400 to-gray-600' :
                page.theme === 'warm' ? 'from-amber-400 to-orange-500' :
                page.theme === 'blue' ? 'from-blue-400 to-indigo-500' :
                page.theme === 'brown' ? 'from-amber-400 to-yellow-500' :
                'from-stone-400 to-gray-500'
              }`}></div>
            </div>

            {/* Main Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                {page.content[language].mainText}
              </p>

              {page.content[language].habitDefinition && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].habitDefinition}
                </p>
              )}

              {page.content[language].scripture && (
                <div className={`border-l-4 ${getAccentColor(page.theme)} pl-6 my-8`}>
                  <blockquote className="font-serif text-xl italic text-gray-800 mb-2">
                    "{page.content[language].scripture}"
                  </blockquote>
                </div>
              )}

              {page.content[language].scriptureReflection && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].scriptureReflection}
                </p>
              )}

              {page.content[language].promise && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify font-medium">
                  {page.content[language].promise}
                </p>
              )}

              {page.content[language].encouragement && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].encouragement}
                </p>
              )}

              {page.content[language].consistency && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].consistency}
                </p>
              )}

              {page.content[language].importance && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].importance}
                </p>
              )}

              {page.content[language].comfort && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].comfort}
                </p>
              )}

              {page.content[language].loveDescription && (
                <p className="text-gray-700 leading-relaxed mb-8 text-justify">
                  {page.content[language].loveDescription}
                </p>
              )}

              {/* Reflection */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mt-12">
                <h3 className="font-serif text-2xl font-semibold text-amber-800 mb-4 flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  {language === 'tamil' ? 'சிந்தனை' : 'Reflection'}
                </h3>
                <p className="text-amber-900 leading-relaxed italic">
                  {page.content[language].reflection}
                </p>
              </div>
            </div>

            {/* Author */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="font-serif text-lg text-gray-600">
                — {contentData.author[language]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current page
  if (currentPage === 'home') {
    return renderHomePage();
  }

  const currentPageData = pages.find(p => p.id === currentPage);
  if (!currentPageData) {
    return renderHomePage();
  }

  return renderContentPage(currentPageData);
}

export default App;