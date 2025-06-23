import React, { useRef, useEffect } from 'react';

interface MarkdownEditorProps {
  /** The markdown text to edit */
  value: string;
  /** Callback when markdown text changes */
  onChange: (value: string) => void;
  /** Placeholder text for the editor */
  placeholder?: string;
  /** Whether the field is required in a form */
  required?: boolean;
}

/**
 * MarkdownEditor provides a textarea with toolbar buttons for common markdown formatting
 * and auto-resizes height based on content.
 */
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, placeholder, required }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    }
  }, [value]);

  const applyFormat = (format: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const text = value;
    const selected = text.slice(start, end);
    let formatted = '';
    switch (format) {
      case 'bold':
        formatted = `**${selected || 'bold text'}**`;
        break;
      case 'italic':
        formatted = `*${selected || 'italic text'}*`;
        break;
      case 'h1':
        formatted = `# ${selected || 'Heading 1'}`;
        break;
      case 'h2':
        formatted = `## ${selected || 'Heading 2'}`;
        break;
      case 'h3':
        formatted = `### ${selected || 'Heading 3'}`;
        break;
      case 'blockquote':
        formatted = `> ${selected || 'Blockquote'}`;
        break;
      case 'code':
        if (selected) {
          formatted = `\`\`\`\n${selected}\n\`\`\``;
        } else {
          formatted = `\`\`\`\ncode\n\`\`\``;
        }
        break;
      case 'link': {
        const url = window.prompt('Enter URL', 'https://');
        if (!url) return;
        formatted = `[${selected || 'link text'}](${url})`;
        break;
      }
      case 'ul':
        formatted = `- ${selected || 'List item'}`;
        break;
      case 'ol':
        formatted = `1. ${selected || 'List item'}`;
        break;
      default:
        return;
    }
    const newText = text.slice(0, start) + formatted + text.slice(end);
    onChange(newText);
    setTimeout(() => {
      if (ta) {
        const cursorPos = start + formatted.length;
        ta.selectionStart = ta.selectionEnd = cursorPos;
        ta.focus();
      }
    }, 0);
  };

  const buttonClass =
    'px-2 py-1 text-sm font-medium border border-gray-300 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400';

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        <button type="button" className={buttonClass} onClick={() => applyFormat('bold')}>B</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('italic')}>I</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('h1')}>H1</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('h2')}>H2</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('h3')}>H3</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('ul')}>UL</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('ol')}>OL</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('blockquote')}>&gt;</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('code')}>{'</>'}</button>
        <button type="button" className={buttonClass} onClick={() => applyFormat('link')}>Link</button>
      </div>
      <textarea
        ref={textareaRef}
        className="w-full border border-gray-300 rounded px-3 py-2 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...(required ? { required: true } : {})}
      />
    </div>
  );
};

export default MarkdownEditor;