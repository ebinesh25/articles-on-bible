export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          title_tamil: string
          title_english: string
          theme: string
          content_tamil: Json
          content_english: Json
          created_at: string
          updated_at: string
          published: boolean
        }
        Insert: {
          id?: string
          title_tamil: string
          title_english: string
          theme: string
          content_tamil: Json
          content_english: Json
          created_at?: string
          updated_at?: string
          published?: boolean
        }
        Update: {
          id?: string
          title_tamil?: string
          title_english?: string
          theme?: string
          content_tamil?: Json
          content_english?: Json
          created_at?: string
          updated_at?: string
          published?: boolean
        }
      }
      authors: {
        Row: {
          id: string
          name_tamil: string
          name_english: string
          created_at: string
        }
        Insert: {
          id?: string
          name_tamil: string
          name_english: string
          created_at?: string
        }
        Update: {
          id?: string
          name_tamil?: string
          name_english?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}