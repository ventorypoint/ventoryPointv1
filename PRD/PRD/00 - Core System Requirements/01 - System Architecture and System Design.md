Core System Requirements
Document 01 of 15 · Modern 3PL Warehouse Operating System (web application)
01. System Architecture & System Design
Item
Detail
Purpose
The target architecture for the whole product (MVP → enterprise), the technology stack and vendor register, and the design decisions every sprint must follow.
Parent documents
PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)
Version / Date / Status
1.0 (Draft) · September 26, 2026 · Draft for review


1. Architecture Principles
#
Principle
What it means in practice
AP-1
The warehouse event is the spine
Every physical action is written once to the append-only warehouse_events store. Inventory, billing, channel sync, dashboards, analytics and AI all consume events, and no module keeps a private copy of the truth.
AP-2
One unified core, one database
WMS, OMS, billing and integrations share one PostgreSQL schema (no stitched-together products). Modular boundaries are enforced in code, not by separate databases.
AP-3
Security at the data layer
Tenant isolation (Organization → Facility → Client) is enforced by Row Level Security in Postgres, not only in the UI or API.
AP-4
Money and stock change only through atomic RPCs
Inventory, allocation and billing mutations run in security definer functions that lock, validate, write the event and update projections in one transaction.
AP-5
Web application only
Every surface (admin, floor workspace, merchant portal) is a responsive web app. Devices connect through the browser (keyboard-wedge scanners, print connector, WebHID scales, getUserMedia webcams).
AP-6
Idempotent and replayable everywhere
Every write from floor, webhook, API or queue carries an idempotency key. Raw inbound payloads are stored so failures can be replayed after a fix.
AP-7
Buy commodity, build differentiation
Use managed services for auth, database, payments, email, labels and EDI. Build the event core, floor UX, billing engine, migration engine and AI.
AP-9
API-first modular monolith
One codebase, not microservices. All business logic lives in a shared service layer (packages/services + packages/domain + Postgres RPCs). The web app (server actions), the internal/public REST API and future mobile apps are thin adapters over the same services, so a mobile app can be added later without rewriting logic.
AP-8
Measure before automating
Every AI/automation feature goes off → shadow → assist → auto, with measured savings against a baseline (Phase 3).

2. Logical Architecture

Figure 1 — Logical architecture: users, experience, application, data and external layers
2.1 Layer responsibilities
Experience layer: Next.js App Router (React Server Components + client components), Tailwind CSS + shadcn/ui (Radix primitives). The admin app, /floor workspace and portal share one codebase and design system (Document 04).
Application layer (API-first): a shared service layer (packages/services) holds every business command and query, with Zod validation and shared types. Next.js server actions (web) and /api/v1 route handlers (internal API for first-party clients, public API for partners) are thin adapters that only authenticate, call a service and shape the response. Supabase Edge Functions for public webhooks and auth helpers. A worker service (Node.js/TypeScript) for queue consumers and scheduled jobs.
Data layer: Supabase Postgres (RLS, security definer RPCs, pgmq queues, Realtime broadcast, Storage, Vault). Analytics store added in Phase 3 (fed by change-data capture).
External services: see the Vendor & Brand Register (Section 6).
3. The Event Spine

Figure 2 — One scan fans out to every consumer through the event store and queues
Rule
Detail
Write path
record_event / record_events RPC: scope check → registry type/schema check → insert with a unique idempotency key → enqueue one delivery per registered consumer → Realtime broadcast on facility:{id}.
Consumers
Inventory projection, billing capture, channel sync, dashboards/metrics, and later analytics export, webhooks (Phase 2) and AI signals (Phase 3). Each consumer is idempotent on (event_id, consumer).
Ordering
Per-entity ordering by occurred_at + sequence. Consumers tolerate out-of-order delivery for different entities.
Failure handling
At-least-once delivery, exponential backoff, dead-letter view with replay. Consumer lag alerts at >5s (projection) and >60s (billing).
Retention
Events kept indefinitely (audit/billing evidence), monthly partitions, and cold archive of partitions older than 24 months (Document 06).

4. Deployment Topology (US)

Figure 3 — US deployment topology for the MVP
5. Data Domains

Figure 4 — Bounded contexts and their main entities
Every business table carries organization_id, plus facility_id and/or client_account_id where relevant. Cross-domain access goes through service functions or views, never through direct writes into another domain's tables.
6. Technology Stack & Vendor Register (Core Brands)
The full list of third-party products and brands the platform is built on or integrates with. Each is a sub-processor or dependency to track for security review (Document 05), data location (Document 06) and cost.
Category
Brand / product
Used for
Phase
Data location
Frontend framework
Next.js (Vercel), React, TypeScript
All web surfaces
1
n/a (code)
UI kit
Tailwind CSS, shadcn/ui, Radix UI, Lucide icons
Design system implementation
1
n/a
Brand fonts
Space Grotesk, DM Sans, JetBrains Mono (Google Fonts, SIL OFL)
Headings, body, codes (design reference: rillet.com, Doc 11)
1
Self-hosted
Hosting / CDN
Vercel
SSR, functions, edge, custom domains
1
US (iad1)
Database & backend
Supabase (PostgreSQL, Auth, RLS, Realtime, Queues/pgmq, Edge Functions, Storage, Vault)
Core data, auth, events, files, secrets
1
US-East (AWS us-east-1)
Workers
Fly.io or Render (Node.js)
Queue consumers, schedulers
1
US-East
Email
Resend
Invites, notifications, invoices
1
US
Errors & performance
Sentry
Error tracking, tracing
1
US
Logs & metrics
Better Stack / Grafana Cloud (choose one)
Logs, uptime, metrics, status page
1
US
Source & CI
GitHub, GitHub Actions
Code, CI/CD, security scanning
1
US
Support chat
Intercom / Crisp / Plain (choose one)
In-app support
1
US
Payments (platform)
Stripe Billing, Stripe Tax
3PL subscriptions (MVP)
1
US
Payments (3PL ↔ brand)
Stripe Connect
Auto-debit, payouts
2
US
Sales channels
Shopify, Amazon Seller Central (SP-API), WooCommerce
Orders, inventory, fulfillment
1
Vendor
Shipping labels
ShipStation (MVP); EasyPost or Shippo (Phase 2)
Labels, tracking
1 / 2
US
Carriers
USPS, UPS, FedEx, DHL, regionals (via label providers)
Shipping
1
Vendor
Address validation
USPS Addresses API and/or Google Address Validation
Self-healing addresses
1
US
Printing
Zebra Browser Print or QZ Tray
ZPL printing from the browser
1
Local
Migration source
Extensiv 3PL Warehouse Manager API
Customer-authorised extraction
1
Vendor
Accounting
QuickBooks Online / Desktop
Invoice & payment sync
2
Vendor
EDI
Stedi and/or SPS Commerce
850/856/810/940/945
2
US
AI models
Anthropic Claude (API)
Copilot, SKU matching, extraction; also AI-assisted engineering (Doc 08)
2–3
US
Compliance automation
Vanta or Drata
SOC 2 readiness
2
US
Search & AI visibility
Google Search Console, Bing Webmaster Tools (+IndexNow), optional AI-visibility tracker
SEO/GEO monitoring (Doc 15)
1
n/a
Analytics store
ClickHouse / BigQuery / MotherDuck (choose one)
AI & reporting history
3
US

7. Integration Architecture
Inbound: channel webhooks → Edge Function (signature check) → raw integration_messages → queue → adapter parse/map → domain command. Reconciliation polling every 15 minutes as a safety net.
Outbound: domain event → channel_sync consumer → adapter push (debounced per SKU, rate-limit aware) → message log.
Adapter contract: ChannelAdapter (verifyWebhook, parseOrder, pushInventory, pushFulfillment, pollSince) and ShippingProvider (getRates, createLabel, voidLabel, getTracking). New connectors are additive and contract-tested.
Public API: REST v1 (OpenAPI 3.0), API keys (hashed, scoped), Idempotency-Key header, cursor pagination, rate limits, consistent error model.
8. Non-Functional Requirements (Platform-Wide)
Area
MVP target
Enterprise target
Floor responsiveness
Scan → next step <300ms p95
Same, at 5x peak
Event write
record_event p95 <50ms
2,000 events/s per facility (with automation)
Channel sync
Inventory push dispatched <200ms p95 after scan
Same
Order ingestion
Webhook → visible order <2s p95
Same
Availability
99.9% monthly
99.95% premium tier
Recovery
RPO ≤15 min, RTO ≤4 h (PITR)
RPO ≤5 min, RTO ≤1 h, regional failover
Scale
300k orders/month per tenant; 5x peak test
1M+ orders/month per tenant
Accuracy
Pick ≥99.8%, inventory ≥99.5%, location accuracy ≥99.5%, billing reference suites 100%
Same
Traceability
'Where is it?' lookup (SKU / lot / serial / LPN / location) with full path + history <3s; 100% rotation compliance; 0 expired units shipped
Same, plus full lot genealogy/mock recall <1 min (Phase 2)
Accessibility
WCAG 2.2 AA on all web surfaces, screen-reader and keyboard support, high-contrast/large-text modes, spoken floor prompts
WCAG 2.2 AA + VPAT/ACR + annual third-party audit

9. Architecture Decision Records (Initial)
ADR
Decision
Why
Revisit when
ADR-001
Next.js + Supabase monolith (modular)
Fastest path to a secure multi-tenant MVP. RLS gives isolation by default. The team is familiar with it.
Sustained >2,000 events/s per facility or team >25 engineers
ADR-002
Event store in Postgres (not Kafka)
Transactional consistency with projections, simpler ops.
Phase 4 automation event rates
ADR-003
Web-only client for Phases 1–4 (no native apps yet)
Product decision. Browsers cover scanners/printers/scales/cameras via connectors and web APIs. Native mobile apps stay possible later because of ADR-007.
A hardware need browsers can't meet, or a customer demand for native/mobile apps
ADR-004
Postgres queues (pgmq) + external worker
No extra infrastructure. Exactly-once effects via consumer idempotency.
Queue throughput limits
ADR-005
Stripe for all payments
PCI scope SAQ-A. Connect avoids money transmission for 3PL collections.
Non-Stripe markets
ADR-006
US-only data residency for MVP
Launch market is the US. Simpler compliance.
First non-US customer (Phase 3/4)
ADR-007
API-first modular monolith with a shared service layer
Keeps one codebase and simple operations, while every capability is reachable over a documented API. Future mobile apps (React Native/Expo or native) reuse services, types, validation, auth (Supabase JWT), realtime and the event API without backend rewrites.
Only if independent scaling or team size forces extracting a service. Service boundaries already match modules, so extraction stays possible

10. Environments & Delivery
Local: Supabase CLI (Docker), seeded tenants, simulator data.
Preview: per pull request (Vercel preview + Supabase branch), with automated tests and RLS suite.
Staging: production-like, synthetic load, device-matrix testing, migration rehearsals.
Production: US region, feature flags per organization, zero-downtime migrations (expand → migrate → contract).
Release: trunk-based development, CI gates (Document 02), progressive rollout by flag, instant rollback.


End of Document 01.
