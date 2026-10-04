-- Facilities Policies
DROP POLICY IF EXISTS "Admins and Owners can view all facilities" ON facilities;
CREATE POLICY "Admins and Owners can view all facilities" ON facilities FOR SELECT USING (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

DROP POLICY IF EXISTS "Admins and Owners can insert facilities" ON facilities;
CREATE POLICY "Admins and Owners can insert facilities" ON facilities FOR INSERT WITH CHECK (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

DROP POLICY IF EXISTS "Admins and Owners can update facilities" ON facilities;
CREATE POLICY "Admins and Owners can update facilities" ON facilities FOR UPDATE USING (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

DROP POLICY IF EXISTS "Admins and Owners can delete facilities" ON facilities;
CREATE POLICY "Admins and Owners can delete facilities" ON facilities FOR DELETE USING (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

-- Client Accounts Policies
DROP POLICY IF EXISTS "Members can view client accounts" ON client_accounts;
CREATE POLICY "Members can view client accounts" ON client_accounts FOR SELECT USING (
  get_user_role(organization_id) IS NOT NULL
);

DROP POLICY IF EXISTS "Admins and Owners can insert client accounts" ON client_accounts;
CREATE POLICY "Admins and Owners can insert client accounts" ON client_accounts FOR INSERT WITH CHECK (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

DROP POLICY IF EXISTS "Admins and Owners can update client accounts" ON client_accounts;
CREATE POLICY "Admins and Owners can update client accounts" ON client_accounts FOR UPDATE USING (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

DROP POLICY IF EXISTS "Admins and Owners can delete client accounts" ON client_accounts;
CREATE POLICY "Admins and Owners can delete client accounts" ON client_accounts FOR DELETE USING (
  get_user_role(organization_id) IN ('owner', 'admin', 'ops_manager')
);

-- Invitations Policies
DROP POLICY IF EXISTS "Members can view invitations" ON invitations;
CREATE POLICY "Members can view invitations" ON invitations FOR SELECT USING (
  get_user_role(organization_id) IS NOT NULL
);

DROP POLICY IF EXISTS "Admins can insert invitations" ON invitations;
CREATE POLICY "Admins can insert invitations" ON invitations FOR INSERT WITH CHECK (
  get_user_role(organization_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Admins can update invitations" ON invitations;
CREATE POLICY "Admins can update invitations" ON invitations FOR UPDATE USING (
  get_user_role(organization_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Admins can delete invitations" ON invitations;
CREATE POLICY "Admins can delete invitations" ON invitations FOR DELETE USING (
  get_user_role(organization_id) IN ('owner', 'admin')
);

-- Organization Members deletion/update policies
DROP POLICY IF EXISTS "Admins can update org members" ON organization_members;
CREATE POLICY "Admins can update org members" ON organization_members FOR UPDATE USING (
  get_user_role(organization_id) IN ('owner', 'admin')
);

DROP POLICY IF EXISTS "Admins can delete org members" ON organization_members;
CREATE POLICY "Admins can delete org members" ON organization_members FOR DELETE USING (
  get_user_role(organization_id) IN ('owner', 'admin')
);
