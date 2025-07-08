import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Globe, Plus, Trash2, FileText, BookOpen, Heart, Save, X } from 'lucide-react';
import { Language, ContentEntry } from '../types';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';

interface CreateArticlePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

interface ArticleForm {
  id: string;
  title: {
    tamil: string;
    english: string;
  };
  theme: string;
  content: {
    tamil: ContentEntry[];
    english: ContentEntry[];
  };
}

const THEME_OPTIONS = [
  { value: 'gray', label: 'Gray', color: 'bg-gray-100' },
  { value: 'warm', label: 'Warm', color: 'bg-amber-100' },
  { value: 'blue', label: 'Blue', color: 'bg-blue-100' },
  { value: 'brown', label: 'Brown', color: 'bg-yellow-100' },
  { value: 'light', label: 'Light', color: 'bg-stone-100' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-100' },
  { value: 'green', label: 'Green', color: 'bg-green-100' },
  { value: 'red', label: 'Red', color: 'bg-red-100' },
  { value: 'pink', label: 'Pink', color: 'bg-pink-100' },
  { value: 'yellow', label: 'Yellow', color: 'bg-yellow-100' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-100' },
  { value: 'teal', label: 'Teal', color: 'bg-teal-100' },
  { value: 'cyan', label: 'Cyan', color: 'bg-cyan-100' },
  { value: 'lime', label: 'Lime', color: 'bg-lime-100' },
];

const CONTENT_TYPES = [
  { type: 'mainText', label: 'Main Text', icon: FileText, description: 'Regular article content' },
  { type: 'scripture', label: 'Scripture', icon: BookOpen, description: 'Biblical quotes or verses' },
  { type: 'reflection', label: 'Reflection', icon: Heart, description: 'Thoughtful reflections' },
];

const CreateArticlePage: React.FC<CreateArticlePageProps> = ({ language, setLanguage }) => {
  const navigate = useNavigate();
  const { trackButtonClick } = useGoogleAnalytics();
  const [activeTab, setActiveTab] = useState<Language>('english');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [article, setArticle] = useState<ArticleForm>({
    id: '',
    title: {
      tamil: '',
      english: ''
    },
    theme: 'gray',
    content: {
      tamil: [],
      english: []
    }
  });

  const getFontClass = () => language === 'tamil' ? 'font-catamaran' : 'font-inter';

  const addContentSection = (contentType: string, lang: Language) => {
    const newSection: ContentEntry = {
      type: contentType,
      value: ''
    };

    setArticle(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: [...prev.content[lang], newSection]
      }
    }));

    trackButtonClick('add_content_section', {
      content_type: contentType,
      language: lang,
      section_count: article.content[lang].length + 1
    });
  };

  const removeContentSection = (index: number, lang: Language) => {
    setArticle(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: prev.content[lang].filter((_, i) => i !== index)
      }
    }));

    trackButtonClick('remove_content_section', {
      language: lang,
      section_index: index
    });
  };

  const updateContentSection = (index: number, lang: Language, value: string) => {
    setArticle(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: prev.content[lang].map((section, i) => 
          i === index ? { ...section, value } : section
        )
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate form
      if (!article.id.trim()) {
        throw new Error('Article ID is required');
      }
      if (!article.title.english.trim() || !article.title.tamil.trim()) {
        throw new Error('Both English and Tamil titles are required');
      }
      if (article.content.english.length === 0 || article.content.tamil.length === 0) {
        throw new Error('Content is required in both languages');
      }

      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        throw new Error('API URL not configured');
      }

      console.log('Creating article with data:', article);

      const response = await fetch(`${apiUrl}/articles/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      trackButtonClick('article_created', {
        article_id: article.id,
        theme: article.theme,
        content_sections_tamil: article.content.tamil.length,
        content_sections_english: article.content.english.length
      });

      // Navigate to the created article
      navigate(`/article/${article.id}`);
    } catch (error) {
      console.error('Error creating article:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to create article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTypeIcon = (type: string) => {
    const contentType = CONTENT_TYPES.find(ct => ct.type === type);
    return contentType ? contentType.icon : FileText;
  };

  const getContentTypeLabel = (type: string) => {
    const contentType = CONTENT_TYPES.find(ct => ct.type === type);
    return contentType ? contentType.label : 'Content';
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
                Create Article
              </span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  trackButtonClick('language_toggle_create', { 
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
              
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                onClick={() => trackButtonClick('cancel_create_article')}
              >
                <X className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <h1 className={`text-3xl font-light mb-8 text-center text-gray-800 ${getFontClass()}`}>
              {language === 'tamil' ? 'புதிய கட்டுரை உருவாக்கவும்' : 'Create New Article'}
            </h1>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700 text-sm">{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Article ID */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${getFontClass()}`}>
                    {language === 'tamil' ? 'கட்டுரை ஐடி' : 'Article ID'}
                  </label>
                  <input
                    type="text"
                    value={article.id}
                    onChange={(e) => setArticle(prev => ({ ...prev, id: e.target.value }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${getFontClass()}`}
                    placeholder={language === 'tamil' ? 'unique-article-id' : 'unique-article-id'}
                    required
                  />
                </div>

                {/* Theme */}
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${getFontClass()}`}>
                    {language === 'tamil' ? 'தீம்' : 'Theme'}
                  </label>
                  <select
                    value={article.theme}
                    onChange={(e) => setArticle(prev => ({ ...prev, theme: e.target.value }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${getFontClass()}`}
                  >
                    {THEME_OPTIONS.map(theme => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Titles */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${getFontClass()}`}>
                    {language === 'tamil' ? 'ஆங்கில தலைப்பு' : 'English Title'}
                  </label>
                  <input
                    type="text"
                    value={article.title.english}
                    onChange={(e) => setArticle(prev => ({ 
                      ...prev, 
                      title: { ...prev.title, english: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-inter`}
                    placeholder="Enter English title"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium text-gray-700 mb-2 ${getFontClass()}`}>
                    {language === 'tamil' ? 'தமிழ் தலைப்பு' : 'Tamil Title'}
                  </label>
                  <input
                    type="text"
                    value={article.title.tamil}
                    onChange={(e) => setArticle(prev => ({ 
                      ...prev, 
                      title: { ...prev.title, tamil: e.target.value }
                    }))}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-catamaran`}
                    placeholder="தமிழ் தலைப்பை உள்ளிடவும்"
                    required
                  />
                </div>
              </div>

              {/* Content Tabs */}
              <div>
                <div className="border-b border-gray-200 mb-6">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      type="button"
                      onClick={() => setActiveTab('english')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === 'english'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      English Content
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tamil')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === 'tamil'
                          ? 'border-amber-500 text-amber-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Tamil Content
                    </button>
                  </nav>
                </div>

                {/* Content Type Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {CONTENT_TYPES.map(contentType => {
                    const Icon = contentType.icon;
                    return (
                      <button
                        key={contentType.type}
                        type="button"
                        onClick={() => addContentSection(contentType.type, activeTab)}
                        className="flex items-center space-x-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors duration-200"
                        title={contentType.description}
                      >
                        <Plus className="h-4 w-4" />
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{contentType.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Content Sections */}
                <div className="space-y-4">
                  {article.content[activeTab].map((section, index) => {
                    const Icon = getContentTypeIcon(section.type);
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Icon className="h-5 w-5 text-amber-600" />
                            <span className="font-medium text-gray-700">
                              {getContentTypeLabel(section.type)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeContentSection(index, activeTab)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <textarea
                          value={section.value}
                          onChange={(e) => updateContentSection(index, activeTab, e.target.value)}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-vertical min-h-[120px] ${
                            activeTab === 'tamil' ? 'font-catamaran' : 'font-inter'
                          }`}
                          placeholder={
                            activeTab === 'tamil' 
                              ? `${getContentTypeLabel(section.type)} உள்ளடக்கத்தை உள்ளிடவும்...`
                              : `Enter ${getContentTypeLabel(section.type).toLowerCase()} content...`
                          }
                          required
                        />
                      </div>
                    );
                  })}

                  {article.content[activeTab].length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className={getFontClass()}>
                        {activeTab === 'tamil' 
                          ? 'உள்ளடக்கப் பிரிவுகளைச் சேர்க்க மேலே உள்ள பொத்தான்களைப் பயன்படுத்தவும்'
                          : 'Use the buttons above to add content sections'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center space-x-2 px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ${getFontClass()}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{language === 'tamil' ? 'உருவாக்கப்படுகிறது...' : 'Creating...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>{language === 'tamil' ? 'கட்டுரையை உருவாக்கவும்' : 'Create Article'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticlePage;