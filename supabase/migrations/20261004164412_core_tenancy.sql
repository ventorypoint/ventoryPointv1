-- UUID v7 function
CREATE OR REPLACE FUNCTION uuid_v7() RETURNS uuid AS $$
BEGIN
  RETURN gen_random_uuid();
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Create custom types idempotently
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
        CREATE TYPE member_role AS ENUM (
          'owner',
          'admin',
          'ops_manager',
          'supervisor',
          'floor_worker',
          'billing',
          'client_user'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitation_status') THEN
        CREATE TYPE invitation_status AS ENUM (
          'pending',
          'accepted',
          'expired',
          'revoked'
        );
    END IF;
END$$;

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  name text NOT NULL,
  country text,
  timezone text DEFAULT 'UTC',
  default_currency text DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organization Members
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role member_role NOT NULL,
  is_active boolean DEFAULT true,
  added_by uuid REFERENCES profiles(id),
  can_manage_all_members boolean DEFAULT false,
  all_facilities boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Facilities
CREATE TABLE IF NOT EXISTS facilities (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  short_code text,
  address text,
  city text,
  state text,
  zip_code text,
  county text,
  country text,
  latitude numeric,
  longitude numeric,
  timezone text DEFAULT 'UTC',
  operating_hours jsonb,
  carrier_cutoffs jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Member Facility Access
CREATE TABLE IF NOT EXISTS member_facility_access (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  member_id uuid NOT NULL REFERENCES organization_members(id) ON DELETE CASCADE,
  facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(member_id, facility_id)
);

-- Client Accounts
CREATE TABLE IF NOT EXISTS client_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  brand_name text NOT NULL,
  short_code text,
  status text DEFAULT 'active',
  primary_contact text,
  default_facility_id uuid REFERENCES facilities(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Client Facilities
CREATE TABLE IF NOT EXISTS client_facilities (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  client_id uuid NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  facility_id uuid NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(client_id, facility_id)
);

-- Invitations
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT uuid_v7(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  invite_code text UNIQUE,
  role member_role NOT NULL,
  invitee_email text,
  invited_by uuid REFERENCES profiles(id),
  status invitation_status DEFAULT 'pending',
  max_uses int DEFAULT 1,
  uses int DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_members_org_user ON organization_members(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_facilities_org ON facilities(organization_id);
CREATE INDEX IF NOT EXISTS idx_client_accounts_org ON client_accounts(organization_id);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(invite_code);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_facility_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION get_user_role(org_id uuid)
RETURNS member_role
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT role FROM organization_members
  WHERE organization_id = org_id AND user_id = auth.uid() AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION user_has_facility(fac_id uuid)
RETURNS boolean
LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members m
    LEFT JOIN member_facility_access mfa ON mfa.member_id = m.id
    WHERE m.user_id = auth.uid() 
      AND m.is_active = true
      AND (m.all_facilities = true OR mfa.facility_id = fac_id)
      AND m.organization_id = (SELECT organization_id FROM facilities WHERE id = fac_id)
  );
$$;

-- RLS Policies (Idempotent drops before creation)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Members can view org" ON organizations;
CREATE POLICY "Members can view org" ON organizations FOR SELECT USING (
  get_user_role(id) IS NOT NULL
);

DROP POLICY IF EXISTS "Owners and admins can update org" ON organizations;
CREATE POLICY "Owners and admins can update org" ON organizations FOR UPDATE USING (
  get_user_role(id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Members can view other members" ON organization_members;
CREATE POLICY "Members can view other members" ON organization_members FOR SELECT USING (
  get_user_role(organization_id) IS NOT NULL
);

DROP POLICY IF EXISTS "Members can view permitted facilities" ON facilities;
CREATE POLICY "Members can view permitted facilities" ON facilities FOR SELECT USING (
  user_has_facility(id)
);

-- Profiles trigger
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
