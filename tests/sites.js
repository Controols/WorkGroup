/* ============================================================
   The three sites, their pages, and the widths every sweep runs.

   One place to edit when a page is added or renamed. Keep this in
   step with the "Site structure & pages" section of CLAUDE.md.
   ============================================================ */

/* 320 → 1440. Covers the shared 880px breakpoint, Linen's 480px
   header step-down, and all four Cleaning Works breakpoints
   (980 / 700 / 600 / 480). */
const WIDTHS = [320, 360, 375, 390, 414, 480, 600, 700, 768, 880, 980, 1024, 1280, 1440];

const SITES = [
  {
    name: 'linen-works',
    dir: 'linen-works',
    pages: ['index.html', 'uniforms-laundry.html', 'about.html', 'contact.html', 'thanks.html'],
    // Danish is the served default; English is set via localStorage before load.
    langs: [
      { code: 'da', storage: null },
      { code: 'en', storage: { key: 'lw-lang', value: 'en' } },
    ],
  },
  {
    name: 'cleaning-works',
    dir: 'cleaning-works',
    pages: ['index.html', 'ydelser.html', 'niveauer.html', 'om-os.html', 'job.html', 'kontakt.html', 'tak.html'],
    langs: [
      { code: 'da', storage: null },
      { code: 'en', storage: { key: 'cw-lang', value: 'en' } },
    ],
  },
  {
    name: 'works-group',
    dir: 'works-group',
    pages: ['index.html'],
    langs: [{ code: 'en', storage: null }], // English-only, no toggle
  },
];

/* Every (site, page, lang) triple, flattened — the unit each sweep tests. */
function everyPage() {
  const out = [];
  for (const site of SITES) {
    for (const page of site.pages) {
      for (const lang of site.langs) {
        out.push({ site, page, lang, url: `/${site.dir}/${page}` });
      }
    }
  }
  return out;
}

/* Seeds the language choice before any page script runs, then loads the page
   and waits for web fonts. Fonts matter: they change min-content width, and a
   measurement taken before they land reports false clean — that is how the
   320px about.html overflow survived the 2026-08-20 pass (CLAUDE.md #20). */
async function openPage(page, target) {
  if (target.lang.storage) {
    await page.addInitScript(
      ([k, v]) => { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
      [target.lang.storage.key, target.lang.storage.value],
    );
  }
  await page.goto(target.url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready.then(() => true));
}

module.exports = { SITES, WIDTHS, everyPage, openPage };
