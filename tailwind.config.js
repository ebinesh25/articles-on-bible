/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    // Ensure these classes are never purged for markdown content
    'font-bold',
    'italic',
    'text-3xl',
    'text-2xl', 
    'text-xl',
    'text-lg',
    'text-base',
    'text-sm',
    'my-6',
    'my-5',
    'my-4',
    'my-3',
    'my-2',
    'my-1',
    'mt-4',
    'mb-4',
    'pl-8',
    'pl-4',
    'list-disc',
    'list-decimal',
    'border-l-4',
    'border-gray-300',
    'bg-gray-100',
    'text-gray-600',
    'px-1',
    'py-0.5',
    'p-4',
    'rounded',
    'rounded-lg',
    'overflow-x-auto',
    'font-mono',
    'text-blue-600',
    'underline',
    'prose',
    'prose-lg',
    'max-w-none'
  ],
  theme: {
    extend: {
      fontFamily: {
        'catamaran': ['Catamaran', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
