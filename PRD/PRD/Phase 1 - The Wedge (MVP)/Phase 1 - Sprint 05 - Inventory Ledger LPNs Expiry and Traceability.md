Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 5 of 19

Sprint 5: Inventory Ledger, LPNs, Expiry & 'Where Is It?' Traceability

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 3–5 — Inventory Core

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 4: SKU Catalog, Unique vs Non-Unique Tracking & FIFO-FEFO-LIFO Rules

Unlocks next

Phase 1 · Sprint 6: Web Floor Workspace (Scanning, Feedback, Printing)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 5 is to build the inventory ledger: the real-time answer to "exactly where is this item?": which location (full address), which container (pallet/case/tote LPN), which lot with which dates, which serial/unique ID, and in what status. It also keeps the complete history of every unit's movements. It's implemented as a projection of warehouse events. Quantities change only through atomic RPCs that write an event and update balances in the same transaction.

As with the event backbone, correctness comes before UI. The projection, locking and rebuild logic are validated with concurrency and property-based tests before any floor workflow writes to them.

By the end of this sprint:

Inventory balances exist by facility × location × container (LPN) × SKU × lot × serial × status.

Every unique (serialised) unit has its own record showing current location, container, lot, status and full history.

Lots carry manufacture date, expiry and first-received date, and an expiry-status job flags near-expiry and moves expired stock to 'expired'.

A 'Where is it?' search finds any SKU, lot, serial/unique ID, LPN or location and shows exact addresses and a movement timeline.

Moves, adjustments and status changes are atomic, audited and concurrency-safe.

Inventory can be viewed by SKU, location, lot/expiry and client, with full transaction history.

A nightly job proves live balances equal a full rebuild from events.

Out of scope for this sprint: receiving (Sprint 7) and picking (Sprint 9) producers, allocation logic (Sprint 8), cycle counts (Sprint 11), and the floor-worker UI for moves (the Sprint 6 shell uses these RPCs).

Dependency: Sprint 4 must be signed off before this sprint starts. Sprint 2 (event store + consumer queue), Sprint 3 (locations), Sprint 4 (SKUs, lots, tracking rules).

2. User Stories

As a Supervisor, I want to see exactly where every unit of a SKU is, by lot and expiry, so that I can answer a client's question in seconds.

As an Ops Manager, I want every inventory change to carry a reason and a person so that shrinkage can be investigated.

As an engineer, I want inventory to be impossible to corrupt through concurrent operations so that we can promise 99.5%+ accuracy.

As a Supervisor, I want to put stock on hold or mark it damaged so that it can't be allocated to orders.

As a Brand client (via the 3PL), I want to know exactly which serial numbers are in stock and where each one is so that warranty and theft questions are answered instantly.

As an Ops Manager, I want pallets tracked as licence plates so that moving a pallet moves everything on it in one scan.

As a Quality Manager, I want expired stock blocked automatically and near-expiry stock reported to the brand so that nothing expired ever ships.

3. Functional Requirements

3.1 Ledger Schema

lots (lot_number, mfg_date, expiry_date, first_received_at, expiry_status), serials (serial or generated unique ID, sku, lot?, current location, current container, status, first_received_at), containers (LPN barcode, type [pallet|case|tote|cart], parent container, current location, status), inventory_balances (unique key facility, location, container, sku, lot, serial, status), inventory_transactions (append-only, links event_id, from/to location & container), adjustment_reasons.

Check constraint qty ≥ 0 on balances. Serial balances have qty ∈ {0,1}. A serial can exist in exactly one place at a time (unique constraint).

3.2 Containers / Licence Plates (LPN)

Create/print LPNs (Sprint 6 printing), nest containers (pallet → cases → totes), and place containers in locations.

move_container(lpn, to_location) moves the container and everything inside it atomically (one event, per-item transactions).

Break down / consolidate containers (move contents between LPNs).

3.3 Expiry Status Management

Nightly (and on-receipt) job sets each lot's expiry status: OK → near-expiry (within the SKU's warning window) → expired.

Expired stock moves automatically to the 'expired' status (not allocatable). Near-expiry list per client with CSV export and email to the 3PL (brand notifications in Phase 2 portal).

Dates are editable only via an audited correction with a reason (e.g. mis-keyed expiry).

3.4 Atomic Inventory RPCs

move_inventory(from_location, from_container?, to_location, to_container?, sku, lot?, serial?, qty, status).

adjust_inventory(location, sku, lot?, qty_delta, reason_code, note). Above-threshold adjustments create a pending approval instead of posting.

change_inventory_status(location, sku, lot?, qty, from_status, to_status, reason).

receive_into(location, sku, lot data, qty) and consume_from(...): internal primitives for the Sprint 7/9/10 producers.

Tracking-class enforcement: lot required for lot-controlled SKUs, serial required (qty 1 each) for unique SKUs, no lot/serial for non-unique SKUs.

Each RPC: validates scope + tracking rules → locks balance rows → writes warehouse_event → writes transactions → updates balances, all in one transaction.

3.5 Projection Consumer & Reconciliation

For events produced outside the RPCs (e.g. migration opening balances), a projection consumer applies them idempotently.

Nightly rebuild_and_compare job per facility, with the mismatch report and alert.

3.6 'Where Is It?' Search & Traceability

One search box (scan or type) accepting SKU, barcode, lot, serial/unique ID, LPN, location code or order number.

Results show every matching unit/quantity with the full location path (Building › Wing › Area › Aisle › Bay › Level › Position, or floor cell/lane), container LPN, lot, dates, status and quantity.

Item history timeline for any serial, lot or LPN: every receipt, putaway, move, pick, count, adjustment and shipment, with who, when, device and from → to addresses.

Location contents view for any address (what's here, in which containers, which lots/serials).

3.7 Inventory Views

By SKU (totals by status, per location/lot), by location (contents), by lot/expiry (rotation view with days-to-expiry and received dates), by serial, by LPN, by client (summary).

Transaction history with filters, links to the source event, actor and device.

Adjustment approval queue for Supervisors.

4. Acceptance Criteria

50 concurrent move_inventory calls draining the same balance never produce a negative balance, and total quantity is conserved.

Every transaction links to exactly one event. Rebuilding balances from events on a 1M-event dataset equals live balances.

Moving a lot-tracked SKU without a lot is rejected. Moving a serial with qty > 1 is rejected.

An above-threshold adjustment appears in the approval queue and changes nothing until approved.

Searching a serial returns exactly one current address (full path + LPN) and a complete history timeline from receipt to now.

Moving a pallet LPN containing 3 SKUs/5 lots updates all contents to the new address in one atomic operation, and each item's history shows the move.

A lot reaching its expiry date moves to 'expired' status by the next run and can't be allocated. Near-expiry lots appear on the near-expiry report.

'Where is it?' returns results in <3 seconds for a facility with 500k balance rows.

5. Non-Functional & Security Requirements

Requirement

Detail

Correctness

Property-based tests (random operation sequences) assert conservation and non-negativity.

Performance

Inventory RPC p95 <80ms. By-SKU view <1s at 100k balance rows.

Concurrency

Deterministic lock ordering (by balance key) to avoid deadlocks. Retry on serialization failure.

Data isolation

Balances and transactions scoped by org + facility + client via the Sprint 1 helpers.

6. Implementation Task Breakdown: Sprint 5

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Ledger Schema] ──> [Step 2: Atomic RPCs] ──> [Step 3: Projection & Rebuild] ──> [Step 4: Views & QA]



Step 1: Ledger Schema, Constraints & RLS

Goal: Create a ledger that structurally can't hold invalid states.

Task 1.1: Migrations

Lots (with dates & expiry status), serials/unique IDs, containers (LPN, nesting), balances (with container), transactions (from/to location & container), adjustment reasons. Constraints (one place per serial) and indexes for search.

Task 1.2: RLS

Scoped read policies. Writes only via security definer RPCs, with direct table writes revoked.

Step 2: Atomic Inventory Operations

Goal: Implement the only permitted ways to change stock.

Task 2.1: Core Primitives

Shared PL/pgSQL for lock → event → transaction → balance update.

Task 2.2: Move / Adjust / Status / Receive / Consume RPCs

Tracking-class validation (non-unique / lot / serial), approval threshold on adjustments.

Task 2.3: Container (LPN) RPCs

Create, nest, move_container, break down/consolidate.

Step 3: Projection Consumer & Nightly Reconciliation

Goal: Prove the ledger always matches the event history.

Task 3.1: Projection Consumer

Idempotent apply for externally produced quantity events.

Task 3.2: Rebuild & Compare Job

Scheduled per facility. Mismatch report table and alerting.

Task 3.3: Expiry Status Job

Nightly + on-receipt status update, auto-move to expired, near-expiry report/email.

Step 4: Inventory Views, Approval Queue & Test Suites

Goal: Make inventory visible and prove it's correct.

Task 4.1: Inventory Screens

By SKU / location / lot-expiry / serial / LPN / client + transaction history.

Task 4.2: 'Where Is It?' Search & Item Timeline

Unified search (SKU, barcode, lot, serial/UID, LPN, location, order), full-path results, history timeline per serial/lot/LPN, location contents view.

Task 4.3: Adjustment Approval Queue

Approve/reject with note, which posts the adjustment.

Task 4.4: Concurrency & Property Tests

50-writer contention test, random sequences, 1M-event rebuild.

7. Sprint Delivery Milestones

Milestone 1 — Ledger Data Layer (Target: Day 3)

Schema, constraints and RLS deployed. Direct writes blocked.

Milestone 2 — Atomic Operations (Target: Day 6)

All RPCs pass validation and concurrency tests.

Milestone 3 — Reconciliation (Target: Day 8)

Rebuild-and-compare passes on a 1M-event dataset.

Milestone 4 — Views, Search & Sign-Off (Target: Day 10)

Inventory screens, 'Where is it?' search, item timelines and the expiry job live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Approval threshold defaults (proposal: >10 units or >5% of the location balance).

Should 'allocated' be a balance status (as designed) or a separate reservation table? The current design keeps one source of truth. Confirm before Sprint 8.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 6 can start.



End of Phase 1 · Sprint 5 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 5 of 19  |  Page