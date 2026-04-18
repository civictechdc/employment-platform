-- Phase 2: Auth & Role-Based Access Control
-- Run in the Supabase SQL editor (Dashboard → SQL Editor)
--
-- After running:
--   1. Sign in to the app once with GitHub
--   2. Find your auth user ID:
--        SELECT id FROM auth.users WHERE email = 'your@email.com';
--   3. Link your auth user to your volunteer record (if not already done):
--        UPDATE volunteers SET auth_user_id = '<your-auth-uid>' WHERE name = 'Your Name';
--   4. Grant yourself project creation:
--        UPDATE volunteers SET can_create_project = true WHERE auth_user_id = '<your-auth-uid>';

-- ============================================================
-- volunteers: add project creation flag
-- ============================================================

alter table volunteers
  add column if not exists can_create_project boolean not null default false;

-- ============================================================
-- RLS: projects
-- ============================================================

alter table projects enable row level security;

create policy "Projects are publicly readable"
  on projects for select
  using (true);

create policy "Flagged volunteers can insert projects"
  on projects for insert
  to authenticated
  with check (
    exists (
      select 1 from volunteers
      where auth_user_id = auth.uid()
        and can_create_project = true
    )
  );

create policy "Project leads can update their project"
  on projects for update
  to authenticated
  using (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = projects.id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

create policy "Project leads can delete their project"
  on projects for delete
  to authenticated
  using (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = projects.id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

-- ============================================================
-- RLS: project_members
-- ============================================================

alter table project_members enable row level security;

create policy "Project members are publicly readable"
  on project_members for select
  using (true);

create policy "Project leads can insert project members"
  on project_members for insert
  to authenticated
  with check (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = project_members.project_id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

create policy "Project leads can update project members"
  on project_members for update
  to authenticated
  using (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = project_members.project_id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

create policy "Project leads can delete project members"
  on project_members for delete
  to authenticated
  using (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = project_members.project_id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

-- ============================================================
-- RLS: open_roles
-- ============================================================

alter table open_roles enable row level security;

create policy "Open roles are publicly readable"
  on open_roles for select
  using (true);

create policy "Project leads can insert open roles"
  on open_roles for insert
  to authenticated
  with check (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = open_roles.project_id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

create policy "Project leads can update open roles"
  on open_roles for update
  to authenticated
  using (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = open_roles.project_id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

create policy "Project leads can delete open roles"
  on open_roles for delete
  to authenticated
  using (
    exists (
      select 1 from project_members pm
      join volunteers v on pm.volunteer_id = v.id
      where pm.project_id = open_roles.project_id
        and v.auth_user_id = auth.uid()
        and pm.is_lead = true
    )
  );

-- ============================================================
-- RPC: create_project
--
-- SECURITY DEFINER lets this function bypass RLS so it can
-- insert into both projects and project_members atomically,
-- sidestepping the bootstrap problem (you can't be a lead
-- until after the project exists). Permission is enforced
-- inside the function itself.
-- ============================================================

create or replace function create_project(
  p_name          text,
  p_slug          text,
  p_description   text,
  p_status        project_status,
  p_contact_email text,
  p_tags          text[]
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_project_id   uuid;
  v_volunteer_id uuid;
begin
  -- Permission check
  select id into v_volunteer_id
  from volunteers
  where auth_user_id = auth.uid()
    and can_create_project = true;

  if v_volunteer_id is null then
    raise exception 'Permission denied or no volunteer record linked to your account';
  end if;

  -- Insert the project
  insert into projects (name, slug, description, status, contact_email, tags)
  values (p_name, p_slug, p_description, p_status, p_contact_email, p_tags)
  returning id into v_project_id;

  -- Add creator as project lead
  insert into project_members (project_id, volunteer_id, role_title, is_lead)
  values (v_project_id, v_volunteer_id, 'Project Lead', true);

  return v_project_id;
end;
$$;
