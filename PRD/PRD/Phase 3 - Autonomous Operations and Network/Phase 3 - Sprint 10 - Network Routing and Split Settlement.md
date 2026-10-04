Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 10 of 15

Sprint 10: Network Order Routing, Unified Merchant Command Center & Split Settlement

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Collaborative 4PL Network Grid (Master PRD §6.4.6)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 9: 4PL Network Grid: Partnerships, Capacity Sharing & Cross-Tenant Data Boundaries

Unlocks next

Phase 3 · Sprint 11: Fulfillment Marketplace: Public Directory & Verified 3PL Profiles

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to make the network work for brands with no extra effort: the originating 3PL's orders route to the best node in the network (nearest buyer with stock), the brand sees one order feed, one inventory and one invoice, and money is settled automatically between the 3PLs according to their agreement rate cards, with the platform's network fee.

By the end of this sprint:

The Sprint 8 routing engine includes partner nodes as candidates (within agreements), and routed orders are fulfilled by the node.

The brand portal shows unified orders, inventory and tracking across all nodes under the originating 3PL's branding.

Node charges flow to the originating 3PL as payables (from the node rate card). The brand is invoiced once by the originating 3PL.

Monthly settlement statements and payouts between 3PLs run automatically through Stripe Connect, with the network fee deducted.

Out of scope for this sprint: brands contracting nodes directly, cross-border network routing (Phase 4), network-level freight consolidation.

Dependency: Sprint 9 must be signed off (agreements, grants, placement). Also uses Phase 2 · Sprints 1–4 (ledger, invoicing, Stripe Connect).

2. User Stories

As a Brand client, I want East Coast orders shipped from an East Coast partner automatically, while I still deal with one 3PL.

As an originating 3PL, I want partner costs to appear as payables automatically so that my margin is always clear.

As a node 3PL, I want to be paid automatically for the orders I fulfil so that network work is as easy as my own clients.

3. Functional Requirements

3.1 Network Routing

Candidates extend to partner nodes where the network client has stock and the agreement is active. Scoring includes the node rate card cost (so the originating 3PL's margin is considered) and node SLA/capacity.

The routed order is created at the node as a fulfillment order (restricted fields). Status/tracking flows back in real time. Channel updates stay with the originating 3PL's connection.

3.2 Unified Merchant Command Center

The portal aggregates orders, inventory and tracking across own facilities and nodes. The node is labelled per the Sprint 9 transparency setting.

3.3 Payables & Brand Invoicing

Node billable events → charges on the node's ledger against the originating 3PL (as its 'client'), mirrored as payables in the originating 3PL's ledger.

The originating 3PL bills the brand at its own rates (Phase 2 invoicing). Margin report: brand revenue vs node payables per order/client.

3.4 Split Settlement

Monthly (or twice-monthly) settlement statement per agreement: node charges, disputes, adjustments, network fee. Auto-debit from the originating 3PL's balance/method to the node's Connect account. The platform network fee goes as an application fee.

Dispute workflow between 3PLs with evidence (photos, scans from Phase 2 · Sprint 5).

4. Acceptance Criteria

A brand order to New York routes to the partner node in New Jersey (stock available, cheapest within SLA), and the brand sees it in the portal like any other order.

Tracking from the node's shipment reaches the brand's Shopify store through the originating 3PL's connection within 1 minute.

For a test month, the node's charges equal the originating 3PL's payables, and the settlement statement nets correctly after the network fee.

The settlement payout is transferred in Stripe test mode to the node's connected account.

A disputed node charge is held out of settlement until resolved.

5. Non-Functional & Security Requirements

Requirement

Detail

Integrity

Double-entry consistency between node receivables and originating payables, reconciled nightly.

Latency

Status/tracking propagation from node to originating 3PL <1 minute.

Isolation

Node order records expose only granted fields (Sprint 9 grants).

6. Implementation Task Breakdown: Sprint 10

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Routing] ──> [Step 2: Command Center] ──> [Step 3: Payables] ──> [Step 4: Settlement]



Step 1: Network Routing & Node Fulfillment Orders

Goal: Send orders to the best partner node.

Task 1.1: Partner Candidates & Cost Scoring

Agreement check, node rate cost, SLA.

Task 1.2: Node Order Creation & Status Sync

Restricted fulfillment order, realtime status back.

Step 2: Unified Merchant Command Center

Goal: Show brands one network.

Task 2.1: Portal Aggregation Across Nodes

Orders, inventory, tracking.

Step 3: Node Charges, Payables & Margin

Goal: Keep every party's books right.

Task 3.1: Mirrored Charges & Payables

Node ledger ↔ originating payables.

Task 3.2: Network Margin Report

Revenue vs payables.

Step 4: Split Settlement & Disputes

Goal: Pay nodes automatically and fairly.

Task 4.1: Settlement Statements & Payouts

Netting, network fee, Connect transfers.

Task 4.2: Inter-3PL Dispute Workflow

Evidence, hold, resolution.

Task 4.3: Two-Partner Pilot

Live pilot between two design partners.

7. Sprint Delivery Milestones

Milestone 1 — Network Routing (Target: Day 3)

Orders route to partner nodes.

Milestone 2 — Command Center (Target: Day 5)

Brand sees a unified view.

Milestone 3 — Payables (Target: Day 7)

Node charges mirrored as payables.

Milestone 4 — Settlement & Sign-Off (Target: Day 10)

Settlement and payouts working. Pilot started.

8. Open Questions Carried Into This Sprint

Network fee model: % of node charges, a per-order fee, or both?

Settlement cadence and credit risk: should the platform require a deposit/credit limit for originating 3PLs?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 11 can start.



End of Phase 3 · Sprint 10 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 10 of 15  |  Page