Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 2 of 15

Sprint 2: Pick-to-Light & Put Walls

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

Robotics & Automation Orchestration (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 1: Automation Integration Framework & Warehouse Execution Layer

Unlocks next

Phase 4 · Sprint 3: Autonomous Mobile Robot (AMR) Orchestration

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to add the most common first automation step for mid-market 3PLs: pick-to-light (lights on bins show where and how many to pick) and put walls (sort batch-picked items into order cubbies, guided by lights). Both greatly increase batch-picking throughput and accuracy, and they plug into the Sprint 1 framework.

By the end of this sprint:

Pick-to-light zones light the right bins with quantities, and button presses confirm picks.

Put walls let workers scan an item and see which cubby light to put it in, with a 'cubby complete' signal for pack-out.

Put walls are the consolidation point for zone and batch picking (replacing pack-station consolidation where installed).

Throughput and accuracy are measured against manual picking in the same zones.

Out of scope for this sprint: robot integration (Sprint 3), automated put walls with robotic arms.

Dependency: Sprint 1 must be signed off (adapter framework, router). Also uses Phase 1 · Sprint 9 batch/zone picking and Sprint 10 pack flow.

2. User Stories

As a Picker, I want the bin to light up with the quantity so that I pick faster and never pick from the wrong bin.

As a Put-Wall Operator, I want the cubby to light up when I scan an item so that sorting a batch into orders is fast and error-free.

As a Packer, I want to know when an order's cubby is complete so that I pack it straight away.

3. Functional Requirements

3.1 Light Hardware Adapters

Adapters for common light-module vendors (via controller APIs), mapping light module IDs ↔ locations/cubbies. Display quantity, colour (per picker in multi-picker zones), confirm/short buttons.

3.2 Pick-to-Light Flow

Zone activation by tote/order scan → lights for tasks in the zone → button press = pick confirmation (qty adjustable, short button → Phase 1 short-pick path).

Multi-picker colour coding for concurrent orders in the same zone.

3.3 Put Wall Flow

Assign batch orders to cubbies → operator scans each item → the target cubby lights up → press to confirm put. Completed cubbies signal on the pack side (put-to-light / pack-from-light).

Exceptions: item not needed (over-pick), damaged item, cubby full.

3.4 Measurement

Lines per hour and error rate for pick-to-light/put-wall zones vs manual baseline (Phase 3 measurement framework).

4. Acceptance Criteria

In a lab setup, a batch of 24 orders is picked via pick-to-light and sorted via a put wall with 100% correct cubby placement.

A short press on a light module triggers the short-pick flow and a count task.

A completed cubby signals pack-out, and packing that order uses the normal pack flow.

The pilot measures lines per hour vs the manual baseline.

5. Non-Functional & Security Requirements

Requirement

Detail

Latency

Scan → light on <300ms. Button → confirmation event <500ms.

Resilience

Controller failure falls back to scanner-based picking in the same zone.

6. Implementation Task Breakdown: Sprint 2

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Light Adapters] ──> [Step 2: Pick-to-Light] ──> [Step 3: Put Wall] ──> [Step 4: Pilot]



Step 1: Light Module Adapters & Mapping

Goal: Drive lights from the platform.

Task 1.1: Controller Adapters

Vendor APIs, module mapping UI.

Step 2: Pick-to-Light Flow

Goal: Guide picks with lights.

Task 2.1: Zone Activation, Lights & Buttons

Quantities, colours, confirm/short.

Step 3: Put Wall Sorting & Pack-Out Signals

Goal: Sort batches into orders with lights.

Task 3.1: Cubby Assignment & Put Flow

Scan → light → confirm, exceptions.

Task 3.2: Pack-Out Signals

Cubby complete → pack flow.

Step 4: Lab Validation & Pilot Measurement

Goal: Prove the gains.

Task 4.1: Lab Rig Tests & Pilot

24-order lab test, pilot measurement.

7. Sprint Delivery Milestones

Milestone 1 — Light Adapters (Target: Day 3)

Lights controlled from the platform.

Milestone 2 — Pick-to-Light (Target: Day 5)

Pick flow working in the lab.

Milestone 3 — Put Wall (Target: Day 8)

Put wall + pack-out working.

Milestone 4 — Sign-Off (Target: Day 10)

Lab test and pilot measurement complete.

8. Open Questions Carried Into This Sprint

Which light-module vendors to support first?

Do we offer hardware bundles through partners, or integrate only?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 3 can start.



End of Phase 4 · Sprint 2 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 2 of 15  |  Page