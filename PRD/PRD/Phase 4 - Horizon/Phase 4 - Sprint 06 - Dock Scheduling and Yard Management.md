Product Requirements Document (PRD)

Phase 4 — Horizon (24+ Months) · Sprint 6 of 15

Sprint 6: Dock Appointment Scheduling & Yard Management

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.5 (Phase 4 — Horizon, directional: scope to be re-validated before build)

Module

Enterprise Cross-Dock & Multi-Hub Dock/Yard Scheduling (Master PRD §6.5)

Duration

2 weeks (10 working days)

Planning status

Directional. Master PRD §6.5 marks Phase 4 as a horizon, so re-validate this scope with customers before sprint planning.

Must be complete before starting

Phase 4 · Sprint 5: 3D Dimensioners & Scan Tunnels

Unlocks next

Phase 4 · Sprint 7: Enterprise Cross-Dock & Multi-Hub Flow-Through

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to manage the dock and yard of large facilities: carriers and suppliers book dock appointments in a self-service portal, dock doors are scheduled by capacity and load type, and the yard (trailers waiting, loaded or empty) is tracked from gate-in to gate-out. This removes phone-and-spreadsheet dock scheduling and cuts detention fees.

By the end of this sprint:

Carriers, suppliers and brands book inbound/outbound appointments in a self-service booking page, within the 3PL's dock rules.

Dock doors have a live schedule with capacity rules (load type, duration, door capabilities).

Gate check-in/out and yard moves are recorded, with trailer status and dwell time.

Detention risk alerts and on-time appointment metrics are available.

Out of scope for this sprint: transportation management (tendering, freight audit), automated gate hardware (licence plate cameras) beyond basic integration hooks.

Dependency: Sprint 5 must be signed off. Also uses the Phase 1 ASN/check-in and the Phase 2 · Sprint 10 loads/BOL.

2. User Stories

As a Carrier Dispatcher, I want to book a dock slot online so that my driver doesn't wait for hours.

As a Dock Supervisor, I want a live door schedule so that labour and doors are ready when trucks arrive.

As a Yard Jockey, I want to see which trailer goes to which door next so that the yard keeps moving.

As a 3PL Owner, I want fewer detention charges so that transport costs fall.

3. Functional Requirements

3.1 Dock Rules & Doors

Doors with capabilities (dock height, reefer, drive-in), operating hours, slot lengths by load type (floor-loaded container, palletized, LTL, parcel pickup), buffer times, max concurrent appointments.

3.2 Appointment Booking

Branded booking page (per facility), with a PO/ASN/load reference required, slot selection and confirmations/reminders. Internal booking and reschedule by staff. Recurring appointments for scheduled carrier pickups.

3.3 Gate & Yard

Gate check-in (appointment lookup, trailer/seal, driver), yard location assignment, move tasks (yard → door, door → yard), trailer status (loaded, empty, in progress), gate-out. Dwell and detention clocks.

3.4 Metrics & Alerts

On-time arrival %, door utilisation, average dwell, detention risk alerts (e.g. 30 minutes before free time ends).

4. Acceptance Criteria

A carrier books an appointment for a 40' floor-loaded container, and only doors and slots meeting the rules are offered.

Checking in at the gate links the trailer to its ASN, and the dock schedule updates in real time.

A trailer approaching free-time expiry triggers a detention alert.

5. Non-Functional & Security Requirements

Requirement

Detail

Usability

External booking without an account (reference + email verification).

Realtime

Door schedule updates <2s.

6. Implementation Task Breakdown: Sprint 6

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Dock Rules] ──> [Step 2: Booking] ──> [Step 3: Gate & Yard] ──> [Step 4: Metrics]



Step 1: Doors, Slots & Dock Rules

Goal: Model dock capacity.

Task 1.1: Door & Rule Configuration

Capabilities, slot lengths, limits.

Step 2: Self-Service Appointment Booking

Goal: Let partners book themselves.

Task 2.1: Booking Page & Notifications

References, slots, reminders, reschedule.

Step 3: Gate Check-In/Out & Yard Moves

Goal: Know where every trailer is.

Task 3.1: Gate & Yard Flows

Check-in, yard spots, move tasks, gate-out.

Step 4: Dock/Yard Metrics & Detention Alerts

Goal: Cut waiting and fees.

Task 4.1: Metrics Dashboard & Alerts

On-time, utilisation, dwell, detention.

7. Sprint Delivery Milestones

Milestone 1 — Dock Rules (Target: Day 2)

Doors and rules configured.

Milestone 2 — Booking (Target: Day 5)

External booking live.

Milestone 3 — Gate & Yard (Target: Day 8)

Yard tracked end-to-end.

Milestone 4 — Sign-Off (Target: Day 10)

Metrics and alerts live.

8. Open Questions Carried Into This Sprint

Integrate with carrier visibility platforms (e.g. project44/FourKites) for ETAs in this sprint or later?

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 4 · Sprint 7 can start.



End of Phase 4 · Sprint 6 PRD.

Phase 4 — Horizon (24+ Months)  |  Sprint 6 of 15  |  Page