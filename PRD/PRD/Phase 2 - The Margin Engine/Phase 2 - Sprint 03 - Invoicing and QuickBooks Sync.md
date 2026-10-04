Product Requirements Document (PRD)

Phase 2 — The Margin Engine (Months 6–12) · Sprint 3 of 15

Sprint 3: Invoicing, Credit Notes & QuickBooks Sync

Item

Detail

Parent document

PRD — Modern 3PL Warehouse Operating System (v1.1), Section 6.3 (Phase 2 — "The 3PL Margin Engine")

Module

Real-Time Micro-Billing Ledger (Master PRD §6.3.1)

Duration

2 weeks (10 working days)

Must be complete before starting

Phase 2 · Sprint 2: Inbound, Outbound & VAS Charge Engine, Postage Markup & Monthly Minimums

Unlocks next

Phase 2 · Sprint 4: Embedded Payments & Scheduled Auto-Debit (Card / ACH)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Objective & Scope

The objective of this sprint is to turn the ledger into invoices: scheduled invoice runs per client (monthly and/or twice-monthly), a review-and-approve step, branded invoice documents, credit notes for corrections, and two-way sync with QuickBooks Online and QuickBooks Desktop, so there's no double data entry.

By the end of this sprint:

Invoices are generated automatically per client on their billing schedule, from the ledger charges.

Billing users can review, adjust (with an audit trail), approve and send invoices by email.

Credit notes correct issued invoices without editing history.

Approved invoices sync to QuickBooks Online or Desktop with line-level detail, and payment status syncs back.

Out of scope for this sprint: card/ACH collection (Sprint 4), portal invoice view (Sprint 7), NetSuite/Xero sync (later in Phase 2 if demanded).

Dependency: Sprint 2 must be signed off. Also uses Phase 1 · Sprint 14 (billing periods, draft PDF).

2. User Stories

As a Billing user, I want invoices generated automatically on each client's billing date so that month-end takes minutes.

As a Billing user, I want to review and approve invoices before they're sent so that nothing wrong reaches a client.

As a 3PL Owner, I want invoices to appear in QuickBooks without re-typing so that my accountant has everything.

As a Billing user, I want to issue a credit note for a disputed line without changing the original invoice so that records stay clean.

3. Functional Requirements

3.1 Invoice Runs

Billing schedule per client: monthly, twice-monthly (1st & 15th), weekly, or custom. Invoice run closes the period, runs month-close rules (storage calendars, minimums) and groups charges into invoice lines by category/charge type (configurable detail level).

Invoice numbering sequence per organization (configurable prefix). Payment terms per client (due on receipt, Net 15/30).

3.2 Review, Adjust & Approve

Invoice states: draft → in review → approved → sent → partially paid / paid / overdue → void.

Adjustments before approval are recorded as manual charges or reversals (never edits), with a reason. Bulk approve.

Branded invoice PDF: 3PL logo, client details, summary by category, detailed appendix (CSV + PDF) with drill-down references.

3.3 Sending

Email via Resend with PDF + CSV attachments. Per-client recipients. Resend and a delivery log.

3.4 Credit Notes

Credit notes against sent invoices (full or line-level), with a reason, synced to accounting and shown as a separate document.

3.5 QuickBooks Sync

QuickBooks Online: OAuth connect, customer mapping (client account ↔ QBO customer), item mapping (charge type ↔ QBO item/income account), invoice + credit memo push, payment status pull.

QuickBooks Desktop: QuickBooks Web Connector (QBWC) SOAP integration with the same mapping and a queued sync. Status visible per invoice.

Sync errors go to the Phase 1 integration error queue.

4. Acceptance Criteria

A twice-monthly client gets invoices on the 1st and 15th containing only charges from the matching period.

An adjustment made in review appears as a separate audited line, and the original charges are unchanged.

An approved invoice appears in a QuickBooks Online sandbox with correct customer, items, amounts and invoice number within 1 minute.

A credit note reduces the client balance in QuickBooks and appears in the client's document history.

Invoice totals always equal the sum of their charges (enforced by a database check).

5. Non-Functional & Security Requirements

Requirement

Detail

Integrity

Issued invoices are immutable. Corrections only via credit notes. Totals checked at the database level.

Performance

Invoice run for 60 clients <2 min.

Security

QuickBooks tokens stored in Vault. Least-privilege scopes.

6. Implementation Task Breakdown: Sprint 3

The work runs in the steps below, in order, from the data layer up to the web UI.

[Step 1: Invoice Schema] ──> [Step 2: Invoice Runs] ──> [Step 3: Send & Credit] ──> [Step 4: QuickBooks]



Step 1: Invoice, Line, Credit Note & Schedule Schema

Goal: Model invoices as immutable documents built from ledger charges.

Task 1.1: Migrations & RLS

invoices, invoice_lines, credit_notes, billing_schedules, invoice_sequences.

Task 1.2: Integrity Checks

Totals constraint, immutability after 'sent'.

Step 2: Invoice Runs, Review & Documents

Goal: Generate correct invoices automatically and let staff review them.

Task 2.1: Scheduled Invoice Runs

Period close, grouping, numbering, terms.

Task 2.2: Review & Approve UI

Adjust via manual charges/reversals, bulk approve.

Task 2.3: Invoice PDF & Appendix

Branded PDF, detailed CSV appendix.

Step 3: Sending & Credit Notes

Goal: Deliver invoices and correct them cleanly.

Task 3.1: Email Delivery & Log

Resend with attachments, delivery log.

Task 3.2: Credit Notes

Full/line credit, PDF, status updates.

Step 4: QuickBooks Online & Desktop Sync

Goal: Remove double entry into accounting.

Task 4.1: QBO Connector

OAuth, customer/item mapping, invoice/credit push, payment pull.

Task 4.2: QBD Web Connector

QBWC endpoint, queue, mapping reuse.

Task 4.3: Sync Errors & Tests

Error-queue routing, sandbox tests.

7. Sprint Delivery Milestones

Milestone 1 — Invoice Data Layer (Target: Day 2)

Schema and integrity checks deployed.

Milestone 2 — Invoice Runs (Target: Day 5)

Scheduled runs create correct drafts. Review/approve works.

Milestone 3 — Send & Credit Notes (Target: Day 7)

Email delivery and credit notes live.

Milestone 4 — QuickBooks & Sign-Off (Target: Day 10)

QBO and QBD sync verified in sandboxes.

8. Open Questions Carried Into This Sprint

Invoice detail level default: summary by category with a detailed appendix, or every charge as a line?

Tax: do any design partners need sales tax on services (state-dependent)? If so, a tax engine (e.g. Avalara/Stripe Tax) is needed.

9. Definition of Done (Gate to the Next Sprint)

All acceptance criteria in Section 4 pass and are demonstrated.

Row Level Security tests exist and pass for every new table (including the Client User role where relevant).

Non-functional targets in Section 5 are measured and met.

Open questions in Section 8 are answered or explicitly deferred by the product owner.

Sign-off recorded, so Phase 2 · Sprint 4 can start.



End of Phase 2 · Sprint 3 PRD.

Phase 2 — The Margin Engine (Months 6–12)  |  Sprint 3 of 15  |  Page