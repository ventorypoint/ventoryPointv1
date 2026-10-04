-- Migration: Floor Worker Authentication & Badge Generation
-- Phase 1, Sprint 1 (Floor Worker Credential Type)

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Decouple profiles FK so floor workers without an auth.users email account can have profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Floor Worker Credentials Table
CREATE TABLE IF NOT EXISTS public.floor_worker_credentials (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES public.organization_members(id) ON DELETE CASCADE UNIQUE,
  worker_code text NOT NULL,
  badge_token text NOT NULL UNIQUE,
  pin_hash text NOT NULL,
  failed_attempts int NOT NULL DEFAULT 0,
  locked_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  last_signed_in_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fwc_org ON public.floor_worker_credentials(organization_id);
CREATE INDEX IF NOT EXISTS idx_fwc_badge_token ON public.floor_worker_credentials(badge_token);
CREATE INDEX IF NOT EXISTS idx_fwc_member ON public.floor_worker_credentials(member_id);

-- 3. Floor Devices Table (Registered Floor Terminals / Scanners)
CREATE TABLE IF NOT EXISTS public.floor_devices (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  facility_id uuid REFERENCES public.facilities(id) ON DELETE SET NULL,
  device_name text NOT NULL,
  device_token text NOT NULL UNIQUE,
  is_authorized boolean NOT NULL DEFAULT true,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_floor_devices_org ON public.floor_devices(organization_id);
CREATE INDEX IF NOT EXISTS idx_floor_devices_token ON public.floor_devices(device_token);

-- Enable RLS
ALTER TABLE public.floor_worker_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.floor_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Floor Worker Credentials
DROP POLICY IF EXISTS "Managers can view floor worker credentials" ON public.floor_worker_credentials;
CREATE POLICY "Managers can view floor worker credentials" ON public.floor_worker_credentials
  FOR SELECT USING (
    get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
  );

-- RLS Policies for Floor Devices
DROP POLICY IF EXISTS "Admins and Ops Managers can view floor devices" ON public.floor_devices;
CREATE POLICY "Admins and Ops Managers can view floor devices" ON public.floor_devices
  FOR SELECT USING (
    get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
  );

DROP POLICY IF EXISTS "Admins and Ops Managers can manage floor devices" ON public.floor_devices;
CREATE POLICY "Admins and Ops Managers can manage floor devices" ON public.floor_devices
  FOR ALL USING (
    get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
  );

-- 4. PIN Hash Helper Function (Crypt SHA-512 with random salt)
CREATE OR REPLACE FUNCTION hash_worker_pin(p_pin text)
RETURNS text
LANGUAGE sql IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT extensions.crypt(p_pin, extensions.gen_salt('bf', 8));
$$;

CREATE OR REPLACE FUNCTION verify_worker_pin(p_pin text, p_hash text)
RETURNS boolean
LANGUAGE sql IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT p_hash = extensions.crypt(p_pin, p_hash);
$$;

-- 5. RPC: Create Floor Worker
CREATE OR REPLACE FUNCTION create_floor_worker(
  p_organization_id uuid,
  p_first_name text,
  p_last_name text,
  p_pin text,
  p_all_facilities boolean DEFAULT true,
  p_facility_ids uuid[] DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
declare
  v_caller_role member_role;
  v_profile_id uuid;
  v_member_id uuid;
  v_badge_token text;
  v_worker_seq int;
  v_worker_code text;
  v_clean_first text := trim(coalesce(p_first_name, ''));
  v_clean_last text := trim(coalesce(p_last_name, ''));
  v_clean_pin text := trim(coalesce(p_pin, ''));
begin
  -- Validate caller permission (Owner, Admin, Ops Manager)
  v_caller_role := get_user_role(p_organization_id);
  if v_caller_role is null or v_caller_role not in ('owner', 'admin', 'ops_manager') then
    raise exception 'You do not have permission to create floor workers.';
  end if;

  if length(v_clean_first) = 0 then
    raise exception 'First name is required.';
  end if;

  if length(v_clean_pin) < 4 or length(v_clean_pin) > 6 or v_clean_pin ~ '\D' then
    raise exception 'PIN must be 4 to 6 numeric digits.';
  end if;

  -- 1. Create synthetic profile for the floor worker
  v_profile_id := uuid_v7();
  insert into public.profiles (id, first_name, last_name, email)
  values (v_profile_id, v_clean_first, v_clean_last, null);

  -- 2. Add as organization member
  insert into public.organization_members (
    organization_id, user_id, role, is_active, added_by, all_facilities
  ) values (
    p_organization_id, v_profile_id, 'floor_worker', true, auth.uid(), coalesce(p_all_facilities, true)
  ) returning id into v_member_id;

  -- 3. Assign specific facilities if requested
  if not coalesce(p_all_facilities, true) and coalesce(array_length(p_facility_ids, 1), 0) > 0 then
    insert into public.member_facility_access (member_id, facility_id)
    select v_member_id, f from unnest(p_facility_ids) f
    on conflict do nothing;
  end if;

  -- 4. Generate unique worker code and 256-bit random badge token
  select count(*) + 1001 into v_worker_seq from public.floor_worker_credentials where organization_id = p_organization_id;
  v_worker_code := 'FW-' || v_worker_seq::text;
  v_badge_token := 'vp_badge_' || encode(extensions.gen_random_bytes(24), 'hex');

  -- 5. Insert credentials
  insert into public.floor_worker_credentials (
    organization_id, member_id, worker_code, badge_token, pin_hash, is_active
  ) values (
    p_organization_id, v_member_id, v_worker_code, v_badge_token, hash_worker_pin(v_clean_pin), true
  );

  return jsonb_build_object(
    'member_id', v_member_id,
    'worker_code', v_worker_code,
    'badge_token', v_badge_token,
    'first_name', v_clean_first,
    'last_name', v_clean_last
  );
end;
$$;

-- 6. RPC: Reissue Badge Token
CREATE OR REPLACE FUNCTION reissue_floor_badge(p_member_id uuid)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
declare
  v_org_id uuid;
  v_caller_role member_role;
  v_new_token text;
  v_worker_code text;
begin
  select organization_id into v_org_id from public.organization_members where id = p_member_id;
  if v_org_id is null then raise exception 'Member not found.'; end if;

  v_caller_role := get_user_role(v_org_id);
  if v_caller_role is null or v_caller_role not in ('owner', 'admin', 'ops_manager') then
    raise exception 'Permission denied.';
  end if;

  v_new_token := 'vp_badge_' || encode(extensions.gen_random_bytes(24), 'hex');

  update public.floor_worker_credentials
  set badge_token = v_new_token,
      failed_attempts = 0,
      locked_until = null,
      updated_at = now()
  where member_id = p_member_id
  returning worker_code into v_worker_code;

  return jsonb_build_object(
    'member_id', p_member_id,
    'worker_code', v_worker_code,
    'badge_token', v_new_token
  );
end;
$$;

-- 7. RPC: Unlock / Reset PIN for Floor Worker
CREATE OR REPLACE FUNCTION update_floor_worker_pin(p_member_id uuid, p_new_pin text)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
declare
  v_org_id uuid;
  v_caller_role member_role;
begin
  select organization_id into v_org_id from public.organization_members where id = p_member_id;
  if v_org_id is null then raise exception 'Member not found.'; end if;

  v_caller_role := get_user_role(v_org_id);
  if v_caller_role is null or v_caller_role not in ('owner', 'admin', 'ops_manager') then
    raise exception 'Permission denied.';
  end if;

  if length(p_new_pin) < 4 or length(p_new_pin) > 6 or p_new_pin ~ '\D' then
    raise exception 'PIN must be 4 to 6 numeric digits.';
  end if;

  update public.floor_worker_credentials
  set pin_hash = hash_worker_pin(p_new_pin),
      failed_attempts = 0,
      locked_until = null,
      updated_at = now()
  where member_id = p_member_id;
end;
$$;

-- 8. RPC: Floor Worker Sign In (Badge + PIN authentication)
CREATE OR REPLACE FUNCTION floor_worker_login(
  p_badge_token text,
  p_pin text,
  p_device_token text DEFAULT null
)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, extensions
AS $$
declare
  v_cred public.floor_worker_credentials;
  v_member public.organization_members;
  v_profile public.profiles;
  v_org public.organizations;
  v_pin_valid boolean;
begin
  -- 1. Find credential by badge token
  select * into v_cred from public.floor_worker_credentials
  where badge_token = trim(p_badge_token) and is_active = true
  limit 1;

  if v_cred.id is null then
    return jsonb_build_object('ok', false, 'error', 'Invalid badge token. Please check your badge.');
  end if;

  -- 2. Check lockout status
  if v_cred.locked_until is not null and v_cred.locked_until > now() then
    return jsonb_build_object(
      'ok', false,
      'locked', true,
      'error', 'Account is locked due to multiple failed attempts. Please ask a supervisor to unlock it.'
    );
  end if;

  -- 3. Check membership status
  select * into v_member from public.organization_members where id = v_cred.member_id;
  if v_member.id is null or not v_member.is_active then
    return jsonb_build_object('ok', false, 'error', 'Worker access has been revoked.');
  end if;

  -- 4. Verify PIN
  v_pin_valid := verify_worker_pin(trim(p_pin), v_cred.pin_hash);

  if not v_pin_valid then
    -- Increment failed attempts
    update public.floor_worker_credentials
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else null end,
        updated_at = now()
    where id = v_cred.id;

    if v_cred.failed_attempts + 1 >= 5 then
      return jsonb_build_object(
        'ok', false,
        'locked', true,
        'error', 'Too many failed attempts. Account locked for 15 minutes.'
      );
    else
      return jsonb_build_object(
        'ok', false,
        'error', 'Incorrect PIN. ' || (5 - (v_cred.failed_attempts + 1))::text || ' attempts remaining.'
      );
    end if;
  end if;

  -- 5. Success: reset failures and update last login
  update public.floor_worker_credentials
  set failed_attempts = 0,
      locked_until = null,
      last_signed_in_at = now(),
      updated_at = now()
  where id = v_cred.id;

  select * into v_profile from public.profiles where id = v_member.user_id;
  select * into v_org from public.organizations where id = v_member.organization_id;

  return jsonb_build_object(
    'ok', true,
    'worker_code', v_cred.worker_code,
    'first_name', v_profile.first_name,
    'last_name', v_profile.last_name,
    'organization_id', v_org.id,
    'organization_name', v_org.name,
    'member_id', v_member.id,
    'all_facilities', v_member.all_facilities
  );
end;
$$;

-- 9. Grant Permissions
REVOKE ALL ON FUNCTION create_floor_worker(uuid, text, text, text, boolean, uuid[]) FROM public, anon;
REVOKE ALL ON FUNCTION reissue_floor_badge(uuid) FROM public, anon;
REVOKE ALL ON FUNCTION update_floor_worker_pin(uuid, text) FROM public, anon;

GRANT EXECUTE ON FUNCTION create_floor_worker(uuid, text, text, text, boolean, uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION reissue_floor_badge(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION update_floor_worker_pin(uuid, text) TO authenticated;

-- floor_worker_login can be executed by anonymous users from terminal stations
GRANT EXECUTE ON FUNCTION floor_worker_login(text, text, text) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
