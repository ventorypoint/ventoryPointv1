export const ACTIVE_ORG_COOKIE = "vp_active_org_id";
export const ACTIVE_FACILITY_COOKIE = "vp_active_facility_id";

export interface WorkspaceOrganization {
  id: string;
  name: string;
  role: string;
  country?: string;
  timezone?: string;
  currency?: string;
}

export interface WorkspaceFacility {
  id: string;
  name: string;
  code: string;
  city?: string;
  is_active: boolean;
}

export interface WorkspaceContext {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  organizations: WorkspaceOrganization[];
  activeOrg: WorkspaceOrganization | null;
  facilities: WorkspaceFacility[];
  activeFacilityId: string; // 'all' or specific uuid
  role: string;
}
