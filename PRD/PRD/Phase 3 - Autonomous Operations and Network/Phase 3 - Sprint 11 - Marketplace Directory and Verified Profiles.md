Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 11 of 15

Sprint 11: Fulfillment Marketplace: Public Directory & Verified 3PL Profiles

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Two-Sided Fulfillment Marketplace (Master PRD §6.4.7)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 10: Network Order Routing, Unified Merchant Command Center & Split Settlement

Unlocks next

Phase 3 · Sprint 12: Marketplace RFPs, Matching, Lead Routing & Brand Onboarding Handoff

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to launch the brand-facing side of the two-sided marketplace: a public, SEO-friendly directory where eCommerce brands looking for fulfillment find 3PLs on the platform by location, capabilities and scale. Profiles are backed by verified performance metrics from real platform data. This is the retention moat from the master PRD: the platform sends 3PLs revenue and never competes with them.

By the end of this sprint:

3PLs can publish a marketplace profile (from their network profile) with services, capabilities, photos, pricing ranges and a verified-metrics badge.

Brands can search and filter the public directory by region, capabilities (cold chain, hazmat, FDA, B2B/EDI), channels supported, order volume and specialisations.

Verified metrics (accuracy, on-time ship %, dock-to-stock time, uptime of integrations) are computed from platform data with 3PL consent.

Profile pages are indexable and fast, and capture brand enquiries (full RFP flow in Sprint 12).

Out of scope for this sprint: RFP matching, lead routing and success fees (Sprint 12), paid placement/ads (not planned, to keep ranking trustworthy).

Dependency: Sprint 10 must be signed off. Also uses the Sprint 9 facility profiles and Phase 1–2 operational metrics.

2. User Stories

As a Brand founder, I want to find a 3PL near my customers that handles supplements and Amazon so that I can shortlist in minutes.

As a 3PL Owner, I want a profile that shows my real accuracy and on-time numbers so that I win brands on proof, not claims.

As a Brand, I want to trust that directory rankings aren't bought so that the shortlist is fair.

3. Functional Requirements

3.1 Marketplace Profiles

Profile builder: overview, facilities (from network profiles), services (DTC, B2B, kitting, returns), capabilities, channels/integrations used, minimums and indicative pricing ranges, photos/video, certifications (uploaded documents, admin-verified).

Draft/publish, and profile completeness guidance.

3.2 Verified Metrics

Computed monthly from platform data: pick accuracy, on-time ship rate vs cutoffs, dock-to-stock time, inventory accuracy, average support response (if tracked). Shown as ranges/badges, not raw client data. Requires the 3PL's opt-in.

3.3 Public Directory & Search

Public pages (server-rendered for SEO): search by location radius/region, filters, sort by relevance (capability fit + verified quality + responsiveness). Map view.

Proximity search: search by city, address or ZIP code, or 'near me' (browser location, with permission), then filter by straight-line radius (e.g. 25/50/100/250 miles) or drive time (e.g. within 2 hours of my supplier/port, via an isochrone/routing API). Results sorted by distance or drive time, with map pins and clustering.

Delivery reach: each warehouse shows a reach map and the % of the US population (or of the brand's own customer ZIPs, if uploaded) reachable in 1, 2 and 3 days by ground, computed from carrier transit-time data for the facility's ZIP code. Multi-facility 3PLs and network partners show combined coverage (e.g. '3 warehouses reach 95% of the US in 2 days').

Location privacy: 3PLs choose what's public: exact address, city, or metro area only. Exact addresses are revealed to a brand only after the 3PL accepts its enquiry/lead. Distance results use the approximate location when precision is hidden.

AI-search ready (GEO): each profile is server-rendered with LocalBusiness/ProfessionalService JSON-LD (service types, approximate geo, areaServed, delivery-reach summary, verified metrics), city/region landing pages built from live directory data, directory entries in llms.txt and sitemaps, so both the platform and its 3PLs can be recommended in AI answers to 'find a 3PL near…' questions (Core Doc 15 §5).

Enquiry form on profiles (brand contact, volume, channels) → routed to the 3PL inbox (full RFP matching in Sprint 12).

3.4 Trust & Moderation

Ranking policy published. No paid placement. Admin moderation of profiles/certifications. Abuse/spam protection on enquiries.

4. Acceptance Criteria

A 3PL publishes a profile in <30 minutes using pre-filled network/facility data.

Verified metrics on a profile match the 3PL's internal dashboard values for the same period (rounded to the badge ranges).

Directory search with 3 filters returns results in <500ms. Profile pages score ≥90 on Lighthouse performance and SEO.

Searching ZIP 75201 with a 100-mile radius returns only warehouses within 100 miles, sorted by distance. A 2-hour drive-time search excludes warehouses beyond 2 hours' drive, even if they fall inside the radius.

A warehouse profile shows its 1/2/3-day ground reach map and coverage %, consistent with carrier transit data for its ZIP.

A 3PL set to 'city only' never exposes its street address in public results or pages until it accepts a lead.

An enquiry reaches the 3PL's inbox and email within 1 minute, and spam submissions are blocked.

5. Non-Functional & Security Requirements

Requirement

Detail

Privacy

No client (brand) names or data shown without that client's explicit consent. Metrics aggregated.

Performance/SEO

Server-rendered public pages, <1.5s load, structured data markup.

Trust

Ranking factors documented. Moderation audit trail.

6. Implementation Task Breakdown: Sprint 11

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Profiles] ──> [Step 2: Metrics] ──> [Step 3: Directory] ──> [Step 4: Trust]



Step 1: Marketplace Profile Builder

Goal: Let 3PLs present themselves well, quickly.

Task 1.1: Profile Schema & Builder

Pre-fill from network profiles, completeness guidance.

Task 1.2: Certification Uploads & Verification

Admin review workflow.

Step 2: Verified Metrics Engine

Goal: Replace claims with proof.

Task 2.1: Monthly Metric Computation & Badges

Opt-in, ranges, reconciliation with dashboards.

Step 3: Public Directory, Search & Enquiries

Goal: Help brands find the right 3PL.

Task 3.1: SSR Directory & Search

Filters, map, relevance ranking.

Task 3.2: Enquiry Capture & Routing

Form, inbox, email, spam protection.

Step 4: Trust, Moderation & Launch

Goal: Keep the marketplace credible.

Task 4.1: Ranking Policy & Moderation Tools

Published policy, admin queue.

Task 4.2: Seed Launch with Design Partners

First 10–20 profiles live.

7. Sprint Delivery Milestones

Milestone 1 — Profiles (Target: Day 3)

Profile builder live.

Milestone 2 — Verified Metrics (Target: Day 5)

Badges computed and reconciled.

Milestone 3 — Directory (Target: Day 8)

Public search and enquiries live.

Milestone 4 — Sign-Off (Target: Day 10)

Seed profiles published. Performance/SEO targets met.

8. Open Questions Carried Into This Sprint

Should 3PLs not yet on the platform be listable (unverified) to seed supply, or verified platform users only?

Pricing ranges: required or optional on profiles?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 12 can start.



End of Phase 3 · Sprint 11 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 11 of 15  |  Page