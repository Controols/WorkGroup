# CleaningWorks — website build

Project instructions for Claude Code. Read this before touching anything.

We are building the public website for **CleaningWorks**, a Danish commercial cleaning company.
The design is settled: direction D, "Værkstedet". `mockup.html` in this folder is the approved
homepage design and is the single source of truth for how the site looks.

> ## ✅ THE BUILD IS DONE (2026-08-24) — this file is now a SPEC, not a to-do list
> The site was built and lives in **`../cleaning-works/`**, merged to `main`. Seven pages
> (`index · ydelser · niveauer · om-os · job · kontakt · tak`) plus `css/style.css`,
> `js/site.js`, `js/i18n.js` and `js/calculator.js`. `cases.html` was deliberately skipped
> — it needs one real, approved case study first.
>
> **Read §4 (design system), §5 (bilingual), §6 (calculator spec) and §10 (definition of
> done) as the rules the built site follows.** Read §9 as the list of things that still
> must not ship. The task list in §11 is kept only as a record of the original plan —
> items 1–4 are complete; 5–9 are still outstanding and are tracked properly as Open work
> #15 in the repo-root `../CLAUDE.md`, which is the authority from here on.

---

## 1. Files in this folder

| File | What it is |
|---|---|
| `mockup.html` | **The approved design.** A complete, working homepage: all sections, the price calculator, the DA/EN toggle, the mobile menu. Self-contained (inline CSS + JS). Treat it as a reference, not as the file to ship — but everything it does must survive into the real build. |
| `foto-band.jpg` | The one photo currently in use, in the wide band below the hero. **A stock photo of a living room — see §9.** |
| `cleaingstock.jpg` | The original the client supplied. `foto-band.jpg` is the optimised copy. |
| `CLAUDE.md` | This file. |

⚠️ **Correction (2026-08-24):** this file used to say the earlier directions "have been
removed". They have not — `retning-a` through `retning-g` and the `index.html` overview
page are all still in this folder, and were committed to the repo on 2026-08-24 as design
provenance. Only **`mockup.html` is the approved design**; the rest are reference for how
that decision was reached. Do not build from them, and do not treat their content as
current.

---

## 2. Stack and constraints

- **Static HTML, CSS and JavaScript.** No framework, no bundler, no npm dependency at runtime.
  The site must open correctly from the filesystem and deploy by copying files to any static host.
- **Extract the shared layer.** `mockup.html` has everything inline. The real build splits it:
  - `css/style.css` — one stylesheet, all pages. Tokens at the top, then base, then components, then sections, then media queries. Keep the section comments from the mockup.
  - `js/site.js` — one script, all pages: language toggle, mobile menu, FAQ accordions.
  - `js/calculator.js` — the price calculator, loaded only on pages that use it.
  - One `.html` file per page, each with its own `<head>` and a duplicated header/footer.
- **No templating engine.** Header and footer are duplicated across pages by hand. Accept that;
  when a nav item changes, change it in every file. If duplication becomes painful later we will
  reconsider, but do not introduce a build step without being asked.
- **No inline styles** in the built pages except where the mockup uses them for one-off spacing —
  move those into classes as you go.
- **Fonts:** Manrope, Instrument Serif, JetBrains Mono, loaded from Google Fonts with the fallback
  stacks already defined in the tokens. Keep `&display=swap`.
- **Browser support:** current Chrome, Safari, Firefox and Edge. No IE, no polyfills.

---

## 3. Site map

Build in this order. The homepage exists; everything else is new.

| Page | File | Notes |
|---|---|---|
| Forside | `index.html` | Port of `mockup.html`. Ship this first. |
| Ydelser | `ydelser.html` | The four services, one section each, expanded from the homepage cards. |
| Serviceniveauer | `niveauer.html` | The Basis/Standard/Total table with the calculator, full width. |
| Om os | `om-os.html` | The "Ansvar" content expanded: employment terms, environment, certifications, history. |
| Cases | `cases.html` | Case list. One real case is needed before this page can ship. |
| Job | `job.html` | Recruitment. Direct link from the "ordentlige vilkår" argument. |
| Kontakt | `kontakt.html` | Form, address, map, opening hours. |

Header nav (from the mockup): Ydelser · Niveau · Kvalitetskontrol · Sådan starter I · Ansvar · FAQ.
When the subpages exist, the nav becomes: Ydelser · Serviceniveauer · Om os · Cases · Job · Kontakt,
with the homepage's in-page anchors kept as a secondary nav on the homepage itself.

---

## 4. Design system

Copy these tokens verbatim to the top of `css/style.css`. They are already in `mockup.html`.

```css
:root{
  /* palette */
  --green:#0b4d3f;      /* primary — headers, CTAs, hero panel */
  --green-2:#0f6b56;    /* hover */
  --green-lt:#e3f2ec;   /* tint — pills, soft backgrounds */
  --cream:#fdf8f0;      /* page background */
  --coral:#ff5c39;      /* primary action accent */
  --coral-2:#ff7455;    /* hover */
  --sun:#ffc94d;        /* highlight, badges, quote band */
  --sand:#f3e8d2;       /* warm oat — panels and cards, used instead of plain white */
  --sand-2:#ede0c6;
  --ink:#10221d;        /* text */
  --mute:#5d7570;       /* secondary text */
  --line:#e3d6b9;       /* hairlines, warm-tinted not grey */
  --white:#ffffff;

  /* type */
  --sans:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
  --serif:'Instrument Serif',Georgia,'Times New Roman',serif;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;

  /* spacing */
  --sp-1:6px; --sp-2:12px; --sp-3:20px; --sp-4:32px; --sp-5:52px; --sp-6:84px;

  /* radius */
  --r-sm:12px; --r-md:20px; --r-lg:32px; --r-xl:40px; --r-pill:999px;

  --max:1200px;
}
```

**Rules that are not obvious from the tokens:**

- Body is `17px / 1.62`, weight 500. Headings are weight 800, `letter-spacing:-.03em`, `line-height:1.05`.
- `--serif` is **only** used italic, inside a heading, as a `.serif` span on part of the line.
  Never for body text, never for a whole heading. It is a highlight, not a typeface for reading.
- `--mono` is uppercase with `letter-spacing:.1em`, only for chapter numbers, small labels and
  captions. Never above ~13px.
- **Coral and sun are background colours, never small text colours.** They only ever appear with
  dark ink text on top. This is what keeps the page passing AA.
- Panels are `--sand`, not white. White is used sparingly, for cards that need to lift off sand.
- No black anywhere. The client rejected a dark direction; deep green does the job black would.
- Content width `--max` (1200px), `.wrap` padding 26px.

**Components already designed in the mockup** — reuse them, do not reinvent:
`.btn` (+ `.coral`, `.ghost`, `.big`, `.block`), `.pill` (+ `.coral`, `.sun`, `.on-green`),
`.card`, `.chap` section wrapper (+ `.alt`, `.alt2` background variants), chapter number blocks,
`.band` photo band, `.levels` comparison table + `.level-card` mobile fallback, `.calc` form,
`details`-based FAQ accordions, the quote band, the footer grid.

---

## 5. Bilingual: Danish primary, English toggle

The mechanism from the mockup stays. Do not replace it with a routing- or file-based approach
unless asked — the client wants one page that switches, not two sites.

- **Danish lives in the HTML.** Elements that translate carry `data-i18n="key"`.
- **English lives in a `T = { key: "…" }` object.** On load, capture each element's Danish
  `innerHTML` into a `Map`; switching to EN writes `T[key]`, switching back writes the captured
  Danish. Keys may contain inline HTML (`<b>`, `<span class="serif">`) — that is intentional.
- `document.documentElement.lang` follows the selection. The DA/EN buttons carry `aria-pressed`.
- **Every `data-i18n` key in the HTML must exist in `T`, and no `T` key may be unused.** Add a check
  for this and run it whenever you touch content. This has caught real bugs twice already.
- When the site grows past a couple of pages, move `T` into `js/i18n-da-en.js` as one object keyed
  by page, rather than duplicating shared header/footer strings in every file.
- Anything the calculator prints is formatted by JS, not translated by `T` — see below.

---

## 6. The price calculator — canonical spec

This is the centrepiece of the design and the client's favourite part. It appears on the homepage
and on `niveauer.html`. Behaviour must be identical in both places.

```js
let typeF = 1;        // kontor 1 · produktion 1.15 · klinik 1.3
let m2    = 1200;     // slider 200–6000, step 100
let days  = 5;        // slider 1–7 dage/uge
let selectedLevel = 'standard';
let locked = false;   // true once the visitor clicks a level directly

const freqTable = [0.45, 0.585, 0.72, 0.86, 1, 1.14, 1.28];  // index = days - 1
const round100 = n => Math.round(n / 100) * 100;

function bandForDays(d){ return d <= 2 ? 'basis' : d <= 5 ? 'standard' : 'total'; }

function computePrices(){
  const raw = (900 + m2 * 7.4) * typeF * freqTable[days - 1];
  return { basis: round100(raw * 0.55), standard: round100(raw), total: round100(raw * 1.55) };
}
```

**Regression check — keep this as a test.** kontor, 1.200 m², 5 dage/uge →
Basis **5.400 kr.** · Standard **9.800 kr.** · Total **15.200 kr.**

**Behaviour:**

1. All three levels are priced and shown at once, each with `≈ x,x kr./m²` beneath.
2. The level matching the frequency is tagged **Anbefalet**. That recommendation follows the
   frequency slider until the visitor clicks a level, which sets `locked = true` and pins it.
3. Each level is a real `<button>` with `aria-pressed`.
4. The selection drives the Basis/Standard/Total comparison table: highlighted column, and the
   price row shows the live figures. Below 700px the table is replaced by three tap-to-select cards.
5. A summary line reads: `Standard, kontor, 1.200 m², 5 dage/uge — ca. 9.800 kr./md.`
6. Number formatting: Danish `n.toLocaleString('da-DK') + ' kr.'`, decimal comma (`8,2 kr./m²`);
   English `'DKK ' + n.toLocaleString('en-GB')`, decimal point. `1 dag/uge` vs `5 dage/uge`.
7. `render()` runs once on load and again at the end of `setLang()`, so the numbers reformat on
   language switch.

---

## 7. Content that must stay consistent everywhere

These are the site's arguments. Do not reword them page to page.

- Fixed teams, the same people every day, a named operations manager (driftsleder)
- Quality measured monthly to **INSTA 800**; the report is in the client portal the next day
- **30 dages opsigelse, ingen bindingsperiode**
- Permanent contracts on the 3F collective agreement; 11% staff turnover against ~40% in the industry
- Svanemærket, ISO 14001, ISO 9001
- Process: gennemgang → plan & pris → opstart → månedlig kontrol; running in 14 days
- Four services: daglig rengøring · hovedrengøring/special · vinduespolering · bygge- & flytterengøring
- Tone: direct, concrete, no superlatives. Danish that a facility manager would write, not marketing
  copy. If a sentence could appear on any cleaning company's site, rewrite it.

---

## 8. Accessibility and responsive

- Body text never below 16px. Contrast AA on all text — the coral/sun rule in §4 is what protects this.
- Real `<button>` and `<input>` elements. `aria-pressed` on toggles, `aria-expanded` on the burger,
  labels tied to inputs. Visible `:focus-visible` outlines everywhere.
- Breakpoints in use: 980px (nav collapses to burger, two-column layouts stack), 700px (levels table
  becomes cards), 600px (everything single column, reduced section padding).
- **No horizontal overflow at 390px.** Check every page at 390 / 768 / 1440. Wide tables scroll inside
  their own container; grid children that hold wide content need `min-width:0`.
- A full WCAG 2.1 AA audit has not been done. Do one before launch.

---

## 9. ⚠️ Placeholders — none of this is true, none of it may ship

Everything below was invented to make the mockup feel real.

- **Prices.** The whole model — `900 + m² × 7,4`, site-type multipliers, levels at 0,55× / 1× / 1,55× —
  is made up. It is quoted in the hero as a real number. **Replace it with the real pricing logic
  before this page is visible to anyone outside the company.** Highest-priority placeholder on the site.
- **Figures:** 340 erhvervsadresser · 96% genforhandling · 11% udskiftning · 3,7 gennemsnitlig
  INSTA 800-score · 24 timers svartid · 82% svanemærket forbrug · grundlagt 2011.
- **Case:** Mette Lindhardt, Facility Manager, Nordhavn Kontorhus, 11.400 m² — fictional, quote included.
- **Certifications:** INSTA 800, ISO 9001, ISO 14001, Svanemærket, 3F. Keep only the ones actually held.
  This is a legal question, not a design one.
- **Contact details:** 70 00 00 00 · kontakt@cleaningworks.dk · Industrivej 14, 2600 Glostrup ·
  CVR 12 34 56 78.
- **The photo.** `foto-band.jpg` shows a **living room** — sofa, scatter cushions, a rug. The entire
  site sells B2B: offices, production, clinics. It is tagged on the page with a yellow
  *"Stockfoto — erstattes"* label and must not go live. What is needed instead: a wide shot of a real
  team on a real commercial site in early morning light, a portrait of an operations manager for the
  case section, and an equipment detail. Half a day with a photographer covers it. Own photos of own
  teams are the single most valuable investment in this project.
- **Forms** do not submit anywhere.

Keep the "Stockfoto — erstattes" tag on any placeholder image you add. When real content arrives,
remove the tag in the same commit that replaces the content.

---

## 10. Definition of done, per page

A page is finished when all of these hold:

- [ ] Renders with no console errors
- [ ] DA/EN switches every visible string, and the calculator's numbers reformat
- [ ] Every `data-i18n` key exists in `T`; no unused `T` keys
- [ ] Burger menu opens and closes below 980px, closes on link click and on resize above it
- [ ] No horizontal overflow at 390px
- [ ] Focus visible on every interactive element; tab order sensible
- [ ] Where the calculator appears, the regression check in §6 still passes
- [ ] Nav and footer match the other pages exactly

---

## 11. Task list

Historical record of the original plan. Status as of 2026-08-24:

1. ✅ Port `mockup.html` to `index.html` + `css/style.css` + `js/site.js` + `js/calculator.js`.
2. ✅ Build the header and footer once, then duplicate to the other pages.
3. ✅ `ydelser.html`, `niveauer.html`, `om-os.html`, `kontakt.html`.
4. ✅ `job.html` · ⛔ `cases.html` **not built** — needs one real, approved case study first.
   (Also added `tak.html`, the Formspree `_next` target, which this list didn't anticipate.)
5. ⬜ Replace the price model with the real one. **Highest-priority blocker.**
6. ⬜ Replace the photo (still the living room).
7. ⬜ Forms: currently POST to Linen Works' shared Formspree form `mvzelvvd`, distinguished
   only by a hidden `_subject`. Cleaning Works needs its own form.
8. ⬜ Cookie banner and sitemap. *(SEO metadata, Open Graph and the favicon are DONE —
   every page has a description, OG tags and an inline-SVG favicon.)*
9. ⬜ WCAG 2.1 AA pass. Groundwork is in place — real `<button>`/`<input>` elements,
   `aria-pressed` on toggles, `aria-expanded` on the burger, every field label tied by
   `for`/`id`, visible `:focus-visible` outlines, and no horizontal overflow at any width
   from 320 to 1440. A formal audit has still not been run.

**From here on, track this work as Open work #15 in the repo-root `../CLAUDE.md`**, not
in this file — that is where the full placeholder inventory lives.

---

## 12. Don't

- Don't introduce a framework, bundler or CSS library.
- Don't change the palette, type pairing or spacing scale without asking. The design is approved.
- Don't add a dark theme or dark section blocks — the dark direction was explicitly rejected.
- Don't invent facts, figures, testimonials or client names to fill a page. If content is missing,
  leave a clearly marked placeholder and say so.
- Don't publish or deploy anything while §9 still applies.
