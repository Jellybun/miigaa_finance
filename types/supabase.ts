// types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: number
          date: string
          description: string
          amount: number
          category: string  // Changed from category_id to category (string)
          status: string
          receipt_url: string | null
          notes: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          description: string
          amount: number
          category: string  // Changed from category_id to direct string
          status: string
          receipt_url?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          description?: string
          amount?: number
          category?: string  // Changed from category_id to direct string
          status?: string
          receipt_url?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      // Adding the revenues table definition
      revenues: {
        Row: {
          id: number
          date: string
          description: string
          amount: number
          category: string
          client: string
          payment_method: string
          status: string
          invoice: string | null
          notes: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          description: string
          amount: number
          category: string
          client: string
          payment_method: string
          status: string
          invoice?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          description?: string
          amount?: number
          category?: string
          client?: string
          payment_method?: string
          status?: string
          invoice?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenues_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      // You may want to remove this table if you're not using it anymore
      categories: {
        Row: {
          id: number
          name: string
          color: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          color: string
          user_id?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          color?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      },
      // You may want to remove this table if you're not using it anymore
      payment_methods: {
        Row: {
          id: number
          name: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          user_id?: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}