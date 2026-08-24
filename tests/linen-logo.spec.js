/* ============================================================
   Linen Works logo pack — the 40px rule.

   The vector pack's READ-ME states the primary (detailed) mark must
   never render below 40px on screen, because the hairline fills in,
   and that the `solid` variant must be used beneath that. The header
   implements this with a <picture media="(max-width:480px)"> swap.

   That rule is invisible in the markup — nothing fails loudly if
   someone "simplifies" the <picture> into a plain <img>. This is the
   test that fails instead. See Assets in CLAUDE.md.
   ============================================================ */

const { test, expect } = require('@playwright/test');
const { SITES, openPage } = require('./sites');

const linen = SITES.find((s) => s.name === 'linen-works');

/* width → which mark must be showing. Solid is exempt from the 40px
   floor; it is the variant that exists precisely for small sizes. */
const CASES = [
  { width: 1280, file: 'logo-mark.svg', minHeight: 40 },
  { width: 900, file: 'logo-mark.svg', minHeight: 40 },
  { width: 600, file: 'logo-mark.svg', minHeight: 40 }, // ≤880 step-down, still 40px
  { width: 481, file: 'logo-mark.svg', minHeight: 40 },
  { width: 480, file: 'logo-mark-solid.svg', minHeight: 0 }, // swap point
  { width: 375, file: 'logo-mark-solid.svg', minHeight: 0 },
  { width: 320, file: 'logo-mark-solid.svg', minHeight: 0 },
];

for (const pagePath of linen.pages) {
  for (const lang of linen.langs) {
    const target = { site: linen, page: pagePath, lang, url: `/${linen.dir}/${pagePath}` };

    test(`logo · linen-works/${pagePath} · ${lang.code}`, async ({ page }) => {
      const header = page.locator('.logo-mark img');
      const failures = [];

      for (const c of CASES) {
        // Load fresh at each width rather than resizing: <picture> re-selects
        // its <source> asynchronously, so a resize-then-read races the swap.
        // A fresh load is also what an actual phone visitor gets.
        await page.setViewportSize({ width: c.width, height: 900 });
        await openPage(page, target);
        await expect(header).toHaveCount(1);

        const seen = await header.evaluate((img) => ({
          src: img.currentSrc || img.src,
          height: Math.round(img.getBoundingClientRect().height),
        }));

        if (!seen.src.endsWith(c.file)) {
          failures.push(`${c.width}px: expected ${c.file}, got ${seen.src.split('/').pop()}`);
        }
        if (c.minHeight && seen.height < c.minHeight) {
          failures.push(`${c.width}px: detailed mark at ${seen.height}px — below the ${c.minHeight}px floor`);
        }
      }

      // The reversed mark carries the charcoal panel that matches --charcoal,
      // so it only works in the footer. Its absence is a visible regression.
      const foot = page.locator('.foot-mark');
      await expect(foot).toHaveCount(1);
      await expect(foot).toHaveAttribute('src', /logo-mark-reversed\.svg$/);

      expect(failures.join('\n')).toBe('');
    });
  }
}
