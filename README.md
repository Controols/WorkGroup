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
│   ├── hero.jpg
│   ├── Apron_stack.jpg       # Uniform Supply column image
│   └── Linen_closeup2.jpg    # Linen Management column image
├── cleaning-works/     # Cleaning Works — general commercial cleaning
│   ├── index.html
│   ├── services.html
│   ├── about.html
│   ├── contact.html
│   ├── Cleaningtable.jpg     # homepage hero
│   └── Wipingglass.jpg       # services page image band
├── works-group/        # Works Group — parent landing page
│   └── index.html
└── linen-portal/       # Linen Works login portal — inventory + ordering (app, not a static site)
    ├── index.html      # login + customer sign-up
    ├── customer.html   # browse catalog, place orders, order history
    ├── employee.html   # orders queue + fulfillment, inventory mgmt, approve customers
    ├── app.js · styles.css · config.example.js
    ├── supabase-schema.sql   # database + security policies + seed (run once)
    └── README.md       # portal-specific setup & deploy guide
```

The three `*-works` / `works-group` subfolders are complete, standalone **static
sites** — nothing is shared between them (each page has its own inline CSS), so
they are independent at the file level even though they live in one repo.

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

No build step. Either open an HTML file directly in a browser, or serve a folder:

```bash
# serve one site at http://localhost:8000
cd linen-works
python -m http.server 8000
```

Open `http://localhost:8000` (defaults to `index.html`).

## Deploying — one repo, three sites

Static hosts (Netlify, Cloudflare Pages, Vercel, GitHub Pages) can publish a
**subfolder** of a repo. Create three separate deployments from this one repo, each
pointing at a different subfolder, with **no build command** (the sites are already
plain HTML):

| Site           | Publish / base directory | Domain (planned)     |
|----------------|--------------------------|----------------------|
| Linen Works    | `linen-works`            | linenworks.dk        |
| Cleaning Works | `cleaning-works`         | cleaningworks.dk     |
| Works Group    | `works-group`            | worksgroup.dk        |
| Linen Portal   | `linen-portal`           | portal.linenworks.dk |

The portal deploys the same way (subfolder, no build command), but additionally
needs its `config.js` present in the deployed files and a configured Supabase
project. See `linen-portal/README.md`.

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
- Keep it plain HTML/CSS — no framework, no build step.
- Brand split: Linen = linen rental + commercial laundry + textile management ·
  Cleaning = general cleaning · Staffing = group-level (Works Group page only).
  Full detail in `CLAUDE.md`.
- Mobile breakpoint: `max-width: 880px` across all sites.
