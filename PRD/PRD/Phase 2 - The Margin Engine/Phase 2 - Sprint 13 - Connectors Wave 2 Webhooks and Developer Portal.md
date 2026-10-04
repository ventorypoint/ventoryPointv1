Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 13 of 15

Sprint 13: Connector Wave 2 (50+ Total), Outbound Webhooks, GraphQL & Developer Portal

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Integration Expansion & Developer Platform (Master PRD §6.3.8)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 12: Integration Rule Engine, AI SKU Matching & Connector Wave 1

Unlocks next

Phase 2 · Sprint 14: Kitting & Bundling, FEFO Hard-Lock and Lot Genealogy with 30-Minute Mock Recall

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to reach the master PRD's integration breadth (50+ turnkey connectors) and open the platform to developers. Every warehouse event can be delivered by outbound webhook within a second, a GraphQL API sits alongside REST, and a developer portal gives technical 3PLs and brands self-serve keys, docs and logs.

By the end of this sprint:

The connector library reaches 50+ endpoints (marketplaces, carts, subscription/returns apps, accounting, EDI).

Outbound webhooks cover all key events (order.created, order.picked, order.packed, order.shipped, inventory.threshold_breached, return.inspected, invoice.issued, and more) with signing, retries and delivery logs.

GraphQL API v1 is available for read-heavy use cases, and REST API v2 adds the new Phase 2 resources.

A developer portal offers API keys, OpenAPI/GraphQL docs, webhook testing and request logs.

Out of scope for this sprint: an app marketplace for third-party developers (Phase 4 horizon), custom connector SDK for partners.

Dependency: Sprint 12 must be signed off (framework extensions, rule engine).

2. User Stories

As an IT/Systems Lead, I want to connect almost any store a new brand uses without custom work so that no deal is lost over integrations.

As a technical Brand client, I want real-time webhooks when my orders ship so that my systems update instantly.

As a developer, I want clear docs, test keys and logs so that I can integrate in a day.

3. Functional Requirements

3.1 Connector Wave 2

Adapters to reach 50+: e.g. Amazon Vendor Central (DF), Target+, Wayfair, Newegg, Mercado Libre (optional), Shopify Plus B2B, Salesforce Commerce Cloud, PrestaShop, OpenCart, Ecwid, Shift4Shop, Volusion, Kickstarter/BackerKit, Bold Subscriptions, Loop Returns, AfterShip Returns, ChannelAdvisor (Rithum), NetSuite (orders/inventory), Xero (billing), plus the Phase 1 and wave 1 connectors.

Connector catalog UI with setup guides, required credentials and status.

3.2 Outbound Webhooks

Subscriptions per org/client: event types, endpoint URL, secret. HMAC-signed payloads, at-least-once delivery with retries (exponential up to 24h), a delivery log, replay, and auto-disable on persistent failure with alerts.

Delivered from the event backbone. Target <1s from event to first delivery attempt.

3.3 APIs

REST API v2: returns, invoices, charges (read), loads, EDI status, webhooks management. Versioning policy and deprecation headers.

GraphQL v1 (read-focused): orders, shipments, inventory, returns, invoices, with client-scoped auth, query cost limits and persisted queries.

3.4 Developer Portal

Public API reference and guides are server-rendered and indexable (with llms-full.txt entries and HowTo/Article schema) so AI assistants can answer integration questions accurately. Keys, logs and account pages stay private.

Self-serve API keys (test/live), scopes, rotation. Interactive docs (OpenAPI + GraphQL explorer). Webhook test sender. Request logs (last 30 days) with filters.

4. Acceptance Criteria

The connector catalog lists ≥50 working endpoints, each passing the adapter contract suite.

An order.shipped webhook is delivered, signed, within 1 second of the ship event (p95). A failing endpoint is retried and logged.

The GraphQL query for a client's last 100 orders with shipments returns in <500ms and never returns another client's data.

A developer creates a test key, sends a test webhook and sees the request logs without contacting support.

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Webhook dispatch <1s p95. GraphQL p95 <500ms under cost limits.

Security

Signed webhooks, scoped keys, rate limits, abuse protection.

Compatibility

API versioning with at least 12 months' deprecation notice.

6. Implementation Task Breakdown: Sprint 13

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Wave 2 A] ──> [Step 2: Wave 2 B] ──> [Step 3: Webhooks] ──> [Step 4: APIs & Portal]



Step 1: Connector Wave 2 — Marketplaces & Retail

Goal: Close the incumbent's breadth gap.

Task 1.1: Amazon Vendor, Target+, Wayfair, Newegg and others

Adapters + contract tests.

Step 2: Connector Wave 2 — Carts, Apps & Back Office

Goal: Cover legacy carts and brand back-office tools.

Task 2.1: Legacy carts, subscription/returns apps, NetSuite, Xero

Adapters + contract tests.

Task 2.2: Connector Catalog UI

Guides, credentials, status.

Step 3: Outbound Webhooks

Goal: Push every event to customer systems in real time.

Task 3.1: Subscriptions, Signing & Delivery

Consumer on the backbone, retries, log, replay.

Step 4: REST v2, GraphQL v1 & Developer Portal

Goal: Make integration self-serve.

Task 4.1: REST v2 & GraphQL v1

New resources, auth, cost limits.

Task 4.2: Developer Portal

Keys, docs, test sender, request logs.

7. Sprint Delivery Milestones

Milestone 1 — Wave 2 Marketplaces (Target: Day 3)

Marketplace/retail connectors certified.

Milestone 2 — Wave 2 Carts & Apps (Target: Day 5)

Library at 50+. Catalog UI live.

Milestone 3 — Webhooks (Target: Day 7)

Webhooks delivering <1s with retries and logs.

Milestone 4 — APIs, Portal & Sign-Off (Target: Day 10)

GraphQL/REST v2 and developer portal live.

8. Open Questions Carried Into This Sprint

Final wave 2 list: confirm against sales pipeline demand (legacy carts vs international marketplaces).

GraphQL writes (mutations) in Phase 2, or read-only until Phase 3?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 14 can start.



End of Phase 2 · Sprint 13 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 13 of 15  |  Page