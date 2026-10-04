Core System Requirements
Document 03 of 15 · Modern 3PL Warehouse Operating System (web application)
03. User Flow Diagrams (MVP)
Item
Detail
Purpose
The critical end-to-end journeys the MVP must support, as diagrams with the exception paths. Each flow maps to Phase 1 sprints and is automated as a Playwright end-to-end test (Document 02).
Parent documents
PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)
Version / Date / Status
1.0 (Draft) · September 26, 2026 · Draft for review


How to Read the Diagrams
Solid boxes are screens or user actions. Dashed blue boxes are automatic system steps.
Diamonds are decisions. Red boxes on the right are exception paths, and every exception is handled explicitly (nothing fails silently).
1. 3PL Sign-Up, Setup & Team Onboarding

Figure 1 — 3PL Sign-Up, Setup & Team Onboarding
Sprints: Phase 1 · 1, 3, 4, 12, 13, 14.
Success metric: a new 3PL reaches 'ready for first receipt' in one working day (with CSV imports).
2. Receiving & Putaway (Web Floor Workspace)

Figure 2 — Receiving & Putaway (Web Floor Workspace)
Sprints: Phase 1 · 6, 7.
15-Minute Rule: a first-time worker completes this flow unaided.
3. Order Ingestion with Self-Healing

Figure 3 — Order Ingestion with Self-Healing
Sprints: Phase 1 · 8, 12, 13.
Guarantee: zero silently lost orders. Every exception lands in a queue with a one-click fix.
4. Wave, Pick, Pack & Ship

Figure 4 — Wave, Pick, Pack & Ship
Sprints: Phase 1 · 9, 10, 11, 13.
Targets: pick accuracy ≥99.8%, scan → next step <300ms.
5. Month-End Billing (MVP Billing Foundation)

Figure 5 — Month-End Billing (MVP Billing Foundation)
Sprint: Phase 1 · 14 (Phase 2 · 1–4 add invoicing and auto-debit).
Target: month-end export in <2 hours instead of 3–5 days.
6. Extensiv Migration & Weekend Cutover

Figure 6 — Extensiv Migration & Weekend Cutover
Sprints: Phase 1 · 15, 16.
Target: commit in <4 hours, signed-off reconciliation, zero missed shipments.
7. 'Where Is It?' Search & Item Traceability

Figure 7 — 'Where Is It?' Search & Item Traceability
Sprints: Phase 1 · 3, 4, 5 (search, history), 11 (location audit).
Target: exact address + history for any SKU, lot, serial, LPN or location in <3 seconds.
8. MVP Screen Inventory
Area
Screens
Auth & onboarding
Sign in / sign up (email + password, Google, GitHub, Microsoft), forgot password, 'Have an invite code?', pending invitations, create organization, join workspace, workspace switcher, invite management (email, link, codes with expiry/uses/revoke), badge printing, revoked access
Setup
Facilities, client accounts, location hierarchy & naming convention (tree, generators for racks/floor cells/lanes/areas, labels & signs), tracking-class & rotation defaults per client, SKU catalog (list, editor, import), packaging materials, printers & stations, members & invites
Operations (web)
Ops dashboard, ASNs & dock check-in, orders (list, detail, timeline), holds & error queue, waves & progress board, shipments & manifests, count planner & approvals, replenishment rules, inventory views (by SKU, location, lot/expiry, serial, LPN), 'Where is it?' search & item timeline, near-expiry report, location contents
Floor workspace
Badge/PIN login, task home, receive (lot/date/serial capture, UID & LPN label print), put away, move (item or whole LPN), pick (cart binding, task, serial scan), pack (serial scan), count (incl. location audit), replenish, 'Where is it?' lookup, exception sheets
Integrations
Connections list & wizards, connection health, error queue, API keys & docs
Billing
Rate cards (versions), billing period summary, drill-down, manual charges, exports
Migration
Migration project, mapping, dry-run report, cutover runbook, reconciliation
Reports & support
Standard reports, audit log, support chat, status



End of Document 03.
