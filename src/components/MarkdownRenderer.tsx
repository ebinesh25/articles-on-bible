import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownProps {
  /**
   * The markdown text to render
   */
  text: string;
  /**
   * Optional className to apply to the container div
   */
  className?: string;
}

/**
 * MarkdownRenderer renders markdown text to HTML
 * and sets it via dangerouslySetInnerHTML.
 * Useful for simple markdown-to-HTML rendering.
 */
// Configure marked: enable GitHub Flavored Markdown and convert single line breaks to <br>
marked.setOptions({
  gfm: true,
  breaks: true,
});

const MarkdownRenderer: React.FC<MarkdownProps> = ({ text, className }) => {
  const html = useMemo(() => {
    const rawHtml = marked.parse(text) as string;
    // Add comprehensive styling to ensure markdown elements render correctly in production
    const htmlWithStyling = rawHtml
      .replace(/<p>/g, '<p class="mt-4 mb-4" style="margin-top: 1rem; margin-bottom: 1rem;">')
      .replace(/<strong>/g, '<strong class="font-bold" style="font-weight: bold;">')
      .replace(/<b>/g, '<b class="font-bold" style="font-weight: bold;">')
      .replace(/<em>/g, '<em class="italic" style="font-style: italic;">')
      .replace(/<i>/g, '<i class="italic" style="font-style: italic;">')
      .replace(/<h1>/g, '<h1 class="text-3xl font-bold my-6" style="font-size: 2rem; font-weight: bold; margin: 1.5rem 0 1rem 0;">')
      .replace(/<h2>/g, '<h2 class="text-2xl font-bold my-5" style="font-size: 1.75rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0;">')
      .replace(/<h3>/g, '<h3 class="text-xl font-bold my-4" style="font-size: 1.5rem; font-weight: bold; margin: 1rem 0 0.5rem 0;">')
      .replace(/<h4>/g, '<h4 class="text-lg font-bold my-3" style="font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0 0.5rem 0;">')
      .replace(/<h5>/g, '<h5 class="text-base font-bold my-3" style="font-size: 1.125rem; font-weight: bold; margin: 0.75rem 0 0.5rem 0;">')
      .replace(/<h6>/g, '<h6 class="text-sm font-bold my-2" style="font-size: 1rem; font-weight: bold; margin: 0.5rem 0;">')
      .replace(/<ul>/g, '<ul class="my-4 pl-8 list-disc" style="margin: 1rem 0; padding-left: 2rem; list-style-type: disc;">')
      .replace(/<ol>/g, '<ol class="my-4 pl-8 list-decimal" style="margin: 1rem 0; padding-left: 2rem; list-style-type: decimal;">')
      .replace(/<li>/g, '<li class="my-1" style="margin: 0.25rem 0;">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600" style="border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 1rem 0; font-style: italic; color: #6b7280;">')
      .replace(/<code>/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" style="background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem;">')
      .replace(/<pre>/g, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4" style="background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0;">')
      .replace(/<a\s+href="([^"]+)"/g, '<a href="$1" class="text-blue-600 underline" style="color: #3b82f6; text-decoration: underline;"')
      .replace(/<br\s*\/?>/g, '<br><br>'); // Convert single line breaks to double for better spacing
    return htmlWithStyling;
  }, [text]);
  
  return (
    <div
      className={`markdown-content prose prose-lg max-w-none ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;