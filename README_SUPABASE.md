# Supabase Integration Guide

This guide will help you set up Supabase for your React TypeScript application.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Setup Steps

### 1. Install Dependencies

The Supabase client has already been added to your `package.json`. Run:

```bash
npm install
```

### 2. Environment Variables

Copy your Supabase project URL and anon key from your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key

Update your environment files:

**`.env.development`:**
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**`.env.production`:**
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
```

### 3. Database Setup

Run the SQL migration script in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-migrations.sql`
4. Run the script

This will create:
- `authors` table for author information
- `pages` table for your articles/content
- Row Level Security policies for public read access
- Sample data migrated from your existing `content.json`

### 4. Using Supabase Components

The integration includes new components that fetch data from Supabase:

- `SupabaseHomePage` - Replaces `HomePage` with database-driven content
- `SupabaseArticlePage` - Replaces `DynamicComponentArticlePage` with database-driven content

To use these components, update your `App.tsx` routing:

```tsx
// Replace existing routes with:
<Route 
  path="/" 
  element={<SupabaseHomePage language={language} setLanguage={handleLanguageChange} />} 
/>
<Route 
  path="/article/:id" 
  element={<SupabaseArticlePage language={language} setLanguage={handleLanguageChange} />} 
/>
```

## Features

### Content Management
- **Dynamic Content Loading**: Content is loaded from Supabase database
- **Real-time Updates**: Changes in Supabase are reflected immediately
- **Bilingual Support**: Tamil and English content stored separately
- **Rich Content Types**: Support for various content types (mainText, scripture, reflection, etc.)

### Database Schema
- **Pages Table**: Stores articles with bilingual content
- **Authors Table**: Stores author information
- **JSONB Content**: Flexible content structure using JSONB columns
- **Row Level Security**: Public read access with secure admin operations

### Hooks and Services
- **`useContent()`**: Hook for fetching all content data
- **`usePage(id)`**: Hook for fetching individual pages
- **`useSupabase()`**: Hook for Supabase authentication and client access
- **Content Service**: API layer for database operations

## Content Structure

Content is stored as JSONB arrays with objects containing:

```json
{
  "type": "mainText|scripture|reflection|promise|habitDefinition|encouragement",
  "value": "Content text here"
}
```

## Admin Operations

The content service includes functions for:
- `createPage()` - Create new articles
- `updatePage()` - Update existing articles  
- `deletePage()` - Delete articles

These require proper authentication and permissions.

## Migration from JSON

Your existing `content.json` data has been migrated to the database schema. The migration script includes sample data from your current content.

## Troubleshooting

1. **Environment Variables**: Ensure all Supabase environment variables are set correctly
2. **Database Setup**: Make sure the migration script ran successfully
3. **Network Issues**: Check if your app can connect to Supabase
4. **CORS Issues**: Supabase should handle CORS automatically for web apps

## Next Steps

1. Set up your Supabase project and run the migration
2. Update your environment variables
3. Test the new Supabase-powered components
4. Consider adding authentication for admin features
5. Set up real-time subscriptions for live content updates