/*
  # Create articles table

  1. New Tables
    - `articles`
      - `id` (uuid, primary key) - Unique identifier for each article
      - `title_tamil` (text) - Article title in Tamil
      - `title_english` (text) - Article title in English
      - `content_tamil` (jsonb) - Article content blocks in Tamil (array of {type, value} objects)
      - `content_english` (jsonb) - Article content blocks in English (array of {type, value} objects)
      - `theme` (text) - Color theme for the article display
      - `created_at` (timestamptz) - Timestamp when article was created
      - `updated_at` (timestamptz) - Timestamp when article was last updated

  2. Security
    - Enable RLS on `articles` table
    - Add policy for public read access (articles are publicly viewable)
    - Add policy for authenticated insert access (future auth implementation)
    - Add policy for authenticated update access (future auth implementation)
    - Add policy for authenticated delete access (future auth implementation)

  3. Important Notes
    - Articles are publicly readable
    - Write operations require authentication (to be implemented)
    - Content stored as JSONB for flexible structure
    - Timestamps auto-update on changes
*/

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_tamil text NOT NULL DEFAULT '',
  title_english text NOT NULL DEFAULT '',
  content_tamil jsonb NOT NULL DEFAULT '[]'::jsonb,
  content_english jsonb NOT NULL DEFAULT '[]'::jsonb,
  theme text NOT NULL DEFAULT 'gray',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable"
  ON articles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS articles_updated_at_idx ON articles(updated_at DESC);