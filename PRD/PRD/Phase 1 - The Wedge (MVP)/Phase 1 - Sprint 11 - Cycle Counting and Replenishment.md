Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 11 of 19

Sprint 11: Cycle Counting & Replenishment

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 7–11 — Warehouse Execution

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 10: Pack & Ship

Unlocks next

Phase 1 · Sprint 11A: Brand Visibility Lite & Basic Returns (Switching Essentials)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 11 is to keep inventory accurate without shutting the warehouse down: continuous blind cycle counts (scheduled, ad hoc and exception-triggered), a variance approval workflow, min/max pick-face replenishment, and inventory accuracy reporting.

By the end of this sprint:

Supervisors can create count tasks by location, zone or SKU, and workers perform blind counts on the floor workspace.

Variances beyond tolerance trigger a recount, then Supervisor approval posts adjustments.

Short picks automatically generate counts (Sprint 9 hook).

Pick faces are replenished from reserve through generated tasks.

An inventory accuracy KPI is tracked per facility and client.

Out of scope for this sprint: ML anomaly-driven counts (Phase 3), slotting changes (Phase 3), full physical inventory freeze mode (optional stretch).

Dependency: Sprint 10 must be signed off before this sprint starts. Sprint 5 (adjust RPC + approval), Sprint 6 (flow framework), Sprint 9 (short-pick trigger).

2. User Stories

As an Ops Manager, I want to count a few locations every day instead of closing for a weekend count so that operations never stop.

As a Supervisor, I want counters to not see the expected quantity so that counts are honest.

As a Supervisor, I want to approve large variances before they change inventory so that errors or theft are investigated.

As a Floor Worker, I want the system to tell me when a pick face needs refilling and from where so that pickers never find empty bins.

3. Functional Requirements

3.1 Count Tasks

Create by: location list, area/aisle/zone, SKU (all locations holding it), lot (all locations holding it, e.g. before a recall or expiry), serial list, LPN, ABC-style schedule (e.g. every location in a zone once per N days), or triggered (short pick, exception, expiry check).

Count lines are generated with a snapshot of the expected qty at count start (hidden from the counter).

3.2 Blind Count Floor Flow

Scan location → scan each container LPN found → scan each SKU → lot (lot-controlled) → qty, or scan every serial (unique items) → 'location complete'. Unknown SKU or serial found → capture via barcode. Empty location confirmation.

Location audit mode: confirms that each item is at its recorded address and in its recorded container. Items found in the wrong location are moved in the system with a 'location correction' reason, feeding the location-accuracy KPI.

Expiry-check count: counters confirm the lot/expiry printed on the goods matches the system record.

3.3 Variance & Approval

Tolerance per client/facility (units and %). Out-of-tolerance → automatic recount by a different worker where possible.

Supervisor approval queue showing expected vs. counted vs. recount and movement since snapshot. Approve → adjust_inventory with reason 'Cycle count'.

3.4 Replenishment

Min/max rules per pick location + SKU. Generator (on pick events + scheduled) creates replenishment tasks from reserve (FEFO-aware).

Floor replenishment flow: scan reserve location → SKU/lot → qty → scan pick face.

3.5 Accuracy Reporting

Inventory accuracy % (locations counted with zero variance / locations counted), variance value/units by client, count coverage.

4. Acceptance Criteria

The counter's screen never shows the expected quantity.

An out-of-tolerance count generates a recount assigned to a different worker, and adjustments post only after approval.

Movement during a count (a pick from the counted location) is reconciled so the variance isn't overstated.

A pick face dropping below min generates exactly one open replenishment task. Completing it moves stock and closes the task.

5. Non-Functional & Security Requirements

Requirement

Detail

Integrity

Count adjustments only via the Sprint 5 RPC with approval. Full audit trail.

Operational continuity

Counts run during live picking without locking locations (movement reconciliation instead of freezes).

Performance

Accuracy report <2s for 12 months of counts.

6. Implementation Task Breakdown: Sprint 11

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Count Schema] ──> [Step 2: Count Flows] ──> [Step 3: Variance Approval] ──> [Step 4: Replenish & Report]



Step 1: Count, Variance & Replenishment Schema

Goal: Model counts and replenishment with snapshots and approvals.

Task 1.1: Migrations & RLS

count_tasks, count_lines, replenishment_rules, replenishment_tasks.

Task 1.2: Events

count.submitted, count.approved, replenishment.completed.

Step 2: Count Task Creation & Blind Count Flow

Goal: Make continuous counting easy to plan and honest to perform.

Task 2.1: Count Planner UI

By location/zone/SKU/schedule. Triggered-count hook from Sprint 9.

Task 2.2: Blind Count Floor Flow

Location → items → qty → complete. Empty confirm.

Step 3: Variance, Recount & Approval Workflow

Goal: Change inventory only when a variance is verified.

Task 3.1: Tolerance & Recount Logic

Movement reconciliation vs. snapshot, recount assignment.

Task 3.2: Approval Queue

Supervisor review → adjust RPC.

Step 4: Replenishment & Accuracy Reporting

Goal: Keep pick faces full and measure accuracy.

Task 4.1: Replenishment Rules & Generator

Min/max editor, generator on pick events + schedule.

Task 4.2: Replenishment Floor Flow

Reserve → pick face.

Task 4.3: Accuracy Dashboard

KPI tiles + variance report.

7. Sprint Delivery Milestones

Milestone 1 — Count Data Layer (Target: Day 2)

Schema and events deployed.

Milestone 2 — Blind Counts (Target: Day 5)

Count planner + blind count flow work end-to-end.

Milestone 3 — Variance Workflow (Target: Day 7)

Recount + approval posts correct adjustments.

Milestone 4 — Replenishment & Sign-Off (Target: Day 10)

Replenishment tasks + accuracy reporting live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Default count tolerance (proposal: 0 units for serial/high-value, 2% otherwise).

Should Phase 1 (MVP) include a 'full physical inventory' mode for design partners' opening counts at go-live?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 11A can start.



End of Phase 1 · Sprint 11 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 11 of 19  |  Page