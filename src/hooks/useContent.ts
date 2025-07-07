import { useState, useEffect } from 'react'
import { DynamicContentData, DynamicPage } from '../types'
import { getContentData, getPageById } from '../services/contentService'

export function useContent() {
  const [contentData, setContentData] = useState<DynamicContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true)
        const data = await getContentData()
        setContentData(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  return { contentData, loading, error, refetch: () => fetchContent() }
}

export function usePage(id: string) {
  const [page, setPage] = useState<DynamicPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPage() {
      try {
        setLoading(true)
        const pageData = await getPageById(id)
        setPage(pageData)
        setError(null)
      } catch (err) {
        console.error('Error fetching page:', err)
        setError('Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPage()
    }
  }, [id])

  return { page, loading, error }
}