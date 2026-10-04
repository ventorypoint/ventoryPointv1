Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 13 of 19

Sprint 13: Amazon, WooCommerce, ShipStation, CSV/SFTP & Public API

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 12–13 — Integrations v1

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 12: Integration Framework, Self-Healing & Shopify

Unlocks next

Phase 1 · Sprint 14: Billing Foundation (Billable Events, Rate Cards, Export)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 13 is to complete the Phase 1 (MVP) integration set on the Sprint 12 framework: Amazon and WooCommerce order channels, ShipStation as the label provider behind the pack station, file-based CSV/SFTP exchange for clients without a supported platform, and a documented public REST API for technical clients.

By the end of this sprint:

Amazon MFN and WooCommerce orders flow in, inventory flows out, and shipment confirmations flow back.

Pack stations buy and print labels through ShipStation, and tracking is stored automatically.

Clients can drop order and ASN files on SFTP (or upload CSV) on a schedule.

Technical clients can create orders/ASNs and read inventory/shipments via API keys, with OpenAPI docs.

Out of scope for this sprint: other marketplaces (Phase 2), outbound webhooks & GraphQL (Phase 2), native rate shopping (Phase 2).

Dependency: Sprint 12 must be signed off before this sprint starts. Sprint 12 (framework, adapter interface, error queue), Sprint 10 (ShippingProvider interface), Sprint 7 (ASN model).

2. User Stories

As an IT/Systems Lead, I want to connect a client's Amazon Seller Central account so that their merchant-fulfilled orders ship from our warehouse automatically.

As a Packer, I want the shipping label to print when I close the box without leaving the pack screen.

As a client with a custom-built store, I want to send orders by API or file so that I can use the 3PL without a supported platform.

As an Ops Manager, I want all channels to share the same error queue so that there's one place to fix problems.

3. Functional Requirements

3.1 Amazon SP-API Adapter

Connect via SP-API authorization. Orders (MFN) via notifications + polling. PII access per Amazon policy (restricted data token).

Inventory quantity feed (MFN). Shipment confirmation with carrier/tracking. Amazon Buy Shipping integration is Phase 2.

3.2 WooCommerce Adapter

REST API keys + webhooks (order created/updated). Stock quantity push. Order completion + tracking (via a shipment tracking meta/plugin convention).

3.3 ShipStation ShippingProvider

Implements getRates, createLabel, voidLabel, getTracking against the ShipStation API. Carrier/service mapping per client (requested service → carrier service).

Pack station: on carton close → create label → auto-print. Void/re-label from the shipment detail page.

3.4 CSV/SFTP Channel

Per-client SFTP folder (managed SFTP service) or UI upload. Scheduled pickup (every 5–15 min). Templates for orders and ASNs. Processed/error files moved + error queue entries.

Optional daily inventory snapshot file drop-back.

3.5 Public REST API v1

API keys (org- or client-scoped) with scopes. Endpoints: POST/GET /orders, POST /orders/{id}/cancel, POST/GET /asns, GET /inventory (filterable by SKU, lot, expiry window, status and location; returns full location path, LPN, lot dates and serials), GET /serials/{serial} (current location + history), GET /lots/{lot} (quantities, locations, dates), GET /shipments (with serials/lots per carton).

Idempotency-Key header support, cursor pagination, rate limiting, consistent error model. OpenAPI 3.0 spec + hosted reference docs.

4. Acceptance Criteria

An Amazon MFN test order is imported, shipped, and its shipment confirmed on Amazon with tracking within 5 minutes of ship.

A WooCommerce order imports within 5s, and stock updates after a pick.

Closing a carton creates and prints a ShipStation label in <5s. Voiding frees the label.

An SFTP order file with 2 bad rows creates the valid orders and 2 error-queue entries.

An API POST /orders repeated with the same Idempotency-Key creates one order.

5. Non-Functional & Security Requirements

Requirement

Detail

Security

API keys hashed + scoped. SP-API restricted data handled per Amazon policy (PII encryption, retention limits).

Reliability

All channels on the Sprint 12 framework (raw store, retries, reconciliation).

Performance

API p95 <300ms for reads, <500ms for order create. Label creation <5s.

Documentation

OpenAPI spec validated in CI. Docs published with examples.

6. Implementation Task Breakdown: Sprint 13

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Amazon] ──> [Step 2: WooCommerce] ──> [Step 3: ShipStation] ──> [Step 4: Files & API]



Step 1: Amazon SP-API Adapter

Goal: Connect the biggest marketplace for merchant-fulfilled orders.

Task 1.1: Authorization & Order Ingestion

SP-API auth, notifications + polling, PII handling.

Task 1.2: Inventory Feed & Shipment Confirmation

Quantity feed, confirm shipment with tracking.

Step 2: WooCommerce Adapter

Goal: Support the most common self-hosted store.

Task 2.1: Connect, Webhooks & Orders

API key connect, webhook registration, order mapping.

Task 2.2: Stock & Completion Push

Stock quantity + completion with tracking.

Step 3: ShipStation Shipping Provider

Goal: Buy and print labels from the pack station.

Task 3.1: Provider Implementation

Rates, labels, void, tracking. Service mapping per client.

Task 3.2: Pack Station Wiring

Label on carton close, auto-print, re-label/void UI.

Step 4: CSV/SFTP Channel & Public API v1

Goal: Serve clients without a supported platform.

Task 4.1: SFTP/CSV Scheduled Pickup

Per-client folders, templates, error routing.

Task 4.2: Public API v1 & Docs

Endpoints, API keys, idempotency, rate limits, OpenAPI docs.

7. Sprint Delivery Milestones

Milestone 1 — Amazon Orders In (Target: Day 3)

Amazon MFN orders ingest on a sandbox account.

Milestone 2 — WooCommerce & Amazon Out (Target: Day 5)

Inventory/fulfillment push works for both channels.

Milestone 3 — ShipStation Labels (Target: Day 8)

Labels created and printed from the pack station.

Milestone 4 — Files, API & Sign-Off (Target: Day 10)

SFTP + API v1 live with docs. All acceptance criteria pass.

8. Open Questions Carried Into This Sprint

Managed SFTP provider choice (e.g. AWS Transfer Family vs. a hosted SFTP service).

Should design partners with their own ShipStation accounts use those accounts (BYO), or the platform's master account?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 14 can start.



End of Phase 1 · Sprint 13 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 13 of 19  |  Page