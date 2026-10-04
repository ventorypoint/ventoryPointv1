Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 12 of 19

Sprint 12: Integration Framework, Self-Healing & Shopify

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprints 12–13 — Integrations v1

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 11A: Brand Visibility Lite & Basic Returns (Switching Essentials)

Unlocks next

Phase 1 · Sprint 13: Amazon, WooCommerce, ShipStation, CSV/SFTP & Public API

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 12 is to build the connector framework and the self-healing order pipeline, and to prove both with a production-grade Shopify connector: orders arrive by webhook in seconds, bad data is fixed automatically or queued with a one-click fix, inventory is pushed back on every scan, and fulfillments with tracking flow back to the store.

By the end of this sprint:

A 3PL can connect a client's Shopify store via OAuth and map Shopify locations to facilities.

Shopify orders appear as validated orders within seconds.

Address problems are normalised automatically or held with a suggested fix. Unmapped SKUs get mapping suggestions.

Inventory levels are pushed to Shopify on every ledger change. Shipments push fulfillment + tracking.

Missed webhooks are recovered by reconciliation polling.

Out of scope for this sprint: other channels (Sprint 13), outbound customer webhooks (Phase 2), AI fuzzy matching (Phase 2).

Dependency: Sprint 11A must be signed off before this sprint starts. Sprint 8 (orders + holds), Sprint 10 (shipments), Sprint 5 (inventory change events), Sprint 4 (aliases).

2. User Stories

As an IT/Systems Lead, I want to connect a client's Shopify store in under 10 minutes without writing code so that onboarding a brand is painless.

As an Ops Manager, I want bad addresses fixed automatically so that orders don't sit stuck while a customer waits.

As an Ops Manager, I want a single queue of every integration problem with a suggested fix so that nothing fails silently.

As a Brand client, I want my Shopify stock to update the moment the warehouse ships or receives so that I never oversell.

3. Functional Requirements

3.1 Connection Management

Connections list per client. Connect wizard (OAuth for Shopify), facility/location mapping, test connection, pause/resume, delete.

Credentials stored in Supabase Vault and never returned to the browser.

3.2 Ingestion Pipeline

Edge Function /hooks/{channel}/{connection}: verify HMAC → persist raw integration_messages → 200 OK fast → async processing via queue.

Processor: parse → map (aliases, facility) → validate → create/update/cancel order (idempotent on external id + update timestamp).

3.3 Self-Healing Steps

Address: normalise via provider. High-confidence corrections applied automatically (original stored). Low confidence → hold Address review with the suggestion.

SKU: alias lookup → exact barcode/SKU match → deterministic suggestions (case-insensitive, separator-insensitive, variant option patterns) → hold Unmapped SKU with the top suggestions. Confirming creates the alias and releases all affected orders.

Auto-retry of transient errors (rate limit, 5xx) with backoff.

3.4 Error Queue

Unified error queue (filter by client, connection, type), with one-click actions (accept suggestion, edit, retry, ignore with reason). Bulk actions.

3.5 Outbound Sync

channel_sync event consumer: on inventory change for a mapped SKU → compute available-to-sell per channel location → push (debounced 250ms per SKU).

On shipment shipped → create Shopify fulfillment with tracking + carrier. On cancel → cancel the fulfillment order where possible.

3.6 Reconciliation & Health

Every 15 min: fetch orders updated since the cursor → process any missed. Nightly inventory diff report (channel vs. ledger).

Connection health panel: last success, error rate, message lag.

3.7 Shopify Mandatory Privacy Webhooks

Handle customers/data_request (compile the person's data for the merchant), customers/redact (pseudonymise their PII across orders, shipments, photos and messages) and shop/redact (remove a disconnected shop's data after the retention window), with logged outcomes.

4. Acceptance Criteria

A Shopify order appears in the order list <2s p95 after checkout.

An address with a misspelled street and missing ZIP+4 is corrected automatically, with the original preserved.

Confirming an unmapped-SKU suggestion releases all 12 held orders containing that SKU.

With webhooks disabled for 30 minutes, reconciliation creates all missed orders with no duplicates.

Receiving 50 units updates the Shopify inventory level within 5 seconds.

5. Non-Functional & Security Requirements

Requirement

Detail

Reliability

At-least-once processing with idempotent order upsert, so no duplicates.

Latency

Inventory push dispatch <200ms p95 after the ledger event (excluding Shopify's own processing).

Security

HMAC verification. Vault-stored tokens. Least-privilege Shopify scopes.

Observability

Structured logs per message, with metrics for lag, errors and push latency.

6. Implementation Task Breakdown: Sprint 12

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Framework Schema] ──> [Step 2: Ingestion & Healing] ──> [Step 3: Shopify Connector] ──> [Step 4: Errors & Reconciliation]



Step 1: Connection, Message & Error Schema

Goal: Store every integration interaction for replay and audit.

Task 1.1: Migrations & RLS

connections, integration_messages, sync_cursors, inventory_sync_state, integration_errors, address_validations.

Task 1.2: ChannelAdapter Interface

TypeScript contract + mock adapter + test harness.

Step 2: Ingestion Pipeline & Self-Healing Steps

Goal: Turn raw payloads into clean orders, automatically where possible.

Task 2.1: Webhook Edge Function & Queue Processor

Verify → persist → enqueue → process.

Task 2.2: Address Normalisation

Provider client, confidence rules, hold path.

Task 2.3: SKU Resolution & Suggestions

Alias → match → suggestion ranking → hold.

Step 3: Shopify Connector

Goal: Ship a production-grade Shopify integration.

Task 3.1: OAuth App & Connect Wizard

Install flow, scopes, location mapping.

Task 3.2: Orders & Fulfillment

Webhooks (create/updated/cancelled), fulfillment + tracking push.

Task 3.3: Inventory Push

channel_sync consumer, debounce, rate-limit handling.

Step 4: Error Queue, Reconciliation & Health

Goal: Guarantee nothing is lost and everything is visible.

Task 4.1: Error Queue UI

Filters, one-click actions, bulk resolve.

Task 4.2: Reconciliation Poller & Inventory Diff

Cursor-based polling, nightly diff report.

Task 4.3: Connection Health Panel & Alerts

Metrics + alert rules.

7. Sprint Delivery Milestones

Milestone 1 — Framework Data Layer (Target: Day 2)

Schema + adapter contract deployed.

Milestone 2 — Ingestion & Self-Healing (Target: Day 5)

Webhook → order pipeline with address and SKU healing works (mock channel).

Milestone 3 — Shopify Live (Target: Day 8)

Orders in, inventory out, fulfillments out on a Shopify dev store.

Milestone 4 — Error Queue, Reconciliation & Sign-Off (Target: Day 10)

30-minute outage test passes. Error queue live.

8. Open Questions Carried Into This Sprint

Auto-apply threshold for address corrections, and whether some clients want every correction reviewed.

Multi-location Shopify stores: map each Shopify location to a facility, or push the aggregate to one location?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 13 can start.



End of Phase 1 · Sprint 12 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 12 of 19  |  Page