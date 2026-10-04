Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 2 of 15

Sprint 2: Pick Path Optimisation (TSP Routing) & Smarter Batching

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Dynamic Slotting & Route Optimisation (Master PRD §6.4.1)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 1: Operational Data Foundation, AI Platform & Savings Measurement

Unlocks next

Phase 3 · Sprint 3: Dynamic Slotting: Velocity & Affinity Analysis, Slot Recommendations & Re-Slot Tasks

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to cut picker walking. Phase 1 orders pick tasks by a fixed walk sequence. This sprint replaces that with a route solver (travelling salesperson problem, TSP) over the Sprint 1 facility graph, and batches orders so each cart trip is as short as possible. The target from the master PRD is 30–45% less travel distance.

By the end of this sprint:

A route solver orders each picker's claimed tasks along the shortest path, with no backtracking, respecting one-way aisles and ending at the right pack station.

A batching optimiser groups orders into cart batches that minimise total route distance, within cutoff and cart-capacity constraints.

The floor workspace shows the next location on a simple aisle map with a route line.

Savings are measured against the Sprint 1 baseline in shadow, then assist, then auto mode.

Out of scope for this sprint: moving SKUs to better locations (Sprint 3), congestion-aware multi-picker routing (a Phase 3 stretch), robot/AMR routing (Phase 4).

Dependency: Sprint 1 must be signed off (geometry, distance service, modes, baselines). Also uses Phase 1 · Sprint 9 waves and task claiming.

2. User Stories

As a Floor Worker, I want the system to send me along the shortest path so that I walk less and pick more.

As a Supervisor, I want orders grouped so that each cart trip covers nearby locations.

As an Ops Manager, I want to see the metres saved per pick so that I trust the change.

3. Functional Requirements

3.1 Route Solver

Input: claimed tasks (locations), start point, end point (pack station/drop zone), graph constraints. Output: ordered task list + total distance.

Algorithm: exact for small sets (≤12 stops), heuristic (e.g. largest-gap / S-shape / OR-Tools local search) above that, with a time budget of ≤150ms per request.

Re-optimises when tasks are added or removed mid-trip (short picks, reassignment).

3.2 Batching Optimiser

At wave build: cluster orders by location proximity (seed + savings heuristic) subject to cart totes, weight/volume and cutoff priority. Returns batches + expected distance vs the Phase 1 method.

Supervisors see the optimiser's suggested batches and can accept, adjust or ignore them (assist mode). Auto mode builds them directly.

3.3 Floor Route Guidance

Aisle map component (from the geometry model) showing the current position, next location and route line. Stays simple and large on handhelds. Text-first fallback on small screens.

3.4 Measurement

Per wave: planned vs actual distance, metres per pick, picks per hour, compared with baseline and A/B zones.

4. Acceptance Criteria

On a benchmark set of 1,000 historical batches, optimised routes are ≥30% shorter than walk-sequence routes on average.

The route solver responds in <150ms for up to 60 stops.

In a 2-week assist-mode pilot, measured metres per pick drop by ≥25% vs baseline, with no increase in pick errors.

A short pick mid-trip re-optimises the remaining route without the picker noticing a delay.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Solver <150ms p95. Batching of 500 orders <10s.

Safety

Falls back to walk sequence if the solver fails or times out.

Explainability

Supervisors can see why batches were formed (shared zones, distance saved).

6. Implementation Task Breakdown: Sprint 2

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Solver] ──> [Step 2: Batching] ──> [Step 3: Route UI] ──> [Step 4: Pilot]



Step 1: Route Solver Service

Goal: Compute the shortest route fast.

Task 1.1: Solver Implementation & Benchmarks

Exact + heuristic, time budget, benchmark harness.

Task 1.2: Platform Integration & Fallback

Called at claim time, fallback to walk sequence.

Step 2: Batching Optimiser

Goal: Group orders into the shortest trips.

Task 2.1: Clustering with Constraints

Tote, weight, cutoff constraints.

Task 2.2: Wave Builder Integration

Suggestions in assist mode, auto mode.

Step 3: Floor Route Guidance

Goal: Show workers where to go next.

Task 3.1: Aisle Map Component

Current/next/route line, small-screen fallback.

Step 4: Shadow → Assist Pilot & Measurement

Goal: Prove the travel savings on real floors.

Task 4.1: Shadow Run

One week of logged routes.

Task 4.2: Assist Pilot & Savings Report

Two-zone A/B, savings dashboard.

7. Sprint Delivery Milestones

Milestone 1 — Solver Benchmarked (Target: Day 3)

≥30% improvement on the historical benchmark.

Milestone 2 — Batching (Target: Day 5)

Optimised batches in the wave builder.

Milestone 3 — Route UI (Target: Day 7)

Route guidance on handhelds.

Milestone 4 — Pilot & Sign-Off (Target: Day 10)

Pilot savings measured and accepted.

8. Open Questions Carried Into This Sprint

Should routes account for congestion (several pickers in one aisle) in this sprint, or later?

Where does auto mode require supervisor opt-in (per wave) vs being on by default?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 3 can start.



End of Phase 3 · Sprint 2 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 2 of 15  |  Page