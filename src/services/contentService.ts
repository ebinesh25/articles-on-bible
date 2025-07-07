import { supabase } from '../lib/supabase'
import { Database } from '../types/database'
import { DynamicPage, DynamicContentData, ContentEntry } from '../types'

type PageRow = Database['public']['Tables']['pages']['Row']
type AuthorRow = Database['public']['Tables']['authors']['Row']

// Transform database row to DynamicPage format
function transformPageRow(row: PageRow): DynamicPage {
  return {
    id: row.id,
    title: {
      tamil: row.title_tamil,
      english: row.title_english,
    },
    theme: row.theme,
    content: {
      tamil: row.content_tamil as ContentEntry[],
      english: row.content_english as ContentEntry[],
    },
  }
}

// Get all published pages
export async function getPages(): Promise<DynamicPage[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching pages:', error)
    throw error
  }

  return data.map(transformPageRow)
}

// Get a specific page by ID
export async function getPageById(id: string): Promise<DynamicPage | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null
    }
    console.error('Error fetching page:', error)
    throw error
  }

  return transformPageRow(data)
}

// Get author information
export async function getAuthor(): Promise<{ tamil: string; english: string } | null> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching author:', error)
    throw error
  }

  return {
    tamil: data.name_tamil,
    english: data.name_english,
  }
}

// Get all content data (pages + author)
export async function getContentData(): Promise<DynamicContentData> {
  const [pages, author] = await Promise.all([
    getPages(),
    getAuthor(),
  ])

  return {
    pages,
    author: author || { tamil: '', english: '' },
  }
}

// Create a new page (admin function)
export async function createPage(page: Omit<DynamicPage, 'id'>): Promise<DynamicPage> {
  const { data, error } = await supabase
    .from('pages')
    .insert({
      title_tamil: page.title.tamil,
      title_english: page.title.english,
      theme: page.theme,
      content_tamil: page.content.tamil,
      content_english: page.content.english,
      published: true,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating page:', error)
    throw error
  }

  return transformPageRow(data)
}

// Update an existing page (admin function)
export async function updatePage(id: string, updates: Partial<Omit<DynamicPage, 'id'>>): Promise<DynamicPage> {
  const updateData: any = {}
  
  if (updates.title) {
    updateData.title_tamil = updates.title.tamil
    updateData.title_english = updates.title.english
  }
  
  if (updates.theme) {
    updateData.theme = updates.theme
  }
  
  if (updates.content) {
    updateData.content_tamil = updates.content.tamil
    updateData.content_english = updates.content.english
  }

  const { data, error } = await supabase
    .from('pages')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating page:', error)
    throw error
  }

  return transformPageRow(data)
}

// Delete a page (admin function)
export async function deletePage(id: string): Promise<void> {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting page:', error)
    throw error
  }
}