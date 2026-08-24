/* ============================================================
   "Zero console errors" — claimed after every build pass in the
   changelog, now checked instead of eyeballed.

   Also catches broken local asset references: a missing image, CSS
   or script shows up as a failed request against our own server.
   ============================================================ */

const { test, expect } = require('@playwright/test');
const { everyPage, openPage } = require('./sites');

for (const target of everyPage()) {
  test(`console · ${target.site.name}/${target.page} · ${target.lang.code}`, async ({ page }) => {
    const problems = [];

    page.on('pageerror', (err) => problems.push(`uncaught: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') problems.push(`console.error: ${msg.text()}`);
    });
    page.on('requestfailed', (req) => {
      // Only our own files — the Google Fonts CDN is out of our control here.
      if (req.url().startsWith('http://localhost')) {
        problems.push(`failed request: ${req.url()} (${req.failure()?.errorText})`);
      }
    });
    page.on('response', (res) => {
      if (res.url().startsWith('http://localhost') && res.status() >= 400) {
        problems.push(`${res.status()} on ${new URL(res.url()).pathname}`);
      }
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await openPage(page, target);

    expect(problems.join('\n')).toBe('');
  });
}
