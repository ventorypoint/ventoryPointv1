Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 7 of 19

Sprint 7: Inbound: ASNs, Receiving & Putaway

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 7–11 — Warehouse Execution

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 6: Web Floor Workspace (Scanning, Feedback, Printing)

Unlocks next

Phase 1 · Sprint 8: Orders, Holds & Allocation

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 7 is to get stock into the warehouse accurately: expected shipments (ASNs), a scan-guided receiving flow that captures exactly what each SKU's tracking class requires (lot and dates for lot-controlled items, every serial or a generated unique ID for unique items, nothing extra for non-unique items), LPN labels for pallets and cases, discrepancy flagging, and suggested, scan-confirmed putaway to an exact address (shelf bin, rack position, floor cell or bulk lane).

By the end of this sprint:

Staff can create ASNs (UI/CSV) and receive against them, or receive blind.

Workers receive by each/inner/case, and the floor workspace asks only for what the SKU's tracking class and date rules require (lot, manufacture/expiry dates, serials or generated unique-ID labels).

Every received pallet/case can get an LPN label, so the container and its contents are traceable from the dock onwards.

Putaway suggestions guide workers to a valid exact address (including floor cells and bulk lanes) and every putaway is scan-confirmed with location + container.

Closing a receipt produces a discrepancy report (over/short/damaged).

Out of scope for this sprint: client self-serve ASNs in the portal and the vendor ASN importer (Phase 2), container de-vanning billing (Phase 2 billing), GS1-128 SSCC pallet receiving (Phase 2), API-created ASNs (Sprint 13).

Dependency: Sprint 6 must be signed off before this sprint starts. Sprint 5 (receive_into, move_inventory), Sprint 6 (flow framework).

2. User Stories

As an Ops Manager, I want to record what a client says is arriving so that the dock team knows what to expect and discrepancies are caught.

As a Floor Worker, I want the screen to tell me what to count and what data to capture (lot, expiry) so that I can receive correctly without training.

As a Floor Worker, I want to be told where to put each item so that I don't waste time looking for space.

As a Floor Worker receiving phones, I want the screen to make me scan every serial/IMEI so that each unit is individually traceable from day one.

As a Floor Worker receiving unique items without serials, I want the system to print a unique ID label for each unit so that I can tag and track them.

As a 3PL Owner, I want over/short/damaged receipts reported automatically so that I can notify the client and bill any extra handling.

3. Functional Requirements

3.1 ASNs

Create/edit/cancel ASNs, with CSV import (reuses the Sprint 4 import pipeline). Statuses: expected → arrived → receiving → received → closed.

Dock arrival check-in (arrived time, carrier, seal number, photos optional via upload).

3.2 Receiving Flow (Floor)

Select or scan the ASN (or start blind receiving by client). Scan SKU/UoM → qty (UoM-converted) → condition (good/damaged) → receive into a staging location or onto an LPN.

Tracking-class-driven capture: non-unique → quantity only. Lot → lot number + required dates (expiry/best-before, manufacture date; expiry derived from mfg date + shelf life if only mfg is printed; GS1 AI 10/11/17 parsed automatically). Unique/serial → scan each serial/IMEI (qty auto-counts, duplicates rejected, format validated) or, for generated IDs, print one unique-ID label per unit and scan each to confirm it was applied. Lot + serial → both.

LPN labelling: print/apply an LPN per pallet or case (optional per client). Mixed pallets record each SKU/lot on the LPN.

The first-received date/time is stamped automatically on every lot, LPN and serial (the basis for FIFO/LIFO).

Warnings: over-receipt beyond tolerance (configurable), unexpected SKU, expiry below minimum shelf life (hold as quarantine).

3.3 Putaway

Putaway task created per receipt line/container.

Suggestion rules in priority order: existing location with same SKU+lot (if the location's mixed-lot rule and capacity allow) → empty pickable location in a zone matching the temperature/security class → reserve rack position → floor cell or bulk lane (for full pallets). Suggestions skip inactive/full locations and respect mixed-SKU/mixed-lot rules.

Bulk lanes: slots fill in the order that matches the lane's rotation behaviour (drive-through lanes fill from the back). Single-entry lanes are flagged LIFO-only and offered only to LIFO SKUs, or with a warning.

Floor putaway flow: scan tote/LPN or item → shows the suggested location card with the full path (e.g. Wing 2 › Aisle 04 › Bay 12 › Level 3 › Position 02) → scan location (override allowed with a reason) → move_inventory / move_container from staging.

3.4 Receipt Close & Discrepancies

Close receipt: compare received vs. expected per line. Discrepancy report (PDF/CSV) with the damaged-quantity summary.

Events: receipt.line_received, putaway.completed, receipt.closed, each with UoM data for Sprint 14 billing (carton vs. each counts).

4. Acceptance Criteria

Receiving 10 cases of a 12-each SKU adds 120 eaches in the staging location with the scanned lot/expiry.

Receiving a short-dated lot below minimum shelf life puts it in quarantine status automatically.

Receiving 20 units of a serialised SKU requires 20 distinct valid serial scans. A serial already in stock anywhere is rejected as a duplicate.

For a generated-ID SKU, 15 unique-ID labels are printed and each must be scanned once before the receipt line closes.

A full pallet put away to a floor cell records the LPN, the cell's full address and every item on the pallet, all visible in 'Where is it?'.

The putaway suggestion never points to a location of the wrong temperature class or an inactive location.

Closing an ASN with one over and one short line produces a correct discrepancy report.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Receive-step response <300ms p95. Putaway suggestion <200ms.

Integrity

Receipt lines post inventory only through receive_into, so all quantities are event-backed.

Data isolation

ASNs/receipts scoped by client + facility.

6. Implementation Task Breakdown: Sprint 7

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Inbound Schema] ──> [Step 2: ASN Management] ──> [Step 3: Receiving Flow] ──> [Step 4: Putaway & Close]



Step 1: ASN, Receipt, Container & Putaway Schema

Goal: Model inbound work with full traceability.

Task 1.1: Migrations & RLS

asns, asn_lines, receipts, receipt_lines, containers, putaway_tasks, with status enums and RLS.

Task 1.2: Inbound Event Types

Register receiving/putaway event schemas (including UoM and container info).

Step 2: ASN Management & Dock Check-In

Goal: Let office staff prepare the dock for arrivals.

Task 2.1: ASN UI & CSV Import

List/detail/create, CSV import, status tracking.

Task 2.2: Dock Check-In

Arrival capture screen on the web app.

Step 3: Floor Receiving Flow

Goal: Guide workers to receive correctly on the first try.

Task 3.1: Receiving Steps on Flow Framework

ASN/blind selection, SKU/UoM, qty, lot/expiry, serial, condition, staging.

Task 3.2: Validation & Warnings

Tolerance, unexpected SKU, shelf-life quarantine.

Step 4: Putaway Engine, Putaway Flow & Receipt Close

Goal: Get stock to a valid home and close the loop with the client.

Task 4.1: Putaway Suggestion Engine

Rule chain with capacity check, returns the top 3 candidates.

Task 4.2: Floor Putaway Flow

Suggested location card, override with reason.

Task 4.3: Receipt Close & Discrepancy Report

Variance calc, PDF/CSV report, events.

7. Sprint Delivery Milestones

Milestone 1 — Inbound Data Layer (Target: Day 2)

Schema and event types deployed.

Milestone 2 — ASNs & Check-In (Target: Day 4)

ASNs created via UI/CSV. Arrivals checked in.

Milestone 3 — Receiving Flow (Target: Day 7)

Receiving on the floor workspace works for each/case, lot/expiry and serial SKUs.

Milestone 4 — Putaway & Sign-Off (Target: Day 10)

Putaway suggestions + flow + receipt close pass the acceptance criteria.

8. Open Questions Carried Into This Sprint

Over-receipt tolerance default (proposal 5%) and whether over-receipts need supervisor approval.

LPN/pallet labels on receipt: print a license plate label per pallet in Phase 1 (MVP)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 8 can start.



End of Phase 1 · Sprint 7 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 7 of 19  |  Page