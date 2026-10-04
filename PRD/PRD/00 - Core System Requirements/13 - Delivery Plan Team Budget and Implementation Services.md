Core System Requirements

Document 13 of 15 · Modern 3PL Warehouse Operating System (web application)

13. Delivery Plan, Team, Budget & Implementation Services

Item

Detail

Purpose

A realistic plan for delivering Phase 1: timeline with parallel squads, the team needed, an indicative budget model, and the implementation-services playbook that turns software into live warehouses.

Parent documents

PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Realistic Phase 1 Timeline

Phase 1 has 19 sprints (00, 01–16, plus 02A and 11A). Run one after another, that's 38 weeks. Using three squads in parallel, with the dependency order respected, gets the MVP to first go-live about 7 months after Sprint 00 starts (8–9 months after project start, including validation).

Weeks

Core Platform squad

Floor Experience squad

Integrations & Billing squad

−6 to 0

Validation gate (Doc 12), hiring

Hardware/site survey, floor UX prototypes

Extensiv API test, channel app registrations (Shopify, Amazon)

1–2

Sprint 00 (all squads)

Sprint 00: design library

Sprint 00: CI, environments

3–4

S01 Auth & tenancy

Floor prototypes & usability tests

Stripe, email, notification spikes

5–6

S02 Event backbone

Floor UI kit

Connector/address spikes

7–8

S03 Locations & naming

Print connector & device matrix

S02A Admin, billing, notifications

9–10

S04 SKU tracking & rotation

Floor kit hardening

Order model design, API v1 design

11–12

S05 Ledger, LPNs, traceability

S06 Floor workspace

Migration extraction groundwork

13–14

S07 Inbound (with Floor)

S07 floor flows

S08 Orders & allocation

15–16

S09 Picking (with Floor)

S09 floor flows

S12 Framework & Shopify

17–18

S11 Counts & replenishment

S10 Pack & ship

S13 Amazon, Woo, ShipStation, API

19–20

S11A Brand view & returns

S11A returns flow

S14 Billing foundation

21–22

Performance, load, RLS audit

Usability polish, device regression

S15 Migration engine

23–24

S16 Launch readiness (all squads)

S16

S16

25–28

Design-partner cutovers & stabilisation

On-site floor onboarding

Migration runs, connector tuning



Phases 2 and 3 each need about 12 months with the same three squads (15 sprints each, with some parallelism and hardening). Phase 4 is re-planned after Phase 3.

2. Team (Phase 1)

Role

Count

Notes

Founder / CEO (product vision, sales, design partners)

1

Owns the validation gate and commercial items

Product owner / PM

1

Owns sprint PRDs and the decision log, accepts demos

Tech lead / architect

1

Owns Docs 01–02, reviews all migrations/RLS/RPCs

Senior full-stack engineers

3

One lead per squad

Full-stack engineers

3–6

2 per squad with AI-assisted engineering (lean), 3 per squad (standard)

Product designer

1

Figma library, floor usability tests, marketing site

QA / SDET

1

Reference suites, e2e, device matrix

DevOps / security (fractional)

0.5

Environments, observability, pen-test coordination

Implementation specialists

1 → 2

Site surveys, migrations, training, hypercare

Support engineer

1 (from month 6)

<15 min first response in warehouse hours



Lean team: about 12 people. Standard team: about 15–16. AI-assisted engineering (Doc 08) is what makes the lean option realistic.

3. Indicative Budget Model

All figures are indicative planning ranges in USD and must be replaced with real quotes and salary data for your hiring locations.

3.1 Monthly run-rate (Phase 1)

Category

Lean team

Standard team

Notes

People (fully loaded)

Depends on location

Depends on location

Formula: Σ(headcount × fully loaded monthly cost). US engineers cost much more than nearshore/offshore; model both.

Cloud & core services

$1.5k–4k

$3k–8k

Supabase (Team + compute), Vercel, worker host, storage, backups

Engineering tools

$1k–3k

$2k–5k

GitHub, CI minutes, Sentry, logging, Figma, PostHog, AI coding tools

Business tools

$0.5k–1.5k

$1k–2k

Support chat, email, status page, SFTP, address API

Travel for site visits/cutovers

$1k–3k

$2k–5k

Rises during go-lives

3.2 One-off costs before launch

Item

Indicative range

Legal: MSA, ToS, DPA, privacy, design-partner agreement, Extensiv legal review, trademark

$15k–40k

Third-party penetration test

$8k–25k

Insurance (cyber, E&O, general liability), first year

$5k–15k

Brand identity + marketing site

$10k–40k

Hardware test kit (scanners, printers, scale, webcams)

$3k–8k



Phase 1 budget ≈ (people + tools monthly) × 8–9 months + one-off costs + a 15–20% contingency. Revenue during Phase 1 is minimal (design partners free until go-live), so plan runway to at least 6 months after the first go-live.

3.3 Unit economics to track from launch

Revenue per 3PL (tier), gross margin after cloud + third-party costs per tenant, implementation cost per go-live, support hours per tenant, payback period, and net revenue retention.

4. Implementation Services Playbook

Stage

Duration

Owner

Deliverables

1. Signed & kickoff

Week 0

Founder + Implementation

Agreement, goals, go-live date, contacts

2. Discovery

Weeks 1–2

Implementation

SOPs, rate cards, client list, channel list, hardware survey

3. Facility modelling

Weeks 2–3

Implementation + partner ops

Location hierarchy & naming convention, labels/signs printed

4. Configuration

Weeks 3–4

Implementation

Clients, tracking classes/rotation, rate cards, connections, printers

5. Migration dry runs

Weeks 3–5

Implementation + engineer

Clean dry-run report, mapping sign-off

6. Training

Week 5

Implementation

15-min floor sessions, 2h admin/billing session, quick-start cards

7. Rehearsal cutover

T-7 days

Implementation

Full rehearsal <4h, issues fixed

8. Cutover weekend

Go-live

Implementation + on-call

Commit, reconciliation, go/no-go, live Monday

9. Hypercare

2 weeks

Implementation + support

Daily check-ins, peak-day on-site/video support

10. Handover

Week +3

Customer success

Success metrics review, reference/case-study ask



Capacity: one implementation specialist handles 2–3 concurrent go-lives. Hire the second specialist before go-live #3.

Pricing: free implementation for Extensiv switchers during launch. Otherwise self-serve, or ~$1,500 white-glove (master PRD §9).

5. Governance

Two-week sprints with a demo against acceptance criteria. Sprint sign-off per the sprint's Definition of Done.

Weekly decision-log review (Doc 14). A decision must be made before the sprint that needs it starts.

Phase gates: validation gate (Doc 12) → Phase 1 go/no-go (Doc 09 §7) → Phase 2 planning using design-partner feedback.

Monthly risk review (scope, timeline, budget, security, key-person dependencies).



End of Document 13.

Core System Requirements  |  13 Delivery Plan & Team  |  Page