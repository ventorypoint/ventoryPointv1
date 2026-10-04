Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 10 of 19

Sprint 10: Pack & Ship

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 7–11 — Warehouse Execution

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 9: Waves & Picking

Unlocks next

Phase 1 · Sprint 11: Cycle Counting & Replenishment

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 10 is to close the outbound loop: a packer verifies every item by scan, chooses a carton, records weight and dimensions, prints the packing slip and shipping label, and confirms shipment. Inventory is consumed exactly once and tracking is captured. Label creation goes through a pluggable ShippingProvider interface, so ShipStation (Sprint 13) and the Phase 2 native Small Parcel Suite slot in without changing the pack flow.

By the end of this sprint:

Packers complete scan-verified packing for single and multi-carton orders.

Packaging materials are selected and recorded per carton.

Packing slips print with the client's logo. Labels print through the provider interface (manual-tracking provider now).

Orders are marked shipped with tracking, and inventory is consumed.

Out of scope for this sprint: native multi-carrier rate shopping, USB scale auto-read and dual retail labels (Phase 2), photo capture (Phase 2 Dispute Shield), cartonization recommendations (Phase 3).

Dependency: Sprint 9 must be signed off before this sprint starts. Sprint 9 (picked totes), Sprint 6 (printing), Sprint 5 (consume).

2. User Stories

As a Packer, I want to scan each item into the box so that a wrong or missing item is caught before the parcel leaves.

As a Packer, I want the packing slip and label to print automatically when I close the box so that I never mix up paperwork.

As a 3PL Owner, I want every box and packaging material recorded per order so that packaging can be billed accurately.

As a Brand client (indirectly), I want packing slips to carry my brand so that the unboxing experience feels like mine.

3. Functional Requirements

3.1 Pack Station Flow

Scan tote (or order barcode) → the order's lines appear with photos → scan each item (qty increments) → mismatch = error lock.

Unique items: scan each serial/unique ID into the carton (verifies it was picked for this order). For SKUs whose serial capture point is 'at shipment', the serials are captured here for the first time. Lot numbers are recorded per carton for lot-controlled SKUs.

Multi-tote orders (zone picking): the pack screen shows which totes are still missing, and waits or parks the order.

Select carton (scan packaging barcode or tap) → enter weight (manual in Phase 1 (MVP); scale in Phase 2) → dims default from packaging → close carton → next carton or finish.

3.2 Packaging Materials

Catalog per facility: boxes, mailers, void fill, inserts, with dims, max weight, cost and billable flag. Consumption events per carton (feeds Sprint 14).

3.3 Documents & Labels

Packing slip template (PDF): client logo, order details, lines, gift message, returns note. Auto-print on finish.

ShippingProvider interface: getRates, createLabel, voidLabel, getTracking. ManualProvider implementation: enter carrier + tracking and optionally upload a label PDF.

Label auto-print (ZPL/PDF) via the Sprint 6 print service.

3.4 Ship Confirmation

Finish pack → shipment + cartons records (with serials and lots per carton) → inventory consumed from tote (each serial marked 'shipped' with order, carton and tracking number for full traceability) → order status packed → shipped when the label/tracking exists (or at manifest/end-of-day for some carriers).

End-of-day manifest/scan-out list per carrier (printable).

4. Acceptance Criteria

Scanning an item not in the order, or one too many, blocks carton close.

A 3-carton order produces 3 carton records with packaging materials, weights and one shipment with tracking numbers.

Inventory for a shipped order is consumed exactly once (verified against the ledger), even if the finish action is retried.

The packing slip shows the correct client's logo for 3 different clients.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Pack scan response <300ms. Finish → documents printing <3s.

Idempotency

Finish-pack and label creation are idempotent (retries never double-consume or double-label).

Extensibility

ShippingProvider contract documented and tested with a mock provider for Sprint 13.

6. Implementation Task Breakdown: Sprint 10

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Pack Schema] ──> [Step 2: Pack Flow] ──> [Step 3: Docs & Provider] ──> [Step 4: Ship & Manifest]



Step 1: Shipment, Carton & Packaging Schema

Goal: Record exactly what went into every box.

Task 1.1: Migrations & RLS

packaging_materials, shipments, cartons, carton_contents.

Task 1.2: Pack/Ship Event Types

pack.item_verified, pack.carton_closed, packaging.consumed, shipment.shipped.

Step 2: Pack Station Flow

Goal: Make packing scan-verified and fast.

Task 2.1: Order/Tote Load & Verification

Line list, scan increments, mismatch lock, multi-tote waiting.

Task 2.2: Carton Build & Close

Packaging select, weight/dims entry, multi-carton.

Step 3: Packing Slips & Shipping Provider Interface

Goal: Produce correct paperwork through a pluggable label layer.

Task 3.1: Packing Slip Templates

Per-client logo/branding, PDF render, auto-print.

Task 3.2: ShippingProvider Interface & ManualProvider

Contract, mock provider, manual tracking entry.

Step 4: Ship Confirmation, Manifest & Tests

Goal: Close the order loop exactly once.

Task 4.1: Finish & Consume

Idempotent finish, consume from tote, status transitions.

Task 4.2: End-of-Day Manifest

Carrier scan-out list.

Task 4.3: End-to-End Outbound Test

Order → allocate → wave → pick → pack → ship on the device matrix.

7. Sprint Delivery Milestones

Milestone 1 — Pack Data Layer (Target: Day 2)

Schema and events deployed.

Milestone 2 — Pack Flow (Target: Day 5)

Scan-verified single and multi-carton packing works.

Milestone 3 — Documents & Labels (Target: Day 8)

Packing slips + ManualProvider labels print automatically.

Milestone 4 — Ship & Sign-Off (Target: Day 10)

Full outbound loop passes end-to-end tests.

8. Open Questions Carried Into This Sprint

Are pack-station weights mandatory in Phase 1 (MVP) (manual entry) given ShipStation needs weight for rates?

Order status 'shipped' at label creation or at carrier scan-out/manifest? (Affects channel fulfillment push timing in Sprint 12.)

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 11 can start.



End of Phase 1 · Sprint 10 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 10 of 19  |  Page