# Supabase Migration Guide

This guide explains how to migrate your article content from the local `content.json` file to a Supabase database.

## Prerequisites

1. **Supabase Account & Project**: You need a Supabase account with a project set up
2. **Environment Variables**: Required environment variables must be configured
3. **Database Schema**: Your Supabase database should have the correct table structure

## Database Schema

Create an `articles` table in your Supabase database with the following structure:

```sql
-- Create articles table
CREATE TABLE articles (
  id text PRIMARY KEY,
  title_english text NOT NULL,
  title_tamil text NOT NULL,
  theme_color text DEFAULT '#6B7280',
  author_english text NOT NULL,
  author_tamil text NOT NULL,
  content_english jsonb NOT NULL DEFAULT '[]',
  content_tamil jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone DEFAULT NOW(),
  updated_at timestamp with time zone DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_articles_title_english ON articles(title_english);
CREATE INDEX idx_articles_created_at ON articles(created_at);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Create a policy for public read access (adjust as needed)
CREATE POLICY "Allow public read access" ON articles
  FOR SELECT USING (true);
```

## Environment Setup

1. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file**:
   ```bash
   # Your Supabase project URL
   SUPABASE_URL=https://your-project.supabase.co
   
   # Your Supabase service role key (for migration)
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

   > **Important**: The service role key has full admin access to your database. Keep it secure and never commit it to version control.

3. **Find your Supabase credentials**:
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the Project URL and Service Role Key

## Migration Commands

### 1. Dry Run (Recommended First)
Preview what will be migrated without actually uploading data:

```bash
node migrate-to-supabase.js --dry-run --verbose
```

This will show you:
- How many articles will be migrated
- The structure of each article
- Any potential issues

### 2. Clear and Migrate
Clear existing data and perform a fresh migration:

```bash
node migrate-to-supabase.js --clear --verbose
```

### 3. Standard Migration
Migrate without clearing existing data:

```bash
node migrate-to-supabase.js --verbose
```

## Command Options

- `--dry-run`: Preview migration without uploading data
- `--clear`: Clear existing articles before migration
- `--verbose`: Show detailed logging
- `--help`: Show help message

## Data Mapping

The migration script maps your `content.json` data to the Supabase schema as follows:

| content.json | Supabase Column | Description |
|--------------|----------------|-------------|
| `id` | `id` | Article unique identifier |
| `title.english` | `title_english` | English title |
| `title.tamil` | `title_tamil` | Tamil title |
| `theme` | `theme_color` | Theme color (mapped to hex codes) |
| `author.english` | `author_english` | Author name in English |
| `author.tamil` | `author_tamil` | Author name in Tamil |
| `content.english` | `content_english` | English content as JSON |
| `content.tamil` | `content_tamil` | Tamil content as JSON |

## Theme Color Mapping

The script maps theme names to hex colors:

- `gray` → `#6B7280`
- `warm` → `#F59E0B`
- `blue` → `#3B82F6`
- `green` → `#10B981`
- `purple` → `#8B5CF6`
- `red` → `#EF4444`
- `pink` → `#EC4899`
- `indigo` → `#6366F1`

## Content Structure

Each article's content is stored as JSON arrays with objects containing:
- `type`: Content type (e.g., "mainText", "scripture", "reflection")
- `value`: The actual content text

Example:
```json
[
  {
    "type": "mainText",
    "value": "This is the main text content..."
  },
  {
    "type": "scripture",
    "value": "Biblical quote or reference..."
  },
  {
    "type": "reflection",
    "value": "Reflection questions or thoughts..."
  }
]
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Found**
   ```
   ❌ SUPABASE_URL environment variable is required
   ```
   - Make sure your `.env` file is in the project root
   - Check that variable names match exactly

2. **Database Connection Issues**
   ```
   ❌ Database insert failed: relation "articles" does not exist
   ```
   - Ensure you've created the articles table in Supabase
   - Check that your service role key is correct

3. **Permission Errors**
   ```
   ❌ Database insert failed: insufficient_privilege
   ```
   - Make sure you're using the service role key, not the anon key
   - Check your Row Level Security policies

### Validation Steps

After migration, verify your data:

1. **Check Article Count**:
   ```sql
   SELECT COUNT(*) FROM articles;
   ```

2. **Sample Data**:
   ```sql
   SELECT id, title_english, title_tamil, theme_color 
   FROM articles 
   LIMIT 5;
   ```

3. **Content Structure**:
   ```sql
   SELECT id, 
          jsonb_array_length(content_english) as english_sections,
          jsonb_array_length(content_tamil) as tamil_sections
   FROM articles;
   ```

## Next Steps

After successful migration:

1. **Update your app** to read from Supabase instead of `content.json`
2. **Set up proper authentication** if needed
3. **Configure Row Level Security** policies
4. **Set up backups** for your Supabase database
5. **Test your application** with the new data source

## Security Notes

- Keep your service role key secure
- Use environment variables for all sensitive data
- Consider using Row Level Security for production
- Never commit `.env` files to version control
- Use the anon key for client-side operations

## Support

If you encounter issues:
1. Check the migration script output for detailed error messages
2. Verify your database schema matches the expected structure
3. Ensure all environment variables are correctly set
4. Check Supabase logs in your dashboard for server-side errors
