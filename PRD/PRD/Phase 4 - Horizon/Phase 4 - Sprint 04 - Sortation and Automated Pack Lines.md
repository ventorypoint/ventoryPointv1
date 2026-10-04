Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 4 of 15

Sprint 4: Sortation & Automated Pack Lines

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

Phase 4 · Sprint 3: Autonomous Mobile Robot (AMR) Orchestration

Unlocks next

Phase 4 · Sprint 5: 3D Dimensioners & Scan Tunnels

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to automate high-volume outbound: integrate parcel sorters (route cartons to carrier lanes), automated baggers and box-on-demand machines (packaging made to fit each order, driven by Phase 3 cartonization), and print-and-apply label systems, so a large 3PL can pack and ship thousands of orders per hour with people only handling exceptions.

By the end of this sprint:

Sorters receive destination lane instructions per carton (by carrier/service/zone) and report sort confirmations and rejects.

Auto-baggers and box-on-demand machines receive order contents + cartonization output and produce the package, which becomes a normal carton record.

Print-and-apply systems label cartons automatically from shipment data.

An automated pack line dashboard shows throughput, jams/rejects and exception queues.

Out of scope for this sprint: conveyor PLC programming (vendor/integrator scope), full material flow control systems.

Dependency: Sprint 3 must be signed off. Also uses Phase 3 · Sprint 4 cartonization and Phase 2 · Sprint 9 native labels.

2. User Stories

As an Ops Manager, I want cartons sorted to the right carrier lane automatically so that loading is fast and error-free.

As a 3PL Owner, I want packaging made to fit each order so that DIM charges and packaging costs fall further.

As a Supervisor, I want every rejected carton in one exception queue so that nothing is lost on the line.

3. Functional Requirements

3.1 Sorter Integration

Scan at induction → platform returns the lane (carrier/service/zone/route rules) → sorter confirms the sort or reports a reject (no read, no rule, lane full). Lane-to-carrier mapping per facility and schedule.

3.2 Auto-Bagger & Box-on-Demand

Send order/carton contents + cartonization dimensions → the machine builds the package → returns actual dims/weight → carton record + packaging consumption (billing).

3.3 Print-and-Apply

Carton ID read → label data (carrier label, retail label) sent → applied → verify scan → confirmation. Misapply → exception.

3.4 Line Dashboard & Exceptions

Throughput per hour, reject rate by cause, jam downtime, exception queue with resolution actions (re-induct, manual label, repack).

4. Acceptance Criteria

In simulation, 5,000 cartons per hour are assigned lanes with <200ms response per carton.

A box-on-demand package's actual dims update the carton and packaging charges correctly.

A no-read carton lands in the exception queue and is resolved with a manual label, with a full event trail.

5. Non-Functional & Security Requirements

Requirement

Detail

Latency

Sort decision <200ms p99 (sorter timing windows).

Availability

The lane decision service runs on the edge connector with a local cache if the cloud is unreachable.

6. Implementation Task Breakdown: Sprint 4

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Sorter] ──> [Step 2: Pack Machines] ──> [Step 3: Print & Apply] ──> [Step 4: Line Ops]



Step 1: Sorter Lane Decisions & Confirmations

Goal: Route every carton to the right lane.

Task 1.1: Lane Rules & Decision Service

Carrier/service/zone mapping, edge cache.

Step 2: Auto-Bagger & Box-on-Demand Integration

Goal: Make packaging fit every order.

Task 2.1: Machine Adapters & Carton Records

Contents in, dims/weight out, billing.

Step 3: Print-and-Apply Labelling

Goal: Label without hands.

Task 3.1: Label Data Dispatch & Verification

Carrier + retail labels, verify scan.

Step 4: Line Dashboard, Exceptions & Simulation Test

Goal: Keep the line flowing.

Task 4.1: Dashboard & Exception Queue

Throughput, rejects, resolutions.

Task 4.2: 5,000/hour Simulation

Timing and correctness test.

7. Sprint Delivery Milestones

Milestone 1 — Sorter (Target: Day 3)

Lane decisions within timing budget.

Milestone 2 — Pack Machines (Target: Day 6)

Box-on-demand/bagger records correct.

Milestone 3 — Print & Apply (Target: Day 8)

Automatic labelling verified.

Milestone 4 — Sign-Off (Target: Day 10)

Line dashboard and simulation test pass.

8. Open Questions Carried Into This Sprint

Priority machine vendors (e.g. Packsize, Sealed Air, Sparck/CVP) based on target customers.

Should the lane decision service always run at the edge for resilience?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 5 can start.



End of Phase 4 · Sprint 4 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 4 of 15  |  Page