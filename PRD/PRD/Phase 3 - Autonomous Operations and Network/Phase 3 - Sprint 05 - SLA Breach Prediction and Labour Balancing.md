Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 5 of 15

Sprint 5: SLA Breach Prediction & Dynamic Labour Balancing

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Predictive SLA Breach Alerts & Labour Balancing (Master PRD §6.4.3)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 4: Predictive 3D Cartonization & Box Recommendation

Unlocks next

Phase 3 · Sprint 6: Anomaly Detection & Anomaly-Driven Cycle Counting

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to warn supervisors hours before a carrier cutoff is missed and tell them what to do about it. The model forecasts, per carrier cutoff, how many orders will be finished in time at current pick/pack velocity, and recommends labour moves. For example: *"At current velocity, 48 FedEx orders will miss the 2:00 PM cutoff. Move 2 operators from Receiving to Zone B picking."*

By the end of this sprint:

A live forecast per facility and cutoff shows orders at risk and the expected completion time.

Alerts fire early enough to act (configurable lead time, e.g. 3.5 hours before cutoff).

Labour-balancing recommendations name how many workers to move, from where to where, and the expected result.

Supervisors can apply a recommendation in one click (reassign workers' task queues). Outcomes are tracked.

Out of scope for this sprint: workforce scheduling/rostering and payroll, engineered labour standards and incentive pay (Phase 4 horizon).

Dependency: Sprint 4 must be signed off. Also uses Sprint 1 telemetry/analytics, Phase 1 waves and floor sessions, and facility carrier cutoffs (Phase 1 · Sprint 1).

2. User Stories

As a Supervisor, I want to know at 10:30 AM that the 2:00 PM truck is at risk so that I can still fix it.

As a Supervisor, I want the system to tell me who to move where so that I don't have to work it out under pressure.

As a 3PL Owner, I want fewer missed cutoffs so that brand SLAs and my reputation are protected.

3. Functional Requirements

3.1 Workload & Capacity Forecast

Remaining work per cutoff: units/lines/orders by zone and process step (pick, pack, load), including orders still expected to arrive (from channel arrival curves).

Capacity: active workers by process (from floor sessions), recent productivity per worker/process (units per hour), planned breaks.

Forecast completion time per cutoff with a confidence band. Updated every 5 minutes and on major events.

3.2 Breach Alerts

SMS alerts only to users who have given prior express consent, with opt-out (TCPA). Email and in-app alerts by default.

At-risk threshold (e.g. P(miss) > 30% or X orders projected late). In-app, email and SMS/push alerts to supervisors. Cutoff board with countdown and risk colouring.

3.3 Labour Balancing Recommendations

Compliance: recommendations are advisory only, and a supervisor decides (supports state AI laws on employment decisions, such as Colorado's). Worker productivity data isn't used as a quota unless the 3PL has configured and disclosed one (warehouse quota laws).

Optimiser proposes worker moves between processes/zones (respecting skills/permissions), shows the projected effect on every cutoff (never fixing one by breaking another), and suggests order prioritisation changes.

Apply: reassign selected workers' task queues and push a floor-workspace notification to the moved workers.

3.4 Outcome Tracking

For each alert: recommendation, action taken, actual outcome. Accuracy of forecasts (predicted vs actual completion). Cutoff miss rate vs baseline.

4. Acceptance Criteria

On 60 historical days, forecasts made 3.5 hours before cutoff predict completion time within ±20 minutes for ≥80% of cutoffs.

An injected slowdown scenario in staging triggers an alert at the configured lead time, with a recommendation that recovers the cutoff in simulation.

Applying a recommendation moves the selected workers' next tasks to the new zone within 30 seconds, and the workers are notified.

In a 4-week pilot, the cutoff miss rate falls vs baseline.

5. Non-Functional & Security Requirements

Requirement

Detail

Freshness

Forecast refresh ≤5 minutes.

Trust

Every recommendation shows its projected impact on all cutoffs, and supervisors stay in control (no auto moves without opt-in).

Privacy

Worker productivity data visible only to Supervisor+ roles, and used for balancing, not discipline, by default.

6. Implementation Task Breakdown: Sprint 5

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Forecast] ──> [Step 2: Alerts] ──> [Step 3: Balancing] ──> [Step 4: Outcomes]



Step 1: Workload & Capacity Forecast

Goal: Know early whether each cutoff will be met.

Task 1.1: Remaining Work & Arrival Curves

By zone/process, expected late arrivals.

Task 1.2: Capacity & Completion Model

Productivity estimates, confidence bands, backtest.

Step 2: Breach Alerts & Cutoff Board

Goal: Warn the right people at the right time.

Task 2.1: Alert Rules & Channels

Thresholds, in-app/email/SMS.

Task 2.2: Cutoff Board

Countdown, risk colours, drill-down.

Step 3: Labour Balancing Optimiser & Apply

Goal: Turn alerts into actions.

Task 3.1: Recommendation Optimiser

Skill-aware moves, multi-cutoff impact.

Task 3.2: One-Click Apply & Worker Notification

Queue reassignment, floor notification.

Step 4: Outcome Tracking & Pilot

Goal: Prove fewer missed cutoffs.

Task 4.1: Outcome Logging & Forecast Accuracy

Per alert, per cutoff.

Task 4.2: 4-Week Pilot Plan & Baseline Comparison

Pilot started; results reviewed at Phase 3 launch.

7. Sprint Delivery Milestones

Milestone 1 — Forecast Backtested (Target: Day 3)

Forecast accuracy target met on history.

Milestone 2 — Alerts (Target: Day 5)

Alerts and cutoff board live.

Milestone 3 — Balancing (Target: Day 8)

Recommendations and one-click apply working.

Milestone 4 — Sign-Off (Target: Day 10)

Outcome tracking live. Pilot started.

8. Open Questions Carried Into This Sprint

Should the system ever auto-move workers (auto mode), or always recommend only?

Worker productivity visibility: policy on whether individual metrics are shown to supervisors, given works council/union considerations in some regions.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 6 can start.



End of Phase 3 · Sprint 5 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 5 of 15  |  Page