Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 14 of 15

Sprint 14: Kitting & Bundling, FEFO Hard-Lock and Lot Genealogy with 30-Minute Mock Recall

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Kitting, Bundling & Regulated Traceability (Master PRD §6.3.9)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 13: Connector Wave 2 (50+ Total), Outbound Webhooks, GraphQL & Developer Portal

Unlocks next

Phase 2 · Sprint 15: Multilingual Floor Workspace, SOC 2 Readiness & Phase 2 Launch Readiness

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to support two capabilities design partners in consumer goods and regulated categories need. First, kits and bundles: virtual bundles sold across channels without pre-assembly, and physical kitting work orders with labour tracking. Second, regulated traceability: the rotation lock (FIFO / FEFO / LIFO) that Phase 1 enforces at picking is extended to pack verification and kitting, plus full lot genealogy, and a mock-recall report in under 30 minutes (FDA 21 CFR Part 11 / cGMP readiness).

By the end of this sprint:

Virtual bundles publish availability to channels based on their components and are exploded into components for picking and packing.

Physical kitting work orders consume components, produce kit SKUs, and track labour for billing.

Floor flows hard-lock scans of expired or out-of-sequence lots under FEFO/FIFO rules.

A mock-recall report lists every order, customer and location for a given lot within 30 minutes (target: seconds).

Out of scope for this sprint: electronic signatures/full 21 CFR Part 11 validation package (documentation support only), serialisation for DSCSA pharma (Phase 3+ candidate).

Dependency: Sprint 13 must be signed off (bundles publish through all connectors). Also uses the Phase 1 · Sprint 4 kit definitions and Sprint 2 VAS labour charges.

2. User Stories

As a Brand client, I want to sell a 3-pack bundle on Shopify without pre-building it so that I don't tie up inventory.

As an Ops Manager, I want kitting work orders for holiday gift sets so that assembly is tracked, and billed.

As a 3PL serving supplement brands, I want the scanner to refuse an expired or later-expiring lot so that FEFO is guaranteed.

As a Quality Manager, I want a complete recall report for a lot in minutes so that we pass FDA mock recalls.

3. Functional Requirements

3.1 Virtual Bundles

Bundle availability = min over components of floor(available ÷ qty per bundle), pushed via channel_sync.

Order ingestion explodes bundle lines into component lines (keeping the parent reference for packing slips and billing). Pack screen shows the bundle grouping.

3.2 Physical Kitting Work Orders

Work order: kit SKU, quantity, components (BOM), location, due date. Floor flow: pick components → assemble (timer) → scan output → put away finished kits.

Inventory: components consumed, kits produced (lot inheritance rules: kit takes the earliest component expiry). Labour minutes → VAS charges.

3.3 Rotation Hard-Lock (FIFO / FEFO / LIFO) Everywhere

Phase 1 · Sprint 9 enforces the rotation rule at picking. This sprint extends the same lock to pack verification, kitting component picks, replenishment moves and transfers.

Scanning a lot that isn't the allocated one, breaks the SKU's rotation rule, or is expired/short-dated for the client's minimum shelf life triggers an error lock. Supervisor override with a reason, logged, with a rotation-compliance report per client.

3.4 Lot Genealogy & Mock Recall

Genealogy graph: supplier lot → receipt → locations → kits (component → kit lot) → orders → shipments → end customers.

Mock recall report: input lot(s) → units received, on hand by location, shipped (orders, customers, ship dates, tracking), consumed into kits (and those kits' shipments), with PDF/CSV export and a time-to-generate stamp.

Quarantine action: one click moves all on-hand stock of a lot to hold and blocks allocation.

4. Acceptance Criteria

A bundle of 2×A + 1×B with A=10 and B=3 publishes 3 available. An ordered bundle is picked as components.

A kitting work order of 50 kits consumes the right components, produces 50 kit units with the earliest component expiry, and creates labour charges.

Scanning a later-expiring lot during a FEFO pick locks the screen until a supervisor overrides it.

A mock recall for a lot that shipped in 1,200 orders and 30 kits generates a complete report in <1 minute.

The quarantine action blocks new allocations of the lot immediately.

5. Non-Functional & Security Requirements

Requirement

Detail

Traceability

Genealogy is derived from immutable events. The report is reproducible and time-stamped.

Performance

Mock recall <1 min for 1M lot-related events.

Compliance support

Audit trail of overrides and quarantines suitable for cGMP audits.

6. Implementation Task Breakdown: Sprint 14

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Bundles] ──> [Step 2: Kitting] ──> [Step 3: FEFO Lock] ──> [Step 4: Genealogy]



Step 1: Virtual Bundles

Goal: Sell bundles without pre-assembly.

Task 1.1: Bundle ATS in channel_sync

Component-based availability.

Task 1.2: Order Explosion & Pack Grouping

Component lines with parent references.

Step 2: Physical Kitting Work Orders

Goal: Track assembly and bill it.

Task 2.1: Work Order Schema & UI

BOM, qty, due, status.

Task 2.2: Kitting Floor Flow

Pick components, assemble timer, output, put away, lot inheritance.

Step 3: FEFO/FIFO Hard-Lock

Goal: Make wrong-lot shipments impossible without an override.

Task 3.1: Lot Enforcement in Flows

Pick, pack and kitting validators, supervisor override.

Step 4: Lot Genealogy, Mock Recall & Quarantine

Goal: Answer 'where did this lot go?' in minutes.

Task 4.1: Genealogy Queries

Event-derived graph, indexed.

Task 4.2: Mock Recall Report & Quarantine Action

PDF/CSV, timing stamp, one-click hold.

7. Sprint Delivery Milestones

Milestone 1 — Virtual Bundles (Target: Day 3)

Bundle availability and explosion work across connectors.

Milestone 2 — Kitting (Target: Day 6)

Work orders run end-to-end with billing.

Milestone 3 — FEFO Hard-Lock (Target: Day 8)

Lock enforced in all flows.

Milestone 4 — Mock Recall & Sign-Off (Target: Day 10)

Recall report <1 min. Quarantine works.

8. Open Questions Carried Into This Sprint

Kit lot rule: inherit the earliest component expiry (proposed) or assign a new kit lot with its own expiry?

Do regulated design partners need electronic signatures on overrides/quarantines in Phase 2?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 15 can start.



End of Phase 2 · Sprint 14 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 14 of 15  |  Page