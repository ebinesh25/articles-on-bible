import { useEffect } from 'react';
import { Page, DynamicPage, Language } from '../types';

interface SEOMetaProps {
  title?: string;
  description?: string;
  page?: Page | DynamicPage;
  language: Language;
}

export const useDocumentTitle = ({ title, description, page, language }: SEOMetaProps) => {
  useEffect(() => {
    if (page) {
      // For article pages
      const pageTitle = page.title[language];
      // Extract mainText safely: support both object and array formats
      const rawContent = (page.content as any)[language];
      let mainText: string = '';
      if (Array.isArray(rawContent)) {
        const m = rawContent.find((e: any) => e.type === 'reflection');
        mainText = m ? String(m.value) : '';
      } else if (rawContent && typeof rawContent === 'object') {
        mainText = String(rawContent.reflection || '');
      }
      const pageDescription = mainText.substring(0, 160);
      document.title = `${pageTitle} | ${language === 'tamil' ? 'ஜெஸ்ஸி ஆனந்த்' : 'Jessie Anand'}`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', pageDescription);
    } else if (title) {
      // For custom pages
      document.title = title;
      if (description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', description);
      }
    } else {
      // For home page
      const homeTitle = language === 'tamil' 
        ? 'ஊக்கமளிக்கும் சிந்தனைகள் | ஜெஸ்ஸி ஆனந்த்'
        : 'Inspirational Reflections | Jessie Anand';
      const homeDescription = language === 'tamil'
        ? 'நம்பிக்கை, நம்பிக்கை மற்றும் தெய்வீக அன்பின் மூலம் பயணம் செய்யுங்கள், இதயத்தில் பேசும் மற்றும் ஆன்மாவை வளர்க்கும் சிந்தனைமிக்க பிரதிபலிப்புகளுடன்.'
        : 'Journey through faith, hope, and divine love with thoughtful reflections that speak to the heart and nurture the soul.';
      
      document.title = homeTitle;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', homeDescription);
    }
  }, [title, description, page, language]);
};
