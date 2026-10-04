Core System Requirements

Document 11 of 15 · Modern 3PL Warehouse Operating System (web application)

11. Brand Design Reference (Rillet) & Landing Page Structure

Item

Detail

Purpose

Records Rillet (www.rillet.com) as the preferred design reference for the product brand, the design system and the marketing site. It captures the analysed design language and sets out how our landing page, colour schemes and assets must follow it.

Parent documents

PRD — Modern 3PL Warehouse Operating System (v1.1); Phase 1–4 sprint PRDs (PRD\Phase 1…4 folders)

Reference analysed

https://www.rillet.com/ — homepage HTML and production stylesheet (design tokens, typography, layout), September 2026

Binding for

Document 04 (Design System), the marketing site, the merchant portal default theme, pitch/sales assets, and all generated documents and diagrams

Version / Date / Status

1.0 (Draft) · September 26, 2026 · Draft for review



1. Why Rillet

It's a modern, AI-native B2B platform that replaces a legacy incumbent (NetSuite), which mirrors our position against Extensiv.

Its design reads as precise, calm and premium: generous whitespace, one confident brand colour (purple), dark gradient 'feature' sections, and a strict type system. That matches our brand personality (Document 04 §1).

Its page structure sells a complex operational product to operators (accountants there, 3PL owners for us) through proof, numbered sections and demo-first calls to action.

2. Design Language Analysis

Element

What Rillet does

What we adopt

Brand colour

Purple primary #582EFD (purple-600) with a full 50–900 scale; violet scale for deep backgrounds

Same role: purple-600 as brand/interaction colour, purple-900/800 and violet-900/800 for dark sections

Neutrals

Zinc grey scale (#FAFAFA → #18181B); text #18181B; secondary text at 80% opacity

Zinc scale as the neutral system for app and site

Accents

Green scale (#1F996C etc.) for positive states; amber scale; mint (#96F3A9) for community buttons

Green for success, amber for warnings, plus red (added) for errors/floor locks

Dark sections

linear-gradient(180deg, purple-900 → purple-800) and a violet variant; theme tokens invert (white text, white primary button)

Same inversion rules. Used for the AI section, final CTA and footer

Typography

Headings Space Grotesk Medium with negative tracking (H1 64/70 −1.25px, H2 56/56 −0.75px, H3 40/44 −0.5px); body DM Sans 16/24; code JetBrains Mono

Same families and scale (Document 04 §3). JetBrains Mono for SKU/location codes

Buttons

Primary black → hover purple-600; secondary outline zinc-300 → hover purple fill; link buttons purple with arrow; radius 6px

Identical behaviour and radius

Shape & depth

Radius 6 (controls), 12 (cards), pill (badges); mostly flat with 1px borders; soft large shadow on floating panels; purple glow on product shots

Same

Layout

Containers 1210/1330/1440px, 56px desktop gutters, section spacing 120–160px, sticky 80px white nav with mega-menus

Same grid and spacing for the marketing site

Section labelling

Numbered eyebrow + category ('01 · PLATFORM', '02 · AURA AI', '03 · INTEGRATIONS')

Same pattern on every marketing section

Tone of copy

Short, confident outcome headlines ('Zero-Day Close starts here'); 'Not a chatbot' positioning of AI; built-by-practitioners credibility

Outcome headlines about zero lost orders/zero billing leakage; 'Real operational AI, not a chatbot'; built by 3PL operators

Proof

G2 rating badge in the hero, 'Trusted by' logo strip, controller testimonials, badges row

Design-partner logos, operator testimonials, measured results, SOC 2 badge when earned

Calls to action

Demo-first: 'Request a demo' (primary), 'Watch the demo' / 'See it in action' (secondary)

'Request a demo' + 'Switch from Extensiv' (our wedge) + 'See it in action'

3. Colour Scheme (Stored Brand Tokens)

These are the canonical brand colours. They are stored in brand-tokens/tokens.css, brand-tokens/tailwind.brand.js and brand-tokens/tokens.json, in the same folder as this document.

Swatch

Token

Hex

Usage

 

purple-900

#211452

Dark gradient start, footer, document headers

 

purple-800

#392498

Dark gradient end

 

purple-700

#4C22E0

Pressed states, H2 in documents

 

purple-600 ★ primary

#582EFD

Brand colour: links, hovers, focus, highlights

 

purple-500

#644EFF

Charts, illustrations

 

purple-400

#766FFF

Highlights on dark

 

purple-100

#DBDFFF

Soft fills

 

purple-50

#EBEEFF

Tinted sections

 

violet-900

#15052B

Alternative deep background

 

violet-800

#240257

Alternative gradient end

 

gray-900

#18181B

Text primary, floor background

 

gray-500

#71717A

Muted text

 

gray-300

#D4D4D8

Borders

 

gray-100

#F4F4F5

Surfaces

 

green-700

#1F996C

Success

 

amber-600

#CA8A04

Warning

 

red-600 (added)

#DC2626

Error / floor lock



4. Landing Page Structure



Figure 1 — Landing page section order and content (wireframe)

4.1 Section-by-section blueprint (adapted to our product)

#

Section

Content for the 3PL OS

Style

0

Announcement bar

Launch news, webinars, 'Now live: 1-Click Extensiv Migration →'

purple-900 strip, pill, marquee

1

Navigation

Product (Floor workspace, Inventory, Orders, Billing, Integrations, Migration, AI), Solutions (by role: 3PL owner, ops, IT, finance; by size), Integrations, Resources, Pricing, Log in, Request a demo

White, sticky 80px, mega-menus with 6px radius and zinc-200 border

2

Hero

Badge (rating/design-partner count) · H1 e.g. 'Zero lost orders starts here' · lead: unified WMS + OMS + billing, live on the floor in 15 minutes · CTAs: Request a demo / Switch from Extensiv · product screenshot · 'Trusted by' 3PL logos

White, Space Grotesk 64, purple glow on product shot

3

01 · PLATFORM

'Built by people who've run a warehouse floor' · 8 cards: Unified real-time core · 15-minute floor workspace · Self-healing integrations · Real-time billing ledger · Weekend migration · White-label merchant portal · Live reporting · Security & permissions

Grey-50 background, 12px cards, line icons

4

02 · AUTONOMOUS OPS

'Real operational AI. Not a chatbot.' · tabs: Ask anything (copilot) · Slotting & routing · 3D cartonization · SLA breach alerts (label Phase 3 items 'coming soon' until live)

Dark purple gradient, inverted buttons

5

03 · INTEGRATIONS

'Connect every channel in minutes' · logo cloud · 'View all integrations →'

White, logo grid with fade edges

6

04 · SWITCH IN A WEEKEND

Timeline Friday → Saturday → Monday · stats: <4h cutover, 0 missed shipments, 20% saving guarantee

Purple-50 panel

7

05 · TESTIMONIALS

3 operator quotes (owner, ops director, IT lead) + logos

White cards, 12px radius

8

Badges

SOC 2 (when earned), uptime, security

Grey strip

8b

FAQ (answer-first)

8–12 questions buyers ask AI assistants (e.g. 'How long does migrating from Extensiv take?', 'Do you charge per scanner?', 'Which channels do you integrate with?'), each answered in 2–3 factual sentences

Accordion, FAQPage schema; content is in the HTML (not loaded on click)

9

Final CTA

'Get one step closer to zero lost orders' · Request a demo · See it in action

Dark purple gradient

10

Footer

Newsletter · Product · Solutions · Compare (vs Extensiv / ShipHero / Logiwa) · Resources · Company · Legal

gray-900/purple-900, white text

4.1b GEO / AI-search rules for every page (see Core Doc 15)

Server-rendered HTML with one H1 and question-style H2s. Each section opens with a direct 2–3 sentence answer. Key facts (pricing, integrations, results) as real text and tables, not images.

JSON-LD structured data: Organization, SoftwareApplication with Offers on pricing, FAQPage, BreadcrumbList, Article/HowTo on guides.

Consistent one-sentence product description on every page and off-site profile. Visible 'Last updated' dates. Specific, provable numbers only.

Every product module has its own page, and every integration has its own page (so AI can cite a precise source).

4.2 Supporting pages following the same system

Pricing: transparent tiers (master PRD §9), toggle monthly/annual, 'No overages, unlimited seats' band, FAQ.

Switch from Extensiv: comparison table, migration timeline, TCO calculator, CTA.

Product pages (one per module): hero + numbered sections + screenshots + CTA band.

Integrations directory: searchable logo grid with detail pages.

Compare pages: vs Extensiv, ShipHero, Logiwa (the reference has similar 'Competitors' pages).

5. Asset Guidelines (Assets Must Reference This System)

Asset

Rule

Logo & wordmark

Our own mark (name TBD). Wordmark set in Space Grotesk Medium. Mono versions in gray-900 and white. Primary lock-up on white or purple-900.

Product screenshots

Real UI in the brand theme, on rounded 16–20px frames with a purple glow on dark sections. No stock photos of warehouses in hero areas; use product UI first.

Illustrations & icons

Line icons (Lucide), 1.5px stroke, purple-600 or gray-900. Abstract grid/line patterns on dark gradients are allowed.

Photography

Optional, used only for real customers (testimonials, case studies), with a subtle purple overlay on dark sections.

Charts

Series order: purple-600, green-700, purple-400, amber-600, gray-500.

Documents & decks

Space Grotesk headings, DM Sans body, purple-900 headers/table headers, purple-700 sub-headings. All PRDs and diagrams in this repository are regenerated in this scheme.

Email & portal

Default portal theme uses these tokens. 3PLs may override brand-primary/logo (white-label rule, Document 04 §7).

6. Usage Boundaries (Inspired, Not Copied)

Adopt the design language (palette roles, type system, spacing, layout patterns, section structure). Don't copy Rillet's logo, product names, marketing copy, illustrations, screenshots or code.

Fonts (Space Grotesk, DM Sans, JetBrains Mono) are open-source under the SIL Open Font License, loaded from Google Fonts or self-hosted.

Our final brand name and logo must still pass a trademark check (Document 09, item L7). The palette alone doesn't make us look like Rillet's brand, but avoid a purple-on-black logo identical in style to theirs.

Accessibility overrides the reference: every colour pair must meet WCAG AA (floor instructions 7:1).



End of Document 11.

Core System Requirements  |  11 Brand Design Reference  |  Page