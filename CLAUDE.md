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

## Machine setup — read this first on a new computer

The sites need nothing installed: plain HTML, no build step, they open from disk. This
section is for the **tooling** the workflow relies on, and — more importantly — for the
material that **is not in the repo** and does not arrive with a clone.

### 0. Run `npm run doctor` — do not trust this file for machine state

    npm run doctor                    # what is installed HERE, right now
    npm run doctor -- --assets <dir>  # extra place to look for the asset folders

**This section deliberately does not list what each machine has.** A table of tools and
versions is stale the moment anyone runs `winget install`, and nothing announces it —
the same failure that produced the wrong 745 KB figure, the Assets section describing
Concept D art three weeks after it was replaced, and the uniforms brand description.
`doctor` measures instead: tools and versions, the harness, git identity scope, the
Python alias trap, and which untracked asset folders are actually reachable — plus what
each missing thing blocks. Exit 0 means the harness runs here.

**Two Windows machines exist as of 2026-08-24** (`TMJ` and `Controols`). What matters is
not their tool lists but one durable fact:

⚠️ **The untracked asset folders are on `TMJ` only, and every Desktop path in this file
is `TMJ`'s.** `C:\Users\TMJ\` does not exist on the other machine. Nothing warns you —
the sites build and all 64 checks pass without them. See §2 for what that blocks.

⚠️ **Git cannot sync those folders, ever.** `Logo/` is 14 MB of print PDFs and is
gitignored on purpose, as are the Desktop folders. Pulling will never bring them; they
need a real channel (shared drive, or the owner copying them). `doctor` reports their
absence — it cannot fix it.

Git identity is **repo-local**, and repo-local config lives in `.git/config`, which a
clone does **not** carry. Neither machine has a global identity, so every fresh clone
starts with none. `doctor` checks this; it is check 5.

### 1. Install (Windows — verified on machine 1 and machine 2, 2026-08-24)

    winget install --id OpenJS.NodeJS.LTS        # 24.19.0 — required for the checks
    winget install --id ImageMagick.ImageMagick  # 7.1.2  — all image work
    winget install --id Microsoft.VisualStudioCode
    winget install --id Git.Git
    winget install --id GitHub.cli               # gh — used for PRs/issues
    winget install --id Gyan.FFmpeg              # 9.0 — optional, audio/video only

⚠️ **ffmpeg is optional and no repo tooling uses it** — it was installed for audio work
(trimming the local Claude Code notification sounds). It is listed because of a trap:
**Playwright ships its own ffmpeg** under `ms-playwright/ffmpeg-*`, and that build has
**no mp3 or wav demuxer** — webm/vp8 only. It cannot open an MP3 at all, and fails with
a misleading `Invalid data found when processing input` that reads like a corrupt file.
Finding an ffmpeg on disk is not the same as having a usable one. `doctor` resolves the
real binary on PATH.

Then, in the repo:

    npm install                    # Playwright — node_modules/ is NOT committed
    npx playwright install chromium
    npm run sweep                  # expect 64 passed

⚠️ **Restart the terminal (and VS Code) after installing Node** — the PATH change does
not reach processes that were already running. **Confirmed the hard way on machine 2:**
`node` and `npm` were still "not recognized" in the shell that ran the installer. If you
cannot restart (e.g. an agent session mid-task), refresh PATH per command instead:

    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" +
                [System.Environment]::GetEnvironmentVariable("Path","User")

⚠️ **The same staleness bites Claude Code's `!` prefix, which runs in Git Bash — a shell
started before the install.** After installing `gh`, `! gh auth login` failed with
`gh: command not found` while the binary existed and worked. Call it by full path until
the session restarts:

    ! "/c/Program Files/GitHub CLI/gh.exe" auth login

Add the **Live Server** VS Code extension (`ritwickdey.LiveServer`) for previewing; the
Chrome extension refuses `file://` URLs. Not present on machine 2 — `npm run serve` does
the same job now and needs no extension.

⚠️ **Neither machine has real Python**, but `python.exe`, `py.exe` **and `python3.exe`**
all resolve on PATH under `WindowsApps` as **App Execution Aliases**. That is worse than
being absent: a presence check passes, and the command then launches the Microsoft Store
instead of running anything. Do not write tooling that assumes Python — Node is the
scripting language here.

Detecting them is genuinely fiddly, and **how depends on which tool is asking**:

| Probe | Result on an alias |
|---|---|
| `Get-Command python` | ✅ found — useless, this is the trap |
| PowerShell `Get-Item .Length` | `0` |
| Node `fs.statSync` | **throws `EACCES`** |
| Node `fs.lstatSync` | a ~108-byte symlink (reparse point) |

A real interpreter stats cleanly, so "`stat` throws `EACCES`" is the reliable signature.
`npm run doctor` implements exactly this; don't re-derive it. ⚠️ The 0-byte figure was
recorded here first and is **PowerShell's view only** — code that checks `size === 0` in
Node never fires, because the call throws before returning a size.

`rsync` and `pwsh` (PowerShell 7) are absent on both machines; the shell is Windows
PowerShell 5.1, plus Git Bash.

### 1b. Notification sounds (optional, per-machine)

`Sounds/` at the repo root holds the MP3 masters — `message.mp3` (a question or
permission prompt is waiting, **4.0s**) and `jobsdone.mp3` (turn finished, 2.1s). They are
**tracked on purpose**, so a clone carries them; they sit outside every site folder, so a
manual folder copy never publishes them.

`message.mp3` is a **trimmed cut** of the owner-supplied original: 4s with a 0.4s
`afade` out, made with `ffmpeg -t 4 -af "afade=t=out:st=3.6:d=0.4" -c:a libmp3lame -b:a 128k`.
The untouched 5.5s original is kept beside it as `message-full.mp3` — re-cut from that,
never from the already-trimmed file.

The player is `tools/play-sound.ps1` (tracked; takes `-Path`, optionally `-MaxSeconds`
and `-FadeMs`). The **wiring** is not in the repo — it is personal config in
`~/.claude/settings.json`, and it carries absolute paths under the current user's home,
so it cannot be shared between machines.

**Setting it up on a new machine is one command:**

    npm run sounds:install                       # copy files, print the hook JSON
    npm run sounds:install -- --write            # also merge the hooks
    npm run sounds:install -- --write --force    # replace existing hooks

It copies `Sounds/*.mp3` → `~/.claude/sounds/` and `tools/play-sound.ps1` → `~/.claude/`,
then builds the hook JSON with paths resolved for whatever machine it is on. Default is
**print, not write** — `~/.claude/settings.json` is the user's own file and may hold hooks
this script knows nothing about. `--write` refuses if a `Notification` or `Stop` hook
already exists (that is what `--force` is for), backs the file up to `settings.json.bak`
before touching it, and preserves every other key.

Three things that cost time the first time:
- **`SoundPlayer` is WAV-only** and plays nothing for an MP3 — silently. The script uses
  WPF `MediaPlayer`, which handles both.
- **Hook commands are parsed by Git Bash and then PowerShell**, so an inline one-liner
  needs two layers of escaping and breaks on any path change. Call a script with an
  argument instead.
- **`"shell": "powershell"` in the hook schema means `pwsh`**, which is not installed on
  either machine. Invoke `powershell.exe` explicitly from the default bash shell.

### 2. What a clone does NOT give you

These are deliberately untracked and must be re-supplied by the owner. **Nothing warns
you they are missing** — the sites build and test fine without them, and you only find
out when you try to touch an asset.

**All of these live on machine 1 only** — confirmed absent from machine 2 on 2026-08-24.
The "where it was" paths are machine 1's; substitute your own user folder.

| Missing | Where it was (machine 1) | Needed for |
|---|---|---|
| `Logo/` — 14 MB Linen Works vector print pack | repo root, gitignored | Regenerating any logo asset. Its READ-ME carries the **40px rule**; read it before touching the logo. The four files actually served **are** committed in `linen-works/`. |
| `Stock photos Linen Works/` | `C:\Users\TMJ\Desktop\` | The full-resolution photo originals, incl. `Cleaningtable.jpg` (the Cleaning Works band photo) and `pics2.zip`. Re-export from here rather than re-compressing in-repo copies. |
| `LinenWorks Text/` | `C:\Users\TMJ\Desktop\` | The client's supplied English copy (About/ESG/Website). |
| Concept D originals (`1/2/3.jpg`) | **nowhere** | Not on any machine. In-repo copies are the only ones; owner must re-supply for higher res. |

⚠️ **What this blocks on machine 2:** any logo regeneration (the 40px rule lives in the
pack's README, not here) and any photo re-export — including the `foto-band.jpg`
optimisation pass that Assets says to run when the stock photo is replaced. ImageMagick
is installed and ready; there is simply nothing high-res to feed it. **Do not work around
this by re-compressing the in-repo copies** — that only degrades them (see Assets).
Everything else — editing pages, `npm run sweep`, `npm run precopy`, `npm run serve` —
works fully on machine 2.

### 3. Accounts and access the repo cannot hold

Simply.com (hosting, DNS, TLS, the WAF, and the FTP target for the manual copy),
Formspree (form `mvzelvvd`), GitHub (`Controols/WorkGroup`), and eventually Supabase
(Open work #4). Credentials live in the owner's password manager, **not here**.

Git identity is **repo-local** (`Controols <controols24@gmail.com>`) and there is **no
global identity on either machine**, so set one per clone or commits get the wrong author.

⚠️ **`gh` authenticates separately from git.** Git pushes work because credentials are
cached in **Windows Credential Manager**, which `gh` does not share — so an installed
`gh` can still fail on its first command. `gh auth login` is interactive and **a human
must run it**; no agent or script can. `npm run doctor` reports login state, not just
whether the binary exists.

### 4. Before you deploy from a new machine

Run **`npm run precopy`** and read its output. Deployment is a manual folder copy
(Open work #10) — see "Automated checks" and #10 before copying anything.

## Shared design system

All three sites share one design language. The **palette is the only brand
differentiator** — typography, layout architecture, wordmark lockup, spacing,
section structure and the 880px mobile breakpoint are identical across all three.

### Fonts (shared)
- Headlines: **Cormorant Garamond** (premium serif)
- Body: **Jost** (light geometric sans)
- Google Fonts. Do not diverge fonts per brand.
- EXCEPTION (LIVE since 2026-08-03): **Cleaning Works is now the typographic outlier.**
  Its "Concept D" pages use **bold Jost headlines**, not Cormorant serif (the serif
  wordmark lockup is kept). This deliberately breaks the "typography identical, palette
  is the only differentiator" rule — on purpose, to stop Cleaning Works reading as
  recoloured Linen Works. Do NOT "restore" serif headlines on Cleaning Works. Linen
  Works and Works Group still follow the serif-headline rule.

### Wordmark (shared lockup, per-brand word)
First word in heavier serif + *Works* / *Group* in italic (mid-tone accent colour).
Uppercase Cormorant Garamond, horizontal, not stacked.
**LINEN** *Works* · **CLEANING** *Works* · **WORKS** *Group*
- EXCEPTION (LIVE since 2026-08-20): **Linen Works also has a drawn mark** — a folded
  linen stack, placed left of the wordmark in the header and footer. Cleaning Works and
  Works Group stay wordmark-only, so the lockup is no longer identical across the three
  sites. The wordmark itself is unchanged and stays **live text, not an image**, on all
  three — only the mark is an asset. See Assets for the files and the 40px rule.

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

### Cleaning Works (general cleaning — REBUILT 2026-08-24 as "Værkstedet")
⚠️ **Everything in this subsection below the next paragraph describes the OLD build
and is superseded.** It is kept because the old pages are still reachable in git
history and the sibling sites still follow those conventions.

**Current state:** `index.html` · `ydelser.html` · `niveauer.html` · `om-os.html` ·
`job.html` · `kontakt.html` · `tak.html`, plus shared `css/style.css`,
`js/site.js`, `js/i18n.js`, `js/calculator.js`. **Danish-first with a DA/EN toggle**,
its own green/coral/sun palette and its own type stack. It no longer shares the group
design system at all — see the 2026-08-24 changelog entry for what that means and why.
**In `main` as of 2026-08-24. Not deployable** — see Open work #15.

---

**SUPERSEDED — the old "Concept D" build (promoted 2026-08-03, replaced 2026-08-24):**
`index.html` · `services.html` · `about.html` · `contact.html` · `thanks.html`
- **The four pages ARE the "Concept D" redesign as of 2026-08-03** (promoted from
  `_concepts/` over the old house-style pages). It is a **conversion-forward, Danish-
  cleaning-firm** look (modelled on lau-ren.dk, combiservice.dk, jacobsens-rengøring.dk):
  dark utility bar, sticky header, full-bleed photo hero with a floating quote card,
  commitment strip, icon service grid, numbered 01–04 reasons, eco commitment band,
  3-step process. **Bold Jost headlines, not Cormorant serif** — the deliberate
  divergence (see Fonts note). Cool palette + shared wordmark/footer/breakpoint kept.
- Nav labels the inner page "Services" (file is `services.html`).
- Home cards: **Daily Cleaning · Deep & Periodic · Specialist.** (Note: services page and
  footers group as "Deep & Specialist" — a two-vs-three grouping, left intentionally.)
- Services page: two icon service blocks (Daily & Contract / Deep & Specialist); image
  band; 3-step "how it works" (assess site → agree scope → keep it clean).
- `thanks.html` is the Concept D–styled post-submit page (Formspree `_next` target,
  `noindex`, not in nav) — added in the promotion.
- Assets: `1` (hero, gloved hands wiping), `3` (services image band + homepage band,
  mopping), `2` (eco split, blue tools flat-lay). **Served as WebP q82 since 2026-08-03
  (~209 KB total, down from 323 KB).** The `.jpg` copies are kept beside them — the four
  `og:image` meta tags still point at the JPEGs on purpose, because social scrapers
  handle WebP inconsistently (and LinkedIn's scraper is already blocked here — Open work
  #13). Only the four `<img src>` tags use `.webp`. OLD `Cleaningtable.jpg` /
  `Wipingglass.jpg` are **unused** (the redesign dropped them) but left as stock.
- `_concepts/` now holds only `concept-c-systematic-grid.html` (rejected alt, image-free
  Swiss grid). The Concept D files were promoted out; git history has them.
- STILL TODO before real launch (Open work #12): dedicated Formspree form (contact
  still shares Linen's `mvzelvvd`), and consider a distinct hotel/restaurant hero photo
  (`1.jpg`/`3.jpg` read a bit residential; `3.jpg` is reused on two pages).

## Assets
- **Linen Works logo (2026-08-20).** Owner supplied a full vector print pack. The four
  files actually served live in `linen-works/`:
  - `logo-mark.svg` — primary mark, `on-cream` colourway. Header at ≥481px.
  - `logo-mark-solid.svg` — solid mark. Header at ≤480px (see the 40px rule below).
  - `logo-mark-reversed.svg` — footer, on the charcoal band.
  - `favicon-32.png` + `apple-touch-icon.png` — rendered from the pack's 600dpi PNGs.
  ⚠️ **40px minimum on screen.** The pack states the primary mark must not go below
  40px — the hairline fills in — and to use the `solid` version beneath that. That is
  exactly what the `<picture media="(max-width:480px)">` swap in the header is for.
  Don't "simplify" it into a single `<img>`; that silently breaks the brand rule.
  Colourways matter: `on-cream` fills the garment with `#F5F0E8` so it sits on the page
  instead of floating as a white shape, and `reversed` carries a `#2C2418` panel that
  matches `--charcoal` exactly, so it disappears into the footer. Both are opaque
  rectangles by design — they only work on their intended background.
  ⚠️ **The vector pack is NOT in the repo.** It lives in `Logo/` (14 MB of print PDFs,
  SVGs and 300/600dpi PNGs) and is deliberately left untracked — re-supply from the
  owner if assets ever need regenerating. `Logo/linenworks-logo.png` is the flat
  spec-sheet image and is a *presentation*, not a usable asset; use the pack's SVGs.
- Linen Works `hero.jpg` — row of grey aprons on pegs (Apron_hanging).
- **Cleaning Works uses exactly ONE image: `foto-band.jpg`** (corrected 2026-08-24).
  The Værkstedet rebuild displays it in the wide band on `index.html` and
  `ydelser.html`, and all seven pages point `og:image` at the same file by absolute
  URL. **REPLACED 2026-08-24:** it was a stock photo of a LIVING ROOM (sofa, scatter
  cushions, a rug) on a site that sells offices, production and clinics. It is now
  `Cleaningtable.jpg` — a woman in an apron wiping a café table — re-exported from the
  6000×4000 Desktop original as a 16:9 centre crop at 1800×1013, q82, EXIF stripped
  (141 KB, down from 149 KB at 1500×1000). Same filename, so the seven `og:image` tags
  needed no edit. The yellow *"Stockfoto — erstattes"* tag is **deliberately kept** —
  it is still stock, just no longer wrong. ⚠️ It also fixes a latent bug: the old file
  was 1500×1000 but the markup declared `width="1600" height="900"`, so the reserved
  aspect ratio was wrong. Attributes now match the file. See Open work #15.
- **Eight Cleaning Works images are now dead weight** (verified 2026-08-24 by grepping
  every `src` and `og:image` across all seven pages, plus `url()` in `css/style.css`):
  `1.jpg`/`1.webp`, `2.jpg`/`2.webp`, `3.jpg`/`3.webp` — the Concept D hero, image band
  and eco-split — plus the older `Cleaningtable.jpg` (cleaner wiping a restaurant table)
  and `Wipingglass.jpg` (hand polishing a glass). **Two design generations of leftovers.**
  All are kept in `cleaning-works/` deliberately, as available stock, because they are
  the only owner-supplied cleaning photography on this machine — the Concept D originals
  are NOT anywhere else (see the originals caveat below). NOTE: `Cleaningtable.jpg` is
  still arguably the most on-message shot for B2B hospitality of anything here;
  reconsider it when sourcing a real hero to replace the living room.
  ⚠️ Because they are unreferenced, a deploy that copies the whole folder would upload
  **937 KB** of images no page requests — measured by `npm run precopy -- cleaning-works`
  on 2026-08-24, which lists them. (The "~745 KB" figure previously recorded here was
  wrong; it under-counted.)
- Linen Works inner page (`uniforms-laundry.html`) carries two column images:
  `Apron_stack.jpg` (folded uniform/apron stack, warm tones) over Uniform Supply,
  and `Linen_closeup2.jpg` (beige woven linen texture) over Linen Management. Both
  via `.svc-img` (280px cover, 220px on mobile).
- **The Desktop stock folder is a LINEN WORKS folder — audited visually 2026-08-24.**
  Eight of the nine candidates are linen, laundry or hotel-textile shots; it was bought
  for the wrong brand to solve a cleaning-photo problem. Contents:
  - `Cleaningtable.jpg` — woman in apron wiping a café table. **The only genuine
    commercial-cleaning shot in the set.** Now the Cleaning Works band photo.
  - `Stock 4` — kitchen porter washing up at a commercial sink. Kitchen hygiene, not
    general cleaning. The only other non-linen frame.
  - `Stock 1` · `Stock 7` — industrial laundry floors. **Unused, and both are strong
    Linen Works assets** for the Commercial Laundry column, which currently leans on
    textiles at rest (`Apron_stack`, `Linen_closeup2`) rather than the plant. Prefer
    **Stock 7**: `Stock 1` has legible Cyrillic (**ЧИСТОЕ**) on the blue cart, which
    reads oddly on a Danish site.
  - `Stock 2` (hotel towel stack) · `Stock 3` · `Stock 5` · `Stock 6` — hotel/laundry.
    3, 5 and 6 are **portrait**, so they need a crop for any wide band.
  - ⚠️ `Stock 8.jpg` **is byte-identical to `Apron_hanging.jpg`** (same MD5) — i.e. it
    is already the Linen Works hero. Not a ninth option.
  - Also unused: `Linen_closeup.jpg` (olive, too dark for the palette) and
    `Apron_stack2.jpg` (dark/moody).
  ⚠️ **Licensing is unverified.** These were supplied as "Stock photos Linen Works". If
  that licence was per-project, using one on Cleaning Works may fall outside it — worth
  confirming before either site is public.
- IMAGE OPTIMISATION: all in-use photos are resized + compressed for web (q82, EXIF
  stripped). Long-edge caps: heroes ~1600px, band ~1800px, column `.svc-img` ~1100px.
  Linen Works stays JPEG — measured, WebP only saves it 11% (`Linen_closeup2` just 3%),
  not worth the churn. ⚠️ **The 2026-08-03 WebP work is now moot for Cleaning Works** —
  the Værkstedet rebuild dropped the three images that were converted, so the `.webp`
  files are unreferenced along with their `.jpg` originals. `foto-band.jpg` is a plain
  JPEG and has **not** been through the optimisation pass; do that when it is replaced
  with a real photo, not before.
  **ImageMagick 7.1.2 is installed** (`C:\Program Files\ImageMagick-7.1.2-Q16-HDRI`) —
  use `magick`, not the .NET encoder fallback used before.
  ⚠️ **Originals caveat:** the Linen originals are in the Desktop stock folder AND in
  `Stock photos Linen Works/pics2.zip` (7 files, 12 MB) — re-export from there for
  higher res and re-run the same caps. **But the Concept D originals (`1/2/3`) are NOT
  on this machine** — the in-repo copies are the only ones, so the owner must re-supply
  if higher res is ever needed. Don't re-compress already-optimised copies (it only
  degrades them). Source `hero.jpg` was already small, so it's left as the original.
- Original "Stock photos Linen Works" folder has 8 photos (Stock 1–8).

## Open work / next steps
1. ~~Cross-site links + emails are guesses~~ **RESOLVED 2026-07-28.** Domains
   `linenworks.dk`, `cleaningworks.dk`, `worksgroup.dk` are confirmed correct.
   Email is now a **single shared inbox, `info@worksgroup.dk`**, on all three sites
   (was per-brand `hello@<brand>.dk`). See Conventions.
   **Forms live 2026-07-28:** Formspree form **`mvzelvvd`**
   (`https://formspree.io/f/mvzelvvd`). Plain HTML POST — no JS, no SDK, no build
   step, per the tech-stack rule. **Both sites share this one form**; the hidden
   `_subject` is what distinguishes the brands. Split into two forms if you ever want
   separate stats or routing.
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
5. **Uniforms leftovers on Linen Works — mostly cleared 2026-07-28.** Both `<title>`s
   and the footer label on all four pages were fixed in the launch pass. **All that
   remains is the `uniforms-laundry.html` filename itself.** Renaming it now changes a
   URL that is **live and indexable**, so it also needs a redirect from the old path —
   more involved than it was before launch. Renaming to `services.html` would match
   Cleaning Works. Weigh it against the SEO cost of moving a live URL; leaving it is a
   perfectly reasonable permanent answer, since visitors never read the filename.
   NOTE: `uniforms-laundry.html` `<li>Workwear and uniforms</li>` is **correct** —
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

8. ~~**NO TLS CERTIFICATE ON `linenworks.dk`.**~~ **RESOLVED 2026-08-03.** Verified: a
   valid **Let's Encrypt** cert is now installed (`CN=linenworks.dk`, SANs cover apex
   **and** `www.linenworks.dk`, valid Jul 28 → Oct 26 2026; curl `ssl_verify_result: 0`).
   `http://` 301-redirects to `https://` (force-HTTPS is on). Browsers no longer show
   "Not secure". This was a Simply.com control-panel task, as diagnosed. Cert is 90-day
   Let's Encrypt — should auto-renew via Simply.com, but worth confirming before the
   Oct 26 expiry that renewal is automatic.
9. **Contact form never tested end-to-end.** Form `mvzelvvd` is wired and live, but no
   real submission has been made. Formspree sends a **verification email to the form
   owner on first submission** — until that is confirmed, enquiries may not be
   delivered at all. Do this after the cert is issued: submit the form, confirm it
   arrives at `info@worksgroup.dk` with subject "Linen Works — website enquiry", and
   confirm the redirect lands on `thanks.html` rather than formspree.io.
10. ~~**Deploy method unknown.**~~ **ANSWERED 2026-08-24 by the owner: deployment is a
   MANUAL COPY of the whole `linen-works/` folder onto the Simply.com host.** No git
   integration, no build, no pipeline. This confirms the long-suspected worst case, and
   several things follow from it that matter more than the question did:
   - **The live site reflects whatever was in the working tree at copy time, not any
     branch.** That is how `linenworks.dk` got the logo while `main` still lacked it for
     four days (see #17). The repo cannot tell you what is deployed — only the live site
     can.
   - **Every change needs a re-copy.** Nothing reaches visitors by merging or pushing.
   - **A copy publishes the *entire* folder**, so anything left in `linen-works/` goes
     public. Keep scratch files, backups and `_orig-*.html`-style comparison copies out
     of it. (One was created and deleted during the 2026-08-24 session for exactly this
     reason.)
   - **Check out `main` before copying.** Copying from a feature-branch checkout is what
     produced the drift in the first place.
   - **DECIDED 2026-08-24: the manual copy STAYS for now — owner's call**, made after
     being offered a GitHub Actions FTP sync and a scripted WinSCP mirror. Do not
     re-propose deploy automation unless the owner raises it. The consequences above
     are accepted, not overlooked, so the mitigation is enforced at copy time:
     **run `npm run precopy` and only copy if it says SAFE TO COPY.** It checks the
     branch, the working tree, stray untracked files and the sweep, and blocks on the
     unreviewed Danish until `--ack-danish` is passed. See "Automated checks".
11. ~~**Mobile `.stats` fix unverified on a real device.**~~ **RESOLVED 2026-08-03.**
   Verified by rendering the live site in Chrome at a 390px viewport (same-origin
   iframe, so the media queries evaluate for real). At 375px effective width the
   homepage `.stats` collapses to **1 column**, `.stat .n` drops to **44px**,
   "Independent" fits its 323px box exactly, and `scrollWidth === clientWidth` — zero
   horizontal overflow. The fix works; no phone test needed.
   **A separate overflow bug was found during the same sweep — see Open work #14.**
12. **Cleaning Works "Concept D" PROMOTED to live pages (2026-08-03).** The redesign is
   now `cleaning-works/{index,services,about,contact}.html` + `thanks.html`, with the
   launch pass folded in: meta descriptions, Open Graph + twitter card, inline-SVG
   favicon (ink tile, "C"), `thanks.html` + form `_next`, and the about-page `.marks`
   mobile-overflow guard (1-col below 880px). Photos `1/2/3.jpg` moved up beside the
   pages. **Remaining before a real launch:**
   - **Dedicated Formspree form** — contact still POSTs to Linen's shared `mvzelvvd`
     (distinguished only by `_subject`). `_next` points to `https://cleaningworks.dk/
     thanks.html`, which only resolves once that domain is live.
   - **Not deployed** — still lives on branch `cleaning-works-concept-c`, not `main`,
     and `cleaningworks.dk` is unpublished (see Deployment status). Merging + deploying
     is separate; the same TLS-cert / deploy-method questions as Linen (Open work #8/#10)
     will apply.
   - Old `Cleaningtable.jpg` / `Wipingglass.jpg` are now unused but left in the folder.
   - Consider a distinct hotel/restaurant hero (`1.jpg`/`3.jpg` read residential;
     `3.jpg` is reused on home + services).
13. **Simply.com WAF on `linenworks.dk` — NARROWED 2026-08-03 to one real problem:
    LinkedIn's scraper is hard-blocked.** Originally logged as a broad "the WAF is
    challenging everyone" worry. Browser testing that same day showed most of that fear
    was unfounded. Measured results:

    | Client | Result |
    |---|---|
    | **Real Chrome (human visitor)** | ✅ loads normally — no interstitial, valid cert |
    | **Googlebot** (UA) | ✅ `200` — **SEO is safe** |
    | **facebookexternalhit** (UA) | ✅ `200` — FB/Instagram OG cards render |
    | **LinkedInBot** (UA) | ❌ **`455` hard block** |
    | No user-agent | `455` |
    | Browser UA via `curl` | `454` JS challenge (a real browser passes it silently) |

    - **Confirmed fine:** human visitors see no interstitial, and the 454 "Checking your
      browser" is passed transparently by real Chrome. Search ranking is not at risk —
      Googlebot gets a clean 200.
    - **The one real issue:** Simply.com's WAF allow-list covers Google and Facebook but
      **omits LinkedIn**, so `og:` tags never render as a card on LinkedIn — plausibly
      the most important sharing channel for a B2B hospitality brand.
    - **Caveat on method:** these were UA-spoofed `curl` requests. Real LinkedIn traffic
      also comes from LinkedIn IP ranges, so if the WAF allow-lists by IP as well, the
      real bot may get through. **Cheap definitive test:** run
      `linkedin.com/post-inspector/` against `https://linenworks.dk` — it hits from real
      LinkedIn infrastructure.
    - **If Post Inspector also fails:** ask Simply.com support to add LinkedInBot to the
      WAF allow-list. NOT a code problem — hosting configuration, like the cert was.
    - Related: this same WAF is what returns the "455" in the security-scan discussion;
      the 4 low-risk missing-header findings from that scan were reviewed 2026-08-03 and
      **deliberately not actioned** (owner's call — all low-risk hardening headers on a
      static site; see that day's notes). Revisit alongside any `.htaccess` work.
14. **Linen Works `about.html` mobile overflow — FIXED and merged to `main`
    2026-08-24; still not deployed.** Found
    2026-08-03 during the browser sweep. The ESG values grid carried an **inline**
    `style="grid-template-columns:repeat(3,1fr)"`; inline styles outrank stylesheet
    rules, so the `max-width:880px` media query collapsing `.values-grid` to 2 columns
    never applied to it. At 375px the grid stayed 3-up (149/80/140px), text broke one
    word per line and the third column ran **83px off-screen**, forcing horizontal
    scroll. **Live on `linenworks.dk` right now.**
    - **Fix:** moved the rule into a `.values-grid-3` class declared *before* the media
      query — equal specificity, so source order lets the mobile rule win with no
      `!important`. Verified at 375/390/768/900/1280px; desktop still renders 3-up.
    - **State:** in `main` as of 2026-08-24. It only reaches the live site once the
      deploy method (#10) is settled. PR #1 is redundant — see #18.
    - A **second, unrelated** overflow was later found on this same page at 320px and
      fixed on 2026-08-24 — see #20. Two different bugs, same file.
    - **LESSON — check for this pattern elsewhere:** an inline `grid-template-columns`
      silently defeats every responsive rule for that element. A sweep found no other
      inline grid overrides on Cleaning Works or Works Group, but re-check whenever one
      is added.

15. **Cleaning Works "Værkstedet" rebuild — MUST NOT SHIP AS IS (2026-08-24).** The
    rebuild is complete and verified as a *build*, but the owner chose to keep the
    approved mockup's invented content as **visible placeholders** so the design can be
    reviewed whole. Every one of these is tagged in the markup (`.ph` inline highlight,
    `.ph-tag` chip, `.ph-note` band) and must be resolved before anyone outside the
    company sees the site:
    - **The price calculator quotes made-up kroner.** `(900 + m² × 7,4) × type × freq`,
      levels at 0,55× / 1× / 1,55×. It is the single most visible placeholder — the hero
      prints a real-looking monthly price. Replace `computePrices()` in
      `js/calculator.js`; the §6 regression check (kontor / 1.200 m² / 5 dage →
      5.400 · 9.800 · 15.200 kr.) will need updating with it.
    - **Certifications are claimed but unverified:** INSTA 800, ISO 9001, ISO 14001,
      Svanemærket, 3F overenskomst. Legal question, not a design one. They appear on
      `index.html` and `om-os.html`, and INSTA 800 is also woven into body copy and the
      levels table.
    - **Invented figures:** 340 erhvervsadresser · 96% genforhandling · 3,7 INSTA-score ·
      11% udskiftning · 82% svanemærket · 24 t svartid · grundlagt 2011 · ~4% af
      lønsummen · "40 gange om året" · the FAQ's 9.000–14.000 kr. range.
    - **Fictional case:** Mette Lindhardt, Facility Manager, Nordhavn Kontorhus,
      11.400 m². Quote included. On the homepage.
    - **Invented job listings** on `job.html`, and an **invented company history**
      (2011/2015/2019/2023 milestones) on `om-os.html`.
    - **CVR 12 34 56 78** is a placeholder in all seven footers and on `kontakt.html`.
      The real one is still unknown — same gap as Open work #6.
    - ~~**The photo is a living room.**~~ **DOWNGRADED 2026-08-24.** `foto-band.jpg` is
      now `Cleaningtable.jpg` — a woman in an apron wiping a café table. It is a real
      commercial-cleaning frame, so the photo is no longer *wrong*, only generic. The
      "Stockfoto — erstattes" tag is kept on purpose; a real shoot is still better.
      ⚠️ **It quietly takes a side in the unresolved audience question.** The mockup
      sells to *kontor / produktion / klinik*; a café is a restaurant, i.e. the audience
      this file's Conventions specify (hotels, restaurants, care homes). Settle the copy
      and the calculator's three site types alongside the real price model — the photo
      now points one way and the body copy the other.
    - **Privacy and cookie policies do not exist** — the footer says so, in a tagged
      placeholder, rather than linking to pages that aren't there.
    - Still shares Linen's Formspree form `mvzelvvd` (distinguished by `_subject`;
      `job.html` uses its own subject). Own form still wanted — old Open work #12.
    - `cases.html` from the design brief was **not built** — it needs one real,
      approved case study first.

16. **Cleaning Works no longer shares the group design system (2026-08-24).** This is
    now a much bigger divergence than the 2026-08-03 "bold Jost headlines" exception,
    and it is deliberate — the owner's reason for the rebuild was that the previous
    design still read as a recoloured Linen Works. What differs: **palette** (green
    `#0b4d3f` / coral / sun / cream, not the cool slate), **fonts** (Manrope + Instrument
    Serif italic + JetBrains Mono, not Cormorant + Jost), **breakpoints** (980 / 700 /
    600 / 480, not the shared 880), **language** (Danish primary), **file architecture**
    (shared `css/` + `js/`, not single-file inline `<style>`), and **wordmark** (a green
    rounded-square mark + "CleaningWorks" as one word, not the `**CLEANING** *Works*`
    lockup). Linen Works and Works Group are untouched and still follow the shared
    system. **Do not "restore" any of this toward the group style.** The design source of
    truth is `CleaningWorks New Design/mockup.html` and the brief beside it in that
    folder's own `CLAUDE.md`.

17. ~~**`main` IS STALE FOR LINEN WORKS — the logo work was never merged.**~~
    **RESOLVED 2026-08-24 by merging both feature branches into `main`.** Recorded
    because the cause still matters: commit `845988d` (the 2026-08-20 logo work) sat
    only on `cleaning-works-concept-c` for four days, so `main` had the placeholder
    inline-SVG "L" favicon, no header or footer mark and no `logo-mark*.svg`. Anyone
    branching Linen Works work off `main` in that window would have silently reverted
    the logo — which is exactly why the DA/EN branch was based on
    `cleaning-works-concept-c` instead.
    - ✅ **Answered 2026-08-24 by the owner: the live site DOES have the logo**, copied
      manually from the `linen-works/` folder while a feature branch was checked out.
      So the drift was real — `main` was behind the live site, not ahead of it, for
      those four days. See #10, now answered.
    - **Lesson:** feature branches here have been long-lived and stacked on each other.
      Merge to `main` as work completes, or `main` stops meaning anything.

18. ~~**PR #1 — `fix/about-mobile-overflow`.**~~ **CLOSED — nothing left to do
    (verified 2026-08-24 with `gh`).** `gh pr view 1` reports state **MERGED**, and
    `gh pr list` shows **no open PRs at all**. The "close the PR on GitHub" instruction
    this item used to carry was already satisfied; it was written before anyone could
    query GitHub from this machine.
    - **The fix is in `main`, confirmed by content, not by trust:** `about.html:53`
      declares `.values-grid-3{grid-template-columns:repeat(3,1fr)}`, line 176 applies it,
      and no inline `grid-template-columns` survives anywhere in the file.
    - ⚠️ **Do not check this with `git diff main <branch>`** — that compares tip states,
      so it prints everything `main` gained *since* the branch was cut and looks alarming.
      The containment question is `git log main..origin/<branch>` (commits on the branch
      not in `main`), or `git branch -r --merged main`.
    - By that test the branch has **one commit not in `main`** (`f452704`), yet is still
      superseded: it predates the DA/EN flip, and `main`'s version fixes the same bug
      *plus* #20 and the ESG inline style. Nothing there is worth recovering.
    - **Three stale remote branches remain** — `fix/about-mobile-overflow`,
      `cleaning-works-concept-c` and `contact-details-and-brand-doc-fix`. The last two are
      fully contained in `main`. They are the only leftover artefacts now; deleting them is
      housekeeping, not urgent.

19. **🔴 The Linen Works Danish copy has not been reviewed by a native speaker
    (2026-08-24) — AND THE NEXT FOLDER COPY PUBLISHES IT.** Deployment is a manual copy
    of `linen-works/` (#10), so the moment that folder is copied to the host,
    `linenworks.dk` becomes Danish-first with this untouched machine translation as the
    brand voice on an indexed, live site. **Read the Danish before copying**, or copy
    only the files you actually intend to change. It is now the *primary* language, so it
    carries the brand rather than sitting behind a toggle. Terms chosen that are worth a
    second opinion: **linnedudlejning** (linen rental), **erhvervsvaskeri** (commercial
    laundry), **tekstilstyring** (textile management), **basisbeholdning** (par levels),
    **»…«** for the pull quote, and **"Book et møde"** for the CTA — "book et opkald" is
    unnatural Danish, so the meeting framing was used and body copy says
    "telefonmøde på 20 minutter" where the English said "20-minute call". Copy uses
    **I/jer/jeres** (plural you) throughout, standard for Danish B2B. To edit Danish,
    edit the HTML; to edit English, edit that page's `T` object.
    ⚠️ Also unresolved: the client's supplied copy in
    `C:\Users\TMJ\Desktop\LinenWorks Text\` is English, so it is no longer the direct
    source of what the site says. If the client supplies Danish, it should replace the
    HTML, not the `T` object.

20. **Linen Works `about.html` had a second, older mobile overflow — fixed 2026-08-24.**
    Separate from #14 and found the same way: `.values-grid` never collapsed below two
    columns, so at **320px** the second column ran 5px off-screen. Confirmed by measuring
    the untouched pre-change file, so it had been live since launch. Now one column below
    480px. ⚠️ Note this contradicts the 2026-08-20 "35/35 clean at 320→1440" claim — the
    likeliest explanation is that the earlier sweep measured before the Google font had
    loaded, which changes min-content width. **Treat width sweeps as valid only if they
    wait for `document.fonts.ready`.**

## Deployment status (as of 2026-08-24)

**`main` is now the single source of truth again.** All feature branches were merged and
pushed on 2026-08-24 (`cleaning-works-vaerkstedet`, `linen-works-da-en`, and with them
the 2026-08-20 logo commit that had never reached `main`). No site work is stranded on a
branch any more.

**HOW DEPLOYMENT WORKS (confirmed 2026-08-24):** the owner **manually copies the whole
`linen-works/` folder** onto the Simply.com host. Pushing to `main` does not deploy
anything. See #10.

⚠️ **`main` is currently AHEAD of the live site** by the DA/EN flip to Danish-first and
two `about.html` overflow fixes. The logo *is* already live (it was copied from a
feature-branch checkout, which is what caused the four-day drift). **The next copy of
`linen-works/` will switch `linenworks.dk` to Danish** — read #19 first.

| Site | Status | Host | Notes |
|------|--------|------|-------|
| **Linen Works** | 🟢 **LIVE** at `linenworks.dk`, but **`main` is ahead of live** | Simply.com, **manual folder copy** (#10) | ✅ TLS cert (2026-08-03); ✅ logo IS live; ✅ fine for humans + Googlebot; ⚠️ LinkedIn scraper blocked (#13). **In `main` but not yet copied to the host:** the DA/EN flip to Danish-first (⚠️ unreviewed Danish — #19) and both `about.html` overflow fixes (#14, #20) |
| Cleaning Works | Not published (**rebuilt 2026-08-24 — must not ship as is**) | — | "Værkstedet", now in `main`. Build verified; blocked on placeholder content — Open work #15 |
| Works Group | Not published | — | No launch pass done — see below |
| Linen Portal | Not published | — | Inert until Supabase exists (Open work #4) |

**Cleaning Works launch pass is DONE (2026-08-03)** as part of the Concept D promotion:
meta descriptions, Open Graph, favicon, `thanks.html` + form `_next`, and the mobile
overflow guard. It is not deployed to a host yet, and still needs its own Formspree form
(Open work #12). **Works Group still has had none of the launch pass** — before it goes
live, repeat it: `<meta name="description">`, Open Graph tags, favicon, and a
`thanks.html` + `_next` for the form. Use the 2026-07-28 changelog entries as the
checklist. **The mobile stat-grid overflow item is DROPPED from that checklist** —
tested 2026-08-03 at 375px and the Works Group homepage has **zero** overflow, so the
assumption that it inherited the Linen homepage bug was wrong. ⚠️ **But 375px was the
only width ever tested.** The Playwright sweep found the header overflowing **5px at
320px** — no `max-width:480px` block existed, the step-down both sibling sites needed.
Fixed 2026-08-24; the stat grid was never the problem. (Confirmed still missing:
description, OG tags, favicon.) All five Cleaning Works pages also tested clean at
375px — the `.marks` guard added in the Concept D promotion holds.

### Sending a site folder by email
**`.js` files are blocked by Gmail and most corporate mail filters, including inside a
ZIP.** This bites `cleaning-works/`, which is the only site with external scripts
(`js/site.js`, `js/i18n.js`, `js/calculator.js`). Renaming them is not the fix — the
recipient then has to undo it, and relative `<script src>` paths break.

**What works:** build a throwaway copy with the JS inlined into each page, so no `.js`
file exists. Replace each `<script src="js/x.js"></script>` with `<script>` + the file's
contents + `</script>`, in the same order, then delete `js/`. Top-level `const`/`let` in
one classic script are visible to the next, so the three files inline cleanly with no
edits. Ship only the referenced assets — for Cleaning Works that is the seven pages,
`css/style.css` and `foto-band.jpg`, nothing else (265 KB zipped vs 1.2 MB for the raw
folder). Tell the recipient to extract the **whole folder** and open `index.html`; CSS
and image paths are relative, so a single page dragged out of the zip renders unstyled.
Linen Works has no external JS at all, so its folder zips and emails as-is.

### Automated checks (Playwright — added 2026-08-24)
**Run `npm run sweep` before any deploy.** It replaces the responsive sweep that was
hand-rolled three times (35/35, 63/63, 110/110) via injected iframes. 64 checks, ~7s.

    npm run sweep              # everything
    npm run sweep:overflow     # just the width sweep
    npm run sweep:linen        # one site (also :cleaning, :group)
    npm run report             # open the HTML report of the last run
    npm run precopy            # pre-flight before a manual folder copy
    npm run doctor             # what is installed on THIS machine
    npm run sounds:install     # wire the notification sounds (see §1b)

**`npm run doctor` is the first thing to run on an unfamiliar machine** (Machine setup
§0). It replaces the per-machine tool table that used to live in this file, because a
table cannot notice it has gone stale. It checks tools + versions, `node_modules` and the
Playwright browsers (a separate download from `npm install`, and the easiest half of the
setup to forget), git identity scope, the Python alias trap, and which untracked asset
folders are reachable — reporting what each missing item blocks. Exit 0 = harness runs.
It installs nothing and holds no credentials, and it **cannot** sync the gitignored asset
folders; nothing in the repo can.

**`npm run precopy` is the gate for a deploy** (`-- cleaning-works` for another site;
`-- --skip-sweep` to re-check quickly). It copies nothing — it answers "is this folder
safe to publish right now?" and exits non-zero if not. It **fails** on: not being on
`main` (#17's cause), uncommitted changes in the folder, **untracked files that a
whole-folder copy would publish**, a failing sweep, and — for `linen-works` only,
because it is live and indexed — the unreviewed Danish (#19), which is released with
`--ack-danish`. It **warns** on being behind `origin/main` and on unreferenced assets,
and always prints the file count and total size that would go up.

What it covers, all three sites × both languages:
- `tests/overflow.spec.js` — 14 widths, 320→1440. On failure it **names the element**
  sticking out, so there is no devtools bisect. It waits for `document.fonts.ready`
  before measuring — the omission that let the #20 bug survive the 2026-08-20 pass.
- `tests/console.spec.js` — zero console errors, plus any 404 on a local asset.
- `tests/linen-logo.spec.js` — the logo pack's **40px rule**. Loads fresh at each width
  (a `<picture>` re-selects its `<source>` asynchronously, so resize-then-read races the
  swap) and asserts the detailed mark ≥40px above 480px, the solid mark at/below it, and
  the reversed mark in the footer. This rule is otherwise invisible in the markup.
- `tests/cleaning-calculator.spec.js` — the §6 regression check (kontor / 1.200 m² /
  5 dage → 5.400 · 9.800 · 15.200 kr.) and the DA↔EN reformat. ⚠️ When the placeholder
  pricing model is replaced (#15) this test **should** fail — update `EXPECTED` to the
  real figures rather than deleting it.

Pages live in `tests/sites.js` — add new ones there, not in each spec. The harness is
**dev-only**: `package.json`, `tests/`, `tools/`, `playwright.config.js` never ship, and
the no-build-step rule is intact. Node 24 LTS and Chromium were installed for it.

⚠️ **`doctor` and `precopy` are not in the sweep and nothing runs them for you.** They are
answers to questions ("can this machine work?", "is this folder safe to publish?"), not
assertions about the sites, so they stay manual. A green sweep says nothing about either.

### Previewing a site locally
The Chrome extension refuses `file://` URLs, so pages must be served over HTTP to be
tested in a browser. `node tools/static-server.js` (or `npm run serve`) now does this —
it serves the repo root on `http://localhost:4173/` with a `.webp` MIME mapping, and
replaces the hand-rolled PowerShell `HttpListener`. Playwright starts it automatically.
- **Preferred (since 2026-08-03): VS Code + Live Server.** Both are installed — VS Code
  at `%LOCALAPPDATA%\Programs\Microsoft VS Code` (`code` is on PATH) and the Live Server
  extension (`ritwickdey.LiveServer` v5.7.10). Open the repo, right-click any HTML file →
  *Open with Live Server*. Auto-reloads on save.
- **Fallback with nothing installed:** a ~30-line PowerShell `System.Net.HttpListener`
  static server; `http://localhost:<port>/` binds without admin rights. Needed because
  this machine has **no Node and no real Python** (`python` is the Microsoft Store stub).
  If you write one, include a `.webp` MIME mapping — Cleaning Works now serves WebP.
- **Testing a mobile breakpoint:** inject a **same-origin iframe at the target width**
  rather than resizing the window — window resize did *not* change the viewport when
  tried. Media queries inside an iframe evaluate against the iframe's width, and
  same-origin lets you measure `scrollWidth` vs `clientWidth` from the console. This is
  how the #11 verification and the #14 bug discovery were both done.

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
- CONTACT FORMS post to **Formspree** (form `mvzelvvd`), not `mailto:`. A `mailto:`
  form action silently does nothing in Chrome/Edge — never go back to it. Use the
  **plain HTML POST** integration only: no `@formspree/ajax`, no React SDK, no bundler
  — those all violate the no-build-step rule. Every form carries three hidden fields:
  `_subject` (names the brand), `_next` (post-submit redirect) and `_gotcha` (spam
  honeypot — bots fill it, Formspree discards those submissions).
- **Linen Works is bilingual (since 2026-08-24): Danish primary, English behind a
  DA/EN toggle.** Danish lives in the HTML — to change Danish, edit the HTML. English
  lives in a `T` object at the bottom of each page — to change English, edit `T`. Every
  new translatable element needs `data-i18n` (or `data-i18n-alt` / `data-i18n-ph`) plus
  a matching `T` key, on that page. The toggle must stay a `<div class="lang">` and not
  an `<a>`, or the 880px rule that hides nav links will hide it on mobile too. Cleaning
  Works uses the same Danish-primary mechanism but with shared `js/` files; Works Group
  is still English-only.
- Mobile breakpoint: `max-width: 880px` (all sites).
- Nav CTA button uses class `.nav-cta` on every page across all three sites
  (previously the three homepages used `.cta` — standardised 2026-06-16).
- Copy concise and operator-focused; no fluff.
- The old five-color swatch bar at the top is removed — do not add it back. (The
  leftover `.swatch` CSS in `linen-works/index.html` was also deleted 2026-06-16.)
- When using `sed` for copy edits, watch for `&` in replacement strings (it inserts
  the matched text) — prefer literal string replacement for anything containing `&`.

## Changelog

### 2026-08-24 — `npm run doctor`: machine state is measured, not asserted
The entry below recorded the second machine as a **hand-written table** of what each one
had installed. That was the wrong pattern and it was pointed out immediately: a table is
stale the moment anyone runs `winget install`, and nothing announces it — the same
mechanism that produced the wrong 745 KB figure, the Assets section describing Concept D
art three weeks after it was replaced, and the uniforms brand description. `tools/doctor.js`
replaces it, following `sweep` and `precopy`: stop asserting, measure.
- **What it checks:** tools + versions with paths, `node_modules` and the Playwright
  browsers (a separate download from `npm install`, and the easiest half of the setup to
  forget), git identity scope, the Python alias trap, and which untracked asset folders
  are reachable — each with what its absence blocks. Prints the exact `winget` lines to
  fix whatever is missing. Exit 0 = the harness runs here. Installs nothing, no credentials.
- **It cannot sync the asset folders, and says so.** `Logo/` and the Desktop folders are
  gitignored on purpose, so git will never carry them between machines. Machine state can
  be *reported* automatically; the 14 MB of assets still needs a real channel.
- **Found a bug in itself, which is the point.** The first Python check had only
  stub/real buckets. `fs.statSync` **throws `EACCES`** on an App Execution Alias, so the
  entry fell into neither bucket and printed **nothing** — a silent gap in the script
  whose whole job is removing them. Fixed with an explicit `unknown` bucket, so an
  unclassifiable entry is now reported rather than dropped.
- **This also corrected the entry below.** It claimed the aliases are "0-byte, verify by
  length". That is **PowerShell's view only** — `Get-Item .Length` is 0, but Node's
  `statSync` throws before returning any size, and `lstatSync` reports a ~108-byte
  symlink. Code checking `size === 0` in Node would never have fired. There is also a
  third alias, `python3.exe`, which went unrecorded. Machine setup §1 now carries the
  per-probe table.
- **Failure paths verified deliberately**, as `precopy` was: a bogus
  `PLAYWRIGHT_BROWSERS_PATH` produces FAIL + the `npx playwright install` fix line +
  exit 1; `--assets <dir>` finds a folder outside the searched roots. A check that has
  only ever passed is not a verified check.
- Machine setup §0 is now four lines and a pointer to the script instead of a table.
- **`gh` installed later the same day, and immediately proved the point.** It reported a
  healthy version while being **logged into nothing** — presence passing while the tool
  is unusable, the same false-green as the Python aliases. `doctor` now checks
  `gh auth status`, not just the binary. Note `gh` does **not** share git's cached
  Windows Credential Manager login, which is why pushes work and `gh` does not.
  `gh auth login` is interactive; a human must run it.

### 2026-08-24 — second machine provisioned (docs + tooling only)
The repo now has a working checkout on a **second Windows machine** (user `Controols`,
repo at `C:\Users\Controols\worksgroup`). **No site files changed** — this entry and the
new Machine setup §0 are the whole diff.
- **Installed to match machine 1 exactly:** Node 24.19.0 and ImageMagick 7.1.2-29 Q16-HDRI,
  both via `winget`, both landing on the same paths this file already documents — so the
  recorded `magick` invocations work here unchanged. Then `npm install`,
  `npx playwright install chromium`, and **`npm run sweep` → 64/64 in 9.1s**, the expected
  count. Working tree stayed clean; nothing the setup produced is untracked.
- **The PATH warning is real, and now has a workaround.** `node` and `npm` were still
  "not recognized" in the shell that ran the installer. Restarting the terminal is the fix,
  but an agent session mid-task can't; §1 now records the per-command registry refresh.
- **The asset gap is the thing to remember.** `Logo/`, `Stock photos Linen Works/` and
  `LinenWorks Text/` are all absent here, and every Desktop path in this file points at
  `C:\Users\TMJ\`, **which does not exist on machine 2**. Nothing warns you: all 64 checks
  pass without them. It blocks logo regeneration and any photo re-export (including the
  `foto-band.jpg` optimisation pass Assets defers). Editing, sweeping, precopy and serving
  are unaffected.
- **Two corrections to what this file claimed:**
  1. It said machine 1 has "no `py`". Machine 2 has **both** `python.exe` and `py.exe` on
     PATH — as **0-byte App Execution Alias stubs**. That is worse than absent, because a
     presence check passes and the command then does nothing. Still no real Python; verify
     by file length.
  2. §3 said the repo-local git identity means a clone is ready to commit. It isn't —
     `.git/config` is not cloned. Machine 2's identity was set again locally, and neither
     machine has a global one.
- **`gh` and the Live Server extension are NOT on machine 2.** `npm run serve` covers
  previewing; `gh` needs installing before any PR work.

### 2026-08-24 — `npm run precopy`: a gate for the manual copy
The manual folder copy stays (#10, owner's call). This makes it safer without
automating it — it copies nothing and has no credentials.
- **Five hard checks, each tied to a failure this repo has actually had:** on `main`
  (the #17 drift), no uncommitted changes in the folder, **no untracked files** (a copy
  publishes the whole folder — this is the `_orig-*.html` scratch-file trap), the sweep
  passing, and the unreviewed Danish (#19) on `linen-works`, which blocks until
  `--ack-danish` is passed. Warns on being behind `origin/main` and on unreferenced
  assets. Prints what would actually go up.
- **The Danish check is deliberately a flag, not a scan.** No script can tell whether a
  human read the copy. Making it the one thing a person must assert keeps it visible
  instead of quietly passing.
- **Verified by making each check fail on purpose**, not just by watching it pass:
  stray file → blocked; real edit → blocked; feature branch → blocked; missing ack →
  blocked; all clear → SAFE TO COPY, exit 0. A stray file was initially reported twice
  (`git status --porcelain` lists untracked as `??`); the tree check now filters those
  so each problem is named once.
- **Corrected a figure in Assets:** the unreferenced Cleaning Works images total
  **937 KB**, not the ~745 KB recorded here. The script measures it.

### 2026-08-24 — the living-room band photo is gone
- **Audited all nine stock candidates visually** (the eight `Stock 1–8` plus
  `Cleaningtable`) and found the folder is a **Linen Works folder**: eight of nine are
  linen, laundry or hotel-textile frames. `Stock 8` turned out to be **byte-identical to
  `Apron_hanging.jpg`**, the Linen hero. Full breakdown in Assets.
- **`Cleaningtable.jpg` is the only genuine commercial-cleaning shot on this machine**,
  so it replaces the living room in the wide band on `index.html` and `ydelser.html`.
  Re-exported from the 6000×4000 Desktop original — 16:9 centre crop, 1800×1013, q82,
  EXIF stripped. Larger than what it replaced and 8 KB smaller. Same filename, so the
  seven `og:image` tags were untouched.
- **Fixed a latent aspect-ratio bug in passing:** the old file was 1500×1000 but both
  `<img>` tags declared `width="1600" height="900"`, so the browser reserved the wrong
  shape. Attributes now match the file.
- **The placeholder tag stays** (owner's call). The photo is no longer *wrong* — it is
  a real cleaning frame on commercial premises — but it is still stock, not this
  company's work. ⚠️ It does take a side in the unresolved audience question: a café is
  a restaurant, not *kontor / produktion / klinik*. See #15.
- **Alt text updated, Danish only.** `js/site.js` handles `[data-i18n]` and nothing
  else — no `data-i18n-alt` — and its 1:1 key check would report an alt key as unused.
  Translating alt text means extending shared JS across seven pages; not done for one
  image, but that is the reason, not an oversight.
- Two unused **Linen Works** assets surfaced: `Stock 1` and `Stock 7`, both industrial
  laundry floors, for a Commercial Laundry column that currently shows only textiles at
  rest. Prefer `Stock 7` — `Stock 1` has legible Cyrillic on the cart.
- Sweep re-run after the swap: **64/64**.

### 2026-08-24 — Node + Playwright installed; the manual sweep is now a script
- **Node.js 24.19.0 LTS installed** (`winget`, `C:\Program Files\nodejs`). Ends the
  no-Node workaround era alongside the 2026-08-03 ImageMagick/VS Code installs. It is
  **dev tooling, not a build step** — the sites are still plain HTML that opens from
  disk, and nothing in `node_modules/` ships.
- **The responsive sweep is now `npm run sweep`.** The same check had been hand-rolled
  three times (35/35, 63/63, 110/110) by injecting same-origin iframes and reading
  `scrollWidth` from the console. It is now 64 automated checks across all three sites,
  both languages, 14 widths — **~7 seconds**. See "Automated checks" above for scope.
  Failures name the offending element instead of starting a devtools bisect.
- **It found a real bug on its first run: `works-group/index.html` overflowed 5px at
  320px.** The header had no `max-width:480px` block — the exact step-down Linen Works
  needed on 2026-08-20 and Cleaning Works on 2026-08-24. Works Group never got one
  because 375px was the only width it had ever been tested at. Fixed by adding the
  matching block (header padding 16/20, logo 20px, tighter `.nav-cta`). **This is the
  only site file changed this session.** Works Group is unpublished, so nothing live
  was touched.
- **Two lessons from CLAUDE.md are now enforced by code rather than by memory:** the
  sweep waits for `document.fonts.ready` before measuring (the omission behind #20), and
  the Linen logo pack's 40px rule — invisible in the markup, and silently broken by
  "simplifying" the `<picture>` swap — now fails a test.
- One test-authoring correction worth keeping: reading `img.currentSrc` straight after
  a viewport resize **races** the `<picture>` re-selection, which is async. It produced
  inconsistent failures across pages. The logo spec loads fresh at each width instead —
  deterministic, and closer to what a phone visitor actually gets.
- `tools/static-server.js` replaces the PowerShell `HttpListener`; `.webp` MIME included.

### 2026-08-24 — everything merged to `main` and pushed; docs reconciled with reality
Housekeeping pass closing out the day's two builds. No site behaviour changed.
- **All feature branches merged into `main` and pushed.** `cleaning-works-vaerkstedet`
  and `linen-works-da-en`, and with them the 2026-08-20 logo commit that had sat only on
  `cleaning-works-concept-c` for four days. Only `CLAUDE.md` conflicted; both site
  folders merged byte-identical to their verified branch versions, so the 63/63 and
  110/110 sweeps carried over. Re-smoke-tested the merged tree anyway (48 combinations,
  clean). **Nothing is stranded on a branch any more.**
- **The deploy method is finally written down (#10).** Owner: it is a **manual copy of
  the whole `linen-works/` folder** onto Simply.com. That also explains the drift — the
  live site has the logo because it was copied from a feature-branch working tree while
  `main` still lacked it. So `main` was *behind* live, not ahead. Pushing deploys nothing.
- **Asset audit corrected a stale claim.** The Assets section still described Cleaning
  Works as using `1/2/3.jpg` — that was Concept D. Grepping every `src`, `og:image` and
  CSS `url()` across the seven Værkstedet pages shows it uses **exactly one image**,
  `foto-band.jpg`. Eight images are unreferenced: `1/2/3` in both `.jpg` and `.webp`,
  plus `Cleaningtable.jpg` and `Wipingglass.jpg` — two generations of leftovers. Kept as
  stock (they are the only owner-supplied cleaning photography on this machine), but now
  documented as dead weight rather than as the live art.
- **Recorded that `.js` blocks email delivery** and how to build an inlined copy — see
  "Sending a site folder by email". Came up sending Cleaning Works out for review.
- **README.md brought back in line** — it still showed the old `services/about/contact`
  Cleaning Works pages, claimed `linenworks.dk` had no TLS cert (fixed 2026-08-03),
  called the deploy method unrecorded, and recommended `python -m http.server` on a
  machine with no real Python.
- `.gitignore` now covers `Logo/` (the 14 MB print pack, deliberately untracked) and
  `cleaning-works-email.zip`, so neither can be committed by accident.

### 2026-08-24 — Linen Works went bilingual, Danish-first (DA/EN toggle)
- **All five pages flipped to Danish as the primary language**, with English behind a
  DA/EN toggle in the header. Owner's call, taken knowingly: `linenworks.dk` is live and
  was indexed in English, so this changes what Google sees. The Danish is a **fresh
  translation written in this session and has not been read by a native speaker** — see
  Open work #18 before deploying.
- **Danish lives in the HTML, English in a page-local `T` object** — the same direction
  as Cleaning Works, so `<html lang="da">` is the served default and English is the
  layer on top. `lang` follows the toggle; `og:locale` is now `da_DK` with
  `en_GB` as alternate.
- **Kept single-file, deliberately.** Each page carries its own `<script>` and its own
  `T`, duplicating the header/footer strings five times. That is the marketing-site
  convention in this file, and it matters more than usual here: the deploy path is still
  unrecorded (#10), so one changed page = one file to upload, with nothing to forget. If
  the duplication becomes painful, a shared `js/i18n.js` is an easy later move — but it
  would mean a missing upload leaves a dead toggle on a live site.
- **The toggle translates more than text nodes:** `data-i18n-alt` swaps image alt text,
  `data-i18n-ph` swaps form placeholders, and `<title>` + `<meta name="description">`
  switch too. Select options and the contact form's labels are all covered.
- **Choice persists across pages** via `localStorage['lw-lang']`, so the site behaves as
  one site that switches rather than two sites. First-time visitors get Danish.
- **The toggle stays visible on mobile.** It is a `<div>`, not an `<a>`, so the existing
  `nav a:not(.nav-cta){display:none}` rule at 880px leaves it alone — that was the point
  of not making it a link. Below 480px the header now wraps to two lines
  (`flex-wrap:wrap`); it was already at its width limit before this (see 2026-08-20),
  and a language switch that disappears on phones would be useless.
- **Found and fixed a PRE-EXISTING live bug on `about.html`** while sweeping:
  `.values-grid` never collapses below two columns, so at 320px the second column ran
  **5px off-screen**. Verified identical on the untouched pre-change file, so this is on
  `linenworks.dk` today and is not something the DA/EN work introduced. Now 1 column
  below 480px — two ~114px columns were unreadable at that width anyway. Also moved the
  ESG lead paragraph's **inline style** into an `.esg-lead` class: an inline style on
  this exact page is what caused Open work #14, and leaving another one in place was
  asking for the same bug twice.
- **Verified:** 5 pages × 11 widths (320→1440) × both languages = **110/110 with zero
  horizontal overflow**, toggle visible in all 110, footer mark present in all 110, and
  the logo pack's 40px rule still honoured (42/40px detailed mark, 28px solid ≤480px).
  Zero console errors. Every `data-i18n` key resolves to an English string on all five
  pages, DA→EN→DA round-trips exactly, and the language choice survives navigation
  across all five pages in both directions.

### 2026-08-24 — Cleaning Works rebuilt from scratch: "Værkstedet" (retning D)
- **The 2026-08-03 Concept D redesign lasted three weeks.** Owner's verdict: still too
  close to the other two brands. A separate design exploration (seven directions, in
  `CleaningWorks New Design/`) landed on **retning D "Værkstedet"**, and `mockup.html`
  in that folder is the approved homepage. This session turned that mockup into the site.
- **What replaced what.** `index.html` overwritten; `services/about/contact/thanks.html`
  deleted (never deployed — recoverable from git). New: `ydelser.html`, `niveauer.html`,
  `om-os.html`, `job.html`, `kontakt.html`, `tak.html`, plus the extracted shared layer
  `css/style.css`, `js/site.js`, `js/i18n.js`, `js/calculator.js`. `cases.html` was
  deliberately skipped — it needs a real case study.
- **Four decisions were the owner's, taken up front**, because the design folder's own
  `CLAUDE.md` contradicts this file on all four: Danish-first **with** the EN toggle;
  invented content **kept but tagged** as visible placeholders; the price calculator
  built **exactly** as specced, kroner and all; and the **full** Danish site map rather
  than a homepage-first pass. Consequence: the site is a complete, reviewable build that
  **cannot ship** until Open work #15 is cleared.
- **Contact details were corrected without asking** — the mockup's `70 00 00 00`,
  `kontakt@cleaningworks.dk` and Glostrup address are gone, replaced by the real
  `+45 31 40 86 21` / `info@worksgroup.dk` and the Formspree POST with `_subject`,
  `_next` → `tak.html` and `_gotcha`, per this file's conventions. CVR stays a
  placeholder because the real one still isn't known.
- **i18n moved from the mockup's flat `T` object to `js/i18n.js` keyed by page**, as the
  brief's §5 anticipated once the site grew. Strings used on several pages live in small
  shared consts (`CALC`, `LVL_TABLE`, `FORM`, `FACTS`, …) that each page composes, so
  there is one source of truth *and* every page still holds exactly the keys it uses.
  Verified in-browser: **all 7 pages report 1:1**, no missing and no unused keys.
  site.js runs that check itself on localhost and logs the result.
- **Three real responsive bugs were found and fixed**, none of them present in the
  single-page mockup:
  1. `.ph-note` put a `white-space:nowrap` chip in a flex row, so its min-content width
     became chip + longest word — 41px of overflow at 390px. Fixed with `flex-wrap` and
     a `flex:1 1 240px; min-width:0` text sibling.
  2. **Grid children default to `min-width:auto`**, so long Danish compounds set a floor
     the media queries could not get under. Released `min-width:0` on every multi-column
     grid's children — same class of bug as Open work #14, different mechanism.
  3. Below 480px the header ran out of room (logo + DA/EN + burger = 62px over at 320px).
     Added a `max-width:480px` block, the same fix pattern the Linen Works header needed.
- **Verified, not eyeballed:** 7 pages × 9 widths (320→1440) measured programmatically
  for `scrollWidth > clientWidth` — **63/63 clean**. Zero console errors. Burger opens
  and closes on link click on all 7. Every form field has a label tied by `for`/`id`.
  Nav and footer link sets are byte-identical across all 7. The §6 calculator regression
  check passes exactly (kontor / 1.200 m² / 5 dage → **5.400 · 9.800 · 15.200 kr.**),
  and the DA↔EN switch reformats it correctly (`9.800 kr.` ↔ `DKK 9,800`, decimal comma
  ↔ point, `dage/uge` ↔ `days/week`).
- **The audience mismatch is unresolved and is a content decision, not a bug.** The
  mockup sells to *kontor / produktion / klinik*; this file's convention says the
  audience is hotels, restaurants, care homes, healthcare and fitness across **Zealand**.
  The calculator's three site types carry real multipliers (1 / 1,15 / 1,3), so relabelling
  them means repricing them — left exactly as specced, per the owner's answer. Worth
  settling alongside the real price model.
- Old `1/2/3.jpg`+`.webp`, `Cleaningtable.jpg` and `Wipingglass.jpg` are now unused but
  left in place; `_concepts/` still holds the rejected concept-c. The design folder
  (mockup, brief, the seven directions) is **now tracked** — it is the design's
  provenance and it is under 1 MB.

### 2026-08-20 — Linen Works logo added to the site
- **The mark is now in the header and footer of all five Linen Works pages.** Owner
  supplied a logo; the wordmark in it is 1:1 with what the site already renders as live
  text, so the only genuinely new element was the drawn mark. Wordmark stays text.
- **Started from the wrong file, corrected.** First pass extracted the mark from
  `Logo/linenworks-logo.png` — a flat spec-sheet image — by flood-filling the outer
  white to transparent (interior white survives, which is what the design needs) and
  shipped a 4.7 KB WebP. Owner then pointed at `Logo/LinenWorks-logo-print/`, a proper
  vector pack. Swapped to the SVGs and deleted the WebP. **Read that pack's READ-ME
  before touching the logo again** — it carries rules the artwork alone doesn't tell you.
- **Three decisions the READ-ME overturned:** (1) 40px on-screen minimum for the primary
  mark, below which the `solid` version is required — the mobile sizes were 34/28px on
  the detailed mark, so the header now `<picture>`-swaps to solid at ≤480px and the
  ≤880px size went 34px → 40px; (2) `on-cream` is the correct colourway for the
  `#F5F0E8` background, not the white-bodied `brand` one used at first; (3) `reversed`
  exists, which unblocked the footer that had been flagged as impossible the day before.
- **Two latent CSS bugs surfaced, both specificity.** `.foot-grid a` (0,1,1) was beating
  `.foot-logo` (0,1,0) and forcing `display:block` + `font-size:15px`. Invisible while
  the footer logo was text-only; the moment an image went in, the mark stacked above the
  wordmark. Fixed with `.foot-grid a.foot-logo`. ⚠️ **Note this changed live appearance:
  the footer wordmark had been rendering at 15px, not the 30px `.foot-logo` declares.**
  It is now 30px as the CSS always intended. Revert that one line if the small footer
  wordmark was actually wanted.
- **Header was already at its width limit before this.** At 375px the wordmark was
  colliding with the "Book a call" button; adding a ~40px mark tipped 320px into real
  horizontal overflow. Added a `max-width:480px` block (logo 20px, mark 28px, tighter
  `.nav-cta` padding) and, after the 30px footer fix, a footer step-down (22px text /
  40px mark). 375px and 320px now render *better* than they did before the logo.
- **Verified**, not eyeballed: 5 pages × 7 widths (320→1440) checked programmatically
  for `scrollWidth > clientWidth`, header mark height, and footer mark presence — 35/35
  clean, mark measuring 42/40/28px at the intended breakpoints.
- Favicon: the placeholder inline-SVG "L" tile is gone from all five pages, replaced by
  `favicon-32.png` (solid mark, per the 40px rule) + `apple-touch-icon.png`.

### 2026-08-03 — tooling installed; Cleaning Works photos moved to WebP
- **ImageMagick 7.1.2 and VS Code + Live Server installed** (owner). Ends the workaround
  era: the Concept D image pass had to use .NET's JPEG encoder, and browser testing had
  to use a hand-rolled PowerShell server. Use `magick` and Live Server from now on.
- **Cleaning Works photography converted to WebP q82: 323 KB → 209 KB (35%, 114 KB).**
  Quality point chosen by measurement — swept q78/82/85/88 and compared PSNR against the
  source JPEGs; q82 keeps all three ≥37.8 dB (artifacts invisible at these display sizes)
  and matches the project's existing q82 convention. An initial q88 guess was dropped: it
  saved only 14% for quality no one can see.
- **Only the four `<img src>` tags use `.webp`.** The four `og:image` metas still point at
  the JPEGs on purpose — social scrapers handle WebP inconsistently, and this host's WAF
  already blocks LinkedIn's (#13). The `.jpg` copies stay in the folder to serve them.
- **Linen Works deliberately NOT converted** — measured at 11% saving (`Linen_closeup2`
  just 3%); not worth touching a live site through an unrecorded deploy path (#10).
- Verified in Chrome: all four images load at correct natural dimensions, `image/webp`.
- **Originals correction:** the Linen originals are in `Stock photos Linen Works/pics2.zip`
  (7 files, 12 MB), but the **Concept D originals (`1/2/3`) are not on this machine at
  all** — the in-repo copies are the only ones. Higher-res Concept D art must be
  re-supplied by the owner. The old blanket "originals live in the Desktop stock folder"
  claim was wrong for these three.

### 2026-08-03 — browser verification pass: #11 closed, WAF narrowed, new overflow bug
First session to actually **render** the sites in Chrome rather than reason about the CSS.
That flipped three open items and found one live bug.
- **Open work #11 CLOSED.** The homepage `.stats` mobile fix was verified for real at a
  375px viewport: 1 column, 44px `.stat .n`, "Independent" fits, zero overflow. It had
  only ever been derived from arithmetic before.
- **NEW BUG (Open work #14): `linen-works/about.html` overflows 83px on mobile** — live.
  An **inline** `grid-template-columns:repeat(3,1fr)` on the ESG grid outranked the
  880px media query, so it stayed 3-up on phones with text breaking one word per line.
  Fixed by moving the rule to a `.values-grid-3` class declared before the media query
  (source order wins; no `!important`). Verified at 5 widths, desktop unchanged.
  Committed on branch `fix/about-mobile-overflow` off `main` → **PR #1**. Not merged.
- **Open work #13 NARROWED from "WAF challenges everyone" to "LinkedIn is blocked".**
  Real Chrome loads the site cleanly; Googlebot and facebookexternalhit both get `200`
  (SEO and Facebook cards are safe); **LinkedInBot gets `455`**. Verify with LinkedIn
  Post Inspector, then ask Simply.com to allow-list it. Much smaller problem than logged.
- **Works Group stat-grid overflow concern cleared** — tested at 375px, zero overflow;
  removed from its launch-pass checklist. All 5 Cleaning Works pages also clean.
- Recorded the local-preview technique (PowerShell `HttpListener` + same-origin iframe)
  under Deployment status — the extension blocks `file://` and there is no Node/Python.
- Site files changed: `linen-works/about.html` only, and that lives on the PR branch —
  **this branch's `about.html` still has the bug** until PR #1 merges.

### 2026-08-03 — Linen Works TLS cert resolved; security scan reviewed; WAF noted
- **TLS cert live (closes Open work #8).** Verified `linenworks.dk` now serves a valid
  Let's Encrypt cert (apex + `www`, valid Jul 28 → Oct 26 2026), and `http://` 301s to
  `https://`. The 🔴 top open item is done — a Simply.com control-panel task, no code.
- **Pentest-Tools "Light" scan reviewed** (report PDF in repo root). Overall risk Low:
  4 low + 1 info, all missing-hardening-header / missing-security.txt findings, zero
  actual vulnerabilities. **Owner's call: not actioned** — low-risk on a static site.
  Fixable later via an `.htaccess` (X-Content-Type-Options, HSTS, Referrer-Policy, CSP)
  + `.well-known/security.txt` at the host; two (Referrer-Policy, CSP) could also be
  `<meta>` tags in-repo if wanted.
- **Simply.com WAF observed challenging traffic (new Open work #13).** Post-cert, the
  site returns a WAF interstitial to non-browser clients (455 hard block / 454 JS
  "checking your browser"). Real browsers likely pass; crawlers/social-scrapers may not.
  Possibly tripped by the day's scan. Hosting/WAF matter, not code.
- Docs only — no site files changed.

### 2026-08-03 — Cleaning Works: Concept D promoted to the live pages
- Promoted the approved redesign over the old house-style pages: `_concepts/concept-d-*`
  became `cleaning-works/{index,services,about,contact}.html`; internal `concept-d-*.html`
  links rewritten to plain filenames; photos `1/2/3.jpg` moved up beside the pages.
- Folded in the launch pass (matching the Linen Works 2026-07-28 pass): per-page
  `<meta name="description">`, Open Graph + `twitter:card`, inline-SVG favicon (ink tile,
  ivory "C"), new Concept D–styled **`thanks.html`** (`noindex`), and the contact form's
  `_next` → `https://cleaningworks.dk/thanks.html`. Added a mobile-overflow guard on the
  about-page `.marks` strip (forces 1-col below 880px so "Independent" can't overflow).
- Contact form still POSTs to the shared **`mvzelvvd`** (own form is Open work #12).
  Old `Cleaningtable.jpg` / `Wipingglass.jpg` now unused, left in place. `_concepts/`
  retains only the rejected `concept-c-systematic-grid.html`.
- Not deployed and not merged to `main` — still on branch `cleaning-works-concept-c`.

### 2026-08-03 — Cleaning Works redesign: "Concept D" chosen + carried through
- Explored a fresh Cleaning Works homepage direction because the house style made it
  read as recoloured Linen Works. Built two prototypes in `cleaning-works/_concepts/`:
  `concept-c-systematic-grid.html` (image-free Swiss grid — not chosen) and
  `concept-d-danish-conversion.html` (**CHOSEN by owner**). Concept D borrows the
  conversion structure of Danish cleaning-firm sites (lau-ren.dk, combiservice.dk,
  jacobsens-rengøring.dk): utility bar, sticky header, photo hero + floating quote
  card, commitment strip, icon service grid, numbered 01–04 reasons, eco band, 3-step
  process. **Key divergence:** bold Jost headlines instead of Cormorant serif (see the
  Fonts exception note) — the intended break to differentiate the brand.
- **Honesty held to CLAUDE.md:** no invented stats/stars/certs/client logos (the Danish
  sites lean on all of those); trust signals worded as commitments; eco as a commitment,
  not a Svanemærket badge we don't hold. Reused the approved positioning labels.
- Added + optimised three owner-supplied photos (`1/2/3.jpg`, q82 JPEG, 824 KB → 323 KB;
  hero 525 KB → 72 KB). No ImageMagick/cwebp/Python/Node on the machine — used .NET's
  JPEG encoder (baseline, not progressive; the resize was the win).
- Carried Concept D through to `concept-d-{services,about,contact}.html`, cross-linked
  as a clickable four-page set, real copy from the live pages, working Formspree form
  kept on contact. **Live pages untouched.** Promotion is Open work #12.
- All on branch **`cleaning-works-concept-c`** (not merged to `main`). NOTE for future
  sessions: files kept vanishing from disk this session — the untracked original
  `_concepts/` (concept-a/b) and 6 tracked images were wiped; tracked ones were restored
  from git, the untracked concepts were unrecoverable. Everything new was committed
  promptly to survive it. Root cause (a sync/cleanup tool?) still unknown.

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

### 2026-07-28 — Linen Works went live 🟢
- Merged to `main` (fast-forward, `8714868`) and pushed. `main` now matches the live
  site. Deployed to **Simply.com**; `linenworks.dk` and `www` both resolve to
  `94.231.103.26` and serve the current build.
- **Unresolved at end of session: no TLS certificate.** Browsers show "Not secure".
  Full diagnosis and fix in Open work #8 — it is a Simply.com control-panel task, not
  a code change. This is the first thing to do next session.
- Also outstanding: the form has never been submitted end-to-end (#9), the deploy
  method is unrecorded so the repo may drift from the server (#10), and the mobile
  overflow fix has not been checked on a real phone (#11).
- Shipped deliberately without a CVR number or privacy policy (#6, #7) — owner's call.
- Git note: a repo-local identity was set (`Controols <controols24@gmail.com>`); there
  is still no global git identity on this machine. GitHub credentials are now cached in
  Windows Credential Manager, so pushes no longer need an interactive sign-in.

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
