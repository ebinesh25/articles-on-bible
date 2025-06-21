import { Language } from '../types';

/**
 * Get the current language from URL parameters
 */
export const getLanguageFromUrl = (searchParams: URLSearchParams): Language => {
  const langParam = searchParams.get('la');
  return (langParam === 'english' || langParam === 'tamil') ? langParam as Language : 'tamil';
};

/**
 * Update URL with language parameter
 */
export const updateLanguageInUrl = (
  pathname: string, 
  searchParams: URLSearchParams, 
  language: Language
): string => {
  const params = new URLSearchParams(searchParams);
  params.set('la', language);
  return `${pathname}?${params.toString()}`;
};

/**
 * Get URL with language parameter
 */
export const getUrlWithLanguage = (path: string, language: Language): string => {
  return `${path}?la=${language}`;
};
