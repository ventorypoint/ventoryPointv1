Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 6 of 15

Sprint 6: Anomaly Detection & Anomaly-Driven Cycle Counting

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Anomaly-Driven Cycle Counting (Master PRD §6.4.4)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 5: SLA Breach Prediction & Dynamic Labour Balancing

Unlocks next

Phase 3 · Sprint 7: AI Operations Copilot: Natural-Language Queries & Multilingual SOP Assistant

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to catch inventory problems before orders fail. Phase 1 counts on a schedule and after short picks. This sprint adds detection that watches floor behaviour and inventory movements, such as a picker searching a bin for more than 45 seconds, unusual adjustment patterns, or balances drifting from expected consumption. It automatically schedules targeted blind counts, so shrinkage and mis-slots are found early.

By the end of this sprint:

Anomaly detectors run continuously per facility and produce scored anomalies with the reason.

High-scoring anomalies automatically create background blind count tasks (Phase 1 count flow), prioritised by risk and order demand.

Supervisors get an anomaly feed (shrinkage risk, mis-slot, data errors), with explanations and outcomes.

Count coverage shifts from calendar-based to risk-based, while inventory accuracy stays or improves.

Out of scope for this sprint: loss-prevention investigations/CCTV integration, supplier-level quality analytics.

Dependency: Sprint 5 must be signed off. Also uses Sprint 1 telemetry (dwell/search time) and Phase 1 · Sprint 11 count tasks.

2. User Stories

As a Supervisor, I want a count triggered automatically when a picker struggles to find an item so that mis-slotted stock is fixed before the next order fails.

As an Ops Manager, I want to know about suspicious adjustment patterns so that I can investigate shrinkage early.

As a 3PL Owner, I want to count smarter, not more, so that accuracy goes up while counting labour goes down.

3. Functional Requirements

3.1 Detectors

Behavioural: long search time at a location (>45s default, adaptive per location), repeated short picks, frequent manual-entry overrides.

Inventory: balance vs expected (receipts − consumption) drift, unusual adjustment frequency/size by worker/location/SKU, negative-available near misses, lot/expiry inconsistencies.

Data: dimension/weight outliers at pack (carton weight vs expected weight of contents).

3.2 Scoring & Count Generation

Anomaly score combining the detector signal, the value at risk and upcoming demand (open allocations). Above threshold → auto-create a blind count task (recount priority), avoiding locations with active picks where possible.

3.3 Anomaly Feed & Outcomes

Feed with reason, evidence (search time, adjustment history), linked count task and result (variance found / none). The outcome feeds back into detector thresholds.

Pattern view for shrinkage: adjustments by worker/shift/zone (Supervisor+ only).

3.4 Risk-Based Count Planning

Option to replace part of the calendar count schedule with risk-based counts, subject to a minimum coverage policy (e.g. every location once per quarter).

4. Acceptance Criteria

In a replay of 90 days of history, ≥60% of later-confirmed variances would have been flagged by an anomaly beforehand.

A pick with >45s search time creates exactly one prioritised blind count for that location (deduplicated).

Precision: ≥40% of anomaly-triggered counts find a real variance in the pilot (vs the baseline hit rate of calendar counts).

Inventory accuracy is equal or better while total count labour falls in the pilot.

5. Non-Functional & Security Requirements

Requirement

Detail

Latency

Behavioural anomalies raised within 1 minute of the triggering event.

Privacy

Worker-level pattern views restricted to Supervisor+ and audited.

Noise control

Daily cap on auto-generated counts per facility, with deduplication.

6. Implementation Task Breakdown: Sprint 6

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Detectors] ──> [Step 2: Scoring] ──> [Step 3: Feed] ──> [Step 4: Risk Counting]



Step 1: Behavioural, Inventory & Data Detectors

Goal: Spot the signals that precede inventory errors.

Task 1.1: Behavioural Detectors

Search time, repeated shorts, overrides.

Task 1.2: Inventory & Data Detectors

Drift, adjustment patterns, weight outliers.

Step 2: Scoring & Automatic Count Generation

Goal: Turn signals into the right counts.

Task 2.1: Scoring Model

Signal + value at risk + demand.

Task 2.2: Count Task Generation

Dedup, caps, avoid active picks.

Step 3: Anomaly Feed, Outcomes & Feedback

Goal: Explain anomalies and learn from results.

Task 3.1: Anomaly Feed & Evidence

Reasons, linked counts.

Task 3.2: Outcome Feedback Loop

Threshold tuning from results.

Step 4: Risk-Based Count Planning & Pilot

Goal: Count smarter with a coverage guarantee.

Task 4.1: Risk-Based Planner

Coverage policy + risk counts.

Task 4.2: Replay & Pilot

90-day replay, pilot metrics.

7. Sprint Delivery Milestones

Milestone 1 — Detectors (Target: Day 3)

Detectors running in shadow mode.

Milestone 2 — Auto Counts (Target: Day 5)

Scored anomalies create counts.

Milestone 3 — Feed & Feedback (Target: Day 8)

Anomaly feed with outcomes live.

Milestone 4 — Sign-Off (Target: Day 10)

Replay and pilot targets met.

8. Open Questions Carried Into This Sprint

Default search-time threshold per location type (bins vs pallet positions).

Should worker-level shrinkage patterns be shown at all by default, or only on request by an Owner?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 7 can start.



End of Phase 3 · Sprint 6 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 6 of 15  |  Page