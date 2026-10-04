Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 8 of 15

Sprint 8: Labour Management: Engineered Standards & Performance Tracking

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

Labour Management (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 7: Enterprise Cross-Dock & Multi-Hub Flow-Through

Unlocks next

Phase 4 · Sprint 9: Incentive Pay, Gamification & Workforce Integrations

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to give large 3PLs a labour management system (LMS): engineered time standards per task (based on travel distance, units, lines and handling complexity from Phase 3 data), fair performance percentages per worker, indirect-time tracking, and coaching tools. This turns the floor telemetry collected since Phase 1 into labour productivity management.

By the end of this sprint:

Engineered standards per task type are computed from task attributes (travel from the Phase 3 geometry, units, lines, weight, UoM) with configurable allowances.

Each worker's performance % (earned standard hours ÷ actual hours) is calculated per shift, excluding approved indirect time.

Indirect activities (training, cleaning, meetings, equipment waits) can be logged in the floor workspace.

Supervisors have coaching views and trend reports. Data use is governed by a configurable policy.

Out of scope for this sprint: time-and-attendance/payroll systems (integrations in Sprint 9), shift scheduling/rostering.

Dependency: Sprint 7 must be signed off. Also uses Phase 1 floor sessions, Phase 3 · Sprint 1 geometry/telemetry and Phase 3 · Sprint 5 labour forecasting.

2. User Stories

As an Ops Manager, I want fair time standards for each task so that productivity is measured on the work, not on luck in the task mix.

As a Floor Worker, I want indirect time recognised so that cleaning or training doesn't count against me.

As a Supervisor, I want to see who needs coaching and on which task so that I can help people improve.

3. Functional Requirements

3.1 Engineered Standards

Standard model per task type: fixed time + travel (distance × walk rate) + per-line + per-unit + handling factors (weight, UoM, fragile) + PF&D allowance (personal, fatigue, delay). Calibrated from historical telemetry with an industrial-engineering review.

3.2 Performance Calculation

Warehouse quota-law support (e.g. CA AB 701, WA, NY, MN, OR): any standard used as a quota must be disclosed to workers in writing (a per-worker quota notice), meal/rest breaks and bathroom time are excluded, and workers can request their own performance data and the quotas that apply to them.

Per worker/shift/task type: earned standard hours, actual direct hours, indirect hours, performance %, utilisation. Exclusion rules (system outages, device-down time from Phase 4 · Sprint 1).

3.3 Indirect Time Logging

Floor workspace indirect codes with start/stop, supervisor approval, and automatic gaps detection prompts.

3.4 Coaching & Governance

Worker self-service: workers can view and export their own performance data, and quota and monitoring notices are kept on file with acknowledgements.

Coaching dashboard (trends, task-type breakdown, peer bands), coaching notes, and a policy switch controlling visibility (e.g. aggregate-only mode for regions with works councils).

4. Acceptance Criteria

Standards calibrated on 3 months of data predict actual task time within ±10% on average for each task type.

A worker with approved 30 minutes of training has that time excluded from the performance calculation.

Aggregate-only policy mode hides individual performance from supervisors.

5. Non-Functional & Security Requirements

Requirement

Detail

Fairness

Standards documented and explainable per task. Workers can see their own data.

Privacy

Policy-controlled visibility, audited access.

6. Implementation Task Breakdown: Sprint 8

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Standards] ──> [Step 2: Performance] ──> [Step 3: Indirect] ──> [Step 4: Coaching]



Step 1: Engineered Standards Model & Calibration

Goal: Measure work fairly.

Task 1.1: Standard Model & Calibration

Components, allowances, IE review.

Step 2: Performance Calculation

Goal: Compute fair performance %.

Task 2.1: Earned vs Actual Hours Engine

Exclusions, utilisation.

Step 3: Indirect Time Logging

Goal: Recognise non-task work.

Task 3.1: Indirect Codes & Approvals

Floor workspace flows, gap prompts.

Step 4: Coaching Views & Governance

Goal: Improve people, respect privacy.

Task 4.1: Coaching Dashboard & Policy Modes

Trends, notes, visibility policy.

7. Sprint Delivery Milestones

Milestone 1 — Standards (Target: Day 3)

Standards calibrated.

Milestone 2 — Performance (Target: Day 5)

Performance % computed.

Milestone 3 — Indirect (Target: Day 7)

Indirect time logged and approved.

Milestone 4 — Sign-Off (Target: Day 10)

Coaching and governance live.

8. Open Questions Carried Into This Sprint

Do we need a certified industrial engineer partner to validate standards for customers who tie pay to them?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 9 can start.



End of Phase 4 · Sprint 8 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 8 of 15  |  Page