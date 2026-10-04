Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 9 of 19

Sprint 9: Waves & Picking

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 7–11 — Warehouse Execution

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 8: Orders, Holds & Allocation

Unlocks next

Phase 1 · Sprint 10: Pack & Ship

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 9 is to turn allocated orders into efficient, error-proof picking work: supervisors build and release waves, and pickers execute single, batch (multi-order cart) or zone picks on the floor workspace, following the walk sequence, with realtime coordination so several pickers can work the same wave without collisions.

By the end of this sprint:

Supervisors can build waves by strategy and filters and release them to the floor.

Pickers can claim and execute pick tasks with scan-confirmation into totes/cart positions.

Multiple pickers can work one wave concurrently with no duplicate picks.

Short picks are handled safely, with automatic count tasks.

A live wave progress board shows status per wave, zone and picker.

Out of scope for this sprint: AI TSP route optimisation and dynamic slotting (Phase 3), put-wall consolidation (Phase 2+), labour standards (Phase 4).

Dependency: Sprint 8 must be signed off before this sprint starts. Sprint 8 (allocations), Sprint 6 (flow framework), Sprint 3 (walk sequence).

2. User Stories

As a Supervisor, I want to group orders into waves by carrier cutoff so that the trucks leave full and on time.

As a Floor Worker, I want to pick for many orders in one trip with a cart of totes so that I walk less.

As a Floor Worker, I want the next pick to always be the closest one along my path so that I never backtrack.

As a Supervisor, I want several pickers on one big wave without them grabbing the same item so that we finish faster without errors.

As a Floor Worker, I want an easy way to report that a bin is empty so that I can keep going and the problem gets fixed.

3. Functional Requirements

3.1 Wave Builder

Strategies: single-order, batch (N orders per cart, up to 24 totes), wave (by carrier cutoff, client, priority, order profile e.g. single-unit orders), zone (split tasks by zone).

Filters + preview (orders, units, lines, zones touched), release to floor, and cancel/unrelease before picking starts.

3.2 Pick Task Generation

From allocations: tasks per location × SKU × lot, with qty and target tote/order. Sequenced by walk sequence.

Zone strategy: tasks tagged by zone. Orders touching several zones consolidate at the pack station (the Sprint 10 pack flow gathers all totes for an order).

3.3 Floor Pick Flow

Start: scan cart/totes and bind tote positions to orders (batch), or get the next task (wave/zone).

Per task: location card showing the full path (Wing › Area › Aisle › Bay › Level › Position, or floor cell/lane) and a simple aisle diagram → scan location → scan container LPN if the stock is on a pallet/case → product card with photo → scan SKU → confirm lot (lot-controlled) → scan each serial (unique items, qty auto-counts) → scan destination tote → success.

Rotation & identity enforcement: the scanned location, container, lot and serial must match the allocation. A different lot that breaks the SKU's rotation rule (FIFO/FEFO/LIFO), an expired or short-dated lot, or a serial not in stock at that location triggers the error lock. A supervisor PIN override with a reason reallocates if the substitute is valid, and the override is logged.

Task claiming: atomic claim of the next N tasks per picker, with realtime release of unclaimed tasks and reassignment by the Supervisor.

3.4 Exceptions

Short pick (bin empty/insufficient): record the found qty, deallocate the remainder, attempt reallocation from another location, and if none is available flag the order (per partial policy). Automatically create a count task for the location.

Damaged item: move to damaged status + short-pick path.

3.5 Wave Progress Board

Realtime board: waves by status, % picked, per-zone and per-picker progress, open exceptions, carrier cutoff countdown.

4. Acceptance Criteria

A batch of 24 orders on one cart is picked with every unit landing in the correct tote (tested with 3 first-time pickers).

Three pickers on one wave complete it with zero duplicate picks and zero orphan tasks.

Tasks are presented strictly in walk-sequence order for each picker's claimed set.

A short pick deallocates, reallocates from an alternate location when stock exists there, and creates a count task.

Scanning a newer lot for a FIFO SKU (or an older lot for a LIFO SKU) locks the screen, and only a supervisor override with a reason allows the substitution.

Picking a serialised SKU records exactly which serials went into which tote and order.

5. Non-Functional & Security Requirements

Requirement

Detail

Concurrency

Task claiming via SELECT … FOR UPDATE SKIP LOCKED, with no double claims under 20 concurrent pickers.

Performance

Wave release of 500 orders <5s. Next-task fetch <150ms.

Realtime

Board and picker screens reflect other pickers' progress within 1s.

Accuracy

Pick accuracy ≥99.8% in pilot (measured at pack verification).

6. Implementation Task Breakdown: Sprint 9

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Wave & Task Schema] ──> [Step 2: Wave Builder] ──> [Step 3: Floor Pick Flow] ──> [Step 4: Exceptions & Board]



Step 1: Wave, Pick Task & Tote Binding Schema

Goal: Model picking work and its concurrency controls.

Task 1.1: Migrations & RLS

waves, pick_tasks, tote_bindings, pick_exceptions.

Task 1.2: Pick Event Types

pick.confirmed, pick.short, wave.released, tote.bound.

Step 2: Wave Builder & Task Generation

Goal: Let Supervisors create efficient work.

Task 2.1: Wave Builder UI & Preview

Strategy + filters + preview + release.

Task 2.2: Task Generation Service

Allocation → tasks, walk-sequence ordering, zone tagging.

Step 3: Floor Pick Flow & Task Claiming

Goal: Make picking fast and error-proof for any worker.

Task 3.1: Cart/Tote Binding Flow

Scan cart + totes → bind to orders.

Task 3.2: Pick Step Flow

Location → SKU/lot → qty → tote, with consume-to-tote via inventory RPC (allocated → picked-in-tote).

Task 3.3: Atomic Claiming & Realtime Sync

SKIP LOCKED claims, realtime task updates, supervisor reassignment.

Step 4: Short-Pick Handling & Wave Progress Board

Goal: Handle reality on the floor and make progress visible.

Task 4.1: Short-Pick & Damage Paths

Deallocate → reallocate → count task → order flag.

Task 4.2: Wave Progress Board

Realtime board with cutoff countdown.

Task 4.3: Multi-Picker Concurrency Test

20-picker simulation + a 3-person live test.

7. Sprint Delivery Milestones

Milestone 1 — Picking Data Layer (Target: Day 2)

Schema and event types deployed.

Milestone 2 — Waves Released (Target: Day 4)

Waves built and released with correctly sequenced tasks.

Milestone 3 — Floor Picking (Target: Day 7)

Batch and wave picking executable end-to-end on handhelds.

Milestone 4 — Concurrency, Exceptions & Sign-Off (Target: Day 10)

Multi-picker test passes. Short-pick path and board live.

8. Open Questions Carried Into This Sprint

Maximum tasks claimed per picker at once (proposal 10, releasing idle claims after 5 minutes).

Where inventory sits while picked but not packed: a tote container location (recommended) or an 'in-transit' virtual location?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 10 can start.



End of Phase 1 · Sprint 9 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 9 of 19  |  Page