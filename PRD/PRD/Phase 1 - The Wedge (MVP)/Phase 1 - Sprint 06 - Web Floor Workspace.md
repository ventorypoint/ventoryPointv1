Product Requirements Document (PRD)

Phase 1 — The Wedge (MVP) · Sprint 6 of 19

Sprint 6: Web Floor Workspace (Scanning, Feedback, Printing)

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.2 (Phase 1 — The Wedge / MVP)

Module

Sprint 6 — Web Floor Workspace

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 1 · Sprint 5: Inventory Ledger, LPNs, Expiry & 'Where Is It?' Traceability

Unlocks next

Phase 1 · Sprint 7: Inbound: ASNs, Receiving & Putaway

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of Sprint 6 is to build the browser-based floor mode that every warehouse flow runs inside, and to prove it with a complete scan-to-move flow. The shell is where the product's "15-minute onboarding" promise lives or dies, so the sprint ends with a usability test on first-time users.

By the end of this sprint:

Workers sign in on a shared station with badge + PIN and see only their floor tasks.

Scans from any keyboard-wedge scanner are captured reliably, including GS1 lot/expiry data.

Every step shows clear instructions with product photo and location, and gives audio-visual success/error feedback.

Scans made while offline are queued and synced safely.

Labels print to Zebra-class printers from the browser.

Out of scope for this sprint: receiving, picking, packing and counting flows (Sprints 7–11), multilingual content (Phase 2), scales/webcams (Phase 2).

Dependency: Sprint 5 must be signed off before this sprint starts. Sprint 1 (PIN login), Sprint 2 (devices, record_events batch), Sprint 4 (barcode resolution), Sprint 5 (move_inventory).

2. User Stories

As a temp Floor Worker, I want the screen to tell me exactly what to scan next, with a picture, so that I can work correctly on my first day.

As a Floor Worker, I want an unmistakable sound and colour when I scan the wrong thing so that I catch mistakes before they become errors.

As a Supervisor, I want workers to swap on a shared station in seconds so that shift changes don't slow the floor.

As an Ops Manager, I want scans to keep working when the Wi-Fi drops in the back aisles so that work never stops and nothing is lost.

As a Supervisor, I want to print a label from any floor screen to the nearest printer so that re-labelling doesn't need a trip to the office.

3. Functional Requirements

3.1 Floor Mode Shell

/floor layout: header with worker, facility, connection status. A task home with large tiles (Receive, Put Away, Pick, Pack, Count, Move). Tiles appear only for permitted and enabled flows.

Badge/PIN quick-switch overlay (scan badge barcode + PIN) and idle auto-lock.

Station binding: the device is registered to a facility + station type + default printer.

3.2 Scanner Input Service

Keyboard-wedge detection using inter-key timing and a terminator key. Per-station scanner profile (prefix/suffix).

Always-on capture without needing a focused field. Manual typed entry allowed via an explicit 'Type code' button (logged as manual entry).

Barcode classification: location (recognised by the facility naming-convention pattern, including old-code aliases), SKU/UoM, lot, serial, generated unique ID, container LPN, tote, order, badge. GS1-128/DataMatrix AI parsing (01 GTIN, 10 lot, 11 production date, 17 expiry, 21 serial).

3.3 Flow Framework

Declarative step definitions: prompt text key, visual (photo/location card), expected scan classes, validator, on-success event builder, exception options.

Standard components: Location card (full path Wing › Area › Aisle › Bay › Level › Position, with an arrow for the shelf level; floor cell and lane variants), LPN chip, lot/expiry badge, serial capture list, Product card (photo, name, code, UoM), Qty entry (big +/- and numeric keypad), Confirm/Exception sheet.

3.4 Feedback System

Success: green full-screen flash + chime (<150ms). Warning: amber + double beep. Error: red locked state + buzzer, requiring an acknowledgement tap/scan.

Configurable volume. Vibration where the device supports it.

3.5 Reconnect Queue

IndexedDB queue with a client idempotency_key (UUID) and occurred_at per scan event. Background flush via record_events, ordered.

Flows that need server validation (e.g. confirming a location has stock) degrade gracefully: optimistic within safe rules, blocking with a clear message otherwise.

3.6 Printing

Printer registry per facility. Print connector detection. ZPL send. PDF fallback in a new tab.

Reprint from any floor screen (location label, SKU label).

3.7 First Flow: Scan-to-Move

Scan from-location → scan SKU (and lot if tracked, each serial if unique) → qty → scan to-location → move_inventory → success.

Whole-container move: scan LPN → scan to-location → move_container (everything on the pallet moves together).

3.8 i18n Foundation

All floor strings in message catalogs (next-intl). English shipped, with the locale switch hidden until Phase 2.

3.9 Floor 'Where Is It?' Lookup

A lookup tile on the task home: scan any item, lot, serial, LPN or location and see its exact address(es) and contents in floor-sized text (uses the Sprint 5 where_is service).

3.10 Accessibility for Blind & Low-Vision Workers

Spoken prompts option (text-to-speech via the browser, in the worker's language) reading each step aloud, e.g. 'Go to Wing 2, Aisle 04, Bay 12, Level 3, Position 02. Scan the location.'

Screen-reader mode: every step, result and error announced through ARIA live regions (assertive for errors), works with TalkBack/VoiceOver on handhelds and NVDA/JAWS on workstations.

Large-text and high-contrast floor themes, per worker preference (saved with the worker profile). Distinct sound + vibration patterns for success, warning and error, so the colour flash is never the only signal.

All floor controls reachable by hardware keys/scanner triggers and keyboard, with no gesture-only actions.

3.11 Worker Monitoring Notice

Configurable notice (per facility/state) shown at a worker's first floor login and after changes, explaining what is recorded (scans, time per step, device, later cameras) and why. The worker's acknowledgement is stored (supports employer notice laws such as NY, CT, DE).

Time-per-step telemetry is labelled operational data, not a productivity quota.

4. Acceptance Criteria

4 of 5 first-time test users complete scan-to-move unaided within 5 minutes.

1,000 rapid scans (<100ms apart) are all captured with no dropped characters on two scanner models.

A 60-second network drop mid-flow results in 0 lost and 0 duplicated events after reconnect.

Scanning an SKU where a location is expected triggers the error state and blocks progress until acknowledged.

A ZPL label prints successfully on a Zebra ZD-series printer from Chrome and Edge. The PDF fallback works when no connector is present.

With spoken prompts on, a blind tester completes scan-to-move using only audio cues and the scanner. With a screen reader (TalkBack), every step and error is announced.

A new worker must acknowledge the facility's monitoring notice before the first floor task, and the acknowledgement is stored.

5. Non-Functional & Security Requirements

Requirement

Detail

Responsiveness

Scan → UI response <300ms p95 on a Zebra TC-series browser.

Compatibility

Tested on Chrome, Edge, Safari (latest 2), Zebra TC2x/TC5x, Honeywell CT40, and a 10" Android tablet.

Resilience

Queue persists across refresh/sleep. Flush retries with backoff.

Accessibility

WCAG 2.2 AA. Targets ≥48px (≥56px in floor mode), instruction text ≥20px, contrast ≥7:1 for instructions, colour + icon + sound for every state, spoken prompts and screen-reader mode available, large-text/high-contrast themes.

6. Implementation Task Breakdown: Sprint 6

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Shell & Sessions] ──> [Step 2: Scanner & Flow Engine] ──> [Step 3: Offline & Printing] ──> [Step 4: Scan-to-Move & Usability]



Step 1: Floor Layout, Sessions & Station Binding

Goal: Create the floor-mode frame and fast worker switching.

Task 1.1: Floor Route Group & Layout

/floor layout, task home tiles, role/flow gating.

Task 1.2: Badge/PIN Quick-Switch & Idle Lock

Overlay flow, session start/end in floor_sessions.

Task 1.3: Station Binding

Bind device → facility, station type, default printer. Supervisor station admin screen.

Step 2: Scanner Input Service & Flow Framework

Goal: Capture every scan and give later sprints a declarative way to build flows.

Task 2.1: Scanner Input Service

Wedge detection, profiles, classification, GS1 parser (unit-tested with sample barcodes).

Task 2.2: Flow Framework & Components

Step engine, Location/Product/Qty/Exception components, time-per-step telemetry.

Task 2.3: Feedback System

Visual states, Web Audio tones, error lock.

Step 3: Reconnect Queue & Print Connector

Goal: Never lose a scan, and print from anywhere.

Task 3.1: IndexedDB Queue & Flush

Idempotency keys, ordered batch flush, connection indicator, conflict messages.

Task 3.2: Printer Registry & Connector

Printer admin, Browser Print/QZ integration, ZPL send, PDF fallback.

Step 4: Scan-to-Move Flow & Usability Validation

Goal: Prove the shell end-to-end with real users.

Task 4.1: Scan-to-Move Flow

Built entirely on the flow framework, calling move_inventory.

Task 4.2: Device Test Matrix

Run the scanner/print/offline test scripts on the device matrix.

Task 4.3: First-Time User Usability Test

5 participants with no prior exposure. Record time-to-complete and errors.

7. Sprint Delivery Milestones

Milestone 1 — Floor Shell Live (Target: Day 3)

Floor mode, PIN quick-switch and station binding work on a handheld browser.

Milestone 2 — Scanning & Flow Engine (Target: Day 6)

Scanner service passes the rapid-scan test. Flow framework renders steps with feedback.

Milestone 3 — Offline & Printing (Target: Day 8)

Network-drop test passes. ZPL printing works via the connector.

Milestone 4 — Scan-to-Move & Usability Sign-Off (Target: Day 10)

Scan-to-move complete. Usability target (4/5 within 5 min) met.

8. Open Questions Carried Into This Sprint

Print connector selection (Zebra Browser Print vs. QZ Tray), pending the design-partner hardware survey.

Is camera scanning (via a browser barcode library) needed as a fallback in Phase 1 (MVP)?

Should manual typed entry require a supervisor PIN for regulated (lot/expiry) steps?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table.

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 1 · Sprint 7 can start.



End of Phase 1 · Sprint 6 PRD.

Phase 1 — The Wedge (MVP)  |  Sprint 6 of 19  |  Page