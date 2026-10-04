Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 12 of 15

Sprint 12: Regional Market Packs: UK/EU, Australia/NZ & Canada (Carriers, Marketplaces, Payments, Compliance)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

International Expansion (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 11: Cross-Border Shipping & Customs Documentation

Unlocks next

Phase 4 · Sprint 13: Extension Platform: Third-Party Apps, OAuth, UI Extension Points & Sandbox

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to launch the platform for 3PLs in new regions with everything local operations need: regional carriers, regional marketplaces and storefronts, local payment rails for 3PL billing, and regional compliance (GDPR/UK GDPR, Australian Privacy Act, PIPEDA), delivered as configurable market packs.

By the end of this sprint:

UK/EU pack: Royal Mail, Evri, DPD, DHL Parcel, GLS, InPost (via aggregator or direct). Amazon EU, eBay UK/DE, Zalando (if prioritised), Etsy EU. SEPA Direct Debit / Bacs for 3PL billing. GDPR tooling.

Australia/NZ pack: Australia Post, Sendle, CouriersPlease, NZ Post. Amazon AU, eBay AU, Catch/MyDeal (as prioritised). BECS Direct Debit. Privacy Act tooling.

Canada pack: Canada Post, Purolator, regional couriers. Amazon CA. PAD debits. PIPEDA tooling.

Data subject request tools (access, deletion) and data processing agreements for all regions.

Out of scope for this sprint: Asia/LatAm markets (future market packs), local e-invoicing networks unless required for launch.

Dependency: Sprint 11 must be signed off (customs and cross-border). Also uses the Phase 3 · Sprint 15 regional deployments and the Phase 2 connector framework.

2. User Stories

As a UK 3PL, I want Royal Mail and Evri labels from the pack station so that I can ship at local rates.

As an Australian 3PL, I want clients to pay by BECS direct debit so that collections follow local norms.

As a Privacy Officer, I want to handle shopper data deletion requests so that we meet GDPR.

3. Functional Requirements

3.1 Regional Carriers

Carrier integrations per market (aggregator-first, direct where needed for rates/features), service mapping, rate shopping rules, manifests/collection booking.

3.2 Regional Channels

Marketplace/storefront adapters prioritised per market pipeline, on the Phase 2 connector framework and contract tests.

3.3 Local Payment Rails

Stripe-supported debits: SEPA DD, Bacs DD, BECS DD, Canadian PAD, with mandates and local compliance text.

3.4 Privacy Compliance

Data subject access/deletion requests for shopper PII (search, export, redact across orders/shipments/photos), retention policies per region, DPAs and sub-processor lists, regional privacy notices.

4. Acceptance Criteria

A UK tenant ships with Royal Mail and Evri labels via rate shopping, and manifests work.

An AU 3PL collects an invoice by BECS direct debit in test mode.

A GDPR deletion request redacts the shopper's PII across orders, shipments and photos while keeping billing records intact (pseudonymised).

5. Non-Functional & Security Requirements

Requirement

Detail

Residency

Tenant data stays in its region (Phase 3 · Sprint 15).

Compliance

Legal review per market before launch.

6. Implementation Task Breakdown: Sprint 12

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Carriers] ──> [Step 2: Channels] ──> [Step 3: Payments] ──> [Step 4: Privacy]



Step 1: Regional Carrier Integrations

Goal: Ship at local rates.

Task 1.1: UK/EU, AU/NZ, CA Carriers

Aggregator + direct, services, manifests.

Step 2: Regional Marketplace & Storefront Connectors

Goal: Connect local sales channels.

Task 2.1: Priority Connectors per Market

Contract tests, sandboxes.

Step 3: Local Payment Rails

Goal: Collect the local way.

Task 3.1: SEPA/Bacs/BECS/PAD Debits

Mandates, compliance text.

Step 4: Regional Privacy Compliance

Goal: Meet local privacy law.

Task 4.1: DSAR Tools, Retention, DPAs

Search/export/redact, policies.

7. Sprint Delivery Milestones

Milestone 1 — Carriers (Target: Day 3)

Regional carriers labelling.

Milestone 2 — Channels (Target: Day 5)

Priority connectors certified.

Milestone 3 — Payments (Target: Day 7)

Local debits working.

Milestone 4 — Sign-Off (Target: Day 10)

Privacy tooling live. Market legal reviews complete.

8. Open Questions Carried Into This Sprint

Which market launches first, and with which design-partner 3PL?

Local support hours and language coverage per market.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 13 can start.



End of Phase 4 · Sprint 12 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 12 of 15  |  Page