Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 3 of 15

Sprint 3: Autonomous Mobile Robot (AMR) Orchestration

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

Robotics & Automation Orchestration (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 2: Pick-to-Light & Put Walls

Unlocks next

Phase 4 · Sprint 4: Sortation & Automated Pack Lines

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to orchestrate collaborative AMRs (robots that travel to pick locations while people pick into them) and, where installed, goods-to-person systems (robots bring shelves or totes to a station). The platform sends pick work to the robot fleet manager, keeps humans and robots working on the same waves, and records every robot-assisted pick as a normal event.

By the end of this sprint:

At least one collaborative AMR vendor and one goods-to-person vendor are integrated through the Sprint 1 framework.

Waves can be released to robot zones, with the fleet manager optimising robot routes and the platform keeping order-level control.

Workers at goods-to-person stations use the floor workspace to confirm picks from presented totes/shelves.

Robot-zone productivity, utilisation and exceptions are visible, and savings are measured.

Out of scope for this sprint: robot fleet route planning itself (vendor fleet managers do this), robot hardware procurement.

Dependency: Sprint 2 must be signed off. Also uses Phase 3 · Sprint 2 routing (disabled in robot zones, where the fleet manager routes).

2. User Stories

As a 3PL CTO, I want our AMRs driven by the same system that holds our orders so that we don't run two warehouse systems.

As a Picker in a robot zone, I want the robot to tell me what to pick so that I just follow it.

As an Ops Manager, I want to see robot utilisation and bottlenecks so that I size the fleet correctly.

3. Functional Requirements

3.1 Collaborative AMR Integration

Adapter to the fleet manager: send pick tasks (order/tote, location, SKU, qty), receive robot assignments and pick confirmations (from the robot's screen/scanner), handle exceptions (short, damaged).

Order release rules: which orders/waves go to robot zones (by zone, SKU profile, cutoff).

3.2 Goods-to-Person Integration

Inventory in the G2P system is mirrored as locations (tote/shelf IDs). Replenishment into G2P via inbound tasks.

Station flow in the floor workspace: presented container → pick qty → put into order tote → confirm (with light/scan confirmation).

3.3 Mixed Operations

Orders spanning robot and manual zones consolidate at pack or put walls (Sprint 2). The Phase 3 SLA forecast includes robot-zone capacity.

3.4 Robot Analytics

Robot utilisation, picks/robot/hour, human picks/hour in robot zones, exception rates, charging downtime, and cost per pick vs manual.

4. Acceptance Criteria

A 500-order wave released to a simulated AMR zone completes with inventory and billing events identical in structure to manual picking.

A G2P station pick updates inventory at the tote location and the order tote correctly.

An order with lines in both robot and manual zones consolidates correctly at pack.

Robot analytics show utilisation and cost per pick for the pilot zone.

5. Non-Functional & Security Requirements

Requirement

Detail

Latency

Task dispatch to fleet manager <500ms. Confirmation → event <1s.

Resilience

Fleet manager outage → orders re-routed to manual zones after a configurable timeout.

6. Implementation Task Breakdown: Sprint 3

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: AMR] ──> [Step 2: G2P] ──> [Step 3: Mixed Ops] ──> [Step 4: Analytics]



Step 1: Collaborative AMR Adapter

Goal: Drive robot pick work from the platform.

Task 1.1: Fleet Manager Adapter & Release Rules

Tasks, assignments, confirmations, exceptions.

Step 2: Goods-to-Person Adapter & Station Flow

Goal: Support robot-presented picking.

Task 2.1: G2P Inventory Mirroring & Replenishment

Tote/shelf locations, inbound tasks.

Task 2.2: Station Flow

Present → pick → put → confirm.

Step 3: Mixed Human/Robot Operations

Goal: Run robots and people on the same waves.

Task 3.1: Consolidation & SLA Capacity

Pack/put-wall consolidation, SLA inputs.

Step 4: Robot Analytics & Pilot

Goal: Measure robot value.

Task 4.1: Utilisation & Cost-per-Pick Dashboards

Robot and human metrics.

Task 4.2: Vendor Sandbox Certification

One AMR + one G2P vendor certified.

7. Sprint Delivery Milestones

Milestone 1 — AMR (Target: Day 3)

AMR tasks flowing in the vendor sandbox.

Milestone 2 — G2P (Target: Day 6)

G2P station flow working.

Milestone 3 — Mixed Ops (Target: Day 8)

Mixed-zone waves consolidate correctly.

Milestone 4 — Sign-Off (Target: Day 10)

Analytics live. Vendors certified.

8. Open Questions Carried Into This Sprint

Which AMR vendors first (e.g. Locus, Geek+, Zebra/Fetch, Brightpick), based on partner installs?

Commercial model with robot vendors (referral partnership vs integration only).

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 4 can start.



End of Phase 4 · Sprint 3 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 3 of 15  |  Page