-- RUN THIS WHOLE FILE ONCE in Supabase SQL Editor (one paste, one Run).
-- It contains every migration in order, then makes jabermahfuz786@gmail.com an admin.
-- Safe to re-run: statements use IF NOT EXISTS / ON CONFLICT.

-- ===== 20260926184450_create_my_icon_schema.sql =====
/*
# My Icon — Full Schema

Creates the complete database for the My Icon luxury real estate & investment platform.

## Tables
1. `projects` — Real estate listings (Makkah, Madinah, Oman, Bangladesh, Upcoming, Completed)
2. `project_images` — Image/video URLs per project
3. `project_facilities` — Facilities index per project
4. `investment_applications` — Public "Apply to Invest" submissions
5. `umrah_agencies` — B2B Umrah/ticketing agency registrations
6. `blog_posts` — Blog/News articles
7. `investors` — Investor accounts (linked to auth.users via email)
8. `investments` — Investor portfolio entries (project allocation, amounts, dues)
9. `investment_documents` — Agreement PDFs, receipts per investment
10. `investor_notices` — Targeted push notifications to investors
11. `investor_meetings` — Meeting requests from investors
12. `contact_messages` — Contact form submissions
13. `admin_logs` — Audit log for admin actions

## Security
- RLS enabled on ALL tables.
- Public tables (projects, project_images, project_facilities, blog_posts): anon+authenticated SELECT; admin writes via service role only (no anon insert/update/delete).
- Application tables (investment_applications, umrah_agencies, contact_messages): anon+authenticated INSERT only (public submissions), no public SELECT.
- Investor-scoped tables (investments, investment_documents, investor_notices, investor_meetings): authenticated SELECT scoped to the investor's own rows via email match.
- The `investors` table: authenticated SELECT scoped to own row.
*/

-- ============ PROJECTS ============
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'upcoming',
  -- category: 'makkah' | 'madinah' | 'oman' | 'bangladesh' | 'upcoming' | 'completed'
  country text NOT NULL,
  city text NOT NULL,
  property_type text NOT NULL DEFAULT 'building',
  -- property_type: 'land' | 'flat' | 'hotel' | 'building'
  construction_status text NOT NULL DEFAULT 'under_construction',
  -- construction_status: 'ready' | 'under_construction' | 'upcoming'
  land_size text,
  unit_size text,
  starting_price numeric NOT NULL DEFAULT 0,
  price_currency text NOT NULL DEFAULT 'USD',
  -- price_currency: 'SAR' | 'OMR' | 'BDT' | 'USD'
  payment_type text NOT NULL DEFAULT 'cash',
  -- payment_type: 'cash' | 'installment'
  engagement_type text NOT NULL DEFAULT 'ownership',
  -- engagement_type: 'ownership' | 'investment'
  installment_plan text,
  available_units integer NOT NULL DEFAULT 1,
  total_units integer NOT NULL DEFAULT 1,
  construction_progress integer NOT NULL DEFAULT 0,
  expected_completion date,
  ownership_info text,
  map_lat double precision,
  map_lng double precision,
  map_url text,
  brochure_url text,
  description text,
  is_public boolean NOT NULL DEFAULT true,
  status_badge text NOT NULL DEFAULT 'available',
  -- status_badge: 'available' | 'upcoming' | 'sold_out' | 'completed'
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (is_public = true);

-- No public write policies — admin uses service role key

-- ============ PROJECT IMAGES ============
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL DEFAULT 'image',
  -- type: 'image' | 'video'
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_images" ON project_images;
CREATE POLICY "public_read_project_images" ON project_images FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.is_public = true)
  );

-- ============ PROJECT FACILITIES ============
CREATE TABLE IF NOT EXISTS project_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE project_facilities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_project_facilities" ON project_facilities;
CREATE POLICY "public_read_project_facilities" ON project_facilities FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM projects WHERE projects.id = project_facilities.project_id AND projects.is_public = true)
  );

-- ============ INVESTMENT APPLICATIONS ============
CREATE TABLE IF NOT EXISTS investment_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  country text NOT NULL,
  mobile text NOT NULL,
  email text NOT NULL,
  interested_project text,
  investment_type text,
  proposed_amount numeric,
  preferred_currency text NOT NULL DEFAULT 'USD',
  payment_preference text NOT NULL DEFAULT 'cash',
  preferred_meeting_time text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investment_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_applications" ON investment_applications;
CREATE POLICY "public_insert_applications" ON investment_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============ UMRAH AGENCIES ============
CREATE TABLE IF NOT EXISTS umrah_agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_name text NOT NULL,
  country text NOT NULL,
  license_number text NOT NULL,
  contact_person text NOT NULL,
  monthly_passenger_volume integer,
  required_visa_quantity integer,
  services_required text[],
  -- services: 'visa', 'ticketing', 'hotel', 'transport'
  document_url text,
  whatsapp_link text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE umrah_agencies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_umrah_agencies" ON umrah_agencies;
CREATE POLICY "public_insert_umrah_agencies" ON umrah_agencies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============ BLOG POSTS ============
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'news',
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog_posts" ON blog_posts;
CREATE POLICY "public_read_blog_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- ============ INVESTORS ============
-- Investors are linked to auth.users by email. Admin creates the auth user,
-- then inserts a row here. The investor logs in via Supabase auth.
CREATE TABLE IF NOT EXISTS investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  investor_code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  country text,
  nominee_name text,
  nominee_relation text,
  nominee_phone text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Investors can read their own profile (matched by email from JWT)
DROP POLICY IF EXISTS "investor_read_own" ON investors;
CREATE POLICY "investor_read_own" ON investors FOR SELECT
  TO authenticated USING (email = auth.jwt() ->> 'email');

-- ============ INVESTMENTS ============
CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  project_name text NOT NULL,
  investment_amount numeric NOT NULL DEFAULT 0,
  paid_amount numeric NOT NULL DEFAULT 0,
  due_amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  next_installment_date date,
  next_installment_amount numeric,
  profit_distributed numeric DEFAULT 0,
  agreement_url text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Investors can read only their own investments
DROP POLICY IF EXISTS "investor_read_own_investments" ON investments;
CREATE POLICY "investor_read_own_investments" ON investments FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM investors
      WHERE investors.id = investments.investor_id
      AND investors.email = auth.jwt() ->> 'email'
    )
  );

-- ============ INVESTMENT DOCUMENTS ============
CREATE TABLE IF NOT EXISTS investment_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investment_id uuid NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'receipt',
  -- document_type: 'agreement' | 'receipt' | 'other'
  title text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investment_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "investor_read_own_documents" ON investment_documents;
CREATE POLICY "investor_read_own_documents" ON investment_documents FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM investments
      JOIN investors ON investors.id = investments.investor_id
      WHERE investments.id = investment_documents.investment_id
      AND investors.email = auth.jwt() ->> 'email'
    )
  );

-- ============ INVESTOR NOTICES ============
CREATE TABLE IF NOT EXISTS investor_notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES investors(id) ON DELETE CASCADE,
  -- if investor_id is null, it's a broadcast to all investors
  title text NOT NULL,
  body text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investor_notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "investor_read_own_notices" ON investor_notices;
CREATE POLICY "investor_read_own_notices" ON investor_notices FOR SELECT
  TO authenticated USING (
    investor_id IS NULL
    OR EXISTS (
      SELECT 1 FROM investors
      WHERE investors.id = investor_notices.investor_id
      AND investors.email = auth.jwt() ->> 'email'
    )
  );

-- ============ INVESTOR MEETINGS ============
CREATE TABLE IF NOT EXISTS investor_meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL REFERENCES investors(id) ON DELETE CASCADE,
  requested_date date NOT NULL,
  requested_time text NOT NULL,
  topic text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE investor_meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "investor_read_own_meetings" ON investor_meetings;
CREATE POLICY "investor_read_own_meetings" ON investor_meetings FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM investors
      WHERE investors.id = investor_meetings.investor_id
      AND investors.email = auth.jwt() ->> 'email'
    )
  );

DROP POLICY IF EXISTS "investor_insert_own_meetings" ON investor_meetings;
CREATE POLICY "investor_insert_own_meetings" ON investor_meetings FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM investors
      WHERE investors.id = investor_meetings.investor_id
      AND investors.email = auth.jwt() ->> 'email'
    )
  );

-- ============ CONTACT MESSAGES ============
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact" ON contact_messages;
CREATE POLICY "public_insert_contact" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============ ADMIN LOGS ============
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  entity text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
-- No public policies — admin access only via service role

-- ============ INDEXES ============
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status_badge);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_facilities_project ON project_facilities(project_id);
CREATE INDEX IF NOT EXISTS idx_investments_investor ON investments(investor_id);
CREATE INDEX IF NOT EXISTS idx_investment_documents_investment ON investment_documents(investment_id);
CREATE INDEX IF NOT EXISTS idx_investor_notices_investor ON investor_notices(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_meetings_investor ON investor_meetings(investor_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_investors_email ON investors(email);
CREATE INDEX IF NOT EXISTS idx_investors_code ON investors(investor_code);


-- ===== 20260926191434_add_expat_business_tables.sql =====
/*
# Add expat service + business inquiry tables

## New Tables
1. `expat_service_requests` — Submissions from the Expat Crisis Helpline grid (HUB 1)
2. `business_inquiries` — Inquiries from Business City sections (HUB 2)

## Security
- Both tables: anon+authenticated INSERT only (public submissions), no public SELECT.
*/

CREATE TABLE IF NOT EXISTS expat_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type text NOT NULL,
  description text NOT NULL,
  document_url text,
  contact_name text,
  contact_phone text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expat_service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_expat_requests" ON expat_service_requests;
CREATE POLICY "public_insert_expat_requests" ON expat_service_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS business_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type text NOT NULL,
  name text,
  phone text,
  email text,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_business_inquiries" ON business_inquiries;
CREATE POLICY "public_insert_business_inquiries" ON business_inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_expat_service_type ON expat_service_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_business_inquiry_type ON business_inquiries(inquiry_type);


-- ===== 20261001123027_add_user_id_to_investors.sql =====
/*
# Add user_id column to investors table

## Changes
1. Adds `user_id` (uuid) column to `investors` table, linking each investor to their Supabase auth.users account.
2. Creates an index on `user_id` for fast lookups.
3. Adds a foreign key constraint from `investors.user_id` to `auth.users.id` with ON DELETE CASCADE.

## Security
- No RLS policy changes. The existing `investor_read_own` SELECT policy (email match via JWT) remains in effect.
- The `user_id` column is nullable to avoid breaking existing investor rows that haven't been linked yet.

## Notes
1. The `user_id` column is optional (nullable) so existing investor records remain valid.
2. When the admin creates a new investor via the edge function, it will set both `email` and `user_id` from the created auth user.
3. The investor dashboard can optionally use `user_id` for lookups, but the existing email-based query continues to work.
*/

ALTER TABLE investors ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_investors_user_id ON investors(user_id);


-- ===== 20261002002357_create_content_table.sql =====
/*
# Create content table for admin CRUD

1. New Tables
- `content`
  - `id` (uuid, primary key, auto-generated)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `price` (numeric, nullable, for item pricing)
  - `image_url` (text, nullable, URL to item image)
  - `created_at` (timestamptz, defaults to now)
  - `updated_at` (timestamptz, defaults to now, auto-updates on row change)

2. Security
- Enable RLS on `content`.
- Single-tenant (no sign-in required): allow anon + authenticated full CRUD.
  The admin page is gated client-side; the data itself is intentionally public/shared.
- 4 separate policies (SELECT, INSERT, UPDATE, DELETE) — no FOR ALL.

3. Indexes
- `content_created_at_idx` on `created_at` for ordering by newest first.
*/

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price numeric(12, 2),
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS content_updated_at ON content;
CREATE TRIGGER content_updated_at
  BEFORE UPDATE ON content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for ordering
CREATE INDEX IF NOT EXISTS content_created_at_idx ON content (created_at DESC);

-- RLS Policies: single-tenant, anon + authenticated
DROP POLICY IF EXISTS "anon_select_content" ON content;
CREATE POLICY "anon_select_content" ON content FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_content" ON content;
CREATE POLICY "anon_insert_content" ON content FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_content" ON content;
CREATE POLICY "anon_update_content" ON content FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_content" ON content;
CREATE POLICY "anon_delete_content" ON content FOR DELETE
  TO anon, authenticated USING (true);


-- ===== 20261016120000_investor_portal_v2.sql =====
/*
# Icon Investor Portal v2

- Login by email, phone number or investor code (resolved server-side).
- 8 portal projects, each protected by a per-investor PIN.
- PIN is hashed (bcrypt via pgcrypto), checked on the server, rate-limited.
- Project details, updates and files are returned only after a successful unlock.
- Dividend history, membership level, estimated return, targeted broadcasts.

Investors have NO direct read access to project details tables; everything
goes through SECURITY DEFINER functions that check the caller's email from the JWT.
*/

create extension if not exists pgcrypto;

-- ============ COLUMNS ON EXISTING TABLES ============
alter table investors add column if not exists membership_level text;

alter table investments add column if not exists investor_project_id uuid;
alter table investments add column if not exists expected_return_pct numeric;

alter table investor_notices add column if not exists investor_project_id uuid;

-- ============ PORTAL PROJECTS ============
create table if not exists investor_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_bn text not null,
  name_en text not null,
  sector_bn text not null default '',
  sector_en text not null default '',
  image_url text,
  sort_order int not null default 0,
  status text check (status in ('planning', 'active', 'on_hold', 'completed')),
  progress_percent int check (progress_percent between 0 and 100),
  summary text not null default '',
  moving_forward text not null default '',
  not_moving_forward text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table investments
  drop constraint if exists investments_investor_project_id_fkey;
alter table investments
  add constraint investments_investor_project_id_fkey
  foreign key (investor_project_id) references investor_projects(id) on delete set null;

alter table investor_notices
  drop constraint if exists investor_notices_investor_project_id_fkey;
alter table investor_notices
  add constraint investor_notices_investor_project_id_fkey
  foreign key (investor_project_id) references investor_projects(id) on delete cascade;

alter table investor_projects enable row level security;
-- No policies: investors reach this only via portal_projects() / portal_project_detail().

insert into investor_projects (slug, name_bn, name_en, sector_bn, sector_en, sort_order) values
  ('makkah-madinah-land', 'মক্কা মদিনা (ল্যান্ড ও প্রপার্টি)', 'Makkah Madinah (Land & Property)', 'ল্যান্ড ও রিয়েল এস্টেট ফান্ডিং', 'Land & Real Estate Funding', 1),
  ('makkah-madinah-hotel', 'মক্কা মদিনা হোটেল প্রজেক্ট', 'Makkah Madinah Hotel Project', 'হসপিটালিটি মেগাপ্রজেক্ট', 'Hospitality Megaproject', 2),
  ('oman-st30', 'ওমান প্রজেক্ট (ST-30 ফোল্ডার)', 'Oman Project (ST-30 Folder)', 'ওমান কৌশলগত ST-30', 'Oman Strategic ST-30', 3),
  ('investor-licence', 'ইনভেস্টর লাইসেন্স প্রজেক্ট', 'Investor Licence Project', 'অফিসিয়াল লাইসেন্সিং', 'Official Licensing', 4),
  ('umrah-b2b', 'ওমরাহ B2B প্রজেক্ট', 'Umrah B2B Project', 'ওমরাহ B2B সার্ভিস', 'Umrah B2B Services', 5),
  ('oman-supermarket', 'সুপারমার্কেট বিজনেস (ওমান)', 'Supermarket Business (Oman)', 'খুচরা সুপারমার্কেট', 'Retail Supermarket', 6),
  ('icon-oud-perfume', 'আইকন উড পারফিউম (ওমান)', 'Icon Oud Perfume (Oman)', 'বিলাসী সুগন্ধি (ওমান)', 'Luxury Fragrance Oman', 7),
  ('lazeez-club-salalah', 'লাজিস ক্লাব রেস্টুরেন্ট (সালালাহ, ওমান)', 'Lazeez Club Restaurant (Salalah, Oman)', 'হসপিটালিটি ও ডাইনিং (সালালাহ)', 'Hospitality & Dining (Salalah)', 8)
on conflict (slug) do nothing;

-- ============ PROJECT UPDATES & FILES (gated) ============
create table if not exists investor_project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references investor_projects(id) on delete cascade,
  title text not null,
  body text not null default '',
  image_url text,
  update_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists investor_project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references investor_projects(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text not null default 'document',
  created_at timestamptz not null default now()
);

alter table investor_project_updates enable row level security;
alter table investor_project_files enable row level security;
-- No policies: only via portal_project_detail().

-- ============ PER-INVESTOR PIN PER PROJECT ============
create table if not exists investor_project_access (
  investor_id uuid not null references investors(id) on delete cascade,
  investor_project_id uuid not null references investor_projects(id) on delete cascade,
  pin_hash text not null,
  failed_attempts int not null default 0,
  locked_until timestamptz,
  unlocked_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (investor_id, investor_project_id)
);

alter table investor_project_access enable row level security;
-- No policies: never readable by clients.

-- ============ DIVIDENDS ============
create table if not exists investor_dividends (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references investors(id) on delete cascade,
  investor_project_id uuid references investor_projects(id) on delete set null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'USD',
  paid_on date,
  status text not null default 'pending' check (status in ('scheduled', 'pending', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

alter table investor_dividends enable row level security;

drop policy if exists "investor_read_own_dividends" on investor_dividends;
create policy "investor_read_own_dividends" on investor_dividends
  for select to authenticated using (
    exists (select 1 from investors v where v.id = investor_dividends.investor_id and v.email = auth.jwt() ->> 'email')
  );

-- ============ RLS UPDATES ON EXISTING TABLES ============

-- Notices: broadcast to all (null project) or to investors holding that project.
drop policy if exists "investor_read_own_notices" on investor_notices;
create policy "investor_read_own_notices" on investor_notices
  for select to authenticated using (
    (investor_id is null and (
      investor_project_id is null
      or exists (
        select 1 from investments i join investors v on v.id = i.investor_id
        where i.investor_project_id = investor_notices.investor_project_id
          and v.email = auth.jwt() ->> 'email'
      )
    ))
    or exists (
      select 1 from investors v
      where v.id = investor_notices.investor_id and v.email = auth.jwt() ->> 'email'
    )
  );

-- Documents of a portal project require that project to be unlocked.
drop policy if exists "investor_read_own_documents" on investment_documents;
create policy "investor_read_own_documents" on investment_documents
  for select to authenticated using (
    exists (
      select 1 from investments i
      join investors v on v.id = i.investor_id
      where i.id = investment_documents.investment_id
        and v.email = auth.jwt() ->> 'email'
        and (
          i.investor_project_id is null
          or exists (
            select 1 from investor_project_access a
            where a.investor_id = v.id
              and a.investor_project_id = i.investor_project_id
              and a.unlocked_at is not null
          )
        )
    )
  );

-- ============ FUNCTIONS ============

-- Login: email, phone number or investor code -> email (for signInWithPassword).
create or replace function public.resolve_investor_login(p_identifier text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select v.email
  from investors v
  where v.is_active
    and (
      lower(v.email) = lower(trim(p_identifier))
      or upper(v.investor_code) = upper(trim(p_identifier))
      or (
        length(regexp_replace(coalesce(v.phone, ''), '\D', '', 'g')) >= 7
        and regexp_replace(coalesce(v.phone, ''), '\D', '', 'g') = regexp_replace(coalesce(p_identifier, ''), '\D', '', 'g')
      )
    )
  limit 1;
$$;

revoke all on function public.resolve_investor_login(text) from public;
grant execute on function public.resolve_investor_login(text) to anon, authenticated;

-- Admin (service role only): set or reset an investor's PIN for one project. Re-locks the project.
create or replace function public.admin_set_investor_pin(p_investor_id uuid, p_investor_project_id uuid, p_pin text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_pin is null or length(p_pin) < 4 or length(p_pin) > 12 then
    raise exception 'pin_length_invalid';
  end if;
  insert into investor_project_access (investor_id, investor_project_id, pin_hash, failed_attempts, locked_until, unlocked_at, updated_at)
  values (p_investor_id, p_investor_project_id, crypt(p_pin, gen_salt('bf')), 0, null, null, now())
  on conflict (investor_id, investor_project_id) do update
    set pin_hash = excluded.pin_hash,
        failed_attempts = 0,
        locked_until = null,
        unlocked_at = null,
        updated_at = now();
end;
$$;

revoke all on function public.admin_set_investor_pin(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.admin_set_investor_pin(uuid, uuid, text) to service_role;

-- Investor: check PIN for a project. Rate-limited: 5 wrong tries -> 15 min lock.
create or replace function public.unlock_portal_project(p_project_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_email text := auth.jwt() ->> 'email';
  v_investor_id uuid;
  v_row investor_project_access%rowtype;
begin
  if v_email is null then raise exception 'not_authorized'; end if;

  select v.id into v_investor_id from investors v where v.email = v_email and v.is_active;
  if v_investor_id is null then raise exception 'not_authorized'; end if;

  if not exists (
    select 1 from investments i where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
  ) then
    raise exception 'no_investment';
  end if;

  select * into v_row from investor_project_access
  where investor_id = v_investor_id and investor_project_id = p_project_id;
  if not found then raise exception 'pin_not_set'; end if;

  if v_row.locked_until is not null and v_row.locked_until > now() then
    raise exception 'too_many_attempts';
  end if;

  if v_row.pin_hash = crypt(coalesce(p_pin, ''), v_row.pin_hash) then
    update investor_project_access
      set failed_attempts = 0, locked_until = null, unlocked_at = now(), updated_at = now()
      where investor_id = v_investor_id and investor_project_id = p_project_id;
    return true;
  end if;

  update investor_project_access
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else null end,
        updated_at = now()
    where investor_id = v_investor_id and investor_project_id = p_project_id;
  return false;
end;
$$;

revoke all on function public.unlock_portal_project(uuid, text) from public, anon;
grant execute on function public.unlock_portal_project(uuid, text) to authenticated;

-- Investor: the 8 portal projects with their own amount and lock state. No project details.
create or replace function public.portal_projects()
returns table (
  id uuid,
  slug text,
  name_bn text,
  name_en text,
  sector_bn text,
  sector_en text,
  image_url text,
  sort_order int,
  my_amount numeric,
  my_currency text,
  has_pin boolean,
  is_unlocked boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id, p.slug, p.name_bn, p.name_en, p.sector_bn, p.sector_en, p.image_url, p.sort_order,
    coalesce((
      select sum(i.investment_amount) from investments i
      join investors v on v.id = i.investor_id
      where v.email = auth.jwt() ->> 'email' and i.investor_project_id = p.id
    ), 0) as my_amount,
    (
      select min(i.currency) from investments i
      join investors v on v.id = i.investor_id
      where v.email = auth.jwt() ->> 'email' and i.investor_project_id = p.id
    ) as my_currency,
    exists (
      select 1 from investor_project_access a join investors v on v.id = a.investor_id
      where v.email = auth.jwt() ->> 'email' and a.investor_project_id = p.id
    ) as has_pin,
    exists (
      select 1 from investor_project_access a join investors v on v.id = a.investor_id
      where v.email = auth.jwt() ->> 'email' and a.investor_project_id = p.id and a.unlocked_at is not null
    ) as is_unlocked
  from investor_projects p
  where auth.uid() is not null
  order by p.sort_order;
$$;

revoke all on function public.portal_projects() from public, anon;
grant execute on function public.portal_projects() to authenticated;

-- Investor: full details of one project. Only after a successful unlock.
create or replace function public.portal_project_detail(p_project_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text := auth.jwt() ->> 'email';
  v_investor_id uuid;
  v_result jsonb;
begin
  select v.id into v_investor_id from investors v where v.email = v_email and v.is_active;
  if v_investor_id is null then raise exception 'not_authorized'; end if;

  if not exists (
    select 1 from investor_project_access a
    where a.investor_id = v_investor_id and a.investor_project_id = p_project_id and a.unlocked_at is not null
  ) then
    raise exception 'locked';
  end if;

  select jsonb_build_object(
    'project', (
      select jsonb_build_object(
        'id', p.id, 'name_bn', p.name_bn, 'name_en', p.name_en,
        'sector_bn', p.sector_bn, 'sector_en', p.sector_en, 'image_url', p.image_url,
        'status', p.status, 'progress_percent', p.progress_percent, 'summary', p.summary,
        'moving_forward', p.moving_forward, 'not_moving_forward', p.not_moving_forward,
        'updated_at', p.updated_at
      ) from investor_projects p where p.id = p_project_id
    ),
    'my_amount', coalesce((
      select sum(i.investment_amount) from investments i
      where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
    ), 0),
    'my_currency', (
      select min(i.currency) from investments i
      where i.investor_id = v_investor_id and i.investor_project_id = p_project_id
    ),
    'updates', coalesce((
      select jsonb_agg(to_jsonb(u) order by u.update_date desc, u.created_at desc)
      from (select id, title, body, image_url, update_date, created_at from investor_project_updates where project_id = p_project_id) u
    ), '[]'::jsonb),
    'files', coalesce((
      select jsonb_agg(to_jsonb(f) order by f.created_at desc)
      from (select id, title, file_url, file_type, created_at from investor_project_files where project_id = p_project_id) f
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

revoke all on function public.portal_project_detail(uuid) from public, anon;
grant execute on function public.portal_project_detail(uuid) to authenticated;

-- Investor: overview numbers for the 6 cards.
create or replace function public.portal_overview()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'full_name', v.full_name,
    'investor_code', v.investor_code,
    'membership_level', v.membership_level,
    'total_by_currency', (
      select coalesce(jsonb_object_agg(q.currency, q.total), '{}'::jsonb)
      from (select currency, sum(investment_amount) as total from investments where investor_id = v.id group by currency) q
    ),
    'invested_projects', (
      select count(distinct investor_project_id) from investments
      where investor_id = v.id and investor_project_id is not null
    ),
    'active_projects', (
      select count(distinct i.investor_project_id) from investments i
      join investor_projects p on p.id = i.investor_project_id
      where i.investor_id = v.id and p.status = 'active'
    ),
    'completed_projects', (
      select count(distinct i.investor_project_id) from investments i
      join investor_projects p on p.id = i.investor_project_id
      where i.investor_id = v.id and p.status = 'completed'
    ),
    'received_by_currency', (
      select coalesce(jsonb_object_agg(q.currency, q.total), '{}'::jsonb)
      from (select currency, sum(amount) as total from investor_dividends where investor_id = v.id and status = 'paid' group by currency) q
    ),
    'estimated_by_currency', (
      select coalesce(jsonb_object_agg(q.currency, q.total), '{}'::jsonb)
      from (
        select currency, sum(investment_amount * expected_return_pct / 100) as total
        from investments where investor_id = v.id and expected_return_pct is not null
        group by currency
      ) q
    )
  )
  from investors v
  where v.email = auth.jwt() ->> 'email' and v.is_active;
$$;

revoke all on function public.portal_overview() from public, anon;
grant execute on function public.portal_overview() to authenticated;

-- Investor: dividend history with project names.
create or replace function public.portal_dividends()
returns table (
  id uuid,
  project_name_bn text,
  project_name_en text,
  amount numeric,
  currency text,
  paid_on date,
  status text
)
language sql
stable
security definer
set search_path = public
as $$
  select d.id, p.name_bn, p.name_en, d.amount, d.currency, d.paid_on, d.status
  from investor_dividends d
  join investors v on v.id = d.investor_id
  left join investor_projects p on p.id = d.investor_project_id
  where v.email = auth.jwt() ->> 'email'
  order by d.paid_on desc nulls last, d.created_at desc;
$$;

revoke all on function public.portal_dividends() from public, anon;
grant execute on function public.portal_dividends() to authenticated;

-- Make sure the anon key cannot touch any gated table directly.
revoke all on investor_project_updates, investor_project_files, investor_project_access, investor_projects from anon, authenticated;


-- ===== 20261016130000_admin_users.sql =====
/*
# Admin accounts (replaces the shared admin password)

Admins are normal Supabase Auth users whose user id is listed here.
The admin-api edge function checks the caller's JWT and this table.
Only the service role can read or write this table (no policies, no grants).

To make a user an admin, run in SQL Editor:
  insert into public.admin_users (user_id)
  select id from auth.users where email = 'you@example.com';
*/

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;


-- ===== make admin =====
insert into public.admin_users (user_id)
select id from auth.users where email = 'jabermahfuz786@gmail.com'
on conflict (user_id) do nothing;

select user_id from public.admin_users;
