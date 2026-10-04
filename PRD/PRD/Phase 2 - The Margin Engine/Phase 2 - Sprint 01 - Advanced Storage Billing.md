Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 1 of 15

Sprint 1: Advanced Storage Billing Models & Environmental Surcharges

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Real-Time Micro-Billing Ledger (Master PRD §6.3.1)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 16: Weekend Cutover, Ops Dashboard & Launch Readiness (Phase 1 live with design partners)

Unlocks next

Phase 2 · Sprint 2: Inbound, Outbound & VAS Charge Engine, Postage Markup & Monthly Minimums

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

Phase 1 records every billable event and prices a basic storage charge from nightly snapshots (Phase 1 · Sprint 14). The objective of this sprint is to give storage billing the same depth as the incumbent: every storage model a 3PL puts in a contract, the billing calendars those contracts use, and automatic temperature/hazmat surcharges.

Storage is usually the largest recurring line on a 3PL invoice, and the one most often under-billed. This sprint gets it exactly right before the rest of the billing engine is built on it.

By the end of this sprint:

Rate cards can price storage per standard / oversize / half / stackable / non-stackable pallet, per cubic foot, per linear foot, and per dedicated location (bin, shelf, drawer, rack).

Each client can use a calendar-month snapshot, average daily balance, split-month (1st–15th vs 16th–end), or anniversary (30 days from receipt, per pallet/lot) billing calendar.

Refrigerated, frozen and hazmat surcharges (percentage or flat) apply automatically based on where the stock sits.

Storage accrues daily in the ledger, so the 3PL can see month-to-date storage at any time.

Out of scope for this sprint: inbound/outbound/VAS charge types, postage markups and minimums (Sprint 2), invoice generation (Sprint 3).

Dependency: Phase 1 · Sprint 14 (billable charges, rate cards, storage snapshots) and Phase 1 · Sprint 7 (first-received dates per lot/pallet, needed for anniversary billing).

2. User Stories

As a 3PL Owner, I want to bill oversize pallets at a higher rate than standard ones so that awkward freight pays for the space it takes.

As a Billing user, I want inventory received after the 15th to be billed half a month so that my contracts are applied exactly as written.

As a Billing user, I want each pallet billed every 30 days from the day it arrived (anniversary billing) for clients whose contract says so.

As a 3PL Owner, I want frozen and hazmat storage surcharges to apply automatically so that I never forget a premium.

As a 3PL Owner, I want to see today's accrued storage per client so that there are no surprises at month-end.

3. Functional Requirements

3.1 Storage Unit Models

Pallet types stored on the container/LPN (standard 48×40×60, oversize, half, stackable, non-stackable), with a default per location type and an override at receiving.

Cubic volume: units × each dims (or case dims when stored in cases). Linear floor footage for floor-stored or oddly shaped freight (from location type + footprint).

Dedicated location billing: a location reserved for a client is billed whether full or empty.

3.2 Billing Calendars

Calendar-month snapshot: balance at 11:59 PM local time on the last day of the month.

Average daily balance: the mean of daily snapshots across the month.

Split-month: full rate for stock present on/before the 15th, half rate for stock first received on the 16th or later.

Anniversary: each pallet/lot is charged every 30 days from its first_received_at. Proration on release is configurable.

The calendar is set per client and per charge line. Mid-month changes create a new rate card version (Phase 1 versioning).

3.3 Environmental Surcharges

Surcharge rules per zone temperature class (chilled, frozen) and SKU flags (hazmat), as a % uplift or a flat amount per unit of measure.

Surcharges are separate charge lines linked to the base storage charge, so invoices show them clearly.

3.4 Daily Storage Accrual

A daily job writes accrual entries (not final charges) per client, storage model and surcharge. Month close converts accruals into final billable_charges under the client's calendar rule.

Month-to-date storage widget per client.

4. Acceptance Criteria

A reference month with 12 pallets (4 oversize, 2 received on the 20th, 3 frozen) produces charges matching a hand-calculated spreadsheet to the cent under each of the four calendars.

An anniversary-billed pallet received on 3 March is charged on 3 March, 2 April and 2 May, and not in the calendar month-end run.

Moving a pallet from ambient to frozen mid-month applies the frozen surcharge only for the days it was frozen, when using average daily balance.

Changing a client's calendar mid-month applies the new rule only from the new rate card version's effective date.

5. Non-Functional & Security Requirements

Requirement

Detail

Accuracy

Decimal arithmetic. A reference-scenario suite covers every storage model × calendar combination in CI.

Performance

Daily accrual for a facility with 200k balance rows finishes in <10 min. Month close <15 min per facility.

Traceability

Every storage charge drills down to the daily snapshot rows (location, SKU, lot, pallet) that produced it.

Data isolation

Billing data is visible only to Owner/Admin/Billing roles. Client visibility arrives in Sprint 7.

6. Implementation Task Breakdown: Sprint 1

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Storage Schema] ──> [Step 2: Calendars] ──> [Step 3: Surcharges & Accrual] ──> [Step 4: Validation]



Step 1: Storage Model, Calendar & Surcharge Schema

Goal: Extend rate cards and snapshots to express every storage contract.

Task 1.1: Rate Card Line Extensions

Add storage model, calendar, surcharge fields and constraints to rate_card_lines.

Task 1.2: Pallet Type & Footprint Data

Pallet type on containers/LPNs, footprint on location types, and a receiving override.

Task 1.3: Accrual Tables

storage_accruals (client, date, model, qty, amount, source snapshot ids).

Step 2: Billing Calendar Engines

Goal: Implement the four calendar rules exactly.

Task 2.1: Snapshot & ADB Engines

Month-end snapshot selection and daily mean.

Task 2.2: Split-Month & Anniversary Engines

Receipt-date logic per pallet/lot, 30-day cycles, release proration.

Step 3: Environmental Surcharges & Daily Accrual

Goal: Apply premiums automatically and show storage in real time.

Task 3.1: Surcharge Rules

Zone temperature + SKU hazmat rules, as linked charge lines.

Task 3.2: Daily Accrual Job & Month Close

Scheduled accrual, month-close conversion, MTD widget.

Step 4: Reference Scenarios & Sign-Off

Goal: Prove every storage combination is right before invoicing depends on it.

Task 4.1: Reference Scenario Suite

Hand-calculated fixtures for each model × calendar × surcharge.

Task 4.2: Design-Partner Contract Replay

Replay one real partner month and compare with their previous invoice.

7. Sprint Delivery Milestones

Milestone 1 — Storage Data Layer (Target: Day 2)

Rate card extensions, pallet types and accrual tables deployed.

Milestone 2 — Calendar Engines (Target: Day 5)

All four calendars pass their reference fixtures.

Milestone 3 — Surcharges & Accrual (Target: Day 8)

Surcharges apply automatically. Daily accrual and MTD widget live.

Milestone 4 — Sign-Off (Target: Day 10)

Full reference suite and one partner replay match to the cent.

8. Open Questions Carried Into This Sprint

Anniversary billing on partial pallet release: prorate the remaining days, or bill the full 30-day cycle?

Should linear-foot billing measure the actual footprint recorded at receiving, or a fixed footprint per location type?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 2 can start.



End of Phase 2 · Sprint 1 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 1 of 15  |  Page