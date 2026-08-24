/* ============================================================
   Horizontal-overflow sweep — every page, every width, both languages.

   This is the check that was hand-rolled three times (35/35 on
   2026-08-20, 63/63 and 110/110 on 2026-08-24) by injecting a
   same-origin iframe and reading scrollWidth from the console.

   Two things it does that the manual version didn't:
     · waits for document.fonts.ready before measuring (see sites.js)
     · names the element causing the overflow, so a failure points at
       the CSS instead of starting a devtools bisect
   ============================================================ */

const { test, expect } = require('@playwright/test');
const { WIDTHS, everyPage, openPage } = require('./sites');

/* Runs in the browser. Returns null when the page fits. */
function probeOverflow() {
  const doc = document.documentElement;
  const clientWidth = doc.clientWidth;
  const over = doc.scrollWidth - clientWidth;
  if (over <= 0) return null;

  const sticking = [...document.querySelectorAll('body *')].filter((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) return false; // hidden
    return r.right > clientWidth + 0.5;
  });

  // An element inside an offending parent is a symptom, not the cause.
  const outermost = sticking.filter((el) => !sticking.some((o) => o !== el && o.contains(el)));

  return {
    over,
    scrollWidth: doc.scrollWidth,
    clientWidth,
    culprits: outermost
      .map((el) => {
        const r = el.getBoundingClientRect();
        const cls =
          typeof el.className === 'string' && el.className.trim()
            ? '.' + el.className.trim().split(/\s+/).join('.')
            : '';
        return {
          sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + cls,
          past: Math.round(r.right - clientWidth),
          text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48),
        };
      })
      .sort((a, b) => b.past - a.past)
      .slice(0, 5),
  };
}

function describeFailures(failures) {
  return (
    '\nHorizontal overflow:\n' +
    failures
      .map(
        (f) =>
          `  ${f.width}px — ${f.over}px past the viewport ` +
          `(scrollWidth ${f.scrollWidth} > clientWidth ${f.clientWidth})\n` +
          f.culprits.map((c) => `       ${c.sel}  +${c.past}px  "${c.text}"`).join('\n'),
      )
      .join('\n') +
    '\n'
  );
}

for (const target of everyPage()) {
  test(`overflow · ${target.site.name}/${target.page} · ${target.lang.code}`, async ({ page }) => {
    await page.setViewportSize({ width: WIDTHS[0], height: 900 });
    await openPage(page, target);

    const failures = [];
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      const result = await page.evaluate(probeOverflow);
      if (result) failures.push({ width, ...result });
    }

    expect(failures.length === 0 ? '' : describeFailures(failures)).toBe('');
  });
}
