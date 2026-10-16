/*
# Investor entry form fields + share details

Admin-only details (investor never sees these in the portal):
father/mother name, address, NID/PASS, photo, nominee details.
Investments get share quantity and share price (for the invoice).
*/

alter table investors
  add column if not exists photo_url text,
  add column if not exists father_name text,
  add column if not exists mother_name text,
  add column if not exists permanent_address text,
  add column if not exists nid_pass text,
  add column if not exists nominee_father_name text,
  add column if not exists nominee_mother_name text,
  add column if not exists nominee_pass text,
  add column if not exists nominee_address text;

alter table investments
  add column if not exists share_quantity numeric,
  add column if not exists share_price numeric;
