import React, { createContext, useContext, ReactNode } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import { User, Session } from '@supabase/supabase-js'
import { SupabaseClient } from '@supabase/supabase-js'

interface SupabaseContextType {
  user: User | null
  session: Session | null
  loading: boolean
  supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const supabaseData = useSupabase()

  return (
    <SupabaseContext.Provider value={supabaseData}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabaseContext() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabaseContext must be used within a SupabaseProvider')
  }
  return context
}