# CleaningWorks — website design, project handover

**Last updated:** 24 August 2026
**Status:** ✅ **Direction D ("Værkstedet") chosen.** The other directions stay in the folder as reference. Next work happens on `retning-d-vaerkstedet.html`.
**Folder:** `C:\Users\TMJ\CleaningWorks Design`

---

## 1. Brief and decisions already made

| Decision | Choice | Notes |
|---|---|---|
| Audience | **Commercial / B2B** | Offices, production, retail, clinics. Not private homes. |
| Deliverable | **Clickable HTML mockups** | Real pages, open in any browser, no build step. |
| Visual direction | **Bold and modern** | Deliberately unlike the typical blue-and-white cleaning site. |
| Language | **Danish primary, English toggle** | DA/EN switch top right; works on every page. |
| **Dark direction** | **Ruled out (24 Aug)** | Client: "I like all designs but not the black one." No page in the set now uses a dark canvas. |
| **Price calculator** | **On every direction (24 Aug)** | The three-level version from D. Same maths everywhere, rebuilt in each direction's own visual language. |
| **Chosen direction** | **D — "Værkstedet" (24 Aug)** | Client: "we are going with D, it's perfect." All further work goes into that page. |

---

## 2. Files in the folder

| File | What it is |
|---|---|
| `index.html` | **Start here.** Overview page comparing all directions, with swatches and "best if…" rationale. |
| `retning-d-vaerkstedet.html` | **Direction D — the B+C hybrid the client asked for.** |
| `retning-b-blueprint.html` | Direction B — light, editorial, systematic. |
| `retning-c-signal.html` | Direction C — colour blocks, product-like, interactive price calculator. |
| `retning-e-dagslys.html` | Direction E — calm, editorial, photography-led. New. |
| `retning-f-katalog.html` | Direction F — Swiss/technical specification sheet. New. |
| `retning-g-holdet.html` | Direction G — warm, people-first. New. |
| `retning-a-nightshift.html` | Direction A — dark/industrial. **Ruled out**, kept for reference. |
| `PROJEKT-STATUS.md` | This document. |

All HTML files are self-contained: CSS and JS are inline, no build tools, no dependencies. Fonts load from Google Fonts, with system fallbacks if offline.

---

## 3. The directions

### D — "Værkstedet" *(the hybrid — new)*
C's warmth on the surfaces, B's discipline in the structure. Deep green, sun yellow, coral and a new warm-oat neutral for panels; Manrope for UI, Instrument Serif italic used sparingly inside headings, JetBrains Mono for the 01–06 chapter numbers. No dark blocks anywhere — where C had a near-black CTA panel, D uses deep green.

- **Palette:** `#0b4d3f` green · `#ffc94d` sun · `#ff5c39` coral · `#fdf8f0` cream · `#f3e8d2` oat
- **The point of it:** the price calculator and the service-level table are one mechanism. The hero calculator (site type × m² × frequency) prices **Basis, Standard and Total simultaneously**, recommends a level from the chosen frequency, and the full comparison table further down shows those live prices and highlights the selected column. Below 700px the table becomes three tap-to-select cards.
- **Best if:** you want C's selling power without losing B's credibility.
- **Risk:** the most feature-heavy page in the set; the price model has to be real before it goes live.

### E — "Dagslys" *(new)*
Quiet, spacious, magazine-like — closer to an architecture studio than a cleaning company. Warm paper, muted sage, terracotta accent, Fraunces + Inter, hairline rules and almost no rounded corners. Photography is the backbone, so it depends on real photos more than any other direction.

- **Palette:** `#faf8f4` paper · `#6b7f6a` sage · `#2b332b` ink · `#c2643f` terracotta
- **The point of it:** *"En dag i huset"* — a seven-stop interactive timeline from 05:30 to 17:45 showing what happens in the building each hour and who is on site. Keyboard-navigable.
- **Best if:** you want to signal care and calm rather than price.
- **Risk:** it needs a photographer to work at all. The calculator is deliberately understated here — if you want price to shout, D or G do that better.

### F — "Katalog" *(new)*
Swiss and technical: white paper, hairlines, mono labels, § section codes, a visible 12-column grid, tabular figures and exactly one accent (signal blue). The densest page in the set, deliberately.

- **Palette:** `#ffffff` white · `#f2f2f0` band · `#1a1a19` ink · `#1a4fd6` signal blue
- **The point of it:** *"Rengøringsplan pr. rum"* — a room-by-room specification browser. Eight room types, each with a full 11–12 row table of tasks, frequency and INSTA 800 level, and a Basis/Standard/Total toggle that greys out the tasks not included at the chosen level.
- **Best if:** you compete in tenders and win on precision.
- **Risk:** the room specs must match what your teams actually do, task for task. It is a promise in table form.

### G — "Holdet" *(new)*
The warmest direction, and the only one where the people are the product. Sky blue, butter yellow and blush on warm off-white, big rounded panels, Outfit + Nunito, highlighter marks behind key words.

- **Palette:** `#2f6fed` sky · `#ffd166` butter · `#ffb4a2` blush · `#fffcf7` off-white · `#16244a` navy ink
- **The point of it:** a drag-able before/after slider (mouse, touch **and** keyboard), plus six named team members with tenure badges and one line each in their own voice — carrying the 11% turnover argument with faces rather than a statistic alone. The price calculator feeds the visitor's choice straight into the contact form.
- **Best if:** your staff retention is the strongest card you hold, and you want to recruit from the site too.
- **Risk:** it needs real portraits and real names; invented ones would undermine the whole idea.

### B — "Blueprint" *(existing)*
Paper background, ink blue and safety orange, Instrument Serif highlights, numbered chapters 01–05, and the Basis/Standard/Total comparison table as the centrepiece.

- **Palette:** `#f6f4ef` paper · `#0d1b2a` ink · `#1b3a68` blue · `#ff5a1f` orange
- **Best if:** you win on documentation and transparency.
- **Risk:** the most text-heavy of the original three; needs real numbers.

### C — "Signal" *(existing)*
Deep green, sun yellow and coral colour blocks, rounded shapes, product-like. Working price calculator and a mockup of the monthly quality report.

- **Palette:** `#0b4d3f` green · `#ffc94d` sun · `#ff5c39` coral · `#fdf8f0` cream
- **Best if:** you want the most leads from the site itself.
- **Risk:** publishing indicative prices means committing to them.

### A — "Night Shift" *(ruled out)*
Near-black canvas, neon lime accent. Kept in the folder for reference only; not part of the decision any more.

---

## 3a. The price calculator (shared mechanism, six different skins)

One model, one behaviour, five implementations — the client picked D's three-level version and asked for it everywhere.

**The maths, identical on every page:**

```
raw    = (900 + m² × 7.4) × typeFactor × freqFactor
basis  = round100(raw × 0.55)
standard = round100(raw)
total  = round100(raw × 1.55)

typeFactor: kontor 1 · produktion 1.15 · klinik 1.3
freqFactor by days/week (1–7): 0.45 · 0.585 · 0.72 · 0.86 · 1 · 1.14 · 1.28
```

Sanity check: kontor, 1.200 m², 5 dage/uge → Basis 5.400 kr. · Standard 9.800 kr. · Total 15.200 kr.

**The behaviour:** three inputs (site type, area 200–6.000 m², frequency 1–7 days/week); all three price levels shown at once; the level matching the chosen frequency is marked *Anbefalet* (1–2 days → Basis, 3–5 → Standard, 6–7 → Total) until the visitor clicks a level, which pins it; a live summary line; Danish/English number formatting.

**How each page skins and wires it:**

| Page | Where | Wired to |
|---|---|---|
| **B** Blueprint | Chapter 02, above the comparison table. Hairline block, mono labels, serif prices, orange *Anbefalet* tag. | The Basis/Standard/Total table — live price row, column highlight follows the selection, live footnote. |
| **D** Værkstedet | Hero. Oat panel, coral CTA, mono chapter labels. | Same table, plus mobile fallback cards. |
| **E** Dagslys | The "Et ærligt bud" section. No box, no fill — hairlines only, prices in Fraunces, *anbefalet* set as an italic serif note. | Replaced the static price example in the FAQ so nothing contradicts it. |
| **F** Katalog | `§03 Prisberegning`. Spec form on the 12-column grid, output as a real data table, formula printed underneath. | Shares one level state with the §02 room-specification module — set it in either place and both update. |
| **G** Holdet | The "Beregn prisen" section. Soft-cornered panel, rounded cards, butter *Anbefalet* pill. | Feeds a live "I kigger på: …" line into the closing contact form. |
| **C** Signal | Hero. **Unchanged** — keeps its original single-price calculator. | — (left as-is so you can compare the two approaches.) |

---

## 4. Shared content across all directions

Deliberately identical everywhere, so you compare *design* and not *messaging*:

- Fixed teams, same people every day, named operations manager
- Quality measured monthly to **INSTA 800**, report shared with the client
- **30 days' notice, no lock-in period**
- Decent employment terms (permanent contracts, 3F collective agreement, 11% turnover vs ~40% industry)
- Environment: Nordic Swan licence, ISO 14001, ISO 9001
- Process: walkthrough → plan & price → onboarding → monthly control
- FAQ covering price, notice, supplier switch, building access, complaints

---

## 5. ⚠️ Placeholders that MUST be replaced before go-live

Everything below is invented to make the mockups feel real. None of it is verified.

- **Numbers:** 340 commercial sites · 96% contract renewal · 11% staff turnover · 3.7 average INSTA 800 score · 24h quote response · 82% Nordic Swan consumption · founded 2011
- **Case study:** "Nordhavn Kontorhus", Mette Lindhardt, 11,400 m², — entirely fictional, including the quote
- **Client logos** (directions C and F): NORDHAVN, Bagger & Kraft, VOLT, Klinik Sundby, Møllers Lager — fictional
- **Team members** (direction G): Peter Holm, Aisha Bello, Camilla Krogh, Søren Kjær, Linda Poulsen, Mikael Dahl — invented, including their quotes and tenure
- **Room specifications** (direction F): plausible but invented. These must be checked against your real cleaning plans — the page presents them as what you actually deliver.
- **Prices:** the calculators on B, C, D, E, F and G use a made-up model (`900 + m² × 7.4`, adjusted for site type and frequency; Basis/Standard/Total at 0.55× / 1× / 1.55×). **This is now the most visible placeholder on the site** — five pages quote it as a real price, and F prints the formula openly. Replace it with your real pricing logic before anyone outside the company sees these.
- **Certifications:** INSTA 800, ISO 9001, ISO 14001, Nordic Swan, 3F — only keep the ones you actually hold. This is a legal issue, not a design one.
- **Contact details:** 70 00 00 00 · kontakt@cleaningworks.dk · Industrivej 14, 2600 Glostrup · CVR 12 34 56 78
- **The stock photo (direction D, Fig. 01):** `cleaingstock.jpg` is now placed in D's wide band as `foto-band.jpg`, marked on the page with a yellow *"Stockfoto — erstattes"* tag. ⚠️ **It shows a living room, not a commercial site** — a sofa, scatter cushions and a rug. Every word on the page sells B2B: offices, production, clinics. A facility manager will read the picture before the headline. It works as a placeholder to see the layout with a real image in it; it should not go live. The rest of D's photo slots (the client portrait in the case section) are still empty placeholders.
- **Photos:** all remaining marked placeholder boxes show where photos go. Own photos of your own teams beat stock photography by a wide margin on a cleaning site — this is usually the single most valuable investment in the project.

---

## 6. Technical notes

- **Language toggle:** each page has a `T = {…}` object at the bottom of the file holding the English strings. Danish sits in the HTML itself and is captured on load; keys match `data-i18n` attributes. To edit Danish, edit the HTML. To edit English, edit the `T` object. All keys verified 1:1 on D, E, F and G.
- **Mobile menu:** B, D, E, F and G have a working burger menu below 980px. **Only C still doesn't** — its nav links are simply hidden. This gets fixed on whichever direction is chosen.
- **Verified (24 Aug):** every page renders in Chromium with no JS errors; the DA/EN toggle changes the page in both directions and reformats the calculator's numbers; the calculator returns 5.400 / 9.800 / 15.200 kr. at defaults and updates live from the sliders; the burger menu opens; and there is no horizontal overflow at 390px width.
- **Not yet built:** subpages, real form submission, cookie banner, SEO metadata, Open Graph images.
- **Accessibility:** not formally audited. Body-text contrast was checked while building D–G; a proper WCAG 2.1 AA pass is still outstanding on the chosen direction.

---

## 7. Next steps — pick up here

**D is chosen. Work order from here:**

1. **Photography.** The single biggest gap. D needs: a wide hero/band shot of a real team on a real commercial site early morning (replaces the stock living-room photo), a portrait of an operations manager for the case section, and ideally an equipment detail. Half a day with a photographer on two or three sites covers it.
2. **Replace the price model** with the real one before anyone outside the company sees the page — it is quoted as a real number in the hero.
3. **Subpages:** services, about, careers, cases, contact.
4. **Then:** copy manual, real form handling, cookie banner, SEO metadata and Open Graph images, and a WCAG 2.1 AA pass.

**Older list, still valid:**

1. ~~Choose a direction~~ — done, D.
2. **Collect the real numbers** — client count, renewal rate, turnover, actual certifications, one real case study with a named client who agrees to be quoted.
3. **Book a photographer** — a half day on two or three real sites, early morning. Shot list: team at work, portrait of an operations manager, equipment detail, empty clean office in backlight. Directions E and G need this most.
4. **Then:** subpages (services, about, careers, cases, contact), mobile menu on B/C if one of them wins, copy manual, and a final accessibility pass.

### Prompt to restart this work another day

> We're continuing the CleaningWorks website design. Read `PROJEKT-STATUS.md` in the CleaningWorks Design folder for context, then [choose direction X / build subpages / combine element Y from Z / replace placeholders with the real numbers below].
