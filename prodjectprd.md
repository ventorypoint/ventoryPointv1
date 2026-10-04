Product Requirements Document (PRD)
Project Management Platform — "Full-Vision" Web Application
Version: 1.0 (Draft) Date: July 9, 2026 Status: Draft for review


1. Executive Summary
This PRD defines a web-based project management platform that unifies planning, scheduling, cost/budget management, documentation, and team accountability into a single tool. It targets three user segments simultaneously — individual/freelance PMs, small-to-mid project teams, and enterprise PMOs — with a tiered architecture that lets the same core engine scale from a solo user to a multi-department organization.

The platform's differentiator is depth in project cost and schedule mechanics (WBS, CPM, budgeting, EVM) that most lightweight tools (Trello, Asana, Monday.com) don't do well, combined with the ease of use that heavyweight tools (MS Project, Primavera P6) lack.


2. Problem Statement
Project managers today are forced to stitch together multiple disconnected tools:

Scheduling tools (MS Project, Primavera) for CPM/Gantt — powerful but expensive, complex, desktop-bound, and disconnected from cost data.
Lightweight PM/collaboration tools (Asana, Trello, Monday) — easy to use but shallow on cost, budget, WBS, and critical path logic.
Spreadsheets for budgets, RACI charts, and cost tracking — manual, error-prone, and disconnected from the schedule.
Word/Google Docs for charters, status reports, and other documentation — not linked to live project data, so documents go stale immediately.

This fragmentation causes duplicated data entry, version-control chaos, and a lack of a single source of truth connecting scope → schedule → cost → risk → accountability.


3. Vision & Goals
Vision: A single web app where a PM can go from "we have an idea for a project" to a fully baselined plan — with WBS, schedule, budget, RACI, and documentation — in one connected workspace, and then track execution against that baseline in real time.

Primary Goals

Goal
Description
G1
Provide integrated WBS → Schedule (CPM/Gantt) → Budget/Cost linkage, so a change in one propagates awareness to the others
G2
Automate generation of standard PM documents (charter, WBS dictionary, RACI, status reports, risk register, budget baseline) from live project data
G3
Support multi-segment usage: solo freelancer, small team, and enterprise PMO, via role-based permissions, workspace hierarchy, and tiered feature access
G4
Deliver accurate, defensible cost and schedule calculations (CPM critical path, float, EVM metrics: CPI, SPI, EAC, ETC, VAC)
G5
Be usable without formal PM certification, while still supporting PMBOK/PRINCE2-aligned rigor for those who want it



4. Target Users & Personas
Since the product targets all tiers, the architecture must support a workspace model that scales from single-user to enterprise multi-department.
Persona 1: Freelance/Independent PM — "Ada"
Manages 2–5 client projects concurrently.
Needs fast project setup, clean client-facing reports, budget tracking against fixed-bid or T&M contracts.
Price-sensitive; wants self-serve onboarding.
Persona 2: Team Lead / Small Agency PM — "Tunde"
Manages a team of 5–20 people across several concurrent projects.
Needs resource allocation, task assignment, RACI clarity, and budget vs. actuals tracking.
Cares about collaboration: comments, notifications, shared documents.
Persona 3: Enterprise PMO Director — "Grace"
Oversees portfolios of 20+ projects across departments.
Needs standardized templates, governance (approval workflows), portfolio-level dashboards, audit trails, SSO/RBAC, and integration with enterprise systems (ERP, HRIS, SSO).
Requires compliance: data residency, permissions granularity, audit logs.


5. Scope (Full-Vision — All Modules In Initial Build)
Since the chosen approach is full-vision rather than phased MVP, the following modules are all in scope for the initial build. (A suggested internal build sequencing is still provided in Section 11 for engineering planning purposes, even though all modules ship together.)
5.1 Project Initiation & Setup
Project creation wizard (name, client, dates, currency, methodology: Waterfall/Agile/Hybrid)
Project charter generator (auto-populated from setup data, editable)
Stakeholder register
Templates library (industry/project-type templates: construction, IT/software, marketing campaign, event, etc.)
5.2 Work Breakdown Structure (WBS)
Hierarchical WBS builder (drag-and-drop, unlimited nesting levels)
WBS numbering (auto-generated, e.g., 1.1.2)
WBS dictionary (auto-generated document describing each work package: description, owner, deliverables, acceptance criteria)
Bulk import from CSV/Excel/MS Project files
Convert WBS elements directly into schedule activities
5.3 Scheduling & Critical Path Method (CPM)
Activity list with duration, dependencies (FS, SS, FF, SF), lag/lead
Automatic CPM calculation: early start/finish, late start/finish, total float, free float, critical path highlighting
Interactive Gantt chart (drag to reschedule, dependency lines, baseline comparison)
Milestone tracking
Resource-leveling suggestions (flagging over-allocation)
Multiple baseline snapshots with variance reporting
Calendar support (working days, holidays, per-resource calendars)
5.4 Budget & Cost Management
Cost estimation methods: analogous, parametric, bottom-up (per WBS work package)
Budget baseline creation (time-phased budget / cost baseline, S-curve)
Resource cost rates (labor rates, material costs, fixed costs, overhead %)
Actual cost entry (manual entry or CSV import; integration-ready for accounting/ERP systems)
Earned Value Management (EVM): PV, EV, AC, CPI, SPI, CV, SV, EAC, ETC, VAC, TCPI
Contingency & management reserve tracking
Multi-currency support
Change request → budget impact tracking
5.5 RACI & Accountability
RACI matrix builder tied directly to WBS/activities and stakeholder register
Auto-flag activities with no owner (missing "R" or "A")
Workload view: tasks per person across all their assigned projects
5.6 Risk & Issue Management
Risk register (probability × impact scoring, risk response strategy, owner)
Issue log
Risk-adjusted schedule/budget contingency suggestions
5.7 Document Generation
Auto-generated, continuously-updated documents from live project data:
Project Charter
WBS Dictionary
RACI Matrix
Risk Register
Budget Baseline Report
Status Report (weekly/monthly, auto-populated with schedule/cost variance)
Closeout Report / Lessons Learned
Export to PDF, Word (.docx), Excel (.xlsx)
Custom document templates (enterprise tier)
5.8 Collaboration & Communication
Comments/mentions on tasks, documents, and risks
Notifications (in-app, email)
Activity/audit log per project
File attachments per task/deliverable
5.9 Reporting & Dashboards
Project-level dashboard: schedule health, cost health, RAG status, upcoming milestones
Portfolio-level dashboard (multi-project rollup) for PMO/enterprise tier
Custom report builder
Exportable executive summary reports
5.10 Administration, Roles & Governance
Workspace hierarchy: Organization → Portfolio → Program → Project
Role-based access control (Admin, PM, Team Member, Viewer, Client/External Guest — configurable per tier)
Approval workflows (e.g., budget changes, baseline changes require sign-off) — enterprise tier
SSO (SAML/OAuth), audit logging, data export — enterprise tier
5.11 Integrations (API-ready)
Calendar sync (Google/Outlook)
File storage (Google Drive, SharePoint)
Accounting/ERP export (for actual cost import)
Public REST API + webhooks


6. Non-Functional Requirements
Category
Requirement
Performance
CPM recalculation on a 5,000-activity project completes in <2 seconds
Scalability
Support organizations from 1 to 10,000+ users; multi-tenant architecture
Availability
99.9% uptime SLA for paid tiers
Security
Encryption at rest and in transit; role-based access control; SOC 2 readiness for enterprise tier
Data residency
Region-selectable data storage for enterprise customers
Accessibility
WCAG 2.1 AA compliance
Browser support
Latest 2 versions of Chrome, Edge, Firefox, Safari
Localization
Multi-currency and multi-language support (initial: English; architecture must support i18n)
Auditability
Full audit trail of changes to baselines, budgets, and approvals (critical for enterprise/compliance)



7. Information Architecture — Core Data Model (High-Level)
Organization

 └── Workspace

      └── Portfolio (optional)

           └── Program (optional)

                └── Project

                     ├── WBS (hierarchical work packages)

                     │    └── Activities (linked to schedule)

                     ├── Schedule (activities, dependencies, calendars, baselines)

                     ├── Budget (cost baseline, resource rates, actuals, EVM snapshots)

                     ├── RACI (roles mapped to WBS/activities × stakeholders)

                     ├── Risk Register

                     ├── Stakeholder Register

                     ├── Documents (generated + uploaded)

                     └── Change Requests / Approvals

Key principle: WBS is the spine. Activities, cost accounts, and RACI assignments all reference WBS elements, so a single work package rolls up schedule, cost, and accountability data consistently.


8. Tiering & Permissions (Business Model: To Be Finalized)
The business model is not yet decided, but the product should be architected to support tiered access regardless of final pricing decisions. Suggested tier structure for planning purposes:

Tier
Target Persona
Suggested Feature Gating
Individual
Freelance PM
Single workspace, limited # active projects, core WBS/schedule/budget/document features, no approval workflows
Team
Small-mid teams
Multiple projects, resource management across team, collaboration features, standard integrations
Enterprise
PMO
Portfolio/program hierarchy, SSO, approval workflows, custom templates, audit logs, API access, dedicated support


(Recommendation: revisit this section once monetization strategy — freemium/subscription vs. license vs. enterprise contracts — is decided, since it will affect which features are paywalled vs. included by default.)


9. Success Metrics (KPIs)
Metric
Target (post-launch, illustrative)
Time to first baselined project (WBS+schedule+budget)
< 30 minutes for a new user
Weekly active projects per active account
Track as core engagement metric
Document generation usage rate
% of projects using auto-generated status reports
CPM/schedule accuracy
0 critical-path calculation errors reported
Customer segment mix
Track adoption split across Individual/Team/Enterprise to validate multi-segment strategy
Retention
Monthly logo retention by tier



10. Assumptions & Constraints
Users may not have formal PM training; UI must guide them (tooltips, templates, wizards) without requiring PMBOK knowledge, while still being rigorous enough for certified PMs.
Full-vision build means higher upfront engineering investment and longer time-to-first-release; this is an explicit tradeoff accepted per stakeholder direction.
CPM/EVM calculations must be correct and defensible — these are the technical core of the product and cannot be "roughly right."
Multi-tenant data isolation is a hard requirement from day one given the enterprise segment is in scope immediately.


11. Suggested Engineering Build Sequence (Internal Planning Only)
Even though all modules are in scope for the product vision, engineering will still need to sequence build order. Suggested internal sequencing (not a customer-facing phased release):

Foundation: Auth, workspace/org hierarchy, RBAC, project setup
Planning core: WBS builder → Schedule/CPM engine → Gantt UI
Cost core: Budget baseline → resource rates → actuals → EVM engine
Accountability layer: RACI, stakeholder register, risk register
Documentation engine: Auto-generated docs (charter, WBS dictionary, RACI, status reports) + export
Collaboration layer: Comments, notifications, activity log
Reporting layer: Project dashboards → portfolio dashboards
Enterprise governance: SSO, approval workflows, audit logs, custom templates
Integrations: Calendar, file storage, ERP export, public API


12. Out of Scope (Initial Release)
Native mobile apps (mobile-responsive web only, initially)
AI-based auto-scheduling/optimization (may be a future differentiator, not initial scope)
Native time-tracking/timesheet system (may integrate with third-party tools instead)
Full-blown resource capacity planning across an entire enterprise HR system (only project-level resource allocation initially)


13. Open Questions for Stakeholder Decision
Monetization model — freemium/subscription vs. one-time license vs. enterprise contracts (flagged in Section 8; affects tiering/paywall design).
Which project methodologies must be natively supported at launch — Waterfall only, or also Agile/Hybrid (sprints, backlogs)?
Which third-party integrations are must-have at launch vs. later (e.g., is ERP actual-cost import a launch requirement for the enterprise segment)?
Data residency requirements — which regions must be supported for enterprise customers at launch?
Initial supported languages/currencies beyond English/USD?



End of Draft PRD. Recommend a stakeholder review pass focused on Section 13 (Open Questions) and Section 8 (Tiering/Business Model) before this is finalized and handed to engineering for detailed technical specs.

