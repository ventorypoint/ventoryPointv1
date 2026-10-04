Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 9 of 15

Sprint 9: Small Parcel Suite: Native Rate Shopping, USB Scales, Dual Labels & Amazon Buy Shipping

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Small Parcel Suite (Master PRD §6.3.7)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 8: Returns (RMA): Portal Authorisations, Return Labels, Inspection & Dispositions

Unlocks next

Phase 2 · Sprint 10: Retail B2B Compliance: GS1-128 / SSCC-18 Labels, Pallet Building, Pick-Stage-Load & BOL

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to put the whole parcel-shipping process on the pack screen, without a separate shipping tool. Live multi-carrier rate shopping picks the cheapest service that meets the SLA, the carton weight is read straight from a USB scale in the browser, carrier and retail labels print together, and Amazon orders ship via Buy Shipping for Seller Fulfilled Prime protection.

By the end of this sprint:

A native ShippingProvider (multi-carrier aggregator) rate-shops USPS, UPS, FedEx, DHL and regional carriers using the 3PL's own negotiated accounts.

Shipping rules pick the cheapest compliant service per order (SLA, client preferences, exclusions).

USB scales feed weight automatically on supported browsers, with manual entry as a fallback.

Dual-label printing (4×6 carrier + retail carton label) and Amazon Buy Shipping work from the pack station.

Out of scope for this sprint: GS1-128/SSCC content on retail labels (Sprint 10 defines the compliant content; this sprint provides the dual-print mechanism), freight LTL rating (Phase 3), 3D dimensioners (Phase 4 horizon).

Dependency: Sprint 8 must be signed off (return labels move to the native provider). Also uses the Phase 1 · Sprint 10 ShippingProvider interface and Sprint 2 postage markup.

2. User Stories

As a 3PL Owner, I want each parcel shipped with the cheapest service that still meets the delivery promise so that postage margin is maximised.

As a Packer, I want the weight to appear automatically when the box touches the scale so that I never mistype it.

As a Packer, I want the carrier label and the retailer's carton label to print together so that B2B drop-ship orders are compliant.

As a 3PL serving Amazon sellers, I want to use Buy Shipping so that late-delivery claims are covered.

3. Functional Requirements

3.1 Native Shipping Provider

Aggregator integration (e.g. EasyPost or Shippo) implementing rates/labels/void/tracking/manifests, with carrier accounts connected per 3PL (BYO negotiated rates) or the aggregator's discounted rates.

Tracking webhooks update shipment status (in transit, out for delivery, delivered, exception) → portal feed.

End-of-day manifests/SCAN forms per carrier.

3.2 Rate Shopping & Shipping Rules

Rule builder per client/channel: allowed carriers/services, SLA (delivery days / ship-by), signature/insurance requirements, exclusions (PO boxes, hazmat), residential surcharge awareness.

At carton close: fetch rates → filter by rules → choose cheapest compliant → buy label. Show the chosen rate + alternatives, and allow a supervisor override with a reason.

3.3 USB Scale Integration

WebHID (and Web Serial fallback) in Chrome/Edge for common USB postal scales, with stable-weight detection and auto-fill. Manual entry for unsupported browsers.

3.4 Dual-Label Printing

Station printer profiles: carrier label printer + retail label printer. Both print on carton close in the correct order. The content template for the retail label comes from Sprint 10 (a placeholder carton label now).

3.5 Amazon Buy Shipping

For Amazon MFN orders: get eligible services from the SP-API Shipping/MFN APIs, buy the label, and confirm automatically (no separate confirm step).

4. Acceptance Criteria

With UPS, USPS and FedEx accounts connected, a 2-day-SLA order is labelled with the cheapest service whose delivery estimate meets the SLA.

Placing a box on a supported USB scale fills the weight within 1 second in Chrome and Edge.

Closing a carton at a dual-printer station prints the carrier label and retail label on the correct printers.

An Amazon order ships through Buy Shipping and is marked shipped on Amazon without a separate confirmation.

Label cost + markup appear in the ledger (Sprint 2) for every native label.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Rate shop + label purchase <3s p95 at carton close.

Reliability

Provider failover: if rate shopping times out, fall back to the client's default service (configurable).

Security

Carrier account credentials stored in Vault.

6. Implementation Task Breakdown: Sprint 9

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Provider] ──> [Step 2: Rules] ──> [Step 3: Scales & Labels] ──> [Step 4: Amazon & QA]



Step 1: Native Multi-Carrier Provider

Goal: Bring shipping inside the platform.

Task 1.1: Aggregator ShippingProvider

Rates, labels, void, tracking, manifests.

Task 1.2: Carrier Account Management

BYO accounts, Vault credentials, test labels.

Task 1.3: Tracking Webhooks

Status updates → shipment + portal feed.

Step 2: Rate Shopping & Shipping Rules

Goal: Pick the right service automatically.

Task 2.1: Rule Builder UI

Carriers/services/SLA/exclusions per client/channel.

Task 2.2: Rate Selection at Carton Close

Filter + cheapest compliant + override.

Step 3: USB Scale & Dual-Label Printing

Goal: Remove manual weight entry and paperwork mistakes.

Task 3.1: WebHID/Web Serial Scale Driver

Stable weight detection, supported-models list.

Task 3.2: Dual Printer Profiles

Carrier + retail label routing.

Step 4: Amazon Buy Shipping & End-to-End Tests

Goal: Protect Amazon sellers and verify everything together.

Task 4.1: Buy Shipping Integration

Eligible services, purchase, auto-confirm.

Task 4.2: Pack-Station E2E Tests

Rates, scale, dual labels on the device matrix.

7. Sprint Delivery Milestones

Milestone 1 — Native Provider (Target: Day 3)

Labels bought via the aggregator with BYO carrier accounts.

Milestone 2 — Rate Rules (Target: Day 5)

Rule-based cheapest compliant selection works.

Milestone 3 — Scales & Dual Labels (Target: Day 8)

USB scale auto-fill and dual printing verified.

Milestone 4 — Amazon & Sign-Off (Target: Day 10)

Buy Shipping live. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Aggregator choice (EasyPost vs Shippo vs direct carrier APIs) and its per-label fee's effect on transparent pricing.

Should ShipStation remain as an optional provider for 3PLs who prefer it?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 10 can start.



End of Phase 2 · Sprint 9 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 9 of 15  |  Page