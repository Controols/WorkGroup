# Works Group — Websites

Monorepo for the three Works Group websites. Plain HTML/CSS — no framework, no
build step. See `CLAUDE.md` for full project context, design system, and the
service split between the brands.

## Structure

```
Works-Group/
├── CLAUDE.md            # Project context for Claude Code — read this first
├── README.md           # This file
├── linen-works/        # Linen Works — linen rental + laundry + textile management
│   ├── index.html
│   ├── uniforms-laundry.html
│   ├── about.html
│   ├── contact.html
│   ├── thanks.html          # post-submit landing page (Formspree _next), noindex
│   ├── logo-mark.svg         # brand mark, header (≥481px)
│   ├── logo-mark-solid.svg   # solid mark, header (≤480px — 40px minimum rule)
│   ├── logo-mark-reversed.svg # brand mark, footer (charcoal band)
│   ├── favicon-32.png        # tab icon (solid mark on cream)
│   ├── apple-touch-icon.png  # 180px iOS icon
│   ├── hero.jpg
│   ├── Apron_stack.jpg       # Uniform Supply column image
│   └── Linen_closeup2.jpg    # Linen Management column image
├── cleaning-works/     # Cleaning Works — general commercial cleaning (Danish, DA/EN)
│   ├── index.html · ydelser.html · niveauer.html · om-os.html
│   ├── job.html · kontakt.html · tak.html
│   ├── css/style.css         # one stylesheet, all pages
│   ├── js/site.js            # language toggle + mobile menu
│   ├── js/i18n.js            # English strings, keyed by page
│   ├── js/calculator.js      # price calculator (index + niveauer only)
│   ├── foto-band.jpg         # the ONLY image any page uses — a placeholder, see CLAUDE.md
│   ├── 1·2·3.jpg/.webp · Cleaningtable.jpg · Wipingglass.jpg   # unused stock, kept on purpose
│   └── _concepts/            # one rejected design direction, kept for reference
├── works-group/        # Works Group — parent landing page
│   └── index.html
├── CleaningWorks New Design/  # the approved Værkstedet mockup + brief + rejected directions
├── tests/              # Playwright checks — `npm run sweep` (dev-only, never shipped)
├── tools/              # static-server.js (local preview) · precopy.js (deploy gate)
└── linen-portal/       # Linen Works login portal — inventory + ordering (app, not a static site)
    ├── index.html      # login + customer sign-up
    ├── customer.html   # browse catalog, place orders, order history
    ├── employee.html   # orders queue + fulfillment, inventory mgmt, approve customers
    ├── app.js · styles.css · config.example.js
    ├── supabase-schema.sql   # database + security policies + seed (run once)
    └── README.md       # portal-specific setup & deploy guide
```

The three `*-works` / `works-group` subfolders are complete, standalone **static
sites** — nothing is shared *between* them, so they are independent at the file level
even though they live in one repo.

Note they no longer share an internal architecture either. **Linen Works** and **Works
Group** are single-file pages with inline `<style>`. **Cleaning Works** was rebuilt in
August 2026 and has a shared `css/` + `js/` layer, its own palette and typeface pairing,
and Danish-first copy with an EN toggle. Linen Works is also bilingual (Danish primary,
English toggle) but keeps its script inline, one copy per page. `CLAUDE.md` explains why
each divergence is deliberate — do not "harmonise" them.

`linen-portal/` is different: it is a **login-gated web app** (customer ordering +
staff fulfillment) backed by **Supabase** (hosted Postgres + auth). Still plain
HTML/JS with no build step, but it talks to a database. See its own README, and
note the **Supabase project is not set up yet** (see Open work below).

## Why one repo (for now)

All three sites are being built and changed together, so a single repo is the
least friction: one clone, one set of branches, one `git push`. Each site still
deploys independently — see below. When a site stabilises and you want it fully
separate, its folder can be lifted into its own repo with no untangling, because
there is no shared code.

## Running locally

No build step. Opening an HTML file straight from disk mostly works, but serve the
folder if you want to test properly — some tooling refuses `file://` URLs.

**Use VS Code + Live Server** (both installed on the build machine): open the repo,
right-click any HTML file → *Open with Live Server*. Auto-reloads on save.

Or run `npm run serve` for a dependency-free static server on `http://localhost:4173/`.

⚠️ Do **not** reach for `python -m http.server` — there is no real Python here
(`python` is the Microsoft Store stub). Node **is** installed as of 2026-08-24.

## Checks before you deploy

    npm install && npx playwright install chromium   # first time on a machine
    npm run sweep       # 64 checks: overflow at 14 widths, console errors,
                        # the logo 40px rule, the price-calculator regression
    npm run precopy     # pre-flight gate for the manual folder copy

Dev-only — none of it ships, and the sites still have no build step. **New machine?
Read "Machine setup" in `CLAUDE.md` first**: several things the workflow depends on
(the logo vector pack, the photo originals, the client copy) are deliberately not in
this repo and have to be re-supplied.

## Deploying — one repo, three sites

### Current status (2026-08-24)

| Site           | Publish / base directory | Domain               | Status |
|----------------|--------------------------|----------------------|--------|
| Linen Works    | `linen-works`            | linenworks.dk        | 🟢 **LIVE** on Simply.com, TLS OK — but `main` is ahead of live |
| Cleaning Works | `cleaning-works`         | cleaningworks.dk     | Not published — **must not ship as is**, see Open work #15 |
| Works Group    | `works-group`            | worksgroup.dk        | Not published — no launch pass done |
| Linen Portal   | `linen-portal`           | portal.linenworks.dk | Not published — Supabase not set up |

**Linen Works is hosted on [Simply.com](https://simply.com)** (Danish host), not on any
of the git-connected static hosts described below.

> ### ⚠️ Pushing does not deploy anything
> Deployment is a **manual copy of the whole `linen-works/` folder** onto the host
> (confirmed 2026-08-24). There is no git integration and no pipeline. Consequences:
>
> - The live site reflects **whatever was in the working tree when it was copied**, not
>   any branch. This has already caused real drift — the logo reached the live site from
>   a feature-branch checkout while `main` still lacked it.
> - **`git checkout main` before copying.**
> - A copy publishes the **entire folder**, so keep scratch files and backups out of it.
> - `main` is currently **ahead of live** by the Danish-first flip and two `about.html`
>   mobile fixes. ⚠️ The next copy switches `linenworks.dk` to Danish, using copy no
>   native speaker has read — read Open work #19 in `CLAUDE.md` first.
>
> Moving to a git-connected host would remove this whole class of problem.

TLS was resolved on 2026-08-03 — `linenworks.dk` has a valid Let's Encrypt cert covering
apex and `www`, and `http://` 301s to `https://`.

The portal deploys as a subfolder too (no build command), but additionally needs its
`config.js` present in the deployed files and a configured Supabase project. See
`linen-portal/README.md`.

### If you move to a git-connected host

Everything below still applies — the sites are plain HTML and any static host can
publish a subfolder of this repo. Connecting `main` to a host would remove the drift
risk above and give automatic deploys on push.

### Netlify (example)
Create a new site for each of the three. In each site's settings:
- **Build command:** *(leave empty)*
- **Publish directory:** the subfolder (e.g. `linen-works`)
- Connect the custom domain in Domain settings.

A committed `netlify.toml` per subfolder can pin this so it's not click-configured
each time — ask Claude Code to add one when you pick a host.

### Cloudflare Pages / Vercel
Same idea: set the project's **root/output directory** to the subfolder and leave
the build command empty (framework preset = "None" / "Other").

### GitHub Pages
GH Pages serves one site per repo from a folder, so it fits a single site cleanly
but is the least convenient for three-from-one. If you go GH Pages, the
three-separate-repos approach is the better match.

## Splitting into three repos later

When you want a site fully independent, the simplest route (valid here because
there's no shared code):

```bash
# from a fresh location
git init linen-works-repo
cp -r Works-Group/linen-works/* linen-works-repo/
# commit and push to the new remote
```

Or use `git subtree split --prefix=linen-works` if you want to carry that folder's
git history across. For static sites a clean copy is usually enough.

## Conventions
- Keep it plain HTML/CSS/JS — no framework, no bundler, no build step.
- Brand split: Linen = linen rental + commercial laundry + textile management ·
  Cleaning = general cleaning · Staffing = group-level (Works Group page only).
  Full detail in `CLAUDE.md`.
- Mobile breakpoint: `max-width: 880px` on Linen Works and Works Group.
  **Cleaning Works uses its own scale** — 980 / 700 / 600 / 480px.
- Shared contact details on every page of every site: `info@worksgroup.dk` and
  `+45 31 40 86 21`. Forms POST to Formspree, never `mailto:`.
- Danish is the primary language on Linen Works and Cleaning Works; English is a
  toggle. Edit Danish in the HTML, English in the `T` object.
- **Read `CLAUDE.md` before changing anything** — several apparent inconsistencies
  between the sites are deliberate and documented there.
