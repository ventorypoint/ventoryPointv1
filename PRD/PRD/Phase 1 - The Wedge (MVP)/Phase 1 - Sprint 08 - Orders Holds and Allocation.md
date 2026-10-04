Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 8 of 19

Sprint 8: Orders, Holds & Allocation

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 7–11 — Warehouse Execution

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 7: Inbound: ASNs, Receiving & Putaway

Unlocks next

Phase 1 · Sprint 9: Waves & Picking

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 8 is to create the single order model that every sales channel feeds into (Shopify, Amazon, CSV, API), with a clear lifecycle, automatic validation holds, and an allocation engine that reserves the right stock atomically according to each SKU's rotation rule (FIFO, FEFO, LIFO or a customer-specified lot), expiry and shelf-life rules, and tracking class (specific lots and serials).

By the end of this sprint:

Orders can be created via UI and CSV and move through a well-defined status machine.

Invalid orders are held automatically with actionable reasons.

Allocation reserves stock correctly and atomically, including partial/backorder policy.

Supervisors can see, filter, hold, release and cancel orders, with a full event timeline.

Out of scope for this sprint: channel ingestion (Sprint 12–13), address auto-normalisation (Sprint 12), distributed/multi-facility routing (Phase 3), B2B EDI orders (Phase 2).

Dependency: Sprint 7 must be signed off before this sprint starts. Sprint 5 (balances with allocated status), Sprint 4 (SKU tracking rules).

2. User Stories

As a Supervisor, I want every order from every channel in one list with one status model so that I can run the day from a single screen.

As an Ops Manager, I want problem orders (bad address, unknown SKU, no stock) held with a clear reason so that they're fixed before reaching the floor.

As a 3PL serving regulated brands, I want allocation to respect FEFO and minimum shelf life so that short-dated product never ships.

As a Brand whose contract specifies LIFO for certain SKUs, I want the newest stock allocated first for those SKUs.

As a B2B customer, I want to request a specific lot on my order so that I receive the lot I agreed to buy.

As a Supervisor, I want to cancel or edit an order before it's released so that client changes don't create picking errors.

3. Functional Requirements

3.1 Order Model & Status Machine

Header: client, facility, channel, external id (unique per client+channel), order date, ship-by date, priority, ship-to address, requested carrier/service, gift/packing notes, B2C or B2B_basic.

Status machine enforced server-side: imported → on_hold ↔ ready → allocated → released → picking → picked → packing → packed → shipped. Cancel is allowed until packed. Every transition is an event.

3.2 Creation & Validation

Manual create (UI), CSV import (template per client).

Validation → holds: missing/unverifiable address (full normalisation in Sprint 12), unmapped SKU (alias lookup), SKU inactive, insufficient stock, manual hold, duplicate external id.

3.3 Allocation Engine

allocate_orders(order_ids[] | facility filter): set-based, deterministic priority (priority → ship-by → order date).

Per line: eligible balances (available status, pickable locations, not expired, remaining shelf life ≥ client/customer minimum), ordered by the SKU's rotation rule: FIFO = oldest first-received date, FEFO = earliest expiry, LIFO = newest first-received date, customer lot = only the requested lot. Tie-break by pick path, then by clearing the smallest quantities. Reserve via atomic status change available→allocated.

Allocations record the exact location, container, lot and (for unique items allocated at order time) serial. For serial SKUs captured at pick, the lot/location is reserved and the serial is bound at pick.

Client policy: allow partial (ship available, backorder rest) or allocate complete orders only. Auto-allocation on ready (configurable) + manual allocate/deallocate.

3.4 Order Management UI

Order list with saved filters (status, client, channel, hold reason, ship-by), bulk actions (hold, release hold, allocate, cancel).

Order detail: lines with allocated/picked/packed/shipped quantities, allocations by location/lot, and the event timeline.

4. Acceptance Criteria

With 1 unit available and two orders needing it, concurrent allocation gives it to exactly one order (higher priority first).

A FEFO SKU with lots expiring in 30, 60 and 90 days allocates the 30-day lot first, unless it's below the minimum shelf life, in which case it's skipped.

An order with an unmapped SKU is held as 'Unmapped SKU' and allocates automatically once the alias is added and the hold is released.

An invalid status transition (e.g. shipped → picking) is rejected server-side.

A LIFO SKU with lots received on 1, 10 and 20 March allocates the 20 March lot first. The same SKU switched to FIFO allocates the 1 March lot.

An expired lot is never allocated, even if it is the oldest.

An order line requesting lot L-2291 allocates only from L-2291, or holds as 'Requested lot unavailable'.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Allocate 1,000 orders <10s. Order list <1s for 100k orders (indexed filters).

Concurrency

Allocation uses the Sprint 5 lock ordering, with no over-allocation under concurrent runs.

Integrity

Unique (client, channel, external_id) blocks duplicate imports.

6. Implementation Task Breakdown: Sprint 8

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Order Schema] ──> [Step 2: Creation & Holds] ──> [Step 3: Allocation Engine] ──> [Step 4: Order UI]



Step 1: Order Schema & Status Machine

Goal: Model orders so invalid states are impossible.

Task 1.1: Migrations & RLS

orders, order_lines, allocations, order_holds, with enums and constraints.

Task 1.2: Transition Function

transition_order(order_id, to_status) with an allowed-transition table + event write.

Step 2: Order Creation, CSV Import & Validation Holds

Goal: Get clean orders in, and hold bad ones with a reason.

Task 2.1: Manual Create & CSV Import

Form + per-client CSV templates via the import pipeline.

Task 2.2: Validation Rules & Holds

Rule set producing hold reasons, plus a release-hold action.

Step 3: Atomic Allocation Engine

Goal: Reserve exactly the right stock, safely and fast.

Task 3.1: Eligibility Query

Set-based eligible-balance selection with FEFO/FIFO, shelf life and lot rules.

Task 3.2: Allocation & Deallocation RPCs

Priority ordering, partial policy, atomic reserve.

Task 3.3: Concurrency & Performance Tests

Competing-order tests, 1,000-order benchmark.

Step 4: Order List, Detail & Timeline

Goal: Give Supervisors one screen to run order flow.

Task 4.1: Order List & Bulk Actions

Filters, saved views, bulk hold/allocate/cancel.

Task 4.2: Order Detail & Timeline

Line quantities, allocations, event timeline via the Realtime hook.

7. Sprint Delivery Milestones

Milestone 1 — Order Data Layer (Target: Day 3)

Schema, status machine and RLS deployed.

Milestone 2 — Creation & Holds (Target: Day 5)

UI/CSV orders created, with validation holds working.

Milestone 3 — Allocation Engine (Target: Day 8)

Allocation passes concurrency, FEFO and performance tests.

Milestone 4 — Order UI & Sign-Off (Target: Day 10)

Order list/detail live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Auto-allocate on 'ready' by default, or only at wave build time? (Wave-time allocation can give better lot choices; auto-allocation gives earlier stock visibility.)

Order edits after allocation: allow with automatic reallocation, or require cancel + recreate?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 9 can start.



End of Phase 1 · Sprint 8 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 8 of 19  |  Page