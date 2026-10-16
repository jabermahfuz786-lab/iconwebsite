/*
# Client name on projects + passport-style investor identity

- projects.client_name: the client / buyer name for a project (optional).
- investors.first_name / last_name: shown in the investor's read-only details form.
Passport number reuses investors.nid_pass; father name reuses father_name.
*/

alter table projects
  add column if not exists client_name text;

alter table investors
  add column if not exists first_name text,
  add column if not exists last_name text;
