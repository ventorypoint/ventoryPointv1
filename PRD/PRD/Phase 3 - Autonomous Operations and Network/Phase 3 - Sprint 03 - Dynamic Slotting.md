Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 3 of 15

Sprint 3: Dynamic Slotting: Velocity & Affinity Analysis, Slot Recommendations & Re-Slot Tasks

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Dynamic Slotting & Route Optimisation (Master PRD §6.4.1)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 2: Pick Path Optimisation (TSP Routing) & Smarter Batching

Unlocks next

Phase 3 · Sprint 4: Predictive 3D Cartonization & Box Recommendation

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to put fast-moving products where they're quickest to pick. The system continuously analyses SKU velocity and affinity (items bought together), recommends moving high-velocity SKUs to golden-zone locations near the pack benches, and schedules the moves as floor tasks during slow hours. Combined with Sprint 2 routing, this delivers the bulk of the travel savings.

By the end of this sprint:

Each facility has a velocity (ABC) and affinity analysis per client/SKU, refreshed daily.

The slotting engine produces ranked move recommendations with the expected travel saving per move.

Approved recommendations become re-slot move tasks scheduled for slow hours, executed in the floor workspace.

Slotting impact is measured through the Sprint 1 framework.

Out of scope for this sprint: cross-client shared slotting policies (3PL decides per client), physical rack redesign recommendations, seasonal pre-slotting from forecasts (Sprint 14 feeds that later).

Dependency: Sprint 2 must be signed off (route solver used to score slot quality). Also uses Phase 1 · Sprint 3 location capacity/types and Sprint 11 replenishment.

2. User Stories

As an Ops Manager, I want the system to tell me which SKUs to move closer to packing so that pickers walk less.

As a Supervisor, I want re-slot moves scheduled when the floor is quiet so that they never slow peak picking.

As a 3PL Owner, I want to see the saving from each move so that I only spend labour on moves that pay back.

3. Functional Requirements

3.1 Velocity & Affinity Analysis

Velocity by picks and units (7/30/90-day, seasonality weighting), ABC classes per facility/client. Affinity: co-occurrence lift for SKU pairs in orders.

3.2 Slot Scoring & Recommendations

Location desirability score from the geometry (distance to pack/dock, level/ergonomics golden zone), plus fit (capacity vs SKU cube and replenishment frequency), client/temperature constraints, mixed-lot rules and rotation compatibility (e.g. LIFO-only bulk lanes only for LIFO SKUs; FIFO/FEFO SKUs kept where older lots stay reachable).

Optimisation: assign high-velocity SKUs to the best locations and co-locate high-affinity pairs, subject to capacity and move-budget limits. Output: ranked moves with expected metres saved per week and the labour cost of the move → payback.

3.3 Re-Slot Tasks

Supervisor approves a set of moves (assist) or the engine schedules them automatically within a daily move budget (auto). Tasks generated for configured slow windows. Swap handling (A↔B via a temporary location).

Floor flow reuses scan-to-move with an explicit 'Re-slot' task type. Pick faces and replenishment rules update automatically.

3.4 Impact Tracking

Predicted vs realised travel saving per move and in aggregate. Re-slot labour cost logged as internal (non-billable by default).

4. Acceptance Criteria

For a design-partner facility, recommendations predict ≥10% additional travel saving on top of Sprint 2 routing, with a payback under 2 weeks for the top 50 moves.

Approved moves generate tasks only inside configured slow windows.

After executing moves, replenishment rules and pick-face assignments point to the new locations with no manual edits.

Realised savings after 2 weeks are within ±30% of predicted.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Nightly slotting run <30 min per facility (50k SKUs, 20k locations).

Safety

Moves never violate temperature/hazmat constraints or client segregation rules.

Explainability

Each recommendation shows the velocity, affinity partners, target location score and payback.

6. Implementation Task Breakdown: Sprint 3

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Analysis] ──> [Step 2: Optimiser] ──> [Step 3: Re-Slot Tasks] ──> [Step 4: Impact]



Step 1: Velocity & Affinity Analysis

Goal: Know what moves fast and what sells together.

Task 1.1: Velocity/ABC Models

Rolling windows, seasonality weighting.

Task 1.2: Affinity Mining

Co-occurrence lift, pair lists.

Step 2: Slot Scoring & Optimisation

Goal: Find the moves that pay back fastest.

Task 2.1: Location Scoring

Distance, ergonomics, fit.

Task 2.2: Assignment Optimiser & Payback

Constrained assignment, move budget, ranked output.

Step 3: Re-Slot Tasks & Floor Execution

Goal: Execute moves without hurting throughput.

Task 3.1: Approval UI & Scheduling

Assist/auto, slow windows, swaps.

Task 3.2: Re-Slot Floor Flow & Rule Updates

Move task type, pick-face/replenishment updates.

Step 4: Impact Tracking & Pilot

Goal: Prove the realised saving.

Task 4.1: Predicted vs Realised Dashboard

Per move and aggregate.

Task 4.2: Design-Partner Pilot

Top 50 moves, 2-week measurement.

7. Sprint Delivery Milestones

Milestone 1 — Analysis (Target: Day 3)

Velocity and affinity refreshed nightly.

Milestone 2 — Optimiser (Target: Day 5)

Ranked moves with payback generated.

Milestone 3 — Re-Slot Execution (Target: Day 8)

Moves scheduled and executed on the floor.

Milestone 4 — Impact & Sign-Off (Target: Day 10)

Pilot saving measured.

8. Open Questions Carried Into This Sprint

Daily move budget default (labour hours) per facility.

Should slotting be allowed to move a client's stock into another client's former zone (segregation policy)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 4 can start.



End of Phase 3 · Sprint 3 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 3 of 15  |  Page