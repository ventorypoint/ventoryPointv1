Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 8 of 15

Sprint 8: Multi-Facility Distributed Order Management & Inventory Transfers

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Distributed Order Management (foundation for Master PRD §6.4.6)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 7: AI Operations Copilot: Natural-Language Queries & Multilingual SOP Assistant

Unlocks next

Phase 3 · Sprint 9: 4PL Network Grid: Partnerships, Capacity Sharing & Cross-Tenant Data Boundaries

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

Before 3PLs can share capacity with each other (Sprints 9–10), a single 3PL with several buildings needs to act as one network. The objective of this sprint is distributed order management (DOM) within one organization: route each order to the best facility (nearest to the buyer with stock, cheapest to ship, within SLA), split orders across facilities when needed, and move stock between facilities with inter-facility transfers.

By the end of this sprint:

Orders for multi-facility clients are routed automatically to the best facility using configurable rules (distance/zone, stock, cost, SLA, capacity).

Orders can be split across facilities when a single node can't fulfil them (per client policy).

Inter-facility transfer orders move stock between buildings with in-transit visibility.

Brands see one aggregated inventory and order view across facilities in the portal.

Out of scope for this sprint: routing to other 3PLs' facilities (Sprints 9–10), FBA inventory placement (Sprint 14).

Dependency: Sprint 7 must be signed off. Also uses Phase 1 ClientFacility, the Phase 2 rule engine (Sprint 12) and Phase 2 native rate shopping (Sprint 9) for cost estimates.

2. User Stories

As a 3PL with warehouses in two regions, I want each order shipped from the closest building with stock so that delivery is faster and cheaper.

As a Brand client, I want to see one combined inventory across the 3PL's buildings so that I don't manage stock per site.

As an Ops Manager, I want to transfer stock between buildings with tracking so that inventory is where demand is.

3. Functional Requirements

3.1 Routing Engine

Candidate facilities: serving the client, with available stock (whole or partial). Score: estimated shipping cost (rate cache by zone/weight), transit days vs SLA, facility capacity/backlog, client preferences. Tie-breaks configurable.

Routing runs before allocation. The decision and scores are logged on the order (explainable). Manual re-route by the Supervisor.

3.2 Split Policies

Per client: never split, split only if it saves delivery days, or split to ship available stock first. Split creates child fulfillment orders per facility, tracked under one parent for the brand and the channel.

3.3 Inter-Facility Transfers

Transfer order: from/to facility, lines, pallets/cartons. Ships from the origin (Phase 1/2 outbound, B2B), arrives as an ASN at the destination. In-transit inventory status. Transfer charges per the 3PL rate card (optional).

Replenishment suggestions between facilities based on regional demand (simple rule in this sprint; forecasting in Sprint 14).

3.4 Network Views

Brand portal and 3PL views: aggregated inventory by facility, orders by routed facility, transfer status.

4. Acceptance Criteria

A West Coast order for a SKU stocked in both LA and Chicago routes to LA. When LA is out of stock, it routes to Chicago, and the decision log shows the scores.

A 'split to save days' client's order is split only when the modelled delivery is at least 1 day faster.

A transfer of 10 pallets appears as in-transit, then received at the destination, with inventory conserved end to end.

The brand portal shows the aggregated available-to-sell quantity equal to the sum of the facilities.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Routing decision <200ms per order. Batch routing of 5,000 orders <60s.

Integrity

Inventory conservation across transfers (event-backed).

Explainability

Every routing decision stores its candidate scores.

6. Implementation Task Breakdown: Sprint 8

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Routing] ──> [Step 2: Splits] ──> [Step 3: Transfers] ──> [Step 4: Network Views]



Step 1: Facility Routing Engine

Goal: Send every order to the best building.

Task 1.1: Candidate Scoring

Stock, cost, transit, capacity, preferences.

Task 1.2: Routing Integration & Manual Re-route

Before allocation, logs, overrides.

Step 2: Split Policies & Child Orders

Goal: Split only when it helps.

Task 2.1: Split Logic

Per-client policy, child fulfillment orders.

Task 2.2: Channel & Portal Parent Handling

One parent for brand/channel, multiple shipments.

Step 3: Inter-Facility Transfers

Goal: Move stock between buildings with full visibility.

Task 3.1: Transfer Orders & In-Transit Status

Outbound → ASN, in-transit.

Task 3.2: Inter-Facility Replenishment Suggestions

Regional demand rule.

Step 4: Aggregated Network Views & Tests

Goal: Show one network to the brand.

Task 4.1: Portal & 3PL Aggregated Views

Inventory, orders, transfers.

Task 4.2: Routing Simulation Tests

Historical replay by facility.

7. Sprint Delivery Milestones

Milestone 1 — Routing (Target: Day 3)

Orders route by score with logs.

Milestone 2 — Splits (Target: Day 5)

Split policies working with parent/child tracking.

Milestone 3 — Transfers (Target: Day 8)

Transfers end-to-end with in-transit status.

Milestone 4 — Sign-Off (Target: Day 10)

Aggregated views live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Default routing objective: lowest cost within SLA (proposed) vs fastest delivery?

Should transfer charges be billed to brands by default?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 9 can start.



End of Phase 3 · Sprint 8 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 8 of 15  |  Page