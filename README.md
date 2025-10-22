# Jesse Anand Articles

[Visit the live site »](https://jesse-anand-articles.netlify.app/)

Jesse Anand Articles is a bilingual (English & Tamil) article platform featuring integrated audio playback, built with React, Supabase, and Vite.

## Features

- **Multilingual Support**: Toggle between English and Tamil for article titles and content.
- **Dynamic Routing**: Client-side navigation using React Router for article lists and detail pages.
- **Supabase Integration**:
  - Headless CMS for storing articles and audio URLs.
  - Database migrations available in `supabase/migrations`.
- **Content Rendering**: Markdown content rendered with `react-markdown` and Remark plugins, supporting headings, lists, code blocks, images, and more.
- **Audio Player**:
  - Inline audio player for each article with play/pause, seek, adjustable playback speeds, and download option.
  - Media interaction tracking via Google Analytics.
- **Analytics**: Google Analytics integration for page views, button clicks, downloads, media interactions, and custom events using custom React hooks.
- **Theming**: Customizable article themes with Tailwind CSS gradient backgrounds and accent colors.
- **Responsive Design**: Mobile-first layout with a fixed bottom audio player on small screens.
- **Error Handling & Fallback**: Graceful fallback to cached content when API (Supabase) calls fail.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, lucide-react icons
- **Backend**: Supabase (Database & Storage)
- **Content**: `react-markdown` & Remark plugins
- **Analytics**: Google Analytics (via custom hooks)

## Database Population Automation

Automate article text-to-speech conversion and database population with the [TTS API and Telegram Bot](https://github.com/ebinesh25/tts-api-and-telegram-bot):

1. Clone the automation repo:
   ```bash
   git clone https://github.com/ebinesh25/tts-api-and-telegram-bot.git
   cd tts-api-and-telegram-bot
   ```
2. Configure environment variables (Supabase URL, Service Role Key, Telegram Bot Token, TTS API credentials).
3. Run the bot/script to generate audio, upload to Supabase Storage, and insert/update records in the `articles` table:
   ```bash
   node index.js
   ```
See the [automation repo README](https://github.com/ebinesh25/tts-api-and-telegram-bot) for detailed instructions.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your environment variables:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   GA_TRACKING_ID=G-XXXXXXX
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production and preview:
   ```bash
   npm run build
   npm run preview
   ```

## License

MIT
