Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 14 of 15

Sprint 14: App Marketplace Launch: Listings, Review, Billing & Partner Program

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

App / Partner Marketplace (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 13: Extension Platform: Third-Party Apps, OAuth, UI Extension Points & Sandbox

Unlocks next

Phase 4 · Sprint 15: Enterprise-Scale Performance, Disaster Recovery & Phase 4 Launch Readiness

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to open the app marketplace: a catalog where 3PLs discover and install partner apps (e.g. freight quoting, insurance, returns, analytics, niche carriers), backed by a security/quality review process, app billing with revenue share, and a partner program for ISVs and system integrators.

By the end of this sprint:

An in-product app marketplace lists reviewed apps, with categories, search, screenshots, pricing and reviews.

Partners submit apps for review (security, scope justification, UX checks) before listing.

Paid apps bill through the platform (subscription or usage) with automated revenue-share payouts to partners.

A partner program (tiers, certification, co-marketing) and a system-integrator directory are live.

Out of scope for this sprint: hardware marketplace, a services marketplace for freelancers.

Dependency: Sprint 13 must be signed off (extension platform). Also uses Phase 2 billing and Stripe Connect.

2. User Stories

As a 3PL Admin, I want to find and install trusted add-ons in a few clicks so that I extend the platform without custom development.

As a partner, I want to charge for my app through the platform so that I don't build my own billing.

As the platform, I want every listed app reviewed so that customers can trust the marketplace.

3. Functional Requirements

3.1 Marketplace Catalog

Listing pages (description, screenshots, scopes requested, pricing, support links, ratings), categories, search, 'works with' badges. One-click install via the Sprint 13 OAuth flow.

3.2 Review Process

Submission checklist, automated scope/security scans, manual review (data handling, UX, support), re-review on scope changes, delisting process.

3.3 App Billing & Revenue Share

Pricing plans per app (free, subscription, usage-based via metering API). Charges appear on the 3PL's platform invoice. Revenue share paid to partners via Stripe Connect monthly.

3.4 Partner Program

Partner tiers, certification (for SIs implementing automation/migrations), partner portal (analytics, payouts, leads), SI directory integrated with the Phase 3 marketplace concept.

4. Acceptance Criteria

A reviewed paid app is listed, installed by a test 3PL, billed on its platform invoice, and the partner's revenue share is paid out in test mode.

An app requesting new scopes in an update is re-reviewed before the update reaches installations.

A delisted app can't be newly installed, and existing installs are notified.

5. Non-Functional & Security Requirements

Requirement

Detail

Trust

Published review criteria. Security scan on every submission.

Finance

Revenue-share ledger reconciled monthly.

6. Implementation Task Breakdown: Sprint 14

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Catalog] ──> [Step 2: Review] ──> [Step 3: Billing] ──> [Step 4: Partners]



Step 1: Marketplace Catalog & Install

Goal: Make apps easy to find and install.

Task 1.1: Listings, Search & One-Click Install

Categories, ratings, scopes.

Step 2: App Review & Governance

Goal: Keep the marketplace safe.

Task 2.1: Submission, Scans & Manual Review

Re-review, delisting.

Step 3: App Billing & Revenue Share

Goal: Let partners earn through the platform.

Task 3.1: Plans, Metering, Invoicing & Payouts

Stripe Connect payouts.

Step 4: Partner Program & SI Directory

Goal: Grow the ecosystem.

Task 4.1: Tiers, Certification, Partner Portal

Analytics, payouts, leads.

7. Sprint Delivery Milestones

Milestone 1 — Catalog (Target: Day 3)

Catalog and installs live.

Milestone 2 — Review (Target: Day 5)

Review process operating.

Milestone 3 — Billing (Target: Day 8)

App billing and payouts working.

Milestone 4 — Sign-Off (Target: Day 10)

Partner program launched with first partners.

8. Open Questions Carried Into This Sprint

Revenue share rate (e.g. 20% platform / 80% partner)?

Which launch partners and apps seed the marketplace?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 15 can start.



End of Phase 4 · Sprint 14 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 14 of 15  |  Page