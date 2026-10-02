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
