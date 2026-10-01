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
