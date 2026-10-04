Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 11 of 15

Sprint 11: EDI Integration: 850, 856, 810, 940 & 945 via an EDI Network

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Retail B2B & EDI Compliance (Master PRD §6.3.6)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 10: Retail B2B Compliance: GS1-128 / SSCC-18 Labels, Pallet Building, Pick-Stage-Load & BOL

Unlocks next

Phase 2 · Sprint 12: Integration Rule Engine, AI SKU Matching & Connector Wave 1

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to automate the document exchange retailers and brands require for wholesale orders. Purchase orders (850) and warehouse shipping orders (940) come in, and advance ship notices (856), invoices (810) and warehouse shipping advice (945) go out, generated automatically from what actually happened on the floor, through an EDI network provider with pre-mapped trading-partner templates.

By the end of this sprint:

A 3PL can connect a client's EDI trading partners through the EDI provider (e.g. Stedi or SPS Commerce) without custom mapping work for supported retailers.

Inbound 850/940 documents create B2B orders automatically. Acknowledgements (997) are handled.

Outbound 856 ASNs are generated from the Sprint 10 carton/pallet hierarchy at load close. 945 and 810 are generated on ship/invoice events.

An EDI message monitor shows every document, its status and errors.

Out of scope for this sprint: full retailer onboarding services (done with the EDI provider), EDI for inbound supplier ASNs (Phase 3 candidate), retailer-specific chargeback dispute workflows.

Dependency: Sprint 10 must be signed off (SSCC hierarchy, loads, BOL). Also uses the Phase 1 · Sprint 12 connector framework and error queue.

2. User Stories

As a Brand client selling to Walmart, I want POs to arrive in the warehouse automatically so that orders ship without manual entry.

As a 3PL Ops Manager, I want the 856 ASN sent automatically when the truck is loaded so that the retailer receives it before the freight arrives.

As an IT/Systems Lead, I want every EDI document visible with its status so that I can fix failures before they become chargebacks.

3. Functional Requirements

3.1 EDI Provider Connector

EdiAdapter on the Phase 1 connector framework: trading partner setup per client (partner ID, qualifiers, test/production mode), document routing, 997 functional acknowledgements.

Pre-built mapping guides for top retailers via the provider's partner templates. Mapping overrides stored per partner.

3.2 Inbound Documents

850 Purchase Order (retailer → brand, fulfilled by the 3PL) and 940 Warehouse Shipping Order (brand → 3PL) → B2B order with ship windows, DC/store, routing info and line items (UPC/buyer part number → SKU via aliases).

Validation failures → error queue with the raw document.

3.3 Outbound Documents

856 ASN from the load close: Shipment → Order → Tare (pallet SSCC) → Pack (carton SSCC) → Item hierarchy, including lot numbers, expiry dates and serial numbers per carton where the trading partner requires them. Carrier, BOL, PRO, seal.

945 Warehouse Shipping Advice to the brand on ship. 810 Invoice to the retailer when the brand uses the 3PL for retailer invoicing (optional per client).

Send timing rules (e.g. 856 within X minutes of the load close, before the carrier departs).

3.4 EDI Monitor

Document list with type, partner, direction, status (received, processed, sent, accepted, rejected), 997 status, raw/parsed views, resend, and alerts on missing 997s.

4. Acceptance Criteria

A test 850 from a sandbox trading partner creates the correct B2B order with all lines mapped.

Closing a 2-pallet, 30-carton load produces an 856 whose SSCC hierarchy exactly matches the scanned pallets and cartons, sent within 5 minutes.

A 945 is sent on ship, and its 997 is received and shown as accepted.

A rejected document appears in the monitor and the error queue with the reason.

5. Non-Functional & Security Requirements

Requirement

Detail

Reliability

Every inbound document is stored raw before processing and is idempotent on the interchange control number.

Timeliness

856 sent <5 min after load close (configurable). Alerts if a 997 is missing after 24h.

Security

Provider credentials in Vault. Documents retained per client policy.

6. Implementation Task Breakdown: Sprint 11

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: EDI Connector] ──> [Step 2: Inbound 850/940] ──> [Step 3: Outbound 856/945/810] ──> [Step 4: Monitor & Certify]



Step 1: EDI Provider Adapter & Trading Partner Setup

Goal: Connect to the EDI network on the existing framework.

Task 1.1: EdiAdapter & 997 Handling

Provider API, routing, acknowledgements.

Task 1.2: Trading Partner Setup UI

Per client, test/production, mapping overrides.

Step 2: Inbound 850 & 940 Processing

Goal: Turn POs into orders automatically.

Task 2.1: Parsers & Mapping to Orders

Ship windows, DC/store, alias resolution.

Task 2.2: Validation & Error Routing

Error queue with raw docs.

Step 3: Outbound 856, 945 & 810 Generation

Goal: Send accurate documents built from real floor data.

Task 3.1: 856 from Load Hierarchy

S-O-T-P-I structure, send timing.

Task 3.2: 945 & 810

Ship and invoice triggers.

Step 4: EDI Monitor & Partner Certification Tests

Goal: Make EDI observable and certified.

Task 4.1: EDI Monitor UI & Alerts

Status, raw/parsed, resend, missing-997 alerts.

Task 4.2: Sandbox Certification Run

One retailer's test cycle with a design partner.

7. Sprint Delivery Milestones

Milestone 1 — EDI Connector (Target: Day 3)

Provider connected. Trading partners configurable.

Milestone 2 — Inbound Orders (Target: Day 5)

850/940 create correct orders.

Milestone 3 — Outbound Documents (Target: Day 8)

856/945/810 generated and acknowledged.

Milestone 4 — Monitor & Sign-Off (Target: Day 10)

Monitor live. One partner certification test passed.

8. Open Questions Carried Into This Sprint

EDI provider: Stedi (API-first, lower cost) vs SPS Commerce (largest retailer network) vs supporting both?

Who pays EDI provider fees: passed through to brands, or bundled?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 12 can start.



End of Phase 2 · Sprint 11 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 11 of 15  |  Page