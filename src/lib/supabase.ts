import { createClient } from '@supabase/supabase-js';

// ============================================================
// StreetRise — Supabase Database Type Definitions
// Mirrors the database schema exactly.
// LEGACY tables (sellers, progress_updates) kept for migration.
// ============================================================
export interface Database {
  public: {
    Tables: {
      // ----------------------------------------------------------------
      // LEGACY — to be removed in Phase 5 (after candidate migration)
      // ----------------------------------------------------------------
      sellers: {
        Row: {
          id: string;
          name: string;
          business_name: string;
          category: string;
          image_url: string | null;
          location: string;
          description: string;
          goal_amount: number;
          raised_amount: number;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          business_name: string;
          category: string;
          image_url?: string | null;
          location: string;
          description: string;
          goal_amount: number;
          raised_amount?: number;
          status?: string;
        };
        Update: {
          id?: string;
          name?: string;
          business_name?: string;
          category?: string;
          image_url?: string | null;
          location?: string;
          description?: string;
          goal_amount?: number;
          raised_amount?: number;
          status?: string;
        };
        Relationships: [];
      };
      progress_updates: {
        Row: {
          id: string;
          seller_id: string;
          step: string;
          date_label: string;
          is_complete: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          step: string;
          date_label: string;
          is_complete?: boolean;
        };
        Update: {
          id?: string;
          seller_id?: string;
          step?: string;
          date_label?: string;
          is_complete?: boolean;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------------
      // CORE — Candidate lifecycle
      // ----------------------------------------------------------------
      candidates: {
        Row: {
          id: string;
          name: string;
          alias: string;
          phone: string | null;
          location: string;
          photo_url: string | null;
          description: string;
          stage: string;
          stage_started_at: string;
          product_category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          alias: string;
          phone?: string | null;
          location: string;
          photo_url?: string | null;
          description: string;
          stage?: string;
          stage_started_at?: string;
          product_category: string;
        };
        Update: {
          id?: string;
          name?: string;
          alias?: string;
          phone?: string | null;
          location?: string;
          photo_url?: string | null;
          description?: string;
          stage?: string;
          stage_started_at?: string;
          product_category?: string;
        };
        Relationships: [];
      };
      candidate_notes: {
        Row: {
          id: string;
          candidate_id: string;
          note: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          note: string;
          created_by: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          note?: string;
          created_by?: string;
        };
        Relationships: [];
      };
      stage_transitions: {
        Row: {
          id: string;
          candidate_id: string;
          from_stage: string | null;
          to_stage: string;
          notes: string | null;
          transitioned_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          from_stage?: string | null;
          to_stage: string;
          notes?: string | null;
          transitioned_at?: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          from_stage?: string | null;
          to_stage?: string;
          notes?: string | null;
          transitioned_at?: string;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------------
      // INVENTORY — product supply and allocation
      // ----------------------------------------------------------------
      inventory: {
        Row: {
          id: string;
          item_name: string;
          brand_name: string | null;
          true_cost_price: number;
          candidate_cost_price: number;
          selling_price: number;
          refundable_percentage: number;
          quantity_available: number;
          quantity_allocated: number;
          quantity_returned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          item_name: string;
          brand_name?: string | null;
          true_cost_price: number;
          candidate_cost_price: number;
          selling_price: number;
          refundable_percentage?: number;
          quantity_available: number;
          quantity_allocated?: number;
          quantity_returned?: number;
        };
        Update: {
          id?: string;
          item_name?: string;
          brand_name?: string | null;
          true_cost_price?: number;
          candidate_cost_price?: number;
          selling_price?: number;
          refundable_percentage?: number;
          quantity_available?: number;
          quantity_allocated?: number;
          quantity_returned?: number;
        };
        Relationships: [];
      };
      inventory_allocations: {
        Row: {
          id: string;
          candidate_id: string;
          inventory_id: string;
          quantity: number;
          status: string;
          advance_date: string;
          settlement_amount_due: number;
          amount_settled: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          inventory_id: string;
          quantity: number;
          status?: string;
          advance_date?: string;
          settlement_amount_due: number;
          amount_settled?: number;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          inventory_id?: string;
          quantity?: number;
          status?: string;
          advance_date?: string;
          settlement_amount_due?: number;
          amount_settled?: number;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------------
      // SUPPORT — basic needs tracking
      // ----------------------------------------------------------------
      support_records: {
        Row: {
          id: string;
          candidate_id: string;
          support_type: string;
          description: string;
          amount_spent: number | null;
          provided_on: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id: string;
          support_type: string;
          description: string;
          amount_spent?: number | null;
          provided_on: string;
        };
        Update: {
          id?: string;
          candidate_id?: string;
          support_type?: string;
          description?: string;
          amount_spent?: number | null;
          provided_on?: string;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------------
      // FINANCE — donations and expenses
      // ----------------------------------------------------------------
      donations: {
        Row: {
          id: string;
          amount: number;
          category: string;
          donor_name: string | null;
          is_anonymous: boolean;
          tx_ref: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          amount: number;
          category: string;
          donor_name?: string | null;
          is_anonymous?: boolean;
          tx_ref: string;
        };
        Update: {
          id?: string;
          amount?: number;
          category?: string;
          donor_name?: string | null;
          is_anonymous?: boolean;
          tx_ref?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          candidate_id: string | null;
          item_name: string;
          category: string;
          amount: number;
          receipt_url: string | null;
          receipt_ref: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          candidate_id?: string | null;
          item_name: string;
          category: string;
          amount: number;
          receipt_url?: string | null;
          receipt_ref: string;
        };
        Update: {
          id?: string;
          candidate_id?: string | null;
          item_name?: string;
          category?: string;
          amount?: number;
          receipt_url?: string | null;
          receipt_ref?: string;
        };
        Relationships: [];
      };

      // ----------------------------------------------------------------
      // LOCATIONS — active stall plots
      // ----------------------------------------------------------------
      business_locations: {
        Row: {
          id: string;
          city: string;
          name: string;
          candidate_name: string;
          address: string;
          type: string;
          year: string;
          coords_x: number;
          coords_y: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          city: string;
          name: string;
          candidate_name: string;
          address: string;
          type: string;
          year: string;
          coords_x: number;
          coords_y: number;
        };
        Update: {
          id?: string;
          city?: string;
          name?: string;
          candidate_name?: string;
          address?: string;
          type?: string;
          year?: string;
          coords_x?: number;
          coords_y?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Retrieve public environment variables
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder-anon-key';

// Check if credentials are configured
export const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== '' &&
  ((process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== '') ||
   (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== undefined && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY !== ''));

// Instantiate the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
