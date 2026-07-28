# Works Group — Websites

Project context for Claude Code. Read this before editing.

## What it is
A family of **three** websites for **Works Group**, a Copenhagen-based commercial
hospitality services operation serving **hotels and restaurants across Denmark**.
B2B — the audience is hotel and restaurant managers.

The business was split into three brands:

1. **Works Group** — the parent. A single landing page that introduces the group,
   links out to the two operating companies, surfaces Staffing as a shared service,
   and carries a short about section. Not a service site itself.
2. **Linen Works** — **linen rental + commercial laundry + textile management.**
   Supplies property linen and workwear textiles on rental, launders them, and
   manages the rotation (repairs, replacements, stock levels) on an ongoing basis.
3. **Cleaning Works** — **general commercial cleaning** for hotels, restaurants and
   offices: daily/contract, deep/periodic, and specialist cleaning.

### How the split works (important — affects all copy)
- **Linen Works does linen rental, laundry and textile management; Cleaning Works
  does cleaning.** They are separate companies under one group. Laundry belongs to
  Linen Works, NOT Cleaning Works. Cleaning Works is general cleaning, NOT laundry.
- **Staffing** is a **shared group-level service**, surfaced only on the Works Group
  landing page. It is NOT on Linen Works or Cleaning Works. (Staffing was removed
  from Linen Works when it moved to group level — do not reintroduce it.)
- HISTORY NOTE: there was briefly a plan to move laundry from Linen Works to Cleaning
  Works (making Cleaning a laundry-only brand). That was reversed. Any laundry copy
  on Cleaning Works is a leftover and should be fixed.
- HISTORY NOTE 2 (corrected 2026-07-28): this file previously described Linen Works as
  a **uniforms** brand and called rental framing a "leftover". That was backwards — it
  described an abandoned direction, not the site. Every Linen Works page, and the
  Works Group panel describing it, is and has been rental/laundry/textile-management
  framed. **Rental framing is correct; do not "fix" it toward uniforms.** The only
  genuine uniforms leftovers are the `uniforms-laundry.html` filename, its `<title>`
  and its footer label (see Open work #5).

## Core strategic goal
Each operating-company homepage must convince a manager within ~10 seconds that the
company is a serious, quality operator worth contacting. The Works Group page must
make the group structure instantly legible and route visitors to the right company.
Everything serves those goals — nothing decorative.

## Tech stack
Plain HTML / CSS / JS. **No framework, no build step.** Keep it that way.
Single-file pages with `<style>` in the `<head>`, repeated per site.

**Exception — `linen-portal/`:** the one part that is an *app*, not a static page.
It is a login-gated customer-ordering + staff-fulfillment portal backed by
**Supabase** (hosted Postgres + auth). Still plain HTML/JS, no build step, but it
loads the Supabase JS client from a CDN and talks to a database. It has shared
files (`styles.css`, `app.js`) — unlike the marketing sites, which share nothing.
See `linen-portal/README.md`. **Status: code complete; the Supabase project is
NOT set up yet** (owner will do it later — see Open work #4).

## Shared design system

All three sites share one design language. The **palette is the only brand
differentiator** — typography, layout architecture, wordmark lockup, spacing,
section structure and the 880px mobile breakpoint are identical across all three.

### Fonts (shared)
- Headlines: **Cormorant Garamond** (premium serif)
- Body: **Jost** (light geometric sans)
- Google Fonts. Do not diverge fonts per brand.

### Wordmark (shared lockup, per-brand word)
First word in heavier serif + *Works* / *Group* in italic (mid-tone accent colour).
Uppercase Cormorant Garamond, horizontal, not stacked.
**LINEN** *Works* · **CLEANING** *Works* · **WORKS** *Group*

### Palettes — one per brand (always use the CSS vars, not raw hex)

| Role         | Linen Works (warm)      | Cleaning Works (cool)    | Works Group (mono)       |
|--------------|-------------------------|--------------------------|--------------------------|
| Lightest bg  | `#F5F0E8` `--ivory`     | `#EEF2F4` `--mist`       | `#F2F1EE` `--paper`      |
| Section bg   | `#E8DFD0` `--stone`     | `#DCE4E8` `--vapor`      | `#E2E0DB` `--ash`        |
| Accent       | `#C9B99A` `--tan`       | `#9DB0BC` `--steel`      | `#A8A29A` `--pewter`     |
| Mid text     | `#7A6A55` `--brown`     | `#536270` `--slate`      | `#5A554E` `--graphite`   |
| Anchor/dark  | `#2C2418` `--charcoal`  | `#1F2A33` `--ink`        | `#211E1A` `--char`       |

- **Linen** = warm neutrals (linen as a material).
- **Cleaning** = cool slate/blue-grey (clean, fresh — NOT generic SaaS blue).
- **Works Group** = near-monochrome charcoal (neutral parent-brand authority).

All combinations pass WCAG AA. If changing a palette, supply a full replacement
table in this format and re-check contrast.

## Site structure & pages

### Works Group (parent landing — 1 page)
`index.html` only.
- **Hero:** single-column centred, charcoal background, parent-brand authority.
- **Company panels (signature element):** two side-by-side panels linking to Linen
  Works (tag "Uniforms & Linen", tan accent tick) and Cleaning Works (tag
  "Commercial Cleaning", slate accent tick). Hover inverts to charcoal.
- **Shared service:** Staffing (group-level).
- **About the group** + charcoal footer.

### Linen Works (linen rental + laundry + textile management — built)
`index.html` · `uniforms-laundry.html` · `about.html` · `contact.html` · `thanks.html`
- `thanks.html` is the post-submit landing page for the contact form (Formspree
  `_next` target). `noindex`. Not in the nav — reachable only after submitting.
- Inner page is `uniforms-laundry.html` (legacy filename — content is not about
  uniforms; see Open work #5). No `staffing.html`.
- Home cards: **Linen Rental · Commercial Laundry · Textile Management** (staffing
  removed — it's group-level now).
- Services page (`uniforms-laundry.html`): two-column split (Linen Rental / Commercial
  Laundry) covering supply + laundering; 3-step "how it works" (assess → set up →
  run the rotation).
- `contact.html` service dropdown mirrors the home cards: Linen rental / Commercial
  laundry / Textile management / Not sure yet.

### Cleaning Works (general cleaning — built)
`index.html` · `services.html` · `about.html` · `contact.html`
- Nav labels the inner page "Services" (file is `services.html`).
- Home cards: **Daily Cleaning · Deep & Periodic · Specialist.**
- Services page: two-column split (Daily & Contract / Deep & Specialist); 3-step
  "how it works" (assess site → agree scope → keep it clean).

## Assets
- Linen Works `hero.jpg` — row of grey aprons on pegs (Apron_hanging).
- Cleaning Works `Cleaningtable.jpg` — cleaner in apron wiping down a restaurant
  table. Cleaning-in-action, on-message for general cleaning. Tones run warm (wood /
  brick) against the cool palette; reads as intentional contrast, not a clash.
  (Replaced an earlier towel-stack photo that read too much like laundry.)
- Linen Works inner page (`uniforms-laundry.html`) carries two column images:
  `Apron_stack.jpg` (folded uniform/apron stack, warm tones) over Uniform Supply,
  and `Linen_closeup2.jpg` (beige woven linen texture) over Linen Management. Both
  via `.svc-img` (280px cover, 220px on mobile).
- Cleaning Works services page (`services.html`) has a full-width `.img-band` between
  the service split and "how it works": `Wipingglass.jpg` (hand polishing a glass).
- Unused-but-available in the stock folder: `Linen_closeup.jpg` (olive, too dark for
  the palette), `Apron_stack2.jpg` (dark/moody), `Apron_hanging.jpg` (= Linen hero),
  plus `Stock 1–8.jpg`.
- IMAGE OPTIMISATION: all in-use photos are resized + compressed for web (progressive
  JPEG, q82, EXIF stripped). Long-edge caps: heroes ~1600px, band ~1800px, column
  `.svc-img` ~1100px. Total image payload ~860 KB across both sites. The originals
  live in the Desktop stock folder — re-export from there if you need higher res, and
  re-run the same caps; don't re-compress the already-optimised copies (it only
  degrades them). Source `hero.jpg` was already small, so it's left as the original.
- Original "Stock photos Linen Works" folder has 8 photos (Stock 1–8).

## Open work / next steps
1. ~~Cross-site links + emails are guesses~~ **RESOLVED 2026-07-28.** Domains
   `linenworks.dk`, `cleaningworks.dk`, `worksgroup.dk` are confirmed correct.
   Email is now a **single shared inbox, `info@worksgroup.dk`**, on all three sites
   (was per-brand `hello@<brand>.dk`). See Conventions.
   **Still pending:** the contact forms post to Formspree with a placeholder
   `YOUR_FORM_ID` — create the form and paste the real ID into
   `linen-works/contact.html` and `cleaning-works/contact.html` before deploying.
2. **Placeholder content** across all sites — testimonials and stat numbers are still
   placeholders. Replace with real figures.
   ~~Phone~~ **DONE 2026-07-28:** the real number is **+45 31 40 86 21**
   (`tel:+4531408621`), live on **every page of all three sites** — all 9 footers,
   both contact-page detail blocks, and the Works Group staffing note (12 links).
   Display format is Danish two-digit pairs; the `tel:` href stays unspaced. One
   shared number, matching the shared `info@worksgroup.dk` inbox. See Conventions.
3. **Repo / folder layout** — outputs use per-site subfolders
   (`linen-works/`, `cleaning-works/`, `works-group/`). Decide separate repos vs one.
4. **Linen Portal — Supabase not set up yet (owner to do later).** The `linen-portal/`
   code is complete but inert until a Supabase project exists. To activate: create a
   free Supabase project → run `linen-portal/supabase-schema.sql` in its SQL Editor →
   put the Project URL + anon key in `linen-portal/config.js` → sign up once and
   promote that account to `employee` (one-line SQL in the portal README). Full steps
   in `linen-portal/README.md`. `config.js` currently holds placeholder keys.
5. **Uniforms leftovers on Linen Works.** The brand is confirmed rental / laundry /
   textile management (2026-07-28); body copy everywhere already reads that way. What
   still says "uniforms" is only naming and metadata:
   - `uniforms-laundry.html` — the filename itself.
   - `uniforms-laundry.html:6` — `<title>Uniforms & Laundry — Linen Works</title>`.
   - `index.html:6` — `<title>Linen Works — Quality linen and uniforms for
     hospitality</title>` (**this one is the homepage SEO title — highest impact**).
   - Footer label "Uniforms & Laundry" on all four pages
     (`index:136`, `about:160`, `contact:151`, `uniforms-laundry:156`).
   Renaming the file changes a live URL and touches nav + footer links on all four
   pages, so it's deferred pending a decision. Renaming to `services.html` would also
   match Cleaning Works. The two `<title>`s and the footer label can be fixed on their
   own without any URL change — that's the low-risk subset.
   NOTE: `uniforms-laundry.html:100` `<li>Workwear and uniforms</li>` is **correct** —
   workwear is one of the textile types rented and laundered. Leave it.

6. **Danish legal disclosure — not yet on any site.** No CVR number appears anywhere,
   and the address is only "Copenhagen, Denmark" rather than a street address. Danish
   marketing/e-commerce rules expect company name, CVR, address, email and phone to be
   available on a business website. Owner chose to launch Linen Works without it
   (2026-07-28) and add it shortly after — confirm the exact requirement with an
   accountant, then add to the footer of all three sites.
7. **No privacy policy, and Google Fonts loads from Google's CDN.** The contact form
   collects name/email/phone, so GDPR expects a privacy notice; the CDN call also sends
   visitor IPs to Google. Owner chose to keep the CDN for the 2026-07-28 launch.
   Self-hosting Cormorant Garamond + Jost removes the third-party call entirely and is
   the cleaner long-term fix.

## Conventions
- Match the shared system before introducing anything new. To build a new page for a
  brand, copy the equivalent page from another brand and swap the palette variable
  block + copy — do not re-derive layout.
- Keep Linen = linen rental + commercial laundry + textile management, Cleaning =
  general cleaning, Staffing = group-level. Don't move laundry to Cleaning Works,
  don't reintroduce staffing into either operating company, and don't reframe Linen
  Works as a uniforms brand — it isn't one (confirmed 2026-07-28).
- SERVICE AREA is **Zealand** (Sjælland), not "Denmark" — copy says "across Zealand."
  The physical address stays "Copenhagen, Denmark" (Copenhagen is on Zealand).
- AUDIENCE is broad: hotels, restaurants, care homes, healthcare and fitness
  businesses (plus offices for Cleaning). Not hotels-and-restaurants only.
- NO INVENTED NUMBERS. Linen Works is a young independent company "built from the
  ground up," so earlier placeholder stats ("120+ properties", "15 yrs", invented
  testimonials) were removed sitewide and replaced with honest positioning labels
  (Independent / Zealand / In-house / Direct) and self-attributed quotes ("How we
  work at …"). If real figures or client testimonials arrive, put them back as real.
- Real Linen Works copy lives in `C:\Users\TMJ\Desktop\LinenWorks Text\`
  (About.txt, ESG.txt, Website.txt). Linen Works pages now use it. Cleaning Works
  and Works Group still use written-to-match copy (no client-supplied text yet).
- CONTACT EMAIL is **one shared inbox: `info@worksgroup.dk`**, used on all three
  sites. Do not reintroduce per-brand addresses (`hello@linenworks.dk` etc.) or the
  `hello@` prefix. Brands stay separate in every other respect — only the inbox is
  shared, and the contact forms carry a hidden `_subject` naming the brand so
  enquiries are still distinguishable in that one inbox.
- CONTACT PHONE is **+45 31 40 86 21**, one shared number on every page of all three
  sites (footer "Get in touch" block, plus the contact pages and the Works Group
  staffing note). Display as Danish two-digit pairs `+45 31 40 86 21`; keep the href
  unspaced `tel:+4531408621`. Any new page must carry it in the footer.
- CONTACT FORMS post to **Formspree** (`https://formspree.io/f/<id>`), not `mailto:`.
  A `mailto:` form action silently does nothing in Chrome/Edge — never go back to it.
- Mobile breakpoint: `max-width: 880px` (all sites).
- Nav CTA button uses class `.nav-cta` on every page across all three sites
  (previously the three homepages used `.cta` — standardised 2026-06-16).
- Copy concise and operator-focused; no fluff.
- The old five-color swatch bar at the top is removed — do not add it back. (The
  leftover `.swatch` CSS in `linen-works/index.html` was also deleted 2026-06-16.)
- When using `sed` for copy edits, watch for `&` in replacement strings (it inserts
  the matched text) — prefer literal string replacement for anything containing `&`.

## Changelog

### 2026-07-28 — corrected the Linen Works brand description (docs only)
- **No site files changed.** This entry fixes `CLAUDE.md` itself, which described
  Linen Works as **uniforms + linen + laundry** and instructed that "rental only"
  framing be treated as a leftover to fix. That was backwards and contradicted both
  the code and this file's own deferred-decisions note.
- Confirmed with the owner: Linen Works is **linen rental + commercial laundry +
  textile management**. Every Linen Works page already reads that way, as does the
  Works Group panel describing it. The site was right; the doc was wrong.
- Acting on the old doc would have meant rewriting correct sitewide copy. Corrected
  the brand description, the split summary, the site-structure section and the
  Conventions line, and added a HISTORY NOTE 2 so the error isn't re-derived.
- The remaining uniforms traces are only the `uniforms-laundry.html` filename, title
  and footer label — promoted from a buried note to **Open work #5**.

### 2026-07-28 — Linen Works launch prep
Pre-launch pass over `linen-works/` only (the other two sites are untouched and still
lack all of the below — do the same pass before either goes live).
- **SEO:** homepage `<title>` said "Quality linen and uniforms for hospitality" — wrong
  scope and the most-read string on the site; now "Linen rental and commercial laundry,
  Zealand". Added a `<meta name="description">` to all 4 pages (there were none).
- **Social:** added Open Graph + `twitter:card` to all 4 pages. Links pasted into
  LinkedIn previously rendered as a bare URL with no card.
- **Favicon:** added as an inline SVG data URI (charcoal tile, ivory "L") — no extra
  file, no request. Same markup on every page including `thanks.html`.
- **Mobile overflow bug:** `.stats` on the homepage stayed 2-column below 880px, but
  `.stat .n` is 56px serif and "Independent" is unbreakable — roughly 250px of text in
  a ~143px cell on a 375px phone, pushing the page into horizontal scroll. Media query
  now forces `.stats` to 1 column and drops `.stat .n` to 44px.
- **Footer label:** "Uniforms & Laundry" → "Rental & Laundry" on all 4 pages (+ the new
  `thanks.html`). Part of Open work #5; the filename itself is still deferred.
- **New `thanks.html`** — Formspree otherwise dumps the visitor on formspree.io after
  submitting. The form now carries `_next` pointing here. Marked `noindex`.
- Removed dead `.about-stats` / `.stat-row` CSS from `about.html` (left over from the
  invented-stats removal; no markup used it). Escaped a raw `&` in `index.html`.
- Left deliberately: `<li>Workwear and uniforms</li>` in `uniforms-laundry.html` is a
  correct textile category, not a leftover.

### 2026-07-28 — real phone number added sitewide
- Placeholder `+45 00 00 00 00` replaced with **+45 31 40 86 21**, then rolled out to
  every page: **12 `tel:` links** across all three sites.
  - 9 footer "Get in touch" blocks (every page of every site), added under the email.
  - 2 contact-page detail blocks (`linen-works/contact.html`, `cleaning-works/`).
  - 1 Works Group staffing note (previously email-only).
- Displayed in Danish two-digit pairs; `tel:` href is unspaced (`tel:+4531408621`).
- **No new CSS.** `.foot-grid a` is already `display:block; margin-bottom:10px`, so
  the extra link stacks correctly in all 9 footers. The staffing note uses
  `.shared .note` (`display:inline-block`), so that one carries an inline
  `margin-left:24px` to separate it from the email — inline styles are already the
  house pattern in these footers.
- The `placeholder="+45 XX XX XX XX"` on the phone *input* fields is unrelated — it
  hints the visitor's own number format. Left as is.
- Closes the phone half of Open work #2 (testimonials + stats still placeholder).

### 2026-07-28 — contact email consolidated + contact forms fixed
- Domains confirmed (no change): `linenworks.dk`, `cleaningworks.dk`, `worksgroup.dk`.
- All 15 displayed/linked addresses across 9 pages replaced with the single shared
  inbox **`info@worksgroup.dk`** (was per-brand `hello@<brand>.dk`).
- Both contact forms switched from a **non-functional `mailto:` action** (silently
  no-ops in Chrome/Edge — enquiries were being lost) to a Formspree POST, and the
  `enctype="text/plain"` was dropped. Added a hidden `_subject` per brand so the two
  sites stay distinguishable in the shared inbox.
- **Pending:** real Formspree form ID still to be pasted in (see Open work #1).

### 2026-06-24 — added Linen Portal (login + inventory ordering)
- New `linen-portal/` app: customer + employee logins, linen inventory catalog,
  customer ordering, and staff order-fulfillment + inventory/stock management.
- Backend = Supabase (Postgres + auth); access governed by Row-Level Security.
  Customers self-sign-up → **pending** → staff **approve** → can order; only active
  customers can order; only employees manage inventory / see all orders.
- MVP scope: ordering + fulfillment, **no payments** (invoicing stays offline).
- Files: `index/customer/employee.html`, `app.js`, `styles.css`,
  `supabase-schema.sql`, `config.example.js`, portal `README.md`.
- **Pending:** Supabase project setup (owner to do later — see Open work #4).

### 2026-06-16 — consistency pass
- `linen-works/index.html`: fixed broken logo link (`href="#"` → `index.html`);
  removed dead `.swatch` CSS; renamed nav `.cta` → `.nav-cta`.
- `linen-works/uniforms-laundry.html`: reworded "how it works" step 2 to drop the
  leftover "Your team is fitted" uniform-programme language (now rental/laundry).
- `cleaning-works/index.html` and `works-group/index.html`: renamed nav `.cta` →
  `.nav-cta`.
- `cleaning-works/{services,about,contact}.html`: visible "Deep & Specialist"
  footer links now use `&amp;`; `&ccedil;` → literal `façade`; `&copy;` → literal
  `©` (matching the convention used elsewhere).

Known, deliberately NOT changed (decisions for later):
- `uniforms-laundry.html` filename + its "Uniforms & Laundry" footer label and page
  `<title>` still use the old wording, though the body copy is now textile/rental.
  (Still open — now tracked as Open work #5. This note was correct all along; the
  brand description at the top of this file was the part that was wrong.)
- Cleaning Works home card says "Deep & Periodic" while footers/services say
  "Deep & Specialist" — pick one label.
- ~~Placeholder `+45 00 00 00 00` phone on both contact pages~~ — resolved 2026-07-28,
  real number now live (see Open work #2).
