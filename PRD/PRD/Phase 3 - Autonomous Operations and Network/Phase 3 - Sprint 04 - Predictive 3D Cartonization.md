Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 4 of 15

Sprint 4: Predictive 3D Cartonization & Box Recommendation

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Predictive 3D Cartonization (Master PRD §6.4.2)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 3 · Sprint 3: Dynamic Slotting: Velocity & Affinity Analysis, Slot Recommendations & Re-Slot Tasks

Unlocks next

Phase 3 · Sprint 5: SLA Breach Prediction & Dynamic Labour Balancing

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to stop paying for shipping air. Before an order is picked, a 3D bin-packing algorithm works out the best box (and number of boxes) from the facility's packaging catalog and the SKU dimensions, including item orientation and void fill. Packers are told exactly which box to use, and DIM-weight surcharges fall. The master PRD estimates $1.50–$4.00 saved per affected package.

By the end of this sprint:

Every multi-item order gets a recommended carton set (box type(s), item-to-box assignment, void fill) before picking.

The pack station shows the recommended box first. Deviations are captured with a reason.

Batch picking can pre-assign a box so pickers pick straight into the shipping carton (pick-to-carton) where configured.

DIM surcharge savings are measured against the Sprint 1 baseline.

Out of scope for this sprint: custom box-on-demand machines (Phase 4), auto-bagger integrations, dimensioning hardware (Phase 4).

Dependency: Sprint 3 must be signed off. Also uses the Phase 1 packaging catalog and carton history, the Phase 2 · Sprint 9 rate shopping (DIM-aware cost), and SKU dimensions (Phase 1 · Sprint 4).

2. User Stories

As a Packer, I want to be told which box to use so that I don't guess and waste time.

As a 3PL Owner, I want fewer oversized boxes so that my clients stop paying DIM surcharges and my packaging costs drop.

As a Supervisor, I want pickers to pick straight into the right shipping box so that we skip a repack step.

3. Functional Requirements

3.1 Cartonization Engine

3D bin packing with rotations (respecting 'this side up'/no-rotate flags), fragile padding allowances and max weight per box. Objective: minimise total shipping cost (rated DIM vs actual weight via Sprint 9 rates) + packaging cost, then number of boxes.

Handles items that must ship alone (oversize, hazmat) and client-specific packaging rules (branded boxes).

3.2 Data Quality Guard

Confidence score per recommendation based on SKU dimension completeness and past pack outcomes. Low confidence → the recommendation is shown as a suggestion only. Dimension outliers are flagged for re-measurement tasks.

3.3 Pack & Pick Integration

Pack screen: the recommended box is highlighted, with a 3D/2D placement hint for multi-item orders. Deviation requires choosing a reason (didn't fit, damaged box, client rule).

Pick-to-carton option for batch picking: carton labels printed at batch start, pickers scan the carton instead of a tote.

3.4 Learning & Measurement

Deviations and 'didn't fit' feedback adjust SKU dims or packing allowances (with review). Savings: DIM-billed shipments, surcharge $, average void %, packaging spend per order vs baseline.

4. Acceptance Criteria

On 5,000 historical multi-item orders, recommended cartons reduce modelled shipping + packaging cost by ≥8% vs what was actually used.

Recommendations compute in <200ms per order at wave release.

In a 2-week pilot, packers accept ≥85% of high-confidence recommendations, and 'didn't fit' deviations are <3%.

DIM surcharge $ per 1,000 shipments falls vs the baseline, reported on the savings dashboard.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

<200ms per order. Batch of 1,000 orders <60s.

Safety

Never recommends a box below the item's minimum dimensions or above max weight.

Explainability

The pack screen shows why a box was chosen (fits N items, saves $X vs next size).

6. Implementation Task Breakdown: Sprint 4

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Engine] ──> [Step 2: Data Guard] ──> [Step 3: Floor Integration] ──> [Step 4: Learn & Measure]



Step 1: 3D Packing Engine

Goal: Compute the cheapest compliant carton set.

Task 1.1: Packing Algorithm & Constraints

Rotations, fragile allowances, weight, ship-alone.

Task 1.2: Cost Objective with Rates

DIM vs actual weight, packaging cost.

Step 2: Confidence Scoring & Dimension Quality

Goal: Only automate where the data is good.

Task 2.1: Confidence Score & Outlier Flags

Completeness + history, re-measure tasks.

Step 3: Pack Screen & Pick-to-Carton

Goal: Put the recommendation in the packer's hands.

Task 3.1: Pack Screen Recommendation & Deviations

Highlight, placement hint, reasons.

Task 3.2: Pick-to-Carton Option

Carton labels at batch start, scan carton.

Step 4: Feedback Loop & Savings Pilot

Goal: Improve from real packs and prove the savings.

Task 4.1: Deviation Learning

Adjust dims/allowances with review.

Task 4.2: Pilot & Savings Report

2-week pilot, DIM and packaging metrics.

7. Sprint Delivery Milestones

Milestone 1 — Engine Benchmarked (Target: Day 3)

≥8% modelled saving on historical orders.

Milestone 2 — Data Guard (Target: Day 5)

Confidence and outlier flags live.

Milestone 3 — Floor Integration (Target: Day 8)

Pack-screen recommendations and pick-to-carton working.

Milestone 4 — Pilot & Sign-Off (Target: Day 10)

Pilot acceptance and savings measured.

8. Open Questions Carried Into This Sprint

Should cartonization choose between the 3PL's boxes and client-branded boxes by cost, or always honour client packaging rules?

Is a 3D placement visual worth the complexity on handhelds, or is a 2D layer hint enough?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 5 can start.



End of Phase 3 · Sprint 4 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 4 of 15  |  Page