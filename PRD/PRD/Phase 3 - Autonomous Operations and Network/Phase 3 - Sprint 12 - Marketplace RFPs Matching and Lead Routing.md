Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 12 of 15

Sprint 12: Marketplace RFPs, Matching, Lead Routing & Brand Onboarding Handoff

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Two-Sided Fulfillment Marketplace (Master PRD §6.4.7)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 11: Fulfillment Marketplace: Public Directory & Verified 3PL Profiles

Unlocks next

Phase 3 · Sprint 13: Brand Profitability Analytics: True Net Profit per SKU & per Order

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to turn marketplace traffic into signed brand clients for the platform's 3PLs. Brands post a structured fulfillment RFP. A matching engine shortlists the best-fit 3PLs using capability fit and verified quality. Pre-qualified leads are routed to those 3PLs with response SLAs. When a deal is won, the brand is onboarded straight into the 3PL's workspace (catalog import, channel connection, portal access), and the platform records the success fee.

By the end of this sprint:

Brands can submit an RFP (volume, SKUs, channels, regions, requirements, timeline) without an account, and verify their email.

The matching engine shortlists up to N 3PLs with an explained fit score. Leads route to them with response deadlines.

3PLs manage leads in an inbox (accept, decline, propose, message), and brands compare proposals.

A won deal creates the client account at the 3PL with a guided onboarding checklist, and records the marketplace fee.

Out of scope for this sprint: contract e-signing between brand and 3PL (links to the 3PL's own contract process), payments for the marketplace fee beyond invoicing the 3PL.

Dependency: Sprint 11 must be signed off (profiles, directory, enquiries).

2. User Stories

As a Brand, I want to describe my needs once and get proposals from well-matched 3PLs so that I don't cold-call ten warehouses.

As a 3PL Owner, I want pre-qualified leads that fit my capabilities so that my sales time is well spent.

As a 3PL, I want a won brand to be onboarded in a few clicks so that time-to-first-order is days, not weeks.

3. Functional Requirements

3.1 Brand RFP

Guided RFP form: company, monthly orders, SKU count, average order profile, channels, B2B/retail needs, storage (pallets/cube), special requirements (cold, hazmat, FDA, kitting), regions/delivery promise, target start date, budget range.

Email verification, anti-bot challenge (Turnstile/hCaptcha), rate limits and basic fraud checks. RFP visible only to matched 3PLs.

3.2 Matching Engine

Hard filters (capabilities, capacity, region, maximum distance/drive time from the brand's supplier or port, and minimum 1–2-day delivery coverage of the brand's customer ZIPs), then a fit score (capability depth, volume fit vs capacity/minimums, verified quality, responsiveness history, network reach for multi-region needs). Explanation per match. Fairness rotation so leads aren't always sent to the same 3PLs.

3.3 Lead Routing & Inbox

Route to the top N (default 3–5) with a response SLA (e.g. 48h). Unresponsive leads are re-routed. The 3PL inbox supports accept/decline (with reason), proposal (pricing summary + documents) and messaging.

Brand side: proposal comparison, questions, shortlist, select a winner.

3.4 Win & Onboarding Handoff

Winner selected → the 3PL confirms → client account created with the RFP data, an onboarding checklist (catalog import, channel connect, first ASN, portal invites, rate card), and a timeline tracker.

Marketplace fee record (success fee per won deal, or % of first-year billing, per policy) invoiced to the 3PL via Phase 2 invoicing.

4. Acceptance Criteria

An RFP for a cold-chain brand is matched only to 3PLs with cold-chain capability and capacity, and each match shows its fit explanation.

A lead not answered within the SLA is re-routed to the next best 3PL automatically.

The brand compares 3 proposals and selects one, and the winning 3PL gets a pre-filled client account and onboarding checklist.

A won deal creates the marketplace fee record, and it appears on the 3PL's next platform invoice.

5. Non-Functional & Security Requirements

Requirement

Detail

Fairness

Rotation and caps prevent lead concentration. Matching factors are auditable.

Privacy

RFP details visible only to matched 3PLs. Brand contact revealed after the 3PL accepts.

Performance

Matching <5s per RFP.

6. Implementation Task Breakdown: Sprint 12

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: RFP] ──> [Step 2: Matching] ──> [Step 3: Leads] ──> [Step 4: Handoff]



Step 1: Brand RFP Capture

Goal: Collect a complete, qualified brief.

Task 1.1: RFP Form & Verification

Guided form, email verification, fraud checks.

Step 2: Matching Engine

Goal: Shortlist the best-fit 3PLs, fairly.

Task 2.1: Filters, Fit Score & Explanations

Capability, volume, quality, reach.

Task 2.2: Fairness Rotation

Caps, rotation.

Step 3: Lead Routing, 3PL Inbox & Proposals

Goal: Make the brand–3PL conversation easy.

Task 3.1: Routing with SLAs & Re-route

Deadlines, automatic re-routing.

Task 3.2: 3PL Inbox & Brand Proposal Comparison

Accept/decline/propose/message, compare, select.

Step 4: Win Handoff, Onboarding & Marketplace Fees

Goal: Turn wins into live clients fast.

Task 4.1: Client Creation & Onboarding Checklist

Pre-fill, checklist, timeline.

Task 4.2: Marketplace Fee Records

Policy, platform invoice line.

7. Sprint Delivery Milestones

Milestone 1 — RFP Capture (Target: Day 2)

Brands submit verified RFPs.

Milestone 2 — Matching (Target: Day 5)

Explained, fair matching working.

Milestone 3 — Leads & Proposals (Target: Day 8)

Inbox, proposals, comparison and selection working.

Milestone 4 — Handoff & Sign-Off (Target: Day 10)

Won deals onboarded. Fees recorded.

8. Open Questions Carried Into This Sprint

Marketplace fee model: fixed success fee per won brand, % of first-year billing, or free for Scale-tier 3PLs?

How many 3PLs per RFP by default (3 vs 5), balancing brand choice and 3PL win rates?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 13 can start.



End of Phase 3 · Sprint 12 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 12 of 15  |  Page