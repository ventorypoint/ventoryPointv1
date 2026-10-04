Core System Requirements

Document 09 of 15 · Modern 3PL Warehouse Operating System (web application)

09. MVP Launch Readiness Checklist

Item

Detail

Purpose

Everything that must be in place, beyond the code in the Phase 1 sprints, to launch Phase 1 — The Wedge (MVP) successfully with design-partner 3PLs in the US.

Parent documents

PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)

How to use

Track each item to done. 'Due' is relative to the first design-partner go-live (T-0). Launch needs every item checked or explicitly waived by the founder.

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Company & Legal

#

Item

Owner

Due

Status

L0

Pre-implementation validation gate passed (Doc 12): interviews, Extensiv API test, hardware survey, design partners signed

Founder

Before Sprint 00

☐

L1

Legal entity, bank account, business insurance (general liability)

Founder

T-20 wks

☐

L2

Cyber liability + technology E&O insurance (3PL contracts will require it)

Founder

T-8 wks

☐

L3

Master Subscription Agreement, Terms of Service, SLA terms (99.9%), Acceptable Use Policy

Legal

T-8 wks

☐

L4

Data Processing Agreement with US state-law service-provider terms (no sale/share, purpose limits, sub-processor flow-down, assistance with requests, deletion at end, audits), Privacy Policy, sub-processor list (Document 06 §7), terms prohibiting PHI in Phases 1–2

Legal

T-8 wks

☐

L8

US privacy counsel review of Docs 05–06 (state privacy laws, breach playbook, worker-monitoring notice text, HIPAA stance)

Legal

T-8 wks

☐

L9

Public accessibility statement (WCAG 2.2 AA target, feedback contact)

Product + Legal

T-2 wks

☐

L5

Design-partner agreement (pricing guarantee, feedback rights, pilot terms)

Founder + Legal

T-12 wks

☐

L6

Legal review of Extensiv migration (customer-authorised API access, terms)

Legal

T-16 wks

☐

L7

Product name trademark search and registration filed; domains secured

Founder

T-16 wks

☐

2. Platform Accounts & Third-Party Approvals

#

Item

Owner

Due

Status

A1

Shopify Partner account; app created; protected customer data access approved

Integrations lead

T-12 wks

☐

A2

Amazon SP-API developer registration; PII (restricted) role approval incl. security questionnaire

Integrations lead

T-14 wks

☐

A3

ShipStation API access; WooCommerce test stores

Integrations lead

T-10 wks

☐

A4

Address validation API account (USPS and/or Google)

Integrations lead

T-10 wks

☐

A5

Stripe account activated; Billing, Tax, Checkout configured (Document 07 §6)

Finance

T-6 wks

☐

A6

Extensiv API credentials from each design partner (sandbox/test where possible)

Implementation

T-8 wks

☐

A7

Production vendor accounts on business plans with DPAs: Supabase, Vercel, worker host, Resend, Sentry, logging, support chat

Tech lead

T-8 wks

☐

3. Engineering & Quality

#

Item

Owner

Due

Status

E1

All Phase 1 sprint acceptance criteria met (Sprints 1–16)

Tech lead

T-2 wks

☐

E2

Reference suites (ledger, allocation, billing, migration, RLS matrix) 100% green

QA

T-2 wks

☐

E3

5x peak load test on staging passed (Document 01 §8)

Tech lead

T-3 wks

☐

E4

Device & browser matrix certified; published minimum hardware list

QA

T-3 wks

☐

E7

Each design partner's facility modelled in the location hierarchy (wings, areas, racks, floor cells, lanes) using the agreed naming convention; old Extensiv codes mapped as aliases

Implementation

T-4 wks

☐

E8

All location labels, floor-cell/lane signs, LPN and unique-ID label stock printed and applied on site

Implementation

T-1 wk

☐

E9

Tracking class, rotation rule (FIFO/FEFO/LIFO) and date rules configured and verified for every client and SKU; missing expiry dates resolved

Implementation

T-2 wks

☐

E5

Print connector installed and tested at each design-partner site

Implementation

T-1 wk

☐

E6

Feature flags per organization; rollback plan per release

Tech lead

T-4 wks

☐

4. Security & Data

#

Item

Owner

Due

Status

S1

Third-party penetration test, with high/critical findings fixed

Security lead

T-4 wks

☐

S2

MFA enforced for Owner/Admin/Billing; secret scanning, SAST and dependency audit in CI

Security lead

T-6 wks

☐

S3

Backup restore drill passed; PITR confirmed; DR runbook written

Tech lead

T-3 wks

☐

S4

Incident response plan, on-call rota, status page, customer notification templates

Tech lead

T-3 wks

☐

S5

Amazon PII controls in place (encryption, 30-day retention job, access logging)

Security lead

Before Amazon go-live

☐

S6

Data retention and deletion jobs running per Document 06

Tech lead

T-2 wks

☐

S7

Written Information Security Program (WISP) adopted and security policies approved (access control, change management, vendor management, incident response), before the first customer's data arrives. Also the starting point for SOC 2

Security lead

T-10 wks

☐

S9

50-state breach-notification matrix and customer notification templates (72-hour contract commitment)

Security lead + Legal

T-4 wks

☐

S10

Third-party accessibility audit (WCAG 2.2 AA) including screen-reader testing, with blocking issues fixed

QA + Design

T-4 wks

☐

S8

All 20 controls in the Security Baseline Checklist (Doc 05 §6) verified with evidence (CI reports, tests, scans)

Security lead + Tech lead

T-3 wks

☐

5. Operations, Support & Onboarding

#

Item

Owner

Due

Status

O1

In-app support chat live; <15 min first-response rota for design partners' warehouse hours

Support lead

T-2 wks

☐

O2

Help centre: setup guides, floor quick-start cards (printable), hardware guide, FAQs

Support lead

T-3 wks

☐

O3

Implementation playbook: kickoff → data collection (SOPs, rate cards) → migration rehearsal → cutover weekend → hypercare (2 weeks)

Implementation

T-6 wks

☐

O4

Cutover runbook tool used in at least one full rehearsal per design partner

Implementation

T-1 wk

☐

O5

Hypercare plan: on-site or live-video support on go-live day and the first peak day

Implementation

T-1 wk

☐

O6

Customer success metrics dashboard (accuracy, lost orders, support response, billing export time)

Product

T-2 wks

☐

6. Go-To-Market & Commercial

#

Item

Owner

Due

Status

G1

Marketing site with positioning, transparent pricing page and 'Switch from Extensiv' page

Marketing

T-8 wks

☐

G6

GEO launch pack (Doc 15 §9): Phase 1 module pages with FAQ + schema, product facts, llms.txt, robots.txt AI-crawler policy, sitemaps, Search Console/Bing + IndexNow, vs-Extensiv and migration guide, integration pages, G2/Capterra/app-store listings, AI prompt-panel baseline

Marketing + Frontend lead

T-4 wks

☐

G2

Pricing tiers finalised and loaded in Stripe; design-partner pricing guarantee terms

Founder

T-6 wks

☐

G3

Design-partner pipeline: 20–25 3PLs, with the first 3–5 go-lives scheduled

Founder / Sales

T-12 wks

☐

G4

Sales collateral: demo environment with seeded data, ROI/TCO calculator vs Extensiv

Sales

T-6 wks

☐

G5

Reference-customer and case-study agreement with first go-lives

Founder

T+4 wks

☐

7. Launch Go/No-Go Criteria

Criterion

Threshold

Rehearsal cutover

Commit <4 hours; reconciliation 100% or signed-off variances

Staging pilot (2 weeks, design-partner data)

Pick accuracy ≥99.8%, inventory accuracy ≥99.5%, 0 silently lost orders

15-Minute Rule

4/5 first-time workers complete a guided task unaided

Billing

Month-end export matches the partner's previous invoice with every variance explained

Reliability

No SEV1/SEV2 open. Load test passed. Restore drill passed.

People

On-call, support rota and hypercare staffed for the go-live weekend and following week



End of Document 09.

Core System Requirements  |  09 MVP Launch Readiness  |  Page