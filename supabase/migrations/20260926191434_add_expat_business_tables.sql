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
