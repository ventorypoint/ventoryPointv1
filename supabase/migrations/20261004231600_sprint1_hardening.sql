-- Sprint 1 hardening: finishes the partially-implemented items from the Sprint 1 audit.
-- Safe to re-run (idempotent).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- 1. Indexes, columns
-- ---------------------------------------------------------------------------
create index if not exists idx_mfa_facility_member on member_facility_access(facility_id, member_id);
create index if not exists idx_mfa_member on member_facility_access(member_id);
create index if not exists idx_client_facilities_facility on client_facilities(facility_id, client_id);
create index if not exists idx_facilities_org_id on facilities(organization_id, id);
create index if not exists idx_invitations_org on invitations(organization_id);

alter table organization_members
  add column if not exists pending_approval boolean not null default false;

alter table facilities
  add column if not exists geocode_status text default 'unverified',
  add column if not exists geocoded_at timestamptz;

alter table invitations
  add column if not exists code_hash text,
  add column if not exists code_hint text,
  add column if not exists domain_restriction text,
  add column if not exists requires_approval boolean not null default false,
  add column if not exists all_facilities boolean not null default true,
  add column if not exists facility_ids uuid[] not null default '{}',
  add column if not exists revoked_at timestamptz;

create unique index if not exists idx_invitations_code_hash on invitations(code_hash) where code_hash is not null;

-- Hash helper: normalises (upper-case, strips dashes/spaces) then SHA-256.
create or replace function hash_invite_code(p_code text)
returns text
language sql immutable
set search_path = public, extensions
as $$
  select encode(
    extensions.digest(upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g')), 'sha256'),
    'hex'
  );
$$;

-- Migrate any plaintext codes created before this migration to hashed storage.
update invitations
set code_hash = hash_invite_code(invite_code),
    code_hint = right(invite_code, 4),
    invite_code = null
where invite_code is not null and code_hash is null;

-- ---------------------------------------------------------------------------
-- 2. Usage log + rate-limit tables
-- ---------------------------------------------------------------------------
create table if not exists invitation_redemptions (
  id uuid primary key default uuid_v7(),
  invitation_id uuid references invitations(id) on delete set null,
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  ip text,
  outcome text not null,
  created_at timestamptz default now()
);
create index if not exists idx_redemptions_org on invitation_redemptions(organization_id, created_at desc);

create table if not exists invite_attempts (
  id uuid primary key default uuid_v7(),
  key text not null,
  success boolean not null,
  created_at timestamptz default now()
);
create index if not exists idx_invite_attempts_key on invite_attempts(key, created_at desc);

alter table invitation_redemptions enable row level security;
alter table invite_attempts enable row level security;

drop policy if exists "Owners and admins can view redemptions" on invitation_redemptions;
create policy "Owners and admins can view redemptions" on invitation_redemptions
  for select using (get_user_role(organization_id) in ('owner', 'admin'));
-- invite_attempts: no policies => only security-definer functions can touch it.

-- ---------------------------------------------------------------------------
-- 3. Additional RLS: profiles, facility access, client facilities, own membership
-- ---------------------------------------------------------------------------
create or replace function shares_org_with(p_user uuid)
returns boolean
language sql security definer stable set search_path = public
as $$
  select exists (
    select 1
    from organization_members a
    join organization_members b on a.organization_id = b.organization_id
    where a.user_id = auth.uid() and a.is_active = true and b.user_id = p_user
  );
$$;

drop policy if exists "Org members can view co-member profiles" on profiles;
create policy "Org members can view co-member profiles" on profiles
  for select using (shares_org_with(id));

-- Lets a revoked / pending user see their own membership row (revoked-access screen).
drop policy if exists "Users can view own memberships" on organization_members;
create policy "Users can view own memberships" on organization_members
  for select using (user_id = auth.uid());

drop policy if exists "Members can view facility access" on member_facility_access;
create policy "Members can view facility access" on member_facility_access
  for select using (
    exists (
      select 1 from organization_members m
      where m.id = member_facility_access.member_id
        and get_user_role(m.organization_id) is not null
    )
  );
-- Writes to member_facility_access happen only via security-definer RPCs.

drop policy if exists "Members can view client facilities" on client_facilities;
create policy "Members can view client facilities" on client_facilities
  for select using (
    exists (
      select 1 from client_accounts c
      where c.id = client_facilities.client_id
        and get_user_role(c.organization_id) is not null
    )
  );

drop policy if exists "Admins can insert client facilities" on client_facilities;
create policy "Admins can insert client facilities" on client_facilities
  for insert with check (
    exists (
      select 1
      from client_accounts c
      join facilities f on f.organization_id = c.organization_id
      where c.id = client_facilities.client_id
        and f.id = client_facilities.facility_id
        and get_user_role(c.organization_id) in ('owner', 'admin')
    )
  );

drop policy if exists "Admins can delete client facilities" on client_facilities;
create policy "Admins can delete client facilities" on client_facilities
  for delete using (
    exists (
      select 1 from client_accounts c
      where c.id = client_facilities.client_id
        and get_user_role(c.organization_id) in ('owner', 'admin')
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Field-tampering protection
--    Member and invitation writes now go ONLY through the RPCs below.
-- ---------------------------------------------------------------------------
drop policy if exists "Admins can update org members" on organization_members;
drop policy if exists "Admins can delete org members" on organization_members;
drop policy if exists "Members can view invitations" on invitations;
drop policy if exists "Admins can insert invitations" on invitations;
drop policy if exists "Admins can update invitations" on invitations;
drop policy if exists "Admins can delete invitations" on invitations;

drop policy if exists "Owners and admins can view invitations" on invitations;
create policy "Owners and admins can view invitations" on invitations
  for select using (get_user_role(organization_id) in ('owner', 'admin'));

create or replace function prevent_org_change()
returns trigger language plpgsql as $$
begin
  if new.organization_id is distinct from old.organization_id then
    raise exception 'organization_id cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_facilities_lock_org on facilities;
create trigger trg_facilities_lock_org before update on facilities
  for each row execute function prevent_org_change();
drop trigger if exists trg_clients_lock_org on client_accounts;
create trigger trg_clients_lock_org before update on client_accounts
  for each row execute function prevent_org_change();

-- ---------------------------------------------------------------------------
-- 5. get_user_permissions (role + facility list for middleware)
-- ---------------------------------------------------------------------------
create or replace function get_user_permissions(org_id uuid)
returns jsonb
language sql security definer stable set search_path = public
as $$
  select case when m.id is null then null else jsonb_build_object(
    'role', m.role,
    'can_manage_all_members', m.can_manage_all_members,
    'all_facilities', m.all_facilities,
    'facility_ids', case
      when m.all_facilities then (select coalesce(jsonb_agg(f.id), '[]'::jsonb) from facilities f where f.organization_id = org_id)
      else coalesce((select jsonb_agg(a.facility_id) from member_facility_access a where a.member_id = m.id), '[]'::jsonb)
    end
  ) end
  from (select 1) x
  left join organization_members m
    on m.organization_id = org_id and m.user_id = auth.uid() and m.is_active = true;
$$;

-- ---------------------------------------------------------------------------
-- 6. Create organization (single transaction)
-- ---------------------------------------------------------------------------
create or replace function create_organization(
  p_name text,
  p_country text default null,
  p_timezone text default 'UTC',
  p_currency text default 'USD'
)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare v_org uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if p_name is null or length(trim(p_name)) = 0 then raise exception 'Organization name is required'; end if;

  insert into profiles (id, email)
  select id, email from auth.users where id = auth.uid()
  on conflict (id) do nothing;

  insert into organizations (name, country, timezone, default_currency)
  values (
    trim(p_name),
    nullif(trim(coalesce(p_country, '')), ''),
    coalesce(nullif(p_timezone, ''), 'UTC'),
    coalesce(nullif(p_currency, ''), 'USD')
  )
  returning id into v_org;

  insert into organization_members (organization_id, user_id, role, is_active, can_manage_all_members, all_facilities)
  values (v_org, auth.uid(), 'owner', true, true, true);

  return v_org;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Invitations engine
-- ---------------------------------------------------------------------------
create or replace function invite_rate_limited(p_keys text[])
returns boolean
language plpgsql security definer set search_path = public
as $$
declare k text; ts timestamptz[];
begin
  foreach k in array p_keys loop
    select array_agg(s.created_at order by s.created_at desc) into ts
    from (
      select created_at from invite_attempts
      where key = k and success = false
      order by created_at desc limit 5
    ) s;
    -- 5 failures within 60s => blocked for a 5 minute cooldown after the latest failure
    if ts is not null and array_length(ts, 1) = 5
       and (ts[1] - ts[5]) <= interval '60 seconds'
       and now() < ts[1] + interval '5 minutes' then
      return true;
    end if;
  end loop;
  return false;
end;
$$;

create or replace function log_invite_attempt(p_keys text[], p_success boolean)
returns void
language plpgsql security definer set search_path = public
as $$
declare k text;
begin
  foreach k in array p_keys loop
    insert into invite_attempts (key, success) values (k, p_success);
  end loop;
  delete from invite_attempts where created_at < now() - interval '1 day';
end;
$$;

create or replace function invitation_problem(i invitations)
returns text
language plpgsql stable
as $$
begin
  if i.id is null then return 'Invalid invite code.'; end if;
  if i.status = 'revoked' or i.revoked_at is not null then return 'This invitation has been revoked.'; end if;
  if i.expires_at is not null and i.expires_at < now() then return 'This invitation has expired.'; end if;
  if i.max_uses is not null and i.uses >= i.max_uses then return 'This invitation has already been used.'; end if;
  if i.status <> 'pending' then return 'This invitation is no longer active.'; end if;
  return null;
end;
$$;

-- Creates an invite; the plaintext code and token are returned ONCE and only a hash is stored.
create or replace function create_invite_code(
  p_organization_id uuid,
  p_role member_role,
  p_max_uses int default 1,
  p_days_valid int default 7,
  p_domain text default null,
  p_requires_approval boolean default false,
  p_all_facilities boolean default true,
  p_facility_ids uuid[] default '{}',
  p_invitee_email text default null
)
returns jsonb
language plpgsql security definer set search_path = public, extensions
as $$
declare
  v_caller member_role;
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
  v_token text;
  v_id uuid;
  v_max int;
  v_days int;
begin
  v_caller := get_user_role(p_organization_id);
  if v_caller is null or v_caller not in ('owner', 'admin') then
    raise exception 'You do not have permission to create invitations.';
  end if;
  if p_role in ('owner', 'client_user') then
    raise exception 'This role cannot be assigned through an invitation.';
  end if;
  if p_role = 'admin' and v_caller <> 'owner' then
    raise exception 'Only an owner can invite admins.';
  end if;
  if not coalesce(p_all_facilities, true) and coalesce(array_length(p_facility_ids, 1), 0) = 0 then
    raise exception 'Select at least one facility or choose all facilities.';
  end if;
  if exists (
    select 1 from unnest(coalesce(p_facility_ids, '{}')) f
    where not exists (select 1 from facilities x where x.id = f and x.organization_id = p_organization_id)
  ) then
    raise exception 'One or more facilities do not belong to this organization.';
  end if;

  v_max := case when p_invitee_email is not null then 1
                when p_max_uses is null or p_max_uses <= 0 then null
                else p_max_uses end;
  v_days := greatest(1, least(coalesce(p_days_valid, 7), 90));

  loop
    v_code := '';
    for i in 1..8 loop
      v_code := v_code || substr(v_alphabet, (get_byte(extensions.gen_random_bytes(1), 0) % 32) + 1, 1);
    end loop;
    exit when not exists (select 1 from invitations where code_hash = hash_invite_code(v_code));
  end loop;

  v_token := encode(extensions.gen_random_bytes(32), 'hex');

  insert into invitations (
    organization_id, token, code_hash, code_hint, role, invitee_email, invited_by,
    status, max_uses, uses, expires_at, domain_restriction, requires_approval,
    all_facilities, facility_ids
  ) values (
    p_organization_id, v_token, hash_invite_code(v_code), right(v_code, 4), p_role,
    nullif(lower(trim(coalesce(p_invitee_email, ''))), ''), auth.uid(),
    'pending', v_max, 0, now() + make_interval(days => v_days),
    nullif(lower(regexp_replace(trim(coalesce(p_domain, '')), '^@', '')), ''),
    coalesce(p_requires_approval, false),
    coalesce(p_all_facilities, true),
    case when coalesce(p_all_facilities, true) then '{}' else p_facility_ids end
  )
  returning id into v_id;

  return jsonb_build_object(
    'id', v_id,
    'code', substr(v_code, 1, 4) || '-' || substr(v_code, 5, 4),
    'token', v_token
  );
end;
$$;

-- Pre-auth validation. Called only by the server (service role) so anon users can't probe it directly.
create or replace function validate_invitation(p_code text default null, p_token text default null, p_ip text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  inv invitations;
  v_problem text;
  v_org text;
  v_keys text[] := array['ip:' || coalesce(nullif(p_ip, ''), 'unknown')];
begin
  if invite_rate_limited(v_keys) then
    return jsonb_build_object('ok', false, 'rate_limited', true,
      'error', 'Too many attempts. Please wait a few minutes and try again.');
  end if;

  select * into inv from invitations
  where (coalesce(p_code, '') <> '' and code_hash = hash_invite_code(p_code))
     or (coalesce(p_token, '') <> '' and token = p_token)
  limit 1;

  v_problem := invitation_problem(inv);
  if v_problem is not null then
    perform log_invite_attempt(v_keys, false);
    return jsonb_build_object('ok', false, 'error', v_problem);
  end if;

  select name into v_org from organizations where id = inv.organization_id;
  return jsonb_build_object(
    'ok', true,
    'organization_name', v_org,
    'role', inv.role,
    'invitee_email', inv.invitee_email,
    'requires_approval', inv.requires_approval
  );
end;
$$;

-- Redeem for the signed-in user (new users sign up first, then land here).
create or replace function redeem_invitation(p_code text default null, p_token text default null, p_ip text default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  inv invitations;
  v_uid uuid := auth.uid();
  v_email text;
  v_confirmed timestamptz;
  v_problem text;
  v_member_id uuid;
  v_existing organization_members;
  v_keys text[];
begin
  if v_uid is null then return jsonb_build_object('ok', false, 'error', 'Please sign in first.'); end if;
  v_keys := array['ip:' || coalesce(nullif(p_ip, ''), 'unknown'), 'user:' || v_uid::text];

  if invite_rate_limited(v_keys) then
    return jsonb_build_object('ok', false, 'rate_limited', true,
      'error', 'Too many attempts. Please wait a few minutes and try again.');
  end if;

  select * into inv from invitations
  where (coalesce(p_code, '') <> '' and code_hash = hash_invite_code(p_code))
     or (coalesce(p_token, '') <> '' and token = p_token)
  limit 1 for update;

  v_problem := invitation_problem(inv);

  select email, email_confirmed_at into v_email, v_confirmed from auth.users where id = v_uid;

  if v_problem is null and inv.invitee_email is not null then
    if v_confirmed is null or lower(v_email) <> lower(inv.invitee_email) then
      v_problem := 'This invitation was sent to a different email address.';
    end if;
  end if;

  if v_problem is null and inv.domain_restriction is not null then
    if v_confirmed is null or lower(split_part(v_email, '@', 2)) <> inv.domain_restriction then
      v_problem := 'This invitation is restricted to @' || inv.domain_restriction || ' email addresses.';
    end if;
  end if;

  if v_problem is not null then
    perform log_invite_attempt(v_keys, false);
    insert into invitation_redemptions (invitation_id, organization_id, user_id, ip, outcome)
    values (inv.id, inv.organization_id, v_uid, p_ip, 'rejected: ' || v_problem);
    return jsonb_build_object('ok', false, 'error', v_problem);
  end if;

  select * into v_existing from organization_members
  where organization_id = inv.organization_id and user_id = v_uid;

  if v_existing.id is not null then
    if v_existing.is_active then
      return jsonb_build_object('ok', true, 'already_member', true, 'organization_id', inv.organization_id);
    elsif v_existing.pending_approval then
      return jsonb_build_object('ok', true, 'pending', true, 'organization_id', inv.organization_id);
    else
      return jsonb_build_object('ok', false, 'error', 'Your access to this workspace has been revoked.');
    end if;
  end if;

  insert into profiles (id, email) values (v_uid, v_email) on conflict (id) do nothing;

  insert into organization_members (
    organization_id, user_id, role, is_active, pending_approval, added_by, all_facilities
  ) values (
    inv.organization_id, v_uid, inv.role, not inv.requires_approval, inv.requires_approval,
    inv.invited_by, inv.all_facilities
  )
  returning id into v_member_id;

  if not inv.all_facilities and coalesce(array_length(inv.facility_ids, 1), 0) > 0 then
    insert into member_facility_access (member_id, facility_id)
    select v_member_id, f from unnest(inv.facility_ids) f
    on conflict do nothing;
  end if;

  update invitations
  set uses = uses + 1,
      status = case when max_uses is not null and uses + 1 >= max_uses then 'accepted'::invitation_status else status end,
      updated_at = now()
  where id = inv.id;

  insert into invitation_redemptions (invitation_id, organization_id, user_id, ip, outcome)
  values (inv.id, inv.organization_id, v_uid, p_ip, case when inv.requires_approval then 'joined (pending approval)' else 'joined' end);

  return jsonb_build_object('ok', true, 'organization_id', inv.organization_id, 'pending', inv.requires_approval);
end;
$$;

create or replace function revoke_invitation(p_invitation_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
declare v_org uuid;
begin
  select organization_id into v_org from invitations where id = p_invitation_id;
  if v_org is null or coalesce(get_user_role(v_org)::text, '') not in ('owner', 'admin') then
    raise exception 'You do not have permission to revoke this invitation.';
  end if;
  update invitations set status = 'revoked', revoked_at = now(), updated_at = now() where id = p_invitation_id;
end;
$$;

-- Invitations addressed to the signed-in user's verified email (onboarding gate)
create or replace function my_pending_invitations()
returns table (id uuid, token text, role member_role, organization_name text, expires_at timestamptz)
language sql security definer stable set search_path = public
as $$
  select i.id, i.token, i.role, o.name, i.expires_at
  from invitations i
  join organizations o on o.id = i.organization_id
  join auth.users u on u.id = auth.uid()
  where u.email_confirmed_at is not null
    and lower(i.invitee_email) = lower(u.email)
    and i.status = 'pending'
    and (i.expires_at is null or i.expires_at > now())
    and (i.max_uses is null or i.uses < i.max_uses);
$$;

-- ---------------------------------------------------------------------------
-- 8. Two-level admin rules (revoke / reactivate / remove / admin privilege)
-- ---------------------------------------------------------------------------
create or replace function can_manage_member(p_member_id uuid)
returns boolean
language plpgsql security definer stable set search_path = public
as $$
declare t organization_members; c organization_members;
begin
  select * into t from organization_members where id = p_member_id;
  if t.id is null then return false; end if;

  select * into c from organization_members
  where organization_id = t.organization_id and user_id = auth.uid() and is_active = true;
  if c.id is null then return false; end if;

  if t.user_id = auth.uid() then return false; end if;      -- never act on yourself
  if c.role = 'owner' then return true; end if;              -- owners manage anyone
  if c.role = 'admin' then
    return t.role not in ('owner', 'admin')
       and (c.can_manage_all_members or t.added_by = auth.uid());
  end if;
  return false;
end;
$$;

create or replace function set_member_active_status(p_member_id uuid, p_active boolean)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not can_manage_member(p_member_id) then
    raise exception 'You do not have permission to manage this member.';
  end if;
  update organization_members
  set is_active = p_active,
      pending_approval = case when p_active then false else pending_approval end,
      updated_at = now()
  where id = p_member_id;
end;
$$;

create or replace function remove_member(p_member_id uuid)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not can_manage_member(p_member_id) then
    raise exception 'You do not have permission to remove this member.';
  end if;
  delete from organization_members where id = p_member_id;
end;
$$;

create or replace function set_admin_privilege(p_member_id uuid, p_value boolean)
returns void
language plpgsql security definer set search_path = public
as $$
declare t organization_members;
begin
  select * into t from organization_members where id = p_member_id;
  if t.id is null then raise exception 'Member not found.'; end if;
  if get_user_role(t.organization_id) is distinct from 'owner' then
    raise exception 'Only an owner can change admin privileges.';
  end if;
  if t.role <> 'admin' then raise exception 'Privileges can only be set on admins.'; end if;
  update organization_members set can_manage_all_members = p_value, updated_at = now() where id = p_member_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Function privileges
-- ---------------------------------------------------------------------------
revoke all on function create_organization(text, text, text, text) from public, anon;
revoke all on function create_invite_code(uuid, member_role, int, int, text, boolean, boolean, uuid[], text) from public, anon;
revoke all on function redeem_invitation(text, text, text) from public, anon;
revoke all on function revoke_invitation(uuid) from public, anon;
revoke all on function my_pending_invitations() from public, anon;
revoke all on function can_manage_member(uuid) from public, anon;
revoke all on function set_member_active_status(uuid, boolean) from public, anon;
revoke all on function remove_member(uuid) from public, anon;
revoke all on function set_admin_privilege(uuid, boolean) from public, anon;
revoke all on function get_user_permissions(uuid) from public, anon;

grant execute on function create_organization(text, text, text, text) to authenticated;
grant execute on function create_invite_code(uuid, member_role, int, int, text, boolean, boolean, uuid[], text) to authenticated;
grant execute on function redeem_invitation(text, text, text) to authenticated;
grant execute on function revoke_invitation(uuid) to authenticated;
grant execute on function my_pending_invitations() to authenticated;
grant execute on function can_manage_member(uuid) to authenticated;
grant execute on function set_member_active_status(uuid, boolean) to authenticated;
grant execute on function remove_member(uuid) to authenticated;
grant execute on function set_admin_privilege(uuid, boolean) to authenticated;
grant execute on function get_user_permissions(uuid) to authenticated;

-- Internal helpers + server-only validation (service role only)
revoke all on function invite_rate_limited(text[]) from public, anon, authenticated;
revoke all on function log_invite_attempt(text[], boolean) from public, anon, authenticated;
revoke all on function validate_invitation(text, text, text) from public, anon, authenticated;
grant execute on function validate_invitation(text, text, text) to service_role;

notify pgrst, 'reload schema';
