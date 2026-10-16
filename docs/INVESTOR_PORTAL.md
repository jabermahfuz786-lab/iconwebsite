# Investor Portal — setup

Route: `/investor-login` (login) and `/dashboard` (portal). Admin tools: `/admin/portal`.

## 1. Database (run once, in order)

Supabase → SQL Editor:

1. Already applied earlier: the `2026…` migrations in `supabase/migrations/`.
2. `supabase/migrations/20261016120000_investor_portal_v2.sql`
3. `supabase/migrations/20261016130000_admin_users.sql`
4. Make yourself an admin (replace the email):

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'you@example.com';
   ```

5. Deploy the edge function (required — the old shared-password version must be replaced):

   ```
   supabase functions deploy admin-api
   ```

Admin pages (`/admin`, `/admin/portal`) now sign in with an admin account from `admin_users`.

This creates the 8 portal projects, per-project PIN storage (hashed), dividends,
project updates/files, and the RPC functions the portal uses.

## 2. Create investors

Admin page `/admin` (existing) creates the auth user and investor row.
Set `membership_level` (e.g. "VIP Platinum Investor") on the investor row in Table Editor.
Login works with **email, phone number, or investor code** plus password.

## 3. Assign investments to portal projects

Use `/admin/portal` → "Add investment to a portal project", or set
`investments.investor_project_id` in Table Editor. Optional: `expected_return_pct`.
Leave it empty when there is no approved figure — the portal then shows "তথ্য আসেনি".

## 4. Set a PIN per investor per project

`/admin/portal` → "Set investor PIN for a project". The PIN is hashed in the database.
Setting or changing a PIN re-locks that project for the investor.

## 5. Project details, updates, files, dividends

Table Editor (not visible to investors directly; the portal reads them only after unlock):

- `investor_projects`: status (planning / active / on_hold / completed), progress_percent,
  summary, moving_forward, not_moving_forward, image_url.
  Left empty = shown as "তথ্য যুক্ত হয়নি". Nothing is invented.
- `investor_project_updates`: title, body, update_date, optional image_url.
- `investor_project_files`: title, file_url (Supabase Storage or Drive link), file_type.
- `investor_dividends`: investor_id, investor_project_id, amount, currency, paid_on,
  status (scheduled / pending / paid / failed). Only `paid` counts as "প্রাপ্ত প্রফিট".

## 6. Broadcast

`/admin/portal` → Broadcast. "All investors" or only holders of one project.

## Security notes

- Every investor query is limited by RLS to the investor's own rows.
- Project details, updates and files are only returned by `portal_project_detail()`,
  which requires the project to be unlocked for that investor.
- Wrong PIN 5 times → 15 minute lock.
- Admin access = signed-in user listed in `admin_users`. The old shared admin password
  is removed from the code; it stops working once `admin-api` is redeployed.
  The old literal is still in git history, so do not reuse it anywhere.
