// ============================================================
// StreetRise — Shared Domain Types
// These map 1:1 to the Supabase database schema.
// ============================================================

export type CandidateStage =
  | 'identified'
  | 'observation'
  | 'training'
  | 'assisted_selling'
  | 'independent_selling'
  | 'stabilized'
  | 'exited';

export type SupportType =
  | 'shelter'
  | 'food'
  | 'clothing'
  | 'hygiene'
  | 'medical'
  | 'training';

export type AllocationStatus =
  | 'Advanced'
  | 'Partially Settled'
  | 'Settled'
  | 'Returned';

// ------------------------------------------------------------------
// Candidate — the core rehabilitee profile
// ------------------------------------------------------------------
export interface Candidate {
  id: string;
  name: string;
  alias: string;
  phone: string | null;
  location: string;
  photo_url: string | null;
  description: string;
  stage: CandidateStage;
  stage_started_at: string;
  product_category: string;
  created_at: string;
}

// ------------------------------------------------------------------
// Candidate Notes — admin/volunteer notes log per candidate
// ------------------------------------------------------------------
export interface CandidateNote {
  id: string;
  candidate_id: string;
  note: string;
  created_by: string;
  created_at: string;
}

// ------------------------------------------------------------------
// Stage Transitions — immutable history of lifecycle stage changes
// ------------------------------------------------------------------
export interface StageTransition {
  id: string;
  candidate_id: string;
  from_stage: CandidateStage | null;
  to_stage: CandidateStage;
  notes: string | null;
  transitioned_at: string;
}

// ------------------------------------------------------------------
// Inventory — products sourced and supplied by StreetRise
// ------------------------------------------------------------------
export interface InventoryItem {
  id: string;
  item_name: string;
  brand_name: string | null;
  true_cost_price: number;       // what StreetRise paid to source it
  candidate_cost_price: number;  // what candidate must settle after selling
  selling_price: number;         // fixed public price on the stall
  refundable_percentage: number; // 0–50 based on return duration
  quantity_available: number;
  quantity_allocated: number;
  quantity_returned: number;
  created_at: string;
}

// ------------------------------------------------------------------
// Inventory Allocations — advance tracking per candidate
// ------------------------------------------------------------------
export interface InventoryAllocation {
  id: string;
  candidate_id: string;
  inventory_id: string;
  quantity: number;
  status: AllocationStatus;
  advance_date: string;
  settlement_amount_due: number;
  amount_settled: number;
  created_at: string;
}

// ------------------------------------------------------------------
// Support Records — basic needs facilitated per candidate
// ------------------------------------------------------------------
export interface SupportRecord {
  id: string;
  candidate_id: string;
  support_type: SupportType;
  description: string;
  amount_spent: number | null;
  provided_on: string;
  created_at: string;
}

// ------------------------------------------------------------------
// Donations — public contributions received
// ------------------------------------------------------------------
export interface Donation {
  id: string;
  amount: number;
  category: string;
  donor_name: string | null;
  is_anonymous: boolean;
  tx_ref: string;
  created_at: string;
}

// ------------------------------------------------------------------
// Expenses — logged outflows with receipts
// ------------------------------------------------------------------
export interface Expense {
  id: string;
  candidate_id: string | null;
  item_name: string;
  category: string;
  amount: number;
  receipt_url: string | null;
  receipt_ref: string;
  created_at: string;
}

// ------------------------------------------------------------------
// Business Locations — active stall / plot locations (post-graduation)
// ------------------------------------------------------------------
export interface BusinessLocation {
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
}
