import React, { useState, useEffect } from 'react';
import { useSupabaseContext } from '../../contexts/SupabaseContext';
import { DynamicPage, ContentEntry } from '../../types';
import { Save, X, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface PageEditorProps {
  page?: DynamicPage | null;
  onSave: () => void;
  onCancel: () => void;
}

const PageEditor: React.FC<PageEditorProps> = ({ page, onSave, onCancel }) => {
  const { supabase } = useSupabaseContext();
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [id, setId] = useState('');
  const [titleTamil, setTitleTamil] = useState('');
  const [titleEnglish, setTitleEnglish] = useState('');
  const [theme, setTheme] = useState('gray');
  const [contentTamil, setContentTamil] = useState<ContentEntry[]>([]);
  const [contentEnglish, setContentEnglish] = useState<ContentEntry[]>([]);

  const isEditing = !!page;

  // Initialize form with page data
  useEffect(() => {
    if (page) {
      setId(page.id);
      setTitleTamil(page.title.tamil);
      setTitleEnglish(page.title.english);
      setTheme(page.theme);
      setContentTamil([...page.content.tamil]);
      setContentEnglish([...page.content.english]);
    } else {
      // Reset for new page
      setId('');
      setTitleTamil('');
      setTitleEnglish('');
      setTheme('gray');
      setContentTamil([{ type: 'mainText', value: '' }]);
      setContentEnglish([{ type: 'mainText', value: '' }]);
    }
  }, [page]);

  const contentTypes = [
    { value: 'mainText', label: 'Main Text' },
    { value: 'scripture', label: 'Scripture' },
    { value: 'scriptureReflection', label: 'Scripture Reflection' },
    { value: 'promise', label: 'Promise' },
    { value: 'reflection', label: 'Reflection' },
    { value: 'habitDefinition', label: 'Habit Definition' },
    { value: 'encouragement', label: 'Encouragement' },
    { value: 'consistency', label: 'Consistency' },
    { value: 'importance', label: 'Importance' },
    { value: 'comfort', label: 'Comfort' },
    { value: 'loveDescription', label: 'Love Description' },
  ];

  const themes = [
    { value: 'gray', label: 'Gray', color: 'bg-gray-100' },
    { value: 'warm', label: 'Warm', color: 'bg-orange-100' },
    { value: 'cool', label: 'Cool', color: 'bg-blue-100' },
    { value: 'nature', label: 'Nature', color: 'bg-green-100' },
  ];

  const addContentItem = (language: 'tamil' | 'english') => {
    const newItem: ContentEntry = { type: 'mainText', value: '' };
    if (language === 'tamil') {
      setContentTamil([...contentTamil, newItem]);
    } else {
      setContentEnglish([...contentEnglish, newItem]);
    }
  };

  const removeContentItem = (language: 'tamil' | 'english', index: number) => {
    if (language === 'tamil') {
      setContentTamil(contentTamil.filter((_, i) => i !== index));
    } else {
      setContentEnglish(contentEnglish.filter((_, i) => i !== index));
    }
  };

  const moveContentItem = (language: 'tamil' | 'english', index: number, direction: 'up' | 'down') => {
    const content = language === 'tamil' ? contentTamil : contentEnglish;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= content.length) return;
    
    const newContent = [...content];
    [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];
    
    if (language === 'tamil') {
      setContentTamil(newContent);
    } else {
      setContentEnglish(newContent);
    }
  };

  const updateContentItem = (language: 'tamil' | 'english', index: number, field: 'type' | 'value', value: string) => {
    const content = language === 'tamil' ? contentTamil : contentEnglish;
    const newContent = [...content];
    newContent[index] = { ...newContent[index], [field]: value };
    
    if (language === 'tamil') {
      setContentTamil(newContent);
    } else {
      setContentEnglish(newContent);
    }
  };

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const handleSave = async () => {
    setError(null);
    
    // Validation
    if (!titleTamil.trim() || !titleEnglish.trim()) {
      setError('Both Tamil and English titles are required');
      return;
    }
    
    if (!isEditing && !id.trim()) {
      setError('Page ID is required');
      return;
    }
    
    if (contentTamil.length === 0 || contentEnglish.length === 0) {
      setError('At least one content item is required for both languages');
      return;
    }

    setSaving(true);
    
    try {
      const pageData = {
        title_tamil: titleTamil.trim(),
        title_english: titleEnglish.trim(),
        theme,
        content_tamil: contentTamil.filter(item => item.value.trim()),
        content_english: contentEnglish.filter(item => item.value.trim()),
        published: true,
      };

      if (isEditing) {
        // Update existing page
        const { error } = await supabase
          .from('pages')
          .update(pageData)
          .eq('id', page.id);
        
        if (error) throw error;
      } else {
        // Create new page
        const { error } = await supabase
          .from('pages')
          .insert({ ...pageData, id: id.trim() });
        
        if (error) throw error;
      }
      
      onSave();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const renderContentEditor = (language: 'tamil' | 'english', content: ContentEntry[]) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800 capitalize">{language} Content</h4>
        <button
          onClick={() => addContentItem(language)}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </button>
      </div>
      
      {content.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <select
              value={item.type}
              onChange={(e) => updateContentItem(language, index, 'type', e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              {contentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            
            <div className="flex space-x-1">
              <button
                onClick={() => moveContentItem(language, index, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveContentItem(language, index, 'down')}
                disabled={index === content.length - 1}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeContentItem(language, index)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            value={item.value}
            onChange={(e) => updateContentItem(language, index, 'value', e.target.value)}
            placeholder={`Enter ${contentTypes.find(t => t.value === item.type)?.label.toLowerCase()} content...`}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-vertical"
            rows={4}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Page' : 'Create New Page'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page ID {!isEditing && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  disabled={isEditing}
                  placeholder="e.g., weakness, remember"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100"
                />
                {!isEditing && titleEnglish && (
                  <button
                    onClick={() => setId(generateId(titleEnglish))}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Generate from English title
                  </button>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamil Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titleTamil}
                  onChange={(e) => setTitleTamil(e.target.value)}
                  placeholder="தமிழ் தலைப்பு"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={titleEnglish}
                  onChange={(e) => setTitleEnglish(e.target.value)}
                  placeholder="English Title"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Theme */}
            <div className="lg:col-span-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <div className="flex space-x-4">
                {themes.map(themeOption => (
                  <label key={themeOption.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value={themeOption.value}
                      checked={theme === themeOption.value}
                      onChange={(e) => setTheme(e.target.value)}
                      className="mr-2"
                    />
                    <div className={`w-6 h-6 rounded ${themeOption.color} border mr-2`}></div>
                    <span className="text-sm">{themeOption.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Editors */}
            <div>
              {renderContentEditor('tamil', contentTamil)}
            </div>
            
            <div>
              {renderContentEditor('english', contentEnglish)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;