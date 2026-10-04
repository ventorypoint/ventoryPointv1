Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 9 of 15

Sprint 9: 4PL Network Grid: Partnerships, Capacity Sharing & Cross-Tenant Data Boundaries

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Collaborative 4PL Network Grid (Master PRD §6.4.6)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 8: Multi-Facility Distributed Order Management & Inventory Transfers

Unlocks next

Phase 3 · Sprint 10: Network Order Routing, Unified Merchant Command Center & Split Settlement

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to let independent 3PLs on the platform form a collaborative fulfillment network, so a single-facility regional 3PL can offer brands national 1–2 day delivery without building new warehouses. This sprint builds the network relationship layer: partner discovery and agreements, published capacity, and strict, auditable cross-tenant data boundaries, which is the hardest part to get right. Order routing and settlement follow in Sprint 10.

By the end of this sprint:

3PLs can join the network, publish facility profiles and available capacity (pallet positions, order throughput, capabilities).

Two 3PLs can sign a network agreement (in-app terms, rate cards between them, SLAs, data-sharing scope).

An originating 3PL (owns the brand relationship) can place a brand's inventory at a node 3PL (partner facility), with shared visibility limited to what the agreement allows.

Every cross-tenant access is enforced by database policies and audited.

Out of scope for this sprint: automatic order routing across partners and financial settlement (Sprint 10), brands contracting directly with node 3PLs (the originating 3PL stays the brand's contract holder).

Dependency: Sprint 8 must be signed off (DOM routing, transfers). Also uses the Phase 1 tenancy/RLS model, which is extended here for cross-tenant grants.

2. User Stories

As a regional 3PL Owner, I want to partner with 3PLs on other coasts so that I can offer my brands 2-day national delivery.

As a node 3PL Owner, I want to sell spare capacity to other 3PLs so that my empty racks earn revenue.

As an originating 3PL, I want partners to see only what they need for fulfillment so that my brand relationships stay mine.

As a Security Officer, I want every cross-company data access logged so that trust in the network can be audited.

3. Functional Requirements

3.1 Network Membership & Profiles

Opt-in network membership per organization. Partner discovery by map and proximity: find partner warehouses by region, distance or drive time, and see how much each would add to your combined 1–2-day delivery coverage (reach gap analysis). Facility profiles: location, size, capabilities (temperature, hazmat, FDA, B2B/EDI), published capacity (pallet positions, orders/day), carrier cutoffs, verified performance metrics from platform data (accuracy, on-time %).

3.2 Network Agreements

Agreement workflow: request → terms (node rate card for the originating 3PL, SLAs, liability/insurance fields, data-sharing scope) → e-accept by both Owners → active. Versioned amendments, suspension and termination with inventory exit plans.

3.3 Cross-Tenant Inventory Placement

A 'network client' link: the originating 3PL's client account is mirrored at the node as a restricted network client (catalog subset, no brand contact data unless shared).

Inbound to the node: the originating 3PL creates transfers/ASNs to the partner facility. The node receives with its own floor workspace.

3.4 Cross-Tenant Data Boundaries

network_grants table defining which entity types and fields each party can read (e.g. node sees SKU, dims, lots, order ship-to for its orders; originating 3PL sees inventory/order status at the node, not the node's other clients).

RLS extended with grant-based policies. Automated cross-tenant isolation suite. Access audit log visible to both parties.

4. Acceptance Criteria

Two test 3PLs complete an agreement, and the originating 3PL places 500 units of a brand's SKU at the node via a transfer that the node receives.

The node can see the network client's SKU data and inventory but no data about the originating 3PL's other clients (automated isolation tests).

The originating 3PL sees the node's inventory for its network client in real time but nothing else from the node.

Every cross-tenant read appears in both parties' access audit log.

Terminating an agreement blocks new inbound and routing immediately and starts the inventory exit workflow.

5. Non-Functional & Security Requirements

Requirement

Detail

Isolation

Grant-based RLS with deny-by-default. Third-party security review of the cross-tenant model before any pilot.

Auditability

Cross-tenant access logged immutably and visible to both parties.

Legal

Agreement templates reviewed by counsel. E-acceptance records retained.

6. Implementation Task Breakdown: Sprint 9

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Membership] ──> [Step 2: Agreements] ──> [Step 3: Placement] ──> [Step 4: Boundaries]



Step 1: Network Membership & Facility Profiles

Goal: Let 3PLs join and show what they offer.

Task 1.1: Profiles & Capacity Publishing

Capabilities, capacity, verified metrics.

Step 2: Network Agreements Workflow

Goal: Formalise partnerships inside the product.

Task 2.1: Agreement Lifecycle

Request, terms, e-accept, amend, suspend, terminate.

Task 2.2: Node Rate Cards

Rates the node charges the originating 3PL.

Step 3: Network Clients & Inventory Placement

Goal: Put a brand's stock in a partner's building.

Task 3.1: Network Client Mirroring

Restricted catalog subset.

Task 3.2: Cross-Tenant Transfers & Receiving

Transfer → node ASN → receive.

Step 4: Cross-Tenant Grants, RLS & Audit

Goal: Make sharing safe and provable.

Task 4.1: Grant Model & Policies

Deny-by-default grant RLS.

Task 4.2: Isolation Suite & Access Audit

Automated tests, shared audit log, external review.

7. Sprint Delivery Milestones

Milestone 1 — Membership (Target: Day 2)

Profiles and capacity published.

Milestone 2 — Agreements (Target: Day 5)

Agreements signed in-app.

Milestone 3 — Placement (Target: Day 8)

Inventory placed and received at a node.

Milestone 4 — Boundaries & Sign-Off (Target: Day 10)

Isolation suite and external review passed.

8. Open Questions Carried Into This Sprint

Liability and insurance model between network partners: platform-standard terms, or fully negotiated per agreement?

May brands see which partner 3PL holds their stock (transparency), or is the node white-labelled behind the originating 3PL?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 10 can start.



End of Phase 3 · Sprint 9 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 9 of 15  |  Page