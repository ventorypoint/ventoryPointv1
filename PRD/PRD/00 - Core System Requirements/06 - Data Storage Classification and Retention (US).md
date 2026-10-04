Core System Requirements
Document 06 of 15 · Modern 3PL Warehouse Operating System (web application)
06. Data Storage, Classification & Retention (US Market)
Item
Detail
Purpose
Where every category of data is stored, how it is protected, how long it is kept, and how it is backed up and deleted, for a US-hosted MVP.
Parent documents
PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)
Version / Date / Status
1.0 (Draft) · September 26, 2026 · Draft for review


1. Data Residency Statement (MVP)
All customer data, including production databases, file storage, backups, logs and processing by sub-processors, is stored and processed in the United States. The primary region is US-East (AWS us-east-1 via Supabase), with backup copies in a second US region. Non-US regions (EU/UK/Canada/Australia) are introduced per tenant from Phase 3 · Sprint 15 onward.
2. Data Classification
Class
Examples
Handling
Restricted
Amazon buyer PII, payment tokens/bank references (Stripe-held), API credentials, PIN hashes
Encrypted at rest (plus field-level where noted), strict access, shortest retention, never in logs or non-prod
Confidential
Orders, ship-to addresses, inventory, rate cards, charges, invoices, SKU catalogs, pack photos
Tenant-isolated by RLS, encrypted at rest, access audited
Internal
Operational metrics, device registry, configuration, audit logs
Tenant-isolated, standard retention
Public
Marketing site, public API docs, marketplace profiles (Phase 3, opt-in)
No restrictions

3. Data Inventory & Storage Location
Data set
Store
Location
Encryption
Retention
Tenancy, users, roles
Supabase Postgres
US-East
At rest (AES-256), TLS in transit
Life of account + 90 days
Warehouse events
Postgres (partitioned)
US-East
At rest
Indefinite (online 24 months, then US cold archive)
Inventory, orders, shipments
Postgres
US-East
At rest
Life of account + 7 years (financial/traceability)
Location hierarchy, lots (dates), serials, LPNs & item history
Postgres
US-East
At rest
Life of account + 7 years (recall/traceability evidence); serial history kept even after the unit ships
Shopper PII (ship-to name/address/phone)
Postgres
US-East
At rest + field-level for Amazon PII
Amazon PII ≤30 days after shipment; other channels per brand setting (default 2 years), then pseudonymised
Billing charges, rate cards, exports
Postgres + Storage
US-East
At rest
7 years (tax/financial records)
Raw integration payloads
Postgres (integration_messages)
US-East
At rest
90 days (PII redacted after processing)
SKU images, labels, packing slips
Supabase Storage (private)
US-East
At rest, signed URLs
Life of SKU / 1 year for documents
Pack photos (Phase 2)
Supabase Storage (private)
US-East
At rest, signed URLs
Configurable 90–365 days; legal hold
Migration staging (Extensiv data)
Postgres (staging schema)
US-East
At rest + PII encrypted
Purged 30 days after go-live
Secrets & tokens
Supabase Vault
US-East
Vault encryption
Until revoked/rotated
Payment data
Stripe (never stored by us)
US
Stripe PCI Level 1
Per Stripe
Application logs
Logging provider
US
At rest
30 days (security events 1 year)
Error traces
Sentry
US
At rest, PII scrubbing
90 days
Emails
Resend
US
At rest
Per provider (30 days logs)
Analytics store (Phase 3)
Columnar store
US
At rest
Mirrors source retention

4. Backups & Disaster Recovery
Item
MVP
Enterprise (Phase 3–4)
Database backups
Daily full + Point-in-Time Recovery (7–30 days)
PITR + cross-region replica
Storage backups
Versioning + daily copy to a second US region
Same + object lock for evidence
RPO / RTO
≤15 min / ≤4 h
≤5 min / ≤1 h
Restore drills
Before go-live, then quarterly
Quarterly + annual regional failover
Floor continuity
Browser reconnect queue holds scans during short outages
On-site edge connector buffering (Phase 4)

5. Deletion & Data Subject Requests
Tenant offboarding: export (CSV/JSON) on request, then deletion of operational data within 90 days, except records we must keep (financial 7 years, retained in a restricted archive).
Shopper deletion requests (from brands or channel webhooks, e.g. Shopify customers/redact): pseudonymise PII on orders/shipments/photos while keeping non-personal operational and billing data.
Privacy request console (Phase 1 · Sprint 16): 3PL staff record a request forwarded by a brand (access, deletion, correction), search all data for that person, export it or pseudonymise it, and track it against the controller's deadline (e.g. 45 days under CCPA). Every request is logged.
Health data: protected health information (HIPAA) is not accepted in Phases 1–2. The terms of service prohibit it unless a HIPAA path with BAAs is agreed (Doc 05 §7b).
Deletion is logged and verified by an automated job report.
6. Access to Data
Customer data is reachable only through RLS-scoped application paths. Direct database access is limited to on-call engineers via just-in-time, audited access.
No production data is copied to non-production environments.
Exports (CSV, reports, API) are logged with user, scope and time.
7. US Sub-Processor List (MVP)
Sub-processor
Purpose
Location
Supabase (on AWS)
Database, auth, storage, functions
US-East
Vercel
Hosting, CDN, functions
US
Worker host (Fly.io or Render)
Background processing
US-East
Stripe
Payments
US
Resend
Transactional email
US
Sentry
Error monitoring
US
Logging/uptime provider
Logs, metrics, status page
US
Support chat provider
Customer support
US
ShipStation
Label creation (customer-connected)
US
Address validation provider (USPS/Google)
Address normalisation
US



End of Document 06.
