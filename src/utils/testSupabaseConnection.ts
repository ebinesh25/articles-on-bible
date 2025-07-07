// Test script to verify Supabase connection and data
// You can run this in your browser console or create a temporary component

import { supabase } from '../lib/supabase';

export async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...');
    const { data, error } = await supabase.from('pages').select('count');
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log(data)
      return false;
    }
    
    console.log('✅ Basic connection successful');

    // Test 2: Fetch pages
    console.log('📄 Testing pages fetch...');
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .eq('published', true);
    
    if (pagesError) {
      console.error('❌ Pages fetch failed:', pagesError.message);
      return false;
    }
    
    console.log(`✅ Found ${pages?.length || 0} published pages:`, pages?.map(p => p.id));

    // Test 3: Fetch authors
    console.log('👤 Testing authors fetch...');
    const { data: authors, error: authorsError } = await supabase
      .from('authors')
      .select('*');
    
    if (authorsError) {
      console.error('❌ Authors fetch failed:', authorsError.message);
      return false;
    }
    
    console.log(`✅ Found ${authors?.length || 0} authors:`, authors);

    // Test 4: Test specific page
    if (pages && pages.length > 0) {
      console.log('📖 Testing specific page fetch...');
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', pages[0].id)
        .single();
      
      if (pageError) {
        console.error('❌ Single page fetch failed:', pageError.message);
        return false;
      }
      
      console.log('✅ Single page fetch successful:', page.title_english);
    }

    console.log('🎉 All tests passed! Supabase is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Helper function to check environment variables
export function checkEnvironmentVariables() {
  console.log('🔧 Checking environment variables...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL is not set');
    return false;
  }
  
  if (!supabaseKey) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is not set');
    return false;
  }
  
  console.log('✅ Environment variables are set');
  console.log('📍 Supabase URL:', supabaseUrl);
  console.log('🔑 API Key (first 20 chars):', supabaseKey.substring(0, 20) + '...');
  
  return true;
}

// Run both tests
export async function runAllTests() {
  console.log('🚀 Starting Supabase integration tests...\n');
  
  const envCheck = checkEnvironmentVariables();
  if (!envCheck) {
    console.log('\n❌ Environment check failed. Please check your .env file.');
    return false;
  }
  
  console.log(''); // Empty line for readability
  
  const connectionTest = await testSupabaseConnection();
  
  console.log('\n📊 Test Results:');
  console.log(`Environment Variables: ${envCheck ? '✅' : '❌'}`);
  console.log(`Supabase Connection: ${connectionTest ? '✅' : '❌'}`);
  
  return envCheck && connectionTest;
}