// ============================================================
// StreetRise — Platform Constants
// Single source of truth for enums, labels, and categories.
// ============================================================

import type { CandidateStage, SupportType } from './types';

// ------------------------------------------------------------------
// Candidate lifecycle stages — ordered progression
// ------------------------------------------------------------------
export const CANDIDATE_STAGES: {
  value: CandidateStage;
  label: string;
  color: string;
  bg: string;
  description: string;
}[] = [
  {
    value: 'identified',
    label: 'Identified',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    description: 'Candidate spotted and added to the screening queue.',
  },
  {
    value: 'observation',
    label: 'Under Observation',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    description: 'Background check, intent verification, and need assessment.',
  },
  {
    value: 'training',
    label: 'In Training',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    description: 'Week 1–2: Shadowed by volunteer. Earning 10% revenue or ₹300/day.',
  },
  {
    value: 'assisted_selling',
    label: 'Assisted Selling',
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-500/10 border-teal-500/20',
    description: 'Handling money with oversight. Basic needs supported by StreetRise.',
  },
  {
    value: 'independent_selling',
    label: 'Independent Selling',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    description: 'Operating solo. Stock advanced, settling cost price, keeping 15% profit.',
  },
  {
    value: 'stabilized',
    label: 'Stabilized',
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/20',
    description: 'Financially self-sustaining. Basic needs settled. Graduated.',
  },
  {
    value: 'exited',
    label: 'Exited',
    color: 'text-muted-foreground',
    bg: 'bg-muted border-border',
    description: 'Left the programme. 6-month re-entry cooldown applies.',
  },
];

export const STAGE_MAP = Object.fromEntries(
  CANDIDATE_STAGES.map((s) => [s.value, s])
) as Record<CandidateStage, (typeof CANDIDATE_STAGES)[0]>;

// ------------------------------------------------------------------
// Support types — basic needs categories
// ------------------------------------------------------------------
export const SUPPORT_TYPES: {
  value: SupportType;
  label: string;
  icon: string;
}[] = [
  { value: 'shelter', label: 'Shelter', icon: '🏠' },
  { value: 'food', label: 'Food (3 meals/day)', icon: '🍱' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'hygiene', label: 'Hygiene & Sanitation', icon: '🧼' },
  { value: 'medical', label: 'Medical', icon: '💊' },
  { value: 'training', label: 'Training Assistance', icon: '📚' },
];

// ------------------------------------------------------------------
// Expense categories
// ------------------------------------------------------------------
export const EXPENSE_CATEGORIES = [
  'Basic Needs — Shelter',
  'Basic Needs — Food',
  'Basic Needs — Clothing',
  'Inventory Purchase',
  'Training & Education',
  'Medical & Hygiene',
  'Permits & Licensing',
  'Overhead & Travel',
  'Equipment & Supplies',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

// ------------------------------------------------------------------
// Donation categories
// ------------------------------------------------------------------
export const DONATION_CATEGORIES = [
  'General Fund',
  'Candidate — Basic Needs',
  'Candidate — Inventory Advance',
  'Candidate — Training',
  'Pilot Preparation',
] as const;

export type DonationCategory = (typeof DONATION_CATEGORIES)[number];

// ------------------------------------------------------------------
// Product categories candidates sell
// ------------------------------------------------------------------
export const PRODUCT_CATEGORIES = [
  'Food & Beverages',
  'Fresh Produce',
  'Household Goods',
  'Stationery',
  'Handcraft & Artisan',
  'Clothing & Accessories',
  'Other',
] as const;

// ------------------------------------------------------------------
// Inventory allocation statuses
// ------------------------------------------------------------------
export const ALLOCATION_STATUSES = [
  'Advanced',
  'Partially Settled',
  'Settled',
  'Returned',
] as const;
