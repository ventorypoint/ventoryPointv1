Core System Requirements

Document 12 of 15 · Modern 3PL Warehouse Operating System (web application)

12. Pre-Implementation Validation Plan

Item

Detail

Purpose

The validation work that must finish before Sprint 00 starts: 3PL discovery interviews, the Extensiv API feasibility test, a hardware and site survey, and design-partner selection. Together they form a go/no-go gate for implementation.

Parent documents

PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)

Duration

4–6 weeks, run in parallel with hiring and Sprint 00 preparation

Gate owner

Founder + tech lead + product owner (go / adjust / no-go decision)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Why This Gate Exists

Everything so far comes from desk research on Extensiv. Real 3PLs must confirm the pain points, the day-one must-haves and the pricing before money is spent on building.

The whole go-to-market plan depends on the 1-Click Extensiv Migration. If Extensiv's API or terms don't allow it, the plan must change before Sprint 15 is built, not after.

Hardware and site realities (scanners, printers, Wi-Fi, floor storage) decide several Phase 1 design choices (print connector, camera fallback, floor labels).

2. Track A — 3PL Discovery Interviews

Item

Plan

Who

8–10 US independent 3PLs matching the ICP (1–5 facilities, 10k–300k orders/month), at least 6 currently on Extensiv. Interview the owner plus the ops director or IT lead where possible.

Format

45–60 min video call + optional site visit for the top 3–5 candidates. Recorded with consent, notes in a shared template.

Output

A synthesis doc: top pains ranked, day-one must-haves, billing practices, hardware list, pricing reactions, and a design-partner shortlist.

2.1 Interview guide

Operations profile: facilities, sq ft, clients, monthly orders, % parcel vs retail B2B, peak season shape, storage types (shelves, racks, floor, cold, hazmat).

Current system: Extensiv modules used, what works, top 3 frustrations, recent outages, support experience, what they pay per year (all-in).

Day-one must-haves: what would stop you switching tomorrow? Specifically: brand portal usage, returns volume, retail/EDI dependence, kitting, lot/serial/expiry needs, FIFO/FEFO/LIFO rules.

Billing: how you bill clients today (tools, time spent, disputes), sample rate card, storage method, invoicing and collection pain.

Floor & hardware: scanner and printer models, label sizes, Wi-Fi coverage, workstations, temp-labour share and onboarding time.

Integrations: channels your clients use (Shopify, Amazon, Woo, others), shipping tools (ShipStation etc.), accounting system.

Switching: triggers, fears (downtime, data loss, retraining), who decides, contract end dates.

Pricing: reaction to the transparent tiers and the 20% saving guarantee; willingness to be a design partner (feedback time, reference, case study).

2.2 Success thresholds

≥6 of 10 confirm at least 2 of our top 5 pains (UI/training, billing leakage, integrations, pricing/overages, support).

≥4 express intent to be design partners on our terms.

Day-one must-haves fit within Phase 1 scope (including Sprint 11A), or the scope is adjusted and re-planned.

3. Track B — Extensiv API Feasibility Test

A 1–2 week engineering test using one design partner's real Extensiv credentials (authorised in writing), plus a legal review.

3.1 Desk research findings (public sources, September 2026)

Publicly documented: Extensiv publishes a developer portal for the 3PL Warehouse Manager REST API and help-centre articles on REST API access and credential management.

Access model supports our use case: a warehouse user with Support Portal access can self-provision a REST API credential (Client ID + Client Secret) and give it to an external developer, 'instantly without having to send a request to Extensiv'. Older guidance says to request access from api@extensiv.com. Keys mint short-lived bearer tokens (about 30–60 minutes).

Roles: 19 permission roles. The typical developer set is CustomerView, FacilityView, InventoryDetailView, ItemView, OrderView/Edit/Write, ReadPropertiesThirdParty, ReceiverView, plus a billing role for charges.

Unknowns to resolve in the test: API terms of use (not found publicly), rate limits (not documented publicly), possible connection-related fees (a help article mentions 'invoicing matters caused by deactivating connections'), and full field-level reference (the portal is JavaScript-rendered and couldn't be fully read).

Sources: developer.extensiv.com (3PL Warehouse Manager API), help.extensiv.com/rest-api (Getting Started with Credential Management; Providing REST API Access), Celigo's Extensiv connector docs, and the API Evangelist independent profile.

3.2 Entity checklist

Entity

Needed for

Via API? (desk research)

Fallback

Customers (clients)

Client accounts

Yes — Customers API (confirm fields)

CSV export

Items, packages/UoM, barcodes

SKU catalog

Yes — Items API with packaging attributes (confirm barcodes/UoM)

Item export

Locations

Location hierarchy (mapped to naming convention)

Partial — location appears on stock detail; a full bin list via API not confirmed

Location export

Inventory detail (location, lot, expiry, serial, LPN)

Opening balances

Yes — stock details with detail level 'Max' (individual serials, quantities per lot); confirm expiry & LPN fields

Stock detail report

Open orders

Cutover continuity

Yes — Orders API incl. allocation state

Order export

Open receivers (ASNs)

Inbound continuity

Yes — Receivers API

Receiver export

Billing charges (transactions)

Parallel-run billing comparison

Yes — itemised charges per customer/facility/period

Invoice export

Billing setup / rate cards

Rate card reconstruction

Not confirmed — assume no

UI export/PDF + guided mapping (default plan)



Legal review: Extensiv API terms of use, the customer's right to extract their own data, a customer authorisation letter template, and data handling during migration.

Exit criteria: ≥80% of the data volume extractable by API (the rest by export), with an extraction run under 1 hour for a typical facility. Otherwise, re-plan Sprint 15 as an 'assisted migration' using CSV importers, and update the sales message.

4. Track C — Hardware & Site Survey

Check

Why

Scanner models, OS/browser versions, keyboard-wedge support

Device matrix and minimum browser version (Sprint 6)

Label printer brands/models, DPI, label sizes

Print connector choice (Zebra Browser Print vs QZ Tray)

Wi-Fi coverage map / dead zones

Reconnect-queue expectations and access-point advice

Workstations, pack benches, scales, webcams

Pack flow and Phase 2 scale/photo capture

Storage layout: racks, shelves, floor areas, lanes, cages, cold rooms

Location hierarchy and naming convention (Sprint 3)

Existing location labels and codes

Alias mapping during migration

5. Track D — Design-Partner Selection

Criterion

Weight

Target

Mostly DTC/parcel (≥70% small-parcel orders)

25%

Required for the MVP cohort

Currently on Extensiv, contract renewal within 9 months

20%

Strong preference

1–2 facilities, 10k–50k orders/month

15%

Required

Channels covered by Phase 1 connectors (Shopify, Amazon, Woo)

15%

≥80% of their order volume

Willing to give weekly feedback + reference + case study

15%

Required

Hardware compatible (or willing to adopt the recommended list)

10%

Required



Output: 3–5 signed design-partner agreements for the first go-lives, plus a pipeline of 20–25.

6. Track E — Phase 1 Decisions

Every Phase 1 question in the Decision Log (Core Doc 14) is answered or explicitly deferred, especially those that shape the database: floor-worker login, location convention, allocation timing, storage billing method, print connector.

7. Gate Decision

Outcome

Condition

Next step

Go

Tracks A–E meet thresholds

Start Sprint 00

Adjust

Scope/must-haves or migration approach need changes

Update master + sprint PRDs, re-plan (≤2 weeks), then start

No-go

Pain or willingness to switch not confirmed

Revisit the segment/positioning before any build spend



End of Document 12.

Core System Requirements  |  12 Pre-Implementation Validation  |  Page