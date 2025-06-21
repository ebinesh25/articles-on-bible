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
  const html = useMemo(() => marked.parse(text), [text]);
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownRenderer;