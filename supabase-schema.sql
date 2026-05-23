-- ============================================================
-- StreetRise — Supabase Database Schema v2.0
-- Architecture: Candidate-centric rehabilitation platform
-- No seed data — pilot phase begins with real candidates only
-- ============================================================

-- ============================================================
-- CORE: Candidate lifecycle
-- ============================================================

create table public.candidates (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    alias text not null,                      -- short display name (e.g. "Ravi K.")
    phone text,
    location text not null,                   -- street / area where identified
    photo_url text,                           -- storage bucket URL
    description text not null,               -- background story
    stage text not null default 'identified'
        check (stage in (
            'identified', 'observation', 'training',
            'assisted_selling', 'independent_selling',
            'stabilized', 'exited'
        )),
    stage_started_at timestamptz not null default now(),
    product_category text not null,           -- what they sell
    created_at timestamptz default now()
);

-- Admin/volunteer notes log per candidate
create table public.candidate_notes (
    id uuid default gen_random_uuid() primary key,
    candidate_id uuid references public.candidates(id) on delete cascade not null,
    note text not null,
    created_by text not null,                 -- admin/volunteer name
    created_at timestamptz default now()
);

-- Immutable log of every stage change
create table public.stage_transitions (
    id uuid default gen_random_uuid() primary key,
    candidate_id uuid references public.candidates(id) on delete cascade not null,
    from_stage text,                          -- null for first entry
    to_stage text not null,
    notes text,
    transitioned_at timestamptz not null default now()
);

-- ============================================================
-- INVENTORY: Products sourced and supplied by StreetRise
-- ============================================================

create table public.inventory (
    id uuid default gen_random_uuid() primary key,
    item_name text not null,
    brand_name text,
    true_cost_price numeric not null check (true_cost_price >= 0),    -- what StreetRise paid
    candidate_cost_price numeric not null check (candidate_cost_price >= 0), -- what candidate settles
    selling_price numeric not null check (selling_price >= 0),        -- fixed public price
    refundable_percentage integer not null default 0
        check (refundable_percentage between 0 and 50),               -- % refunded on return
    quantity_available integer not null default 0 check (quantity_available >= 0),
    quantity_allocated integer not null default 0 check (quantity_allocated >= 0),
    quantity_returned integer not null default 0 check (quantity_returned >= 0),
    created_at timestamptz default now()
);

-- Per-candidate inventory advance tracking
create table public.inventory_allocations (
    id uuid default gen_random_uuid() primary key,
    candidate_id uuid references public.candidates(id) on delete cascade not null,
    inventory_id uuid references public.inventory(id) on delete restrict not null,
    quantity integer not null check (quantity > 0),
    status text not null default 'Advanced'
        check (status in ('Advanced', 'Partially Settled', 'Settled', 'Returned')),
    advance_date timestamptz not null default now(),
    settlement_amount_due numeric not null check (settlement_amount_due >= 0),
    amount_settled numeric not null default 0 check (amount_settled >= 0),
    created_at timestamptz default now()
);

-- ============================================================
-- SUPPORT: Basic needs facilitated per candidate
-- ============================================================

create table public.support_records (
    id uuid default gen_random_uuid() primary key,
    candidate_id uuid references public.candidates(id) on delete cascade not null,
    support_type text not null
        check (support_type in ('shelter', 'food', 'clothing', 'hygiene', 'medical', 'training')),
    description text not null,
    amount_spent numeric check (amount_spent >= 0),
    provided_on date not null,
    created_at timestamptz default now()
);

-- ============================================================
-- FINANCE: Donations and expenses
-- ============================================================

create table public.donations (
    id uuid default gen_random_uuid() primary key,
    amount numeric not null check (amount > 0),
    category text not null,
    donor_name text,
    is_anonymous boolean not null default false,
    tx_ref text not null unique,               -- unique reference per transaction
    created_at timestamptz default now()
);

create table public.expenses (
    id uuid default gen_random_uuid() primary key,
    candidate_id uuid references public.candidates(id) on delete set null,
    item_name text not null,
    category text not null,
    amount numeric not null check (amount > 0),
    receipt_url text,
    receipt_ref text not null,
    created_at timestamptz default now()
);

-- ============================================================
-- LOCATIONS: Active stall / plot coordinates
-- ============================================================

create table public.business_locations (
    id uuid default gen_random_uuid() primary key,
    city text not null,
    name text not null,
    candidate_name text not null,
    address text not null,
    type text not null,
    year text not null,
    coords_x numeric not null check (coords_x between 0 and 100),
    coords_y numeric not null check (coords_y between 0 and 100),
    created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.candidates           enable row level security;
alter table public.candidate_notes      enable row level security;
alter table public.stage_transitions    enable row level security;
alter table public.inventory            enable row level security;
alter table public.inventory_allocations enable row level security;
alter table public.support_records      enable row level security;
alter table public.donations            enable row level security;
alter table public.expenses             enable row level security;
alter table public.business_locations   enable row level security;

-- Public read access (transparency dashboard)
create policy "Public read candidates"        on public.candidates for select using (true);
create policy "Public read donations"         on public.donations for select using (true);
create policy "Public read expenses"          on public.expenses for select using (true);
create policy "Public read business_locations" on public.business_locations for select using (true);

-- Note: candidate_notes, stage_transitions, support_records, inventory are admin-only read
create policy "Admin read candidate_notes"    on public.candidate_notes for select using (auth.role() = 'authenticated');
create policy "Admin read stage_transitions"  on public.stage_transitions for select using (auth.role() = 'authenticated');
create policy "Admin read support_records"    on public.support_records for select using (auth.role() = 'authenticated');
create policy "Admin read inventory"          on public.inventory for select using (auth.role() = 'authenticated');
create policy "Admin read allocations"        on public.inventory_allocations for select using (auth.role() = 'authenticated');

-- Admin full write access to all tables
create policy "Admin write candidates"        on public.candidates for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write candidate_notes"   on public.candidate_notes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write stage_transitions" on public.stage_transitions for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write inventory"         on public.inventory for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write allocations"       on public.inventory_allocations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write support_records"   on public.support_records for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write donations"         on public.donations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write expenses"          on public.expenses for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Admin write locations"         on public.business_locations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('candidate-photos', 'candidate-photos', true),
  ('receipts', 'receipts', true)
on conflict (id) do nothing;

-- Public read
create policy "Public read candidate-photos" on storage.objects for select using (bucket_id = 'candidate-photos');
create policy "Public read receipts"         on storage.objects for select using (bucket_id = 'receipts');

-- Admin write
create policy "Admin upload candidate-photos" on storage.objects for insert with check (bucket_id = 'candidate-photos' and auth.role() = 'authenticated');
create policy "Admin update candidate-photos" on storage.objects for update using (bucket_id = 'candidate-photos' and auth.role() = 'authenticated');
create policy "Admin delete candidate-photos" on storage.objects for delete using (bucket_id = 'candidate-photos' and auth.role() = 'authenticated');
create policy "Admin upload receipts"         on storage.objects for insert with check (bucket_id = 'receipts' and auth.role() = 'authenticated');
create policy "Admin update receipts"         on storage.objects for update using (bucket_id = 'receipts' and auth.role() = 'authenticated');
create policy "Admin delete receipts"         on storage.objects for delete using (bucket_id = 'receipts' and auth.role() = 'authenticated');

-- ============================================================
-- NO SEED DATA
-- Pilot phase: candidates will be entered via the admin panel
-- as real individuals are identified and verified.
-- ============================================================
