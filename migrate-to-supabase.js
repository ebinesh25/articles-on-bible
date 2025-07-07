#!/usr/bin/env node

/**
 * Supabase Migration Script
 * Uploads content.json data to Supabase database
 * 
 * This script migrates articles from the local content.json file to a Supabase database
 * matching the provided schema structure with a single 'articles' table.
 * 
 * Usage: node migrate-to-supabase.js [options]
 * 
 * Options:
 *   --dry-run    : Preview what would be migrated without actually uploading
 *   --clear      : Clear existing articles before migration 
 *   --verbose    : Show detailed logging
 *   --help       : Show help message
 * 
 * Environment Variables:
 *   SUPABASE_URL         : Your Supabase project URL
 *   SUPABASE_SERVICE_KEY : Your Supabase service role key (for admin operations)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file (Vite-style)
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key] = value;
        }
      }
    });
  }
}

// Load environment variables
loadEnvFile();

// Create Supabase client
let supabase;

// Configuration
const config = {
  supabaseUrl: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY,
  contentJsonPath: path.join(__dirname, 'src', 'data', 'content.json'),
  dryRun: process.argv.includes('--dry-run'),
  verbose: process.argv.includes('--verbose'),
  clearFirst: process.argv.includes('--clear')
};

// Theme color mapping
const THEME_COLORS = {
  'gray': '#6B7280',
  'warm': '#F59E0B',
  'blue': '#3B82F6',
  'green': '#10B981',
  'purple': '#8B5CF6',
  'red': '#EF4444',
  'pink': '#EC4899',
  'indigo': '#6366F1'
};

// Validate configuration
function validateConfig() {
  if (!config.supabaseUrl && !config.dryRun) {
    console.error('❌ SUPABASE_URL environment variable is required');
    console.error('   Set this to your Supabase project URL');
    process.exit(1);
  }
  
  if (!config.supabaseKey && !config.dryRun) {
    console.error('❌ SUPABASE_SERVICE_KEY environment variable is required');
    console.error('   Set this to your Supabase service role key');
    process.exit(1);
  }
  
  if (!fs.existsSync(config.contentJsonPath)) {
    console.error(`❌ Content file not found: ${config.contentJsonPath}`);
    process.exit(1);
  }
  
  if (config.dryRun && (!config.supabaseUrl || !config.supabaseKey)) {
    logWarning('⚠️  Environment variables not set - running in dry run mode only');
  }
}

// Utility functions
function log(message, force = false) {
  if (config.verbose || force) {
    console.log(message);
  }
}

function logError(message) {
  console.error(`❌ ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logWarning(message) {
  console.log(`⚠️  ${message}`);
}

// Load and parse content.json
function loadContentData() {
  try {
    const contentData = JSON.parse(fs.readFileSync(config.contentJsonPath, 'utf8'));
    log(`📖 Loaded content.json with ${contentData.pages.length} pages`);
    return contentData;
  } catch (error) {
    logError(`Failed to load content.json: ${error.message}`);
    process.exit(1);
  }
}

// Clear existing data (optional)
async function clearExistingData() {
  if (!config.clearFirst) return;
  
  console.log('🧹 Clearing existing data...');
  
  if (config.dryRun) {
    logWarning('DRY RUN: Would clear all existing articles');
    return;
  }
  
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .neq('id', 'impossible-id-to-match-all'); // Delete all records
    
    if (error) throw error;
    
    logSuccess('Cleared existing articles');
  } catch (error) {
    logError(`Failed to clear data: ${error.message}`);
    throw error;
  }
}

// Migrate individual article
async function migrateArticle(page, author) {

    const { id, title, theme, content } = page;

  log(`\n📝 Processing article: ${id}`);
  log(`  Title (EN): ${title.english}`);
  log(`  Title (TA): ${title.tamil}`);
  log(`  Theme: ${theme}`);

  // Prepare article data
  const articleData = {
    id: id,
    title_english: title.english,
    title_tamil: title.tamil,
    theme_color: THEME_COLORS[theme] || THEME_COLORS['gray'],
    author_english: author?.english || 'Unknown',
    author_tamil: author?.tamil || 'Unknown',
    content_english: JSON.stringify(content.english || []),
    content_tamil: JSON.stringify(content.tamil || []),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Content analysis
  const englishSections = content.english?.length || 0;
  const tamilSections = content.tamil?.length || 0;
  log(`  Content sections: ${englishSections} (EN), ${tamilSections} (TA)`);

  // Preview content structure
  if (config.verbose && content.english?.length > 0) {
    log('  English content structure:');
    content.english.forEach((section, index) => {
      log(`    ${index + 1}. ${section.type}: ${section.value.substring(0, 50)}...`);
    });
  }

  if (config.dryRun) {
    log('  ✅ Article prepared for migration (dry run)');
    return articleData;
  }

  // Insert into Supabase
  log('  📤 Uploading to Supabase...');
  const { data, error: insertError } = await supabase
    .from('articles')
    .insert([articleData])
    .select();

  if (insertError) {
    throw new Error(`Database insert failed: ${insertError.message}`);
  }

  log('  ✅ Article migrated successfully');
  return data[0];
}

// Insert all articles
async function insertAllArticles(pages, author) {
  console.log(`� Migrating ${pages.length} articles...`);
  
  let results = {
    successful: 0,
    failed: 0,
    errors: []
  };

  for (const page of pages) {
    try {
        // console.log(JSON.stringify(page, null, 2));
      await migrateArticle(page, author);
      results.successful++;
    } catch (error) {
      logError(`Failed to migrate article "${page.id}": ${error.message}`);
      results.failed++;
      results.errors.push({
        article: page.id,
        error: error.message
      });
    }
  }

  return results;
}

// Verify data integrity
async function verifyMigration(originalData, results) {
  console.log('🔍 Verifying migration...');
  
  if (config.dryRun) {
    logWarning('DRY RUN: Skipping verification');
    return;
  }
  
  try {
    // Check articles
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title_english, created_at');
    
    if (articlesError) throw articlesError;
    
    const actualCount = articles?.length || 0;
    const expectedCount = originalData.pages.length;
    
    console.log('📊 Migration Summary:');
    console.log(`   Articles: ${actualCount} (expected: ${expectedCount})`);
    console.log(`   Successful: ${results.successful}`);
    console.log(`   Failed: ${results.failed}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(({ article, error }) => {
        console.log(`  - ${article}: ${error}`);
      });
    }
    
    if (actualCount === expectedCount && results.failed === 0) {
      logSuccess('Migration verification passed!');
    } else {
      logWarning('Migration verification found discrepancies');
    }
    
    // Show sample of migrated articles
    if (articles && articles.length > 0) {
      console.log('\n📋 Sample of migrated articles:');
      articles.slice(0, 3).forEach(article => {
        console.log(`  - ${article.id}: ${article.title_english}`);
      });
      if (articles.length > 3) {
        console.log(`  ... and ${articles.length - 3} more`);
      }
    }
    
  } catch (error) {
    logError(`Verification failed: ${error.message}`);
    throw error;
  }
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting Supabase migration...');
  console.log(`Mode: ${config.dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Clear existing: ${config.clearFirst}`);
  console.log(`Verbose: ${config.verbose}`);
  console.log('');
  
  // Initialize Supabase client after validation
  if (!config.dryRun) {
    supabase = createClient(config.supabaseUrl, config.supabaseKey);
  }
  
  try {
    // Load data
    const contentData = loadContentData();
    
    // Clear existing data if requested
    await clearExistingData();
    
    // Migrate all articles
    const results = await insertAllArticles(contentData.pages, contentData.author);
    
    // Verify migration
    await verifyMigration(contentData, results);
    
    console.log('');
    if (results.failed === 0) {
      logSuccess('Migration completed successfully! 🎉');
    } else {
      logWarning(`Migration completed with ${results.failed} failures`);
    }
    
    if (config.dryRun) {
      console.log('');
      logWarning('This was a DRY RUN. No data was actually inserted.');
      console.log('Run without --dry-run to perform the actual migration.');
    }
    
  } catch (error) {
    console.log('');
    logError(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// CLI help
function showHelp() {
  console.log(`
📚 Supabase Migration Tool for Articles

Usage: node migrate-to-supabase.js [options]

Options:
  --dry-run     Preview migration without uploading data
  --clear       Clear existing articles before migration
  --verbose     Show detailed logging
  --help        Show this help message

Environment Variables:
  SUPABASE_URL           Your Supabase project URL
  SUPABASE_SERVICE_KEY   Your Supabase service role key

Examples:
  # Preview migration
  node migrate-to-supabase.js --dry-run --verbose

  # Clear existing data and migrate
  node migrate-to-supabase.js --clear --verbose

  # Standard migration
  node migrate-to-supabase.js

Expected Database Schema:
  articles table with columns:
  - id (text, primary key)
  - title_english (text)
  - title_tamil (text)
  - theme_color (text)
  - author_english (text)
  - author_tamil (text)
  - content_english (jsonb)
  - content_tamil (jsonb)
  - created_at (timestamp)
  - updated_at (timestamp)
`);
}

// Main execution
if (process.argv.includes('--help')) {
  showHelp();
  process.exit(0);
}

validateConfig();
runMigration();
