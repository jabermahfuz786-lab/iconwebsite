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
