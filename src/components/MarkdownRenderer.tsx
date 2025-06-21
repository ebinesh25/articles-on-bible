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
    // Add mt-4 class to all paragraph tags
    const htmlWithSpacing = rawHtml.replace(/<p>/g, '<p class="mt-4">');
    return htmlWithSpacing;
  }, [text]);
  
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;