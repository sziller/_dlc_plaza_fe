# Knowledge Hub (Blog) Authoring Guide

The Knowledge Hub articles are stored in the backend (blog API) and edited through the admin UI. Use this guide to fill the admin form, write Markdown, and control the extras (tables, related links, CTA).

## Where to edit
- Go to the admin Knowledge Hub editor by loging in with `admin/login` and you will be taken to (`/admin/blog` → create/edit). It saves directly to the backend API and powers the public routes `/knowledge-hub` (list) and `/article/:slug` (detail).

## Fields in the admin form (what they do)
- **Title**: Main headline (shows in hero and `<h1>`).
- **Slug**: URL segment, lowercase with hyphens (e.g., `non-custodial-bitcoin-borrowing`). Must be unique.
- **Excerpt**: Short teaser shown on the Knowledge Hub cards.
- **Subheading**: Optional subtitle under the hero title.
- **Author Name**: Optional; shown under the title.
- **Hero Image URL**: Wide image shown near the top. Use a CDN URL; include alt-friendly content in the image itself.
- **Article Image URL**: Optional secondary image further down the page.
- **Slides Presentation URL**: Optional embed (e.g., Google Slides `.../embed`). An “open in new tab” link is shown automatically.
- **CTA Text Big / CTA Supporting Text / CTA Button Text**: Fills the bottom CTA banner. If blank, defaults to generic “Ready to Borrow…” copy.
- **Body (Markdown)**: Main article content (see below).
- **Status**: `draft` keeps it hidden; `published` makes it live in the Hub and detail pages.

## Writing the Body (Markdown)
- Supports standard Markdown via `marked` with line-breaks enabled.
- Headings: use `##` for section headers (the hero already provides the single `h1`).
- Lists: `-` or `*` for bullets, `1.` for ordered steps.
- Links: `[text](https://example.com)` — use meaningful link text.
- Images: `![alt text](https://cdn.example.com/image.jpg)` — include descriptive alt text.
- Length: aim for 1,000–1,800 words; keep paragraphs short and scannable.
- Tone: plain language, specific examples, explain acronyms once (e.g., “Discreet Log Contracts (DLCs)”).

## Special blocks and shortcodes
You can insert structured blocks inside the Markdown body:

1) **Comparison table**  
Add a marker anywhere in the Markdown:
```
[[comparison-table { "title": "Cadena vs Wrapped BTC", "subtitle": "Why native BTC matters", "features": [
  { "feature": "Non-custodial collateral", "cadena": true, "traditional": false, "defi": true },
  { "feature": "On-chain enforcement", "cadena": true, "traditional": false, "defi": "Varies" }
] }]]
```
- If you omit `features`, it falls back to a default set.
- `cadena`, `traditional`, `defi` accept `true` (✓), `false` (✗), or a string (“Varies”).

2) **Related resources list**  
```
[[related-resources { "title": "Related Resources", "links": [
  { "to": "/article/non-custodial-bitcoin-borrowing", "text": "Non-Custodial Bitcoin Borrowing" },
  { "to": "/knowledge-hub", "text": "Back to Knowledge Hub" }
] }]]
```
- Omit `links` to hide the list.

3) **Callout box**  
Wrap content in:
```
:::box
Your callout text (supports Markdown inside).
:::
```

## Images and assets
- Host images on your CDN and paste full URLs.
- Keep file sizes reasonable; prefer optimized WebP/AVIF if available.
- Use clear, descriptive alt text in the Markdown image syntax.

## Ordering and navigation
- The “Next Article” link is based on the order returned by the API list; ensure `published_at`/`created_at` ordering on the backend is correct.
- The Knowledge Hub grid shows only `published` posts.

## SEO and clarity
- Meta tags are driven by Title + Excerpt + Hero/Article images; keep excerpt ~150–160 chars for good previews.
- Use one main idea per section; avoid jargon and hype.
- Meaningful link text; no “click here”.

## Pre-publish checklist
- Status set to `published`.
- Title/Slug/Excerpt filled and proofread.
- Hero image URL valid; alt text present on any inline Markdown images.
- Body has headings, bullets, and at least one conclusion/CTA prompt.
- Optional: add comparison table, related resources, and callouts where helpful.
