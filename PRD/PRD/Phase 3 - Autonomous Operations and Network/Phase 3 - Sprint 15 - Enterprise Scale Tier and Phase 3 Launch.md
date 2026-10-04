Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 15 of 15

Sprint 15: Enterprise Scale Tier (SSO, Advanced Roles, Data Residency) & Phase 3 Launch Readiness

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Phase 3 Launch & Scale Tier

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 14: Demand Forecasting, Purchase Order Suggestions & Distributed Inventory Allocation

Unlocks next

Phase 4 — Horizon (robotics, enterprise cross-dock, international expansion) — directional, to be planned

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this final Phase 3 sprint is to prepare the platform for larger multi-facility 3PLs and to launch Phase 3 formally. It adds the enterprise controls the master PRD places in the Scale tier (SSO/SAML, SCIM provisioning, custom roles, data residency options), validates the AI savings claims with measured results, and rolls out the network and marketplace beyond pilots.

By the end of this sprint:

Scale-tier 3PLs can use SAML/OIDC SSO with SCIM user provisioning, and define custom roles from permission sets.

Data residency options (e.g. US, EU, UK/Canada regions) are available for new tenants, with documented limits.

A Phase 3 results report publishes measured savings (travel, DIM, cutoff misses, count efficiency) from pilots, suitable for marketing claims.

Network and marketplace are generally available, with load, security and SOC 2 (Type II report) gates passed.

Out of scope for this sprint: robotics/AMR orchestration, enterprise cross-dock, dimensioner integrations, international expansion beyond residency (Phase 4 horizon).

Dependency: Sprint 14 must be signed off. All Phase 3 sprints feed the launch gate.

2. User Stories

As an enterprise 3PL IT lead, I want staff to sign in with our identity provider and be provisioned automatically so that access control meets our policy.

As a 3PL Owner, I want custom roles so that permissions match how my organization works.

As a Canadian or European 3PL, I want my data stored in my region so that I meet customer and legal requirements.

As the Product Owner, I want measured, defensible AI savings so that sales and marketing claims are honest.

3. Functional Requirements

3.1 SSO & Provisioning

SAML 2.0 and OIDC SSO per organization (Okta, Entra ID, Google), enforced-SSO option, and SCIM 2.0 user/group provisioning mapped to roles/facility scopes. Floor badge/PIN login unchanged.

3.2 Custom Roles

Permission-set model (view/edit per module, facility scope, client scope). Custom roles built from permission sets, still enforced in RLS via the Phase 1 helper functions (extended). Role audit reports.

3.3 Data Residency

Region choice at tenant creation (separate regional database/storage/analytics deployments). Network and marketplace cross-region rules (profiles global, operational data regional). Documented residency statement.

3.4 Phase 3 Results & Launch

Results report from the Sprint 1 measurement framework across pilot facilities: metres per pick, DIM surcharge $, cutoff miss rate, count hit rate, forecast accuracy.

GA readiness: 5x load test including AI services and cross-tenant routing, pen test (network grants, marketplace, SSO), SOC 2 Type II report received, feature flags/GA rollout plan, and pricing/tier updates for AI, network and marketplace.

4. Acceptance Criteria

A test organization signs in via Okta SAML, and SCIM-created users get the mapped roles and facility scopes automatically.

A custom 'Returns Lead' role can manage RMAs in one facility only, enforced at the database level.

A tenant created in the EU region stores operational data only in EU infrastructure (verified).

The results report shows measured savings with methods and confidence intervals, reviewed by product and sales leadership.

All GA gates (load, pen test, SOC 2 Type II) are passed.

5. Non-Functional & Security Requirements

Requirement

Detail

Security

SSO/SCIM follow IdP best practices. Enforced SSO blocks password login for staff.

Residency

No cross-region replication of operational data, and the analytics store is regional too.

Honesty

Published savings claims only use measured results with stated conditions.

6. Implementation Task Breakdown: Sprint 15

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: SSO & SCIM] ──> [Step 2: Custom Roles] ──> [Step 3: Residency] ──> [Step 4: Launch]



Step 1: SSO & SCIM Provisioning

Goal: Meet enterprise identity requirements.

Task 1.1: SAML/OIDC SSO

Per-org configuration, enforced SSO.

Task 1.2: SCIM 2.0

Users/groups → roles/scopes.

Step 2: Permission Sets & Custom Roles

Goal: Fit permissions to each organization.

Task 2.1: Permission-Set Model & RLS Extension

Module/facility/client scopes.

Task 2.2: Role Builder & Audit Reports

UI, reports.

Step 3: Regional Deployments & Data Residency

Goal: Keep data in the customer's region.

Task 3.1: Regional Stack & Tenant Placement

Region choice, routing by tenant.

Task 3.2: Cross-Region Rules

Network/marketplace boundaries.

Step 4: Phase 3 Results Report & GA Launch

Goal: Launch with proof and confidence.

Task 4.1: Savings Results Report

Measured outcomes, methods, confidence.

Task 4.2: GA Gates & Rollout

Load, pen test, SOC 2 Type II, pricing updates.

7. Sprint Delivery Milestones

Milestone 1 — SSO & SCIM (Target: Day 3)

SSO and provisioning working with 2 IdPs.

Milestone 2 — Custom Roles (Target: Day 5)

Custom roles enforced in RLS.

Milestone 3 — Residency (Target: Day 8)

Second region live for new tenants.

Milestone 4 — Phase 3 GA Sign-Off (Target: Day 10)

Results report published. All GA gates passed.

8. Open Questions Carried Into This Sprint

Which second region first (EU vs Canada vs UK), based on the sales pipeline?

Pricing: are AI modules included in Growth/Scale tiers or sold as add-ons (the master PRD leaves this open)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded. Phase 3 general-availability decision made.



End of Phase 3 · Sprint 15 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 15 of 15  |  Page