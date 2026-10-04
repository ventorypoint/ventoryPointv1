Product Requirements Document (PRD)

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24) · Sprint 1 of 15

Sprint 1: Operational Data Foundation, AI Platform & Savings Measurement

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.4 (Phase 3 — "Autonomous Operations & Collaborative Network")

Module

Autonomous Operations Foundation (supports Master PRD §6.4.1–6.4.5)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 15: Multilingual Floor Workspace, SOC 2 Readiness & Phase 2 Launch Readiness (Phase 2 live)

Unlocks next

Phase 3 · Sprint 2: Pick Path Optimisation (TSP Routing) & Smarter Batching

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

Phase 3's promise is AI that actually cuts cost: 30–45% less picker travel, no DIM-weight surcharges, and no missed carrier cutoffs. That's the opposite of the incumbent's chat-only AI. None of it works without clean, historical operational data and a way to prove the savings. The objective of this sprint is to build that foundation: an analytics store fed from the event backbone, a warehouse geometry model, a model-serving layer, and a before/after measurement framework that every later AI sprint reports into.

By the end of this sprint:

Every warehouse event since go-live is available in an analytics store (columnar), refreshed within 5 minutes.

Each facility has a geometry model (aisle graph with coordinates and travel distances) generated from the location layout, and editable.

Floor-session telemetry (time per step, walking segments between scans) is modelled as travel and dwell metrics.

A model-serving layer runs optimisation and ML jobs per facility, with versioning, feature flags and shadow mode.

A savings dashboard captures baselines (travel per pick, cartons per order, DIM surcharges, cutoff misses) before any AI module is switched on.

Out of scope for this sprint: the optimisation modules themselves (Sprints 2–7).

Dependency: Phase 2 · Sprint 15 must be signed off (Phase 2 live). Also uses the Phase 1 event backbone and floor-session telemetry (Phase 1 · Sprint 6).

2. User Stories

As a Data/ML engineer, I want all warehouse events in an analytics store so that I can train and evaluate models without loading production.

As an Ops Manager, I want a map of my warehouse the system understands so that it can calculate real walking distances.

As a 3PL Owner, I want a measured baseline before AI is turned on so that I can see exactly what the AI saves me.

As a Product Owner, I want every AI feature to run in shadow mode first so that we prove it before it changes floor behaviour.

3. Functional Requirements

3.1 Analytics Store

Change-data capture / event export from Postgres to a columnar store (e.g. ClickHouse, BigQuery or DuckDB/MotherDuck), partitioned by organization/facility. Tenant isolation preserved (per-tenant filters in the semantic layer, no cross-tenant queries).

Curated models: picks, pick paths, orders, cartons, shipments, labour sessions, inventory snapshots, charges.

3.2 Facility Geometry Model

Auto-generate an aisle graph from the Phase 1 location hierarchy (building/wing/area/aisle/bay/level/position, floor cells, bulk lanes) and any stored x/y/z coordinates, plus facility parameters (aisle length, cross-aisles, one-way aisles, pack station and dock positions). Editor to correct nodes and edges.

Distance matrix service: shortest walking distance between any two locations. Cached per facility version.

3.3 Telemetry to Travel Metrics

Derive per-pick travel distance (graph distance between consecutive scan locations), dwell time at a location, search time (scan location → scan item).

3.4 Model Serving & Controls

Job runtime (Python services) for optimisation/ML, called via an internal API from the platform. Model registry with versions per facility.

Modes per AI feature and facility: off → shadow (compute + log recommendations only) → assist (recommend to a human) → auto. Feature flags and a kill switch.

3.5 Savings Measurement Framework

KPI baselines per facility over a 4-week window: metres per pick, picks per labour hour, cartons per order and average void, DIM-billed shipments and surcharge $, cutoff misses, count variance.

Before/after and A/B (by wave/zone) comparison views, used by every later sprint's acceptance criteria.

4. Acceptance Criteria

The analytics store reproduces Phase 1 report totals (orders shipped, units picked) exactly for a test month.

The geometry model for a design-partner facility gives distances within ±5% of tape-measured samples on 20 random location pairs.

Per-pick travel metrics are available for the last 90 days for every active facility.

An AI feature in shadow mode logs recommendations without changing any floor task.

Baseline KPIs are captured for at least 3 design-partner facilities.

5. Non-Functional & Security Requirements

Requirement

Detail

Freshness

Analytics data ≤5 minutes behind production.

Isolation

No query path can mix tenants. Semantic layer enforces organization/facility filters.

Performance

Distance lookup <5ms (cached matrix). Model jobs don't affect production database latency.

Governance

Every model version, mode change and kill-switch use is audited.

6. Implementation Task Breakdown: Sprint 1

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Analytics Store] ──> [Step 2: Geometry] ──> [Step 3: Serving & Modes] ──> [Step 4: Measurement]



Step 1: Analytics Store & Curated Models

Goal: Get clean operational history out of production.

Task 1.1: CDC/Event Export Pipeline

Export, partitioning, tenant filters.

Task 1.2: Curated Models & Reconciliation

Picks, orders, cartons, labour. Totals match Phase 1 reports.

Step 2: Facility Geometry & Distance Service

Goal: Teach the system the physical warehouse.

Task 2.1: Graph Generator & Editor

From location codes + facility parameters, correction UI.

Task 2.2: Distance Matrix Service

Shortest paths, caching per layout version.

Step 3: Telemetry Metrics, Model Serving & AI Modes

Goal: Run models safely and progressively.

Task 3.1: Travel & Dwell Metrics

Derived from floor sessions.

Task 3.2: Model Runtime, Registry & Mode Controls

Off/shadow/assist/auto, kill switch.

Step 4: Savings Measurement Framework

Goal: Prove the AI's value in numbers.

Task 4.1: Baseline Capture

4-week KPI baselines per facility.

Task 4.2: Before/After & A/B Views

Comparison dashboards.

7. Sprint Delivery Milestones

Milestone 1 — Analytics Store (Target: Day 3)

Pipeline live. Totals reconcile.

Milestone 2 — Geometry (Target: Day 6)

Facility graphs generated and validated.

Milestone 3 — Serving & Modes (Target: Day 8)

Model runtime and shadow mode working.

Milestone 4 — Baselines & Sign-Off (Target: Day 10)

Baselines captured for 3 facilities.

8. Open Questions Carried Into This Sprint

Analytics store choice (ClickHouse vs BigQuery vs a DuckDB-based stack), balancing cost and ops burden.

Do design partners allow their anonymised data to train cross-tenant models, or is every model per-tenant only?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 3 · Sprint 2 can start.



End of Phase 3 · Sprint 1 PRD.

Phase 3 — Autonomous Operations & Collaborative Network (Months 12–24)  |  Sprint 1 of 15  |  Page