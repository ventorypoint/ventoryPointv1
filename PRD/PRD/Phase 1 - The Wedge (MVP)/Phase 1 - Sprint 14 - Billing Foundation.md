Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 14 of 19

Sprint 14: Billing Foundation (Billable Events, Rate Cards, Export)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprint 14 — Billing Foundation

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 13: Amazon, WooCommerce, ShipStation, CSV/SFTP & Public API

Unlocks next

Phase 1 · Sprint 15: Extensiv Migration Engine (Extract, Map, Dry Run)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 14 is to guarantee that every chargeable warehouse activity becomes an immutable, priced, traceable charge, and to give the 3PL a month-end output it can bill from. This sprint builds the foundation that Phase 2's real-time ledger, invoicing and auto-debit extend.

By the end of this sprint:

Billing staff can configure versioned rate cards per client.

Every billable event automatically produces a priced, immutable charge linked to its source event.

Storage is snapshotted nightly and charged monthly.

A billing period summary with drill-down, CSV export and a draft invoice PDF is available per client.

Out of scope for this sprint: invoice sending, payments, QuickBooks sync, advanced storage calendars, surcharges, tiered pick matrices, minimums (Phase 2).

Dependency: Sprint 13 must be signed off before this sprint starts. Sprint 2 (consumer queue), Sprints 7/9/10 (billable events), Sprint 5 (balances for snapshots).

2. User Stories

As a 3PL Owner, I want every pallet stored and every carton picked captured and priced automatically so that I never under-bill.

As a Billing user, I want to set each client's contracted rates with effective dates so that price changes don't corrupt past months.

As a Billing user, I want a month-end summary per client with export so that invoicing takes hours instead of days.

As a 3PL Owner, I want to click any charge and see who did what, when and on which device so that I can answer client disputes instantly.

3. Functional Requirements

3.1 Charge Catalogue & Mapping

Seed charge types (see Sprint 14 scope). Mapping rules from event types → charge type + quantity expression (e.g. receipt.line_received → receiving per carton when uom = case).

3.2 Rate Cards

Rate card editor per client: lines by charge type, unit, rate, optional minimum per line, markup % for packaging.

Versioning: publish a new version with an effective-from date. Drafts don't apply. The history view shows the diff between versions.

Copy a rate card from a template or another client.

3.3 Billing Capture Consumer

Consumes billable events → resolves the rate card version by occurred_at → computes quantity/amount → writes billable_charges idempotently (unique on source_event_id + charge_type).

Unpriced events (no rate line) produce $0 'unpriced' charges flagged for review, so they're never dropped.

3.4 Storage Snapshots

Nightly job per facility/client at local end-of-day: pallets (by LPN and by pallet positions / floor cells / bulk-lane slots occupied), locations occupied by type (shelf bin, rack position, floor cell, cage, cold room), cubic feet (qty × each dims or case dims), units.

Location-type rates: storage can be priced differently per location type (e.g. floor cell vs rack position vs cold room).

Monthly storage charge per the client's storage method (month-end snapshot or average daily balance).

3.5 Billing Period & Outputs

Billing period per client (monthly by default): open → reviewing → exported.

Summary by charge type with drill-down to charges → source event → worker/device/time.

Manual charges (VAS, labour hours) with reason and attachment. Reversal for corrections.

Exports: detailed CSV, summary CSV, draft invoice PDF (3PL branding, client details, lines, totals). All exports use the safe-export utility (formula-injection protection), and manual-charge attachments go through the upload service.

3.6 Completeness Check

Daily job comparing billable event counts vs. charges per type, surfaced as a warning banner.

4. Acceptance Criteria

A scripted month (receipts by case, picks, multi-carton packs, packaging, labels, storage) produces charges matching a hand-calculated reference to the cent.

Changing a rate on the 15th applies only to activity from the 15th onwards.

Replaying the same events doesn't create duplicate charges.

An event type with no rate line creates a flagged $0 charge and appears in the completeness warning.

Drill-down from a draft invoice line reaches the originating scan's worker, device and timestamp.

5. Non-Functional & Security Requirements

Requirement

Detail

Accuracy

Decimal arithmetic (numeric) only. Explicit rounding per line. Reference-scenario suite in CI.

Immutability

Append-only charges. Reversals reference the original with a reason.

Performance

Capture lag <1 min p95. Snapshot job <10 min per facility.

Data isolation

Billing data visible only to Owner/Admin/Billing roles (Client User access arrives in Phase 2).

6. Implementation Task Breakdown: Sprint 14

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Billing Schema] ──> [Step 2: Rate Cards] ──> [Step 3: Capture & Storage] ──> [Step 4: Outputs & QA]



Step 1: Charge Catalogue, Rate Card & Charge Schema

Goal: Create immutable, versioned billing records.

Task 1.1: Migrations & RLS

charge_type_catalog, charge_mapping_rules, rate_cards, rate_card_lines, billable_charges, storage_snapshots, billing_periods.

Task 1.2: Immutability Guards

Append-only triggers, reversal pattern.

Step 2: Rate Card Editor & Versioning

Goal: Let billing staff model each client's contract.

Task 2.1: Rate Card UI

Lines editor, templates, copy.

Task 2.2: Versioning & Effective Dates

Publish, history diff, resolution by date.

Step 3: Billing Capture Consumer & Storage Snapshots

Goal: Turn every billable event into a priced charge.

Task 3.1: Capture Consumer

Mapping → pricing → idempotent write, unpriced flagging.

Task 3.2: Storage Snapshot & Monthly Storage Charges

Nightly job, month-end/ADB methods.

Step 4: Billing Period, Exports & Reference Validation

Goal: Deliver a trusted month-end output.

Task 4.1: Summary, Drill-Down & Manual Charges

Period screen, drill-down, manual + reversal.

Task 4.2: CSV & Draft Invoice PDF

Detailed/summary CSV, branded PDF.

Task 4.3: Reference Scenario Suite & Completeness Check

Scripted month vs. hand-calculated reference, daily completeness job.

7. Sprint Delivery Milestones

Milestone 1 — Billing Data Layer (Target: Day 2)

Schema and immutability guards deployed.

Milestone 2 — Rate Cards (Target: Day 4)

Versioned rate cards editable per client.

Milestone 3 — Capture & Storage (Target: Day 7)

Charges captured from events. Storage snapshots running.

Milestone 4 — Outputs & Sign-Off (Target: Day 10)

Summary, exports and PDF live. Reference scenario matches to the cent.

8. Open Questions Carried Into This Sprint

Storage method default per design partner (month-end snapshot vs. average daily balance).

Should the draft invoice PDF carry an invoice number in Phase 1 (MVP), or be clearly marked 'draft/statement' to avoid conflicting with the accounting system's numbering?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 15 can start.



End of Phase 1 · Sprint 14 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 14 of 19  |  Page