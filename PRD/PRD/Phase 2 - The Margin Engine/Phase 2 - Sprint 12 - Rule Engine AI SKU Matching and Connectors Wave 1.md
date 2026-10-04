Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 12 of 15

Sprint 12: Integration Rule Engine, AI SKU Matching & Connector Wave 1

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Integration Expansion & Developer Platform (Master PRD §6.3.8)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 11: EDI Integration: 850, 856, 810, 940 & 945 via an EDI Network

Unlocks next

Phase 2 · Sprint 13: Connector Wave 2 (50+ Total), Outbound Webhooks, GraphQL & Developer Portal

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to give the integration layer the flexibility of the incumbent's visual ETL, without its fragility. A no-code rule engine (order splitting, holds, channel inventory buffers), AI-assisted SKU matching for new variants, and the first wave of new connectors take the platform towards the master PRD's 50+ channel target.

By the end of this sprint:

3PL staff can build no-code rules on incoming orders (conditions → actions) per client/channel.

Channel inventory buffers withhold stock per channel to prevent marketplace oversell suspensions.

New unmapped SKUs get AI-ranked mapping suggestions with one-click approval.

Wave 1 connectors are live: BigCommerce, Magento 2 (Adobe Commerce), Walmart Marketplace, eBay, Etsy, TikTok Shop, Squarespace, Wix, Faire and Recharge.

Out of scope for this sprint: wave 2 connectors and the developer platform (Sprint 13), full visual data-transformation scripting.

Dependency: Sprint 11 must be signed off. Also uses the Phase 1 · Sprint 12 connector framework, the error queue and SKU aliases.

2. User Stories

As an Ops Manager, I want hazmat items split into a separate shipment automatically so that aerosols never ship by air.

As a Brand client, I want to keep 15 units off eBay so that I'm never suspended for overselling.

As an IT/Systems Lead, I want new Shopify variants mapped with one click so that orders don't sit on hold.

As a 3PL Owner, I want to onboard brands on Walmart, TikTok Shop or BigCommerce without custom work so that I can win more clients.

3. Functional Requirements

3.1 Order Rule Engine

Rule builder: triggers (order imported/updated), conditions (channel, client, SKU attributes, destination, value, weight, tags, address confidence), actions (split by attribute/availability, hold with reason, set service level, add insert SKU, set priority, route to facility).

Rules ordered and versioned, with test-mode simulation on past orders before activation. Rule hits logged per order.

3.2 Fraud & Address Holds

Hold rules on channel fraud-risk fields (e.g. Shopify risk level) and on address confidence below a threshold, released automatically when resolved.

3.3 Channel Inventory Buffers

Per client × channel × SKU (or category): fixed buffer or % buffer, plus a max-published quantity. Applied in the Phase 1 channel_sync available-to-sell calculation.

3.4 AI SKU Matching

Embedding + rule-based similarity across SKU code, title, variant options and barcode, trained on the client's accepted aliases. Top-3 suggestions with a confidence score. Auto-accept only above a configurable high threshold, otherwise one-click approve.

3.5 Connector Wave 1

Adapters (orders in, inventory out, fulfillment/tracking out): BigCommerce, Magento 2, Walmart Marketplace, eBay, Etsy, TikTok Shop, Squarespace, Wix, Faire (wholesale), Recharge (subscriptions → order generation from Shopify).

Each passes the adapter contract test suite and a live sandbox run.

4. Acceptance Criteria

A hazmat-split rule splits a mixed order into two shipments. Simulation on last week's orders shows the correct hit count before activation.

An eBay buffer of 15 publishes 85 when 100 are available.

AI suggestions rank the correct master SKU first for ≥85% of new variants in a test set.

Each wave 1 connector imports an order and pushes fulfillment + inventory in its sandbox.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Rule evaluation adds <100ms per order.

Safety

Rules must be simulated before activation. Every rule action is logged and reversible where possible.

Reliability

All connectors inherit the Phase 1 raw store / retry / reconciliation guarantees.

6. Implementation Task Breakdown: Sprint 12

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Rule Engine] ──> [Step 2: Buffers & AI Match] ──> [Step 3: Connectors A] ──> [Step 4: Connectors B]



Step 1: Order Rule Engine & Simulation

Goal: Configurable order logic without code.

Task 1.1: Rule Schema & Evaluator

Conditions/actions DSL, ordering, versioning.

Task 1.2: Rule Builder UI & Simulation

Visual builder, replay on past orders.

Task 1.3: Fraud & Address Hold Rules

Risk/confidence conditions.

Step 2: Channel Buffers & AI SKU Matching

Goal: Prevent oversells and unmapped-SKU holds.

Task 2.1: Buffer Configuration & ATS Calculation

Per channel/SKU buffers in channel_sync.

Task 2.2: AI Matching Service

Similarity model, confidence, auto-accept threshold.

Step 3: Connector Wave 1 — Part A

Goal: Cover the biggest marketplaces.

Task 3.1: Walmart, eBay, TikTok Shop, Etsy

Adapters + contract tests.

Step 4: Connector Wave 1 — Part B

Goal: Cover the major DTC and wholesale platforms.

Task 4.1: BigCommerce, Magento 2, Squarespace, Wix, Faire, Recharge

Adapters + contract tests.

Task 4.2: Sandbox Certification Runs

Live sandbox order cycle per connector.

7. Sprint Delivery Milestones

Milestone 1 — Rule Engine (Target: Day 3)

Rules evaluate and simulate correctly.

Milestone 2 — Buffers & AI Match (Target: Day 5)

Buffers applied. AI suggestion accuracy target met.

Milestone 3 — Connectors A (Target: Day 7)

Marketplace connectors pass contract tests.

Milestone 4 — Connectors B & Sign-Off (Target: Day 10)

All wave 1 connectors certified in sandboxes.

8. Open Questions Carried Into This Sprint

Connector priority: confirm wave 1 against design partners' actual channels (swap in Amazon Vendor/Target+/Wayfair if needed).

AI auto-accept: allowed at all, or always require one click?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 13 can start.



End of Phase 2 · Sprint 12 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 12 of 15  |  Page