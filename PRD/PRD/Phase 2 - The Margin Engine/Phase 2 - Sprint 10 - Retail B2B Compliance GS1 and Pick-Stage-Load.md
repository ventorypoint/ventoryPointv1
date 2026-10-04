Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 10 of 15

Sprint 10: Retail B2B Compliance: GS1-128 / SSCC-18 Labels, Pallet Building, Pick-Stage-Load & BOL

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Retail B2B & EDI Compliance (Master PRD §6.3.6)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 9: Small Parcel Suite: Native Rate Shopping, USB Scales, Dual Labels & Amazon Buy Shipping

Unlocks next

Phase 2 · Sprint 11: EDI Integration: 850, 856, 810, 940 & 945 via an EDI Network

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to let design partners ship to big-box retailers (Walmart, Target, Costco and others) without chargebacks: compliant GS1-128 carton and pallet labels with serialised SSCC-18 codes, pallet building, a mandatory Pick → Stage → Load chain of custody that hard-locks on mismatches, and Bill of Lading generation. EDI document exchange builds on this in Sprint 11.

By the end of this sprint:

Each client can be configured with its GS1 company prefix and retailer label templates. SSCC-18 codes are generated and never reused.

B2B orders are packed into cartons and built onto pallets (LPNs), each labelled with a GS1-128 label.

Staging-lane scans and LPN + trailer-door verification at loading are enforced, with an alarm and lock on mismatch.

A BOL (VICS format) is generated per load.

Out of scope for this sprint: EDI 850/856/810/940/945 exchange (Sprint 11), routing-guide automation per retailer beyond label templates, LTL rate shopping (Phase 3).

Dependency: Sprint 9 must be signed off (dual-label printing). Also uses the Phase 1 · Sprint 8 B2B_basic order type and the Phase 1 container/LPN model.

2. User Stories

As a 3PL serving a brand that just landed a Target contract, I want compliant pallet and carton labels so that we avoid routing-guide chargebacks.

As a Forklift Operator, I want the scanner to stop me if I load a pallet onto the wrong trailer so that a $50,000 mis-shipment can't happen.

As a Supervisor, I want every pallet staged and verified before loading so that the load matches the BOL.

As a Shipping Clerk, I want the BOL generated automatically from what was loaded so that paperwork is always right.

3. Functional Requirements

3.1 GS1 Setup & SSCC Generation

Per client: GS1 company prefix (or the 3PL's prefix where permitted), serial-reference allocation and check digit, and a unique-SSCC guarantee (database sequence + constraint).

Label templates per retailer (4×6 GS1-128 carton/pallet: ship-from/to, carrier, PRO/BOL, PO, SSCC barcode, store/DC zones). Printed via Sprint 9 dual-label or the pallet station.

3.2 B2B Packing & Pallet Building

B2B pack flow: cartons get SSCCs. Pallet build flow: scan pallet LPN (SSCC) → scan cartons onto it → close pallet (weight, dims, pallet type) → print pallet label.

Pallet/carton hierarchy stored for the ASN (856) in Sprint 11.

3.3 Pick → Stage → Load

Stage: pallets must be scanned into an assigned staging lane (the lane barcode is verified).

Load: select the load/appointment → scan the trailer door → scan each pallet. A pallet not on this load/BOL or a wrong door triggers an audible alarm and a locked screen until a supervisor clears it with a reason.

Load closes only when all expected pallets are loaded (or shorted with a supervisor reason).

3.4 Loads & BOL

Load entity (carrier, trailer, seal, appointment, orders, pallets). VICS BOL PDF generated from the actual loaded pallets. Seal number capture. Load events for billing (per pallet loaded) and client visibility.

4. Acceptance Criteria

Generated SSCC-18 codes validate (check digit) in a GS1 checker and are never duplicated across 100k generations.

A test label scans correctly and matches a sample retailer label specification.

Scanning a pallet that belongs to a different load at a trailer door triggers the alarm and lock. Loading continues only after a supervisor override.

The BOL lists exactly the pallets scanned onto the trailer, with correct weights and handling-unit counts.

5. Non-Functional & Security Requirements

Requirement

Detail

Integrity

SSCC uniqueness enforced at the database level. Load verification can't be bypassed without an audited supervisor override.

Usability

Stage/load flows are usable on a forklift-mounted terminal browser with gloves (large targets, scan-first).

Performance

Pallet label print <2s. Load verification scan response <300ms.

6. Implementation Task Breakdown: Sprint 10

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: GS1 & SSCC] ──> [Step 2: Pallet Building] ──> [Step 3: Stage & Load] ──> [Step 4: Loads & BOL]



Step 1: GS1 Configuration, SSCC Engine & Label Templates

Goal: Produce compliant identifiers and labels.

Task 1.1: GS1 Prefix & SSCC Sequence

Per-client config, check digits, uniqueness.

Task 1.2: Retailer Label Templates

GS1-128 carton/pallet templates, ZPL + PDF.

Step 2: B2B Carton Packing & Pallet Building

Goal: Build the carton/pallet hierarchy retailers require.

Task 2.1: B2B Pack Flow

SSCC per carton, label print.

Task 2.2: Pallet Build Flow

LPN, carton scans, close, pallet label.

Step 3: Pick → Stage → Load Chain of Custody

Goal: Make mis-loads impossible without an override.

Task 3.1: Staging Lane Flow

Lane assignment + verification.

Task 3.2: Load Verification Flow

Door + pallet scans, alarm, lock, supervisor override.

Step 4: Load Management & VICS BOL

Goal: Produce correct shipping paperwork from what actually happened.

Task 4.1: Load Entity & UI

Carrier, trailer, seal, appointment.

Task 4.2: BOL Generation & Load Events

VICS PDF, billing events.

7. Sprint Delivery Milestones

Milestone 1 — SSCC & Labels (Target: Day 3)

SSCC engine and label templates validated.

Milestone 2 — Pallet Building (Target: Day 5)

Cartons and pallets built and labelled.

Milestone 3 — Stage & Load (Target: Day 8)

Chain of custody with hard lock works on the device matrix.

Milestone 4 — BOL & Sign-Off (Target: Day 10)

Loads and BOLs generated. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Which retailers' routing guides do design partners need first (label template priority)?

Should mixed-SKU pallets be allowed by default, or configured per retailer?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 11 can start.



End of Phase 2 · Sprint 10 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 10 of 15  |  Page