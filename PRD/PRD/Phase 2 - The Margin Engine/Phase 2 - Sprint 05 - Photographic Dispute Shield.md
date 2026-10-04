Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 5 of 15

Sprint 5: Photographic Dispute Shield at the Pack Station

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Photographic Dispute Shield (Master PRD §6.3.2)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 4: Embedded Payments & Scheduled Auto-Debit (Card / ACH)

Unlocks next

Phase 2 · Sprint 6: Merchant Portal Foundation: Client Users, White-Label Branding & Live Visibility

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to make fulfillment disputes quick to settle. An inexpensive USB webcam at each pack station automatically photographs the open carton when the final item is scanned. The photo is linked to the order, the carton and its billing lines, so any "item missing" or "insert not included" claim can be answered with timestamp, worker, scan log and a colour photo in one click.

By the end of this sprint:

Pack stations can be paired with a webcam in the browser, with no extra software.

A photo is captured automatically on carton close (plus optional extra shots), compressed and uploaded, including after brief network drops.

Photos show on the order, shipment and invoice-line drill-down, with the scan log.

Retention and privacy rules are configurable per organization.

Out of scope for this sprint: return-inspection photos (Sprint 8 reuses this capture component), AI photo verification of contents (Phase 3 candidate), portal display (Sprint 6/7 exposes photos to clients).

Dependency: Sprint 4 must be signed off. Also uses Phase 1 · Sprint 10 (pack flow, cartons) and Phase 1 · Sprint 6 (floor workspace, reconnect queue).

2. User Stories

As a 3PL Owner, I want a photo of every packed box so that I can prove what was shipped when a client disputes an order.

As a Packer, I want the photo taken automatically so that it doesn't slow me down.

As a Billing user, I want the photo next to the invoice line so that disputes are settled without investigation.

As an Admin, I want to control how long photos are kept so that storage costs and privacy obligations are managed.

3. Functional Requirements

3.1 Camera Pairing

Pack station settings: select a camera via browser media devices (getUserMedia), preview, and set resolution/crop. Paired camera stored per device/station.

Health check on floor session start: camera available, permission granted, frame not black.

3.2 Automatic Capture

Trigger on the final item scan / carton close (configurable: every carton, or only multi-item/high-value orders). An optional 'extra photo' button for damage or special packing.

Frame captured to canvas → JPEG/WebP compressed (target <300 KB) → timestamp/order/carton overlay watermark → queued upload to Supabase Storage (signed URL) through the reconnect queue.

3.3 Linking & Viewing

carton_photos linked to carton, shipment, order and packer, with the capture event.

Viewers: order detail, shipment detail, and the ledger/invoice drill-down (a pick/pack charge shows its carton photos + scan log). Zoom, download, share link (expiring).

3.4 Retention & Privacy

Worker notice: camera capture is added to the facility's monitoring notice (Phase 1 · Sprint 06), workers re-acknowledge, and signage guidance is provided for pack stations. No facial recognition or biometric processing.

Retention per organization (e.g. 90/180/365 days), with automatic purge. Legal hold per order.

Camera placement guidance (point at the carton, not faces) and an optional face-blur flag (stretch).

4. Acceptance Criteria

Closing a carton at a paired station creates exactly one photo linked to that carton within 3 seconds (online).

A capture made during a 60-second network drop uploads after reconnect, correctly linked.

From an invoice line for the order's pick/pack fee, a Billing user reaches the photo and scan log in two clicks.

Photos older than the retention period are purged, except those on legal hold.

Pack-station throughput doesn't drop by more than 2% with capture enabled (timed test).

5. Non-Functional & Security Requirements

Requirement

Detail

Performance

Capture adds <300ms to carton close. Upload happens in the background.

Storage

Average photo <300 KB, cost modelled per 10k orders. Lifecycle purge job.

Security

Private bucket, signed URLs with expiry, access via RLS-scoped metadata.

Compatibility

Chrome/Edge/Safari on Windows/macOS pack PCs. Tested with 3 low-cost USB webcams.

6. Implementation Task Breakdown: Sprint 5

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Photo Schema] ──> [Step 2: Camera] ──> [Step 3: Capture] ──> [Step 4: Viewing & Purge]



Step 1: Photo Metadata, Storage & Retention Schema

Goal: Store photos privately and link them to everything they prove.

Task 1.1: Migrations & Bucket

carton_photos, private bucket, RLS on metadata.

Task 1.2: Retention Settings

Org-level policy, legal hold flag.

Step 2: Camera Pairing & Health Check

Goal: Make camera setup a 1-minute task per station.

Task 2.1: Pairing UI

Device select, preview, crop, save per station.

Task 2.2: Session Health Check

Permission, frame check, warning banner.

Step 3: Automatic Capture & Upload

Goal: Capture every box without slowing the packer.

Task 3.1: Capture Trigger in Pack Flow

Carton close hook, rules, extra photo.

Task 3.2: Compression, Watermark & Queued Upload

Canvas → WebP, overlay, reconnect-queue upload.

Step 4: Photo Viewers, Ledger Drill-Down & Purge

Goal: Put proof where disputes are handled.

Task 4.1: Viewers

Order, shipment and ledger/invoice drill-down.

Task 4.2: Share Links & Purge Job

Expiring links, lifecycle purge.

Task 4.3: Throughput Test

Timed pack test with vs without capture.

7. Sprint Delivery Milestones

Milestone 1 — Photo Data Layer (Target: Day 2)

Bucket, metadata and retention settings deployed.

Milestone 2 — Camera Pairing (Target: Day 4)

Stations pair webcams and pass the health check.

Milestone 3 — Automatic Capture (Target: Day 7)

Photos captured and uploaded on carton close, including offline.

Milestone 4 — Viewing & Sign-Off (Target: Day 10)

Drill-down viewers, purge and throughput test pass.

8. Open Questions Carried Into This Sprint

Default capture rule: every carton, or only multi-item/high-value orders (storage cost trade-off)?

Is face blurring required for any design partner (workplace privacy rules)?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 6 can start.



End of Phase 2 · Sprint 5 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 5 of 15  |  Page