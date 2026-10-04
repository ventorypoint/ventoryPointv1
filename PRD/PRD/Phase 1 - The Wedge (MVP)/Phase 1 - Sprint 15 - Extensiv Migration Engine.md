Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 15 of 19

Sprint 15: Extensiv Migration Engine (Extract, Map, Dry Run)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 15–16 — Migration & Launch

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 14: Billing Foundation (Billable Events, Rate Cards, Export)

Unlocks next

Phase 1 · Sprint 16: Weekend Cutover, Ops Dashboard & Launch Readiness

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 15 is to build the extraction and preparation half of the 1-Click Extensiv Migration Engine: authenticate to a 3PL's Extensiv account, pull everything needed to run their facility, normalise and map it to the platform's models, reconstruct rate cards, and produce a dry-run report that proves the data is ready before anything touches production.

By the end of this sprint:

A migration project can be created and connected to an Extensiv account (or fed by CSV templates).

Clients, SKUs, locations, inventory, open orders and open ASNs are extracted into staging and normalised.

Mappings (facility, client, location type, UoM, carrier service) are set in a guided UI.

Rate cards are reconstructed from billing setup data and mapped to the Phase 1 (MVP) charge catalogue.

A dry-run report shows counts, warnings and errors per entity.

Out of scope for this sprint: production commit and cutover (Sprint 16), migration from non-Extensiv WMS APIs, historical invoices.

Dependency: Sprint 14 must be signed off before this sprint starts. Sprints 3/4/7/8 importers and models, Sprint 14 rate card model, Sprint 5 opening-balance event type.

2. User Stories

As a 3PL Owner, I want to connect my Extensiv account and see exactly what will be migrated so that switching doesn't feel like a leap of faith.

As an Ops Manager, I want the system to translate Extensiv's location and unit setups into the new platform's structure so that I don't re-enter 50,000 SKUs.

As a Billing user, I want my clients' rate cards rebuilt automatically so that billing is right from day one.

As an Implementation Specialist, I want a dry-run report of every data problem so that we fix issues before the cutover weekend.

3. Functional Requirements

3.1 Migration Project & Source Connection

Create a migration project for a target facility. Enter Extensiv API credentials (stored in Vault), test the connection, select source warehouse(s) and customers.

Credentials: the 3PL self-provisions a REST API credential (Client ID + Secret) in Extensiv's Support Portal and shares it under a written authorisation. Required roles: CustomerView, FacilityView, ItemView, InventoryDetailView, ReceiverView, OrderView, plus billing-charges access. The connector refreshes bearer tokens automatically (they last about 30–60 minutes), respects and measures rate limits, and uses read-only roles wherever possible.

3.2 Extractors

Resumable, paginated extractors per entity with rate-limit handling: customers → client accounts, items/packages/barcodes → SKUs/UoM/barcodes, locations → locations, inventory stock details → balances (location, lot, expiry, serial, qty), open orders → orders, open receivers → ASNs.

Delta mode: re-extract only records changed since the last run (by modified date where available, else by hash comparison).

3.3 Normaliser & Mapping

Normalisation: trim/uppercase codes, UoM hierarchy derivation from packages, date/timezone conversion, address normalisation (reuses Sprint 12 provider), barcode check-digit validation.

Location mapping: parse Extensiv location codes into the new hierarchy (building/wing/area/aisle/bay/level/position, floor cells, lanes) using mapping rules, generate codes in the facility naming convention, and keep the old code as an alias so staff can still scan old labels during transition.

Tracking data: import each SKU's tracking class (non-unique / lot / serial), rotation rule (FIFO/FEFO/LIFO), every serial with its location, and each lot's received, manufacture and expiry dates. Missing dates are flagged in the dry-run report.

Mapping UI: source facility → target facility, customers → client accounts (create or link), location types, UoM names, carrier/service codes. Rules saved for delta runs.

3.4 Rate Card Reconstruction

Ingest billing setup (API where exposed, otherwise uploaded export/CSV) → propose rate card lines mapped to charge types, with unmapped items listed for manual handling (manual charge or Phase 2 requirement).

3.5 Dry-Run Validation

Runs all importers' validators against staging without writing to production tables.

Report per entity: source count, valid, warnings, errors (downloadable CSV of issues), catalog completeness, inventory totals by client (units, lots, locations).

4. Acceptance Criteria

Sandbox extraction of 20 clients / 10k SKUs / 5k locations / 50k balances completes in <1 hour, resumes after an interruption, and reports accurate counts.

A delta run after 100 source changes stages only those 100 changes.

Location types and UoMs mapped once are applied automatically on the next run.

Rate card reconstruction maps ≥80% of a typical design partner's lines automatically and lists the rest.

The dry run writes nothing to production tables (verified by row counts).

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Extraction throughput limited only by the source API's rate limits. Normalisation of 100k records <10 min.

Resilience

Checkpointed extraction. Safe to resume or re-run.

Security

Vault credentials. Staging PII encrypted. Staging is visible only to Owner/Admin and the implementation role.

6. Implementation Task Breakdown: Sprint 15

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Migration Schema] ──> [Step 2: Extractors] ──> [Step 3: Normalise & Map] ──> [Step 4: Dry Run]



Step 1: Migration Project, Staging & Mapping Schema

Goal: Hold source data safely outside production tables.

Task 1.1: Migrations & RLS

migration_projects, source_connections, migration_runs, staging_records, mapping_rules, reconciliation_reports.

Task 1.2: Project & Connection UI

Create project, credentials, test connection, scope selection.

Step 2: Extensiv Extractors & CSV Fallback

Goal: Pull every entity needed to run the facility.

Task 2.1: API Client & Rate Limiting

Auth, pagination, retries, checkpoints.

Task 2.2: Entity Extractors

Customers, items/UoM/barcodes, locations, inventory detail, open orders, open receivers. Delta mode.

Task 2.3: CSV Fallback Templates

Templates + upload into the same staging pipeline.

Step 3: Normaliser, Mapping UI & Rate Card Reconstruction

Goal: Translate Extensiv's model into ours with minimal human effort.

Task 3.1: Normaliser

Codes, UoM derivation, dates, addresses, barcodes.

Task 3.2: Mapping UI & Saved Rules

Facility, client, location type, UoM, carrier service.

Task 3.3: Rate Card Reconstruction

Billing setup ingest → proposed rate card lines → review.

Step 4: Dry-Run Validation & Report

Goal: Prove readiness without touching production.

Task 4.1: Validator Orchestration

Run all importer validators on staging.

Task 4.2: Dry-Run Report

Per-entity counts/issues, inventory totals, completeness, CSV downloads.

Task 4.3: Sandbox Rehearsal

Full extraction + dry run on a sandbox Extensiv dataset.

7. Sprint Delivery Milestones

Milestone 1 — Migration Data Layer & Connection (Target: Day 2)

Schema deployed. Extensiv sandbox connection tested.

Milestone 2 — Extraction (Target: Day 5)

All entity extractors + delta mode working. CSV fallback working.

Milestone 3 — Normalise & Map (Target: Day 8)

Mapping UI and rate card reconstruction complete.

Milestone 4 — Dry Run & Sign-Off (Target: Day 10)

Sandbox dry-run report clean. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Access to an Extensiv sandbox/test account for development: via a design partner's non-production account?

Which Extensiv billing configuration is retrievable via API vs. only via UI export?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 16 can start.



End of Phase 1 · Sprint 15 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 15 of 19  |  Page