Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 1 of 19

Sprint 1: Auth, Tenant Hierarchy & Roles

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 1–2 — Foundation

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 00: Foundations Setup (Repo, CI/CD, Environments, Design Library, Specs)

Unlocks next

Phase 1 · Sprint 2: Event Backbone, Realtime & Audit Log

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 1 is to establish the secure multi-tenant base of the platform. A 3PL signs up, creates its organization, defines its facilities and client accounts, and invites staff with specific roles, with strict data isolation enforced by PostgreSQL Row Level Security (RLS) before any warehouse module is introduced.

By the end of this sprint:

A user can sign up or sign in with email + password, Google, GitHub or Microsoft, and then create a 3PL organization (becoming its Owner) or join one.

Workspaces can invite people three ways: an emailed invitation (link + code), a shareable invite link, or a workspace invite code that anyone can type in. Codes work for both new users (prompted to create an account) and existing users (added to the workspace).

The Owner/Admin can create facilities and client accounts and assign which facilities serve which clients.

Members are invited with a role and a facility scope, and can be revoked, reactivated or removed under two-level admin rules.

Floor Workers can be created without an email address and sign in with a badge ID + PIN.

Out of scope for this sprint: events and audit log (Sprint 2), locations/SKUs (Sprints 3–5), Client User portal (Phase 2), SSO.

Dependency: Sprint 00 must be signed off before this sprint starts. Sprint 00 (repository, CI/CD, environments, design library, ERD and API skeleton).

2. User Stories

As a 3PL Owner, I want to sign up and create my organization so that my company has a secure, isolated workspace.

As a 3PL Owner, I want to define my warehouses (facilities) and my brand clients so that inventory and orders can later be tracked per client and per building.

As an Admin, I want to invite staff with a role and limit them to specific facilities so that a supervisor in one building can't change another building's operations.

As a new team member, I want to sign up with Google, GitHub or my own email and password, whichever I prefer.

As an Admin, I want to generate an invite code I can share by WhatsApp, SMS or on a whiteboard, so that people can join the workspace without me knowing their email addresses.

As someone who already has an account, I want to enter a workspace code and be added to that workspace immediately, without creating a second account.

As an Ops Manager, I want to create Floor Worker accounts for temp staff who have no email, and let them sign in with a badge and PIN, so that seasonal hiring doesn't stall on account setup.

As an Owner, I want to revoke a departing worker's access instantly so that they can no longer see or change anything.

3. Functional Requirements

3.1 Authentication & Onboarding

Sign-in methods (Supabase Auth): (1) email + password (typed manually; strong-password rules, breached-password check, email verification required); (2) Google; (3) GitHub; (4) Microsoft; (5) floor-worker badge + PIN (see below). Enterprise SSO (SAML/OIDC) arrives in the Scale tier (Phase 3 · Sprint 15).

Account linking: one person = one account. If a social login returns a verified email that already has an account, the identities are linked (after confirming ownership), so users can sign in either way. GitHub sign-in uses the user's primary verified email.

Password reset by email link. MFA (authenticator app) required for Owner/Admin/Billing (enforced from Sprint 02A), optional for others.

Onboarding gate: an authenticated user with no active membership is routed to Create Organization, Join with a code, or their pending invitations (any invites sent to their verified email are listed automatically).

Floor Worker credential type: organization-scoped badge + 4–6 digit PIN, created by an Ops Manager or above. The badge carries a QR/Code 128 containing a random, revocable badge token (never the PIN or a guessable ID). Sign-in = scan badge on a registered floor device → enter PIN (two factors). PIN attempts are rate-limited, and the account locks after 5 failures. Lost badges are revoked and reissued in one click.

3.2 Tenant Hierarchy

Organization (legal/trading name, country, timezone, default currency).

Facility (name, short code, address, timezone, operating hours, carrier cutoff times list).

Facility geolocation: the address is validated and geocoded (latitude/longitude via the address provider), with a structured US ZIP code, county and state stored, and a map-pin confirmation step for the admin. This enables distance search, delivery-reach maps and nearest-facility routing later, without rework.

Client Account (brand name, short code, status active/suspended, primary contact, default facility) plus the ClientFacility mapping.

A user can belong to multiple organizations. Data visibility is always limited to the active organization and permitted facilities.

3.3 Role-Based Access Control

Owner: everything, including deleting the organization and managing admins' privileges.

Admin: organization settings, facilities, clients, members (subject to two-level rules).

Ops Manager: full operational control in permitted facilities, and can create Floor Workers.

Supervisor: runs daily operations (release waves, approve counts, resolve exceptions) in permitted facilities.

Floor Worker: executes assigned floor tasks only, with no configuration access.

Billing: rate cards, billing reports and exports (Sprint 14), read-only operations.

Client User (reserved): schema and RLS shape defined now; screens arrive in Phase 2.

Two-level admin rules: Owners can revoke/reactivate/remove anyone. Admins can manage only the members they invited, unless the Owner grants can_manage_all_members.

3.4 Invitations & Invite Codes

Three invite channels, one engine. Every invite has a role, facility scope (and client scope for brand users from Sprint 11A), expiry and usage limit:

(a) Email invitation (Resend): contains a join button (secure link) and the same invite as a short code, for people who prefer typing. The invite is locked to that email: the account that redeems it must have the same verified email.

(b) Shareable link: /invite?token=… for chat or email, optional single-use.

(c) Workspace invite code: a short, human-friendly code (8 characters, grouped for readability, e.g. K7QM-4XPD; unambiguous alphabet without O/0/I/1) that can be shared any way: in person, WhatsApp/SMS, printed on a shift board. Options: expiry (default 7 days), max uses (1, N or unlimited until expiry), optional email-domain restriction (e.g. only @partner3pl.com), optional admin approval before the member is activated.

Redeeming a code or link: the person enters the code on the sign-in page ('Have an invite code?') or after signing in ('Join a workspace'). The code is validated first (active, not expired, uses left). Not signed in / no account → prompted to create an account with any sign-in method, then joined to the workspace with the invite's role. Existing account → sign in, then added to the workspace (or told they're already a member). Users in several workspaces switch between them with the workspace switcher.

Security: codes stored hashed, rate-limited redemption (e.g. 5 attempts/minute per IP and per account, then a cooldown), anti-bot challenge on repeated failures, revocable at any time, full usage log (who redeemed, when, from where). Admins see active codes, uses remaining and expiry.

3.5 App Shell

Organization switcher + facility switcher in the sidebar, and a revoked-access screen for inactive memberships.

Role-aware navigation: configuration menus hidden from Supervisor/Floor Worker roles.

4. Acceptance Criteria

An automated RLS test suite, run as each role through the API, proves no cross-organization reads/writes and no out-of-scope facility reads/writes.

An Admin without can_manage_all_members can't revoke a member invited by the Owner. The Owner can.

A revoked member's API calls fail at the database layer, not just in the UI.

A Floor Worker created with badge + PIN can sign in from a shared station in under 10 seconds.

An email invite link forwarded to a different email address is rejected.

Creating a facility geocodes its address to latitude/longitude with a ZIP code. An admin can confirm or adjust the map pin, and an unverifiable address is flagged.

A new user entering a valid workspace code is prompted to create an account (email + password, Google, GitHub or Microsoft) and lands in that workspace with the code's role and facility scope.

An existing user entering a valid code for another workspace is added to it without creating a new account, and can switch between workspaces.

Expired, revoked or used-up codes are rejected with a clear message. After 5 wrong codes per minute from one IP, further attempts are blocked for a cooldown period.

Signing in with Google or GitHub using an email that already has a password account links to the same account (after ownership confirmation) instead of creating a duplicate.

A worker scans their badge QR on a registered floor device and must enter the PIN to sign in. The same badge on an unregistered browser is refused, and a revoked badge stops working immediately.

Field-tampering tests: a member sending organization_id, role, is_active, added_by or can_manage_all_members in any request can't change them. Only the allow-listed fields are written.

API responses for members, organizations and facilities contain only the fields in their response schemas (no internal columns), and errors return a code + request ID without stack traces.

Sign-up and password reset require the anti-bot challenge. Automated sign-up attempts without it are rejected.

5. Non-Functional & Security Requirements

Requirement

Detail

Data isolation

RLS on all tables. Helper functions get_user_role(org_id) and user_has_facility(facility_id) are security definer, indexed, and reused by every later sprint.

Performance

Dashboard shell resolves session + org/facility context and renders in <500ms. Permission helper p95 <5ms.

Security

PINs hashed (bcrypt/argon2). Tokens are 256-bit random. Rate limiting on auth and PIN endpoints. All secrets in environment/Vault.

Accessibility

Auth and onboarding screens meet WCAG 2.1 AA.

6. Implementation Task Breakdown: Sprint 1

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: DB Schema & RLS] ──> [Step 2: Auth & Middleware] ──> [Step 3: Org, Facility & Client Setup] ──> [Step 4: Members & Invites]



Step 1: Database Schema Architecture & Supabase RLS Setup

Goal: Create the tenancy tables and lock down access at the database layer.

Task 1.1: Design Core Tables Migration

Create profiles, organizations, organization_members (role enum, is_active, added_by, can_manage_all_members, all_facilities), member_facility_access, facilities, client_accounts, client_facilities, invitations.

Composite indexes on (organization_id, user_id) and (organization_id, facility_id).

Task 1.2: Profile Sync Trigger

Trigger on auth.users insert that provisions public.profiles.

Task 1.3: Permission Helper Functions (RPC)

get_user_role(org_id), user_has_facility(facility_id), get_user_permissions(org_id) returning role + facility list for middleware.

Task 1.4: RLS Policies

Enable RLS on all tables. Org-scoped SELECT via active membership. Facility-scoped tables also require user_has_facility. Write policies by role.

Step 2: Next.js Authentication & Middleware

Goal: Authenticate users and protect routes on both server and client.

Task 2.1: Supabase SSR Setup

Install @supabase/ssr and configure cookie-based sessions for Server and Client Components.

Task 2.2: Auth Screens

Login and register with email + password (manual entry), Google, GitHub and Microsoft buttons, forgot password, 'Have an invite code?' entry, validation and error states (Tailwind).

Task 2.3: Social Providers & Account Linking

Configure Google, GitHub and Microsoft OAuth apps in Supabase. Verified-email linking rules and a duplicate-account guard.

Task 2.4: Route Protection Middleware

middleware.ts guards /app/*. Unauthenticated users go to /login. Users with no active membership go to /onboarding.

Task 2.5: Floor Worker Badge + PIN Login

Badge token (QR/Code 128) scan → PIN → scoped session on registered devices only (Edge Function). Rate limiting, lockout, badge revoke/reissue.

Step 3: Organization, Facility & Client Account Management

Goal: Let the Owner/Admin set up the operating structure of the 3PL.

Task 3.1: Create Organization Flow

The /onboarding form inserts the organization and makes the creator Owner (single transaction via RPC).

Task 3.2: Facility Management UI

List/create/edit facilities, including timezone, operating hours and carrier cutoff times.

Task 3.3: Client Account Management UI

List/create/edit/suspend client accounts. Assign serving facilities.

Task 3.4: Org & Facility Switcher

Sidebar switchers that persist the active context in a cookie and refresh server data.

Step 4: Members, Invitations & Two-Level Admin Rules

Goal: Get staff into the right organization with the right role and scope, and let access be removed safely.

Task 4.1: Link Invitations

Token generation RPC, Invite Team modal (role + facility scope), /invite?token= landing with server-side validation and a join RPC.

Task 4.2: Email Invitations

Edge Function send-invite (Resend) with a locked invitee_email and a matching check on acceptance. The email includes both the join link and the invite code.

Task 4.3: Workspace Invite Codes

Code generator (unambiguous alphabet, hashed storage), options (expiry, max uses, domain lock, approval), redemption RPC for new vs existing users, rate limiting and usage log, admin code list with revoke.

Task 4.4: Revocation, Reactivation & Removal

RPCs set_member_active_status, remove_member, set_admin_privilege enforcing the Owner/Admin rules. A revoked-access screen.

Task 4.5: Floor Worker Creation

An Ops Manager creates badge/PIN workers (no email), with print-ready badge cards (PDF with barcode).

Task 4.6: Members Panel UI

Table with role, facilities, status, invited by, and action controls enabled or disabled per the caller's rights.

7. Sprint Delivery Milestones

Milestone 1 — Database Integrity & Security Baseline (Target: Day 3)

Tenancy tables deployed, the profile trigger works, and the RLS suite blocks cross-org and cross-facility access.

Milestone 2 — Auth & Routing Stable (Target: Day 5)

Email, OAuth and PIN sign-in work. Middleware correctly routes unauthenticated users and users with no membership.

Milestone 3 — Operating Structure Setup (Target: Day 7)

The Owner can create facilities and client accounts and switch context.

Milestone 4 — Team Onboarding Loop Closed & Sign-Off (Target: Day 10)

Link/email invites, Floor Worker creation and revocation work, and all acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Badge/PIN vs. full accounts for Floor Workers: confirm the PIN approach and whether badges should also support a scannable QR login.

Should Billing role users see operational data (orders, inventory) read-only, or only billing screens?

Default carrier cutoffs: per facility only, or per facility + carrier + service level? (Affects the Phase 3 SLA prediction model.)

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 2 can start.



End of Phase 1 · Sprint 1 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 1 of 19  |  Page