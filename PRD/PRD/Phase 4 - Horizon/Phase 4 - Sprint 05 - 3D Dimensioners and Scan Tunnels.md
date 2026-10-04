Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 5 of 15

Sprint 5: 3D Dimensioners & Scan Tunnels

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

3D Dimensioner & Automated Pack-Line Integrations (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 4: Sortation & Automated Pack Lines

Unlocks next

Phase 4 · Sprint 6: Dock Appointment Scheduling & Yard Management

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to replace manual measuring with 3D dimensioners (static cube scanners at receiving and pack) and scan tunnels (automatic barcode + weight + dimension capture on conveyors). This improves SKU master data, which drives cartonization, storage billing and DIM accuracy, and removes manual weight entry from high-volume lines.

By the end of this sprint:

Static dimensioners at receiving capture each/case dims and weight into the SKU catalog (with review of big changes).

Pack-side dimensioners and scan tunnels capture final carton dims/weight automatically for rating and billing.

SKU dimension quality scores improve and feed Phase 3 cartonization confidence.

Carrier audit support: captured dims/weight stored per shipment to dispute carrier DIM adjustments.

Out of scope for this sprint: legal-for-trade certification processes (vendor/customer scope), CT/X-ray inspection.

Dependency: Sprint 4 must be signed off. Also uses Phase 1 · Sprint 4 SKU UoM data and Phase 3 · Sprint 4 cartonization confidence.

2. User Stories

As a Receiving Lead, I want new SKUs measured automatically so that the catalog is accurate from day one.

As a 3PL Owner, I want carton dims captured on the line so that I can dispute carrier DIM adjustments with evidence.

As a Billing user, I want cubic storage billing based on measured dims so that clients can't dispute volumes.

3. Functional Requirements

3.1 Static Dimensioners

Browser/edge integration for common dimensioners at receiving: scan SKU → measure → propose dims/weight update per UoM. Changes above a threshold need approval. History kept.

3.2 Pack-Side & Tunnel Capture

Scan tunnel reads carton ID + dims + weight → attaches to the carton before label purchase (rating with actual values). Out-of-tolerance vs expected → exception (possible wrong contents).

3.3 Data Quality & Downstream

SKU dimension confidence improves cartonization. Storage billing uses measured cube where available.

3.4 Carrier Adjustment Audit

Store measured dims/weight per shipment. Match carrier adjustment invoices (where available) and flag disputes with evidence.

4. Acceptance Criteria

Measuring a new SKU at receiving proposes UoM dims/weight, and approval updates the catalog.

Tunnel capture populates carton dims/weight before label purchase in simulation.

A carton heavier than its expected contents by >10% raises a contents exception.

A carrier DIM adjustment on a shipment with captured dims is flagged with the evidence attached.

5. Non-Functional & Security Requirements

Requirement

Detail

Accuracy

Captured values stored with device ID, timestamp and certification flag.

Latency

Tunnel data attached <300ms after read.

6. Implementation Task Breakdown: Sprint 5

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Static Dims] ──> [Step 2: Tunnels] ──> [Step 3: Downstream] ──> [Step 4: Carrier Audit]



Step 1: Receiving Dimensioners & Catalog Updates

Goal: Measure SKUs automatically.

Task 1.1: Device Integration & Approval Flow

Measure, propose, approve, history.

Step 2: Pack-Side Dimensioners & Scan Tunnels

Goal: Capture carton data on the line.

Task 2.1: Tunnel Adapter & Carton Attach

ID/dims/weight → carton, contents exceptions.

Step 3: Cartonization & Billing Data Use

Goal: Use better data everywhere.

Task 3.1: Confidence & Storage Cube Updates

Feed Phase 3 and Phase 2 engines.

Step 4: Carrier Adjustment Audit & Tests

Goal: Recover wrong carrier charges.

Task 4.1: Adjustment Matching & Dispute Flags

Evidence packs.

Task 4.2: Device Certification Tests

Two dimensioner models, one tunnel.

7. Sprint Delivery Milestones

Milestone 1 — Static Dims (Target: Day 3)

Receiving measurement updates the catalog.

Milestone 2 — Tunnels (Target: Day 6)

Tunnel capture attached to cartons.

Milestone 3 — Downstream (Target: Day 8)

Cartonization and billing use measured data.

Milestone 4 — Sign-Off (Target: Day 10)

Carrier audit and device tests pass.

8. Open Questions Carried Into This Sprint

Which dimensioner vendors first (e.g. Cubiscan, Mettler Toledo, Zebra)?

Do we pursue carrier adjustment recovery as a paid service (share of refunds)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 6 can start.



End of Phase 4 · Sprint 5 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 5 of 15  |  Page