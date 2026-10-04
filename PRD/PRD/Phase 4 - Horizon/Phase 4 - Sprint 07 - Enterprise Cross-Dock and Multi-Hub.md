Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 7 of 15

Sprint 7: Enterprise Cross-Dock & Multi-Hub Flow-Through

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

Enterprise Cross-Dock & Multi-Hub Dock/Yard Scheduling (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 6: Dock Appointment Scheduling & Yard Management

Unlocks next

Phase 4 · Sprint 8: Labour Management: Engineered Standards & Performance Tracking

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to support cross-docking: inbound freight goes straight to outbound without being put away, whether pre-allocated (planned cross-dock by PO/store) or opportunistic (inbound stock immediately fills waiting backorders). It also supports hub-and-spoke flows between a 3PL's hubs, as large retail and B2B operations need.

By the end of this sprint:

Planned cross-dock: inbound ASNs with pre-assigned outbound destinations (stores/DCs/orders) are received and routed directly to outbound staging.

Opportunistic cross-dock: at receiving, the system detects waiting backorders and directs stock to pack/stage instead of storage.

Hub-and-spoke: consolidated linehaul between hubs, with pallets/cartons tracked through each hub.

Cross-dock-specific billing (per pallet/carton handled, no storage) and dwell-time metrics.

Out of scope for this sprint: freight brokerage/TMS, customs bonded cross-dock operations.

Dependency: Sprint 6 must be signed off (dock/yard). Also uses Phase 2 · Sprint 10 SSCC/pallets/loads, Phase 2 · Sprint 11 EDI and Phase 3 · Sprint 8 transfers.

2. User Stories

As a 3PL serving retail distribution, I want inbound pallets for stores sent straight to outbound doors so that they spend hours, not days, in the building.

As an Ops Manager, I want received stock to fill backorders immediately so that customers get orders sooner.

As a multi-hub 3PL, I want freight tracked through each hub so that nothing is lost between buildings.

3. Functional Requirements

3.1 Planned Cross-Dock

ASN lines with outbound allocations (store/DC/order, from EDI 856/940 or brand input). Receiving shows the destination → staging lane by outbound load → load verification (Phase 2 Pick-Stage-Load).

Relabelling/SSCC generation for outbound where needed.

3.2 Opportunistic Cross-Dock

At receipt, check backorders/open demand for the SKU → suggest a direct-to-pack/stage path instead of putaway (rules per client/SKU).

3.3 Hub-and-Spoke

Linehaul loads between hubs (Phase 3 transfer model extended to multi-leg). Handling-unit tracking per hub (arrived, sorted, departed). Exceptions for missing units.

3.4 Billing & Metrics

Cross-dock charge types (per pallet/carton handled, relabel, sort) via the Phase 2 charge engine. Dock-to-dock dwell metrics and alerts.

4. Acceptance Criteria

A planned cross-dock ASN of 20 pallets for 5 stores is received and staged to the correct 5 loads without any putaway, and 856s are sent for the outbound loads.

A received SKU with 12 backorders directs 12 units to pack, and the rest go to putaway.

A 3-hub linehaul tracks every handling unit through each hub, and a missing pallet raises an exception at the next hub.

Cross-dock charges are billed with no storage charges for flow-through units.

5. Non-Functional & Security Requirements

Requirement

Detail

Throughput

Receiving-to-stage decisions <300ms per handling unit.

Integrity

Every handling unit has a continuous custody chain across hubs.

6. Implementation Task Breakdown: Sprint 7

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Planned XD] ──> [Step 2: Opportunistic XD] ──> [Step 3: Hub & Spoke] ──> [Step 4: Billing]



Step 1: Planned Cross-Dock

Goal: Flow pre-allocated freight straight through.

Task 1.1: Outbound Allocations on ASNs & Receive-to-Stage

EDI/brand input, staging by load, relabel.

Step 2: Opportunistic Cross-Dock

Goal: Fill backorders from the dock.

Task 2.1: Demand Check at Receipt & Direct-to-Pack

Rules per client/SKU.

Step 3: Multi-Hub Linehaul & Custody Tracking

Goal: Track freight across hubs.

Task 3.1: Multi-Leg Transfers & Hub Scans

Arrive/sort/depart, exceptions.

Step 4: Cross-Dock Billing & Dwell Metrics

Goal: Bill and measure flow-through work.

Task 4.1: Charge Types & Dwell Dashboard

Charges, dwell alerts.

7. Sprint Delivery Milestones

Milestone 1 — Planned XD (Target: Day 3)

Planned cross-dock working.

Milestone 2 — Opportunistic XD (Target: Day 5)

Backorder direct-to-pack working.

Milestone 3 — Hub & Spoke (Target: Day 8)

Multi-hub custody tracked.

Milestone 4 — Sign-Off (Target: Day 10)

Billing and metrics live.

8. Open Questions Carried Into This Sprint

Do target customers need bonded (customs) cross-dock support (a separate compliance scope)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 8 can start.



End of Phase 4 · Sprint 7 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 7 of 15  |  Page