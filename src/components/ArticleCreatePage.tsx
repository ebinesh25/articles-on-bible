import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import contentData from '../data/content.json';
import { Language, DynamicContentData, ContentEntry, DynamicPage } from '../types';
import { getUrlWithLanguage } from '../utils/urlUtils';
import MarkdownEditor from './MarkdownEditor';

interface ArticleCreatePageProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const themeOptions = [
  'gray', 'warm', 'blue', 'brown', 'light', 'dark', 'black',
  'purple', 'green', 'red', 'pink', 'yellow', 'orange',
  'teal', 'cyan', 'lime'
] as const;

const toKebabCase = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-');

const ArticleCreatePage: React.FC<ArticleCreatePageProps> = ({ language }) => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [theme, setTheme] = useState<typeof themeOptions[number]>(themeOptions[0]);
  const [titleEnglish, setTitleEnglish] = useState('');
  const [titleTamil, setTitleTamil] = useState('');
  const [activeTab, setActiveTab] = useState<'english' | 'tamil'>('english');
  const [englishBlocks, setEnglishBlocks] = useState<ContentEntry[]>([]);
  const [tamilBlocks, setTamilBlocks] = useState<ContentEntry[]>([]);

  const onAddBlock = () => {
    const newBlock: ContentEntry = { type: 'mainText', value: '' };
    if (activeTab === 'english') {
      setEnglishBlocks([...englishBlocks, newBlock]);
    } else {
      setTamilBlocks([...tamilBlocks, newBlock]);
    }
  };

  const onRemoveBlock = (index: number) => {
    if (activeTab === 'english') {
      setEnglishBlocks(englishBlocks.filter((_, i) => i !== index));
    } else {
      setTamilBlocks(tamilBlocks.filter((_, i) => i !== index));
    }
  };

  const onChangeBlockType = (index: number, newType: string) => {
    const setter = activeTab === 'english' ? setEnglishBlocks : setTamilBlocks;
    const blocks = activeTab === 'english' ? englishBlocks : tamilBlocks;
    const updated = blocks.map((blk, i) => i === index ? { ...blk, type: newType } : blk);
    setter(updated);
  };

  const onChangeBlockValue = (index: number, newValue: string) => {
    const setter = activeTab === 'english' ? setEnglishBlocks : setTamilBlocks;
    const blocks = activeTab === 'english' ? englishBlocks : tamilBlocks;
    const updated = blocks.map((blk, i) => i === index ? { ...blk, value: newValue } : blk);
    setter(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage: DynamicPage = {
      id,
      title: { tamil: titleTamil, english: titleEnglish },
      theme,
      content: { tamil: tamilBlocks, english: englishBlocks }
    };
    (contentData as DynamicContentData).pages.push(newPage);
    navigate(getUrlWithLanguage(`/article/${id}`, language));
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Create New Article</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">ID</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={id}
              onChange={e => setId(toKebabCase(e.target.value))}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Theme</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={theme}
              onChange={e => setTheme(e.target.value as typeof themeOptions[number])}
            >
              {themeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-medium mb-1">Title (English)</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={titleEnglish}
              onChange={e => setTitleEnglish(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-medium mb-1">Title (Tamil)</label>
            <input
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={titleTamil}
              onChange={e => setTitleTamil(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              className={`flex-1 text-center px-4 py-2 rounded ${activeTab === 'english' ? 'bg-amber-200' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('english')}
            >English</button>
            <button
              type="button"
              className={`flex-1 text-center px-4 py-2 rounded ${activeTab === 'tamil' ? 'bg-amber-200' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('tamil')}
            >Tamil</button>
          </div>
          {(activeTab === 'english' ? englishBlocks : tamilBlocks).map((blk, idx) => (
            <div key={idx} className="mb-6 border border-gray-300 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-3">
                <label className="font-medium">Type:</label>
                <select
                  className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={blk.type}
                  onChange={e => onChangeBlockType(idx, e.target.value)}
                >
                  <option value="mainText">mainText</option>
                  <option value="scripture">scripture</option>
                  <option value="reflection">reflection</option>
                </select>
                <button
                  type="button"
                  className="text-red-600 ml-auto"
                  onClick={() => onRemoveBlock(idx)}
                >Remove</button>
              </div>
              <MarkdownEditor
                value={blk.value}
                onChange={newVal => onChangeBlockValue(idx, newVal)}
                placeholder="Markdown content"
                required
              />
            </div>
          ))}
          <button
            type="button"
            className="w-full sm:w-auto text-center px-4 py-2 bg-amber-100 hover:bg-amber-200 rounded-lg"
            onClick={onAddBlock}
          >Add Block</button>
        </div>
        <div>
          <button
            type="submit"
            className="w-full sm:w-auto text-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >Create Article</button>
        </div>
      </form>
    </div>
  );
};

export default ArticleCreatePage;