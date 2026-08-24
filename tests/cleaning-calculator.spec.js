/* ============================================================
   Cleaning Works price calculator — the §6 regression check.

   kontor · 1.200 m² · 5 dage/uge  →  5.400 · 9.800 · 15.200 kr.

   ⚠️ These numbers come from a PLACEHOLDER pricing model (Open work
   #15). When computePrices() is replaced with the real model this
   test SHOULD fail — update EXPECTED below to the new figures rather
   than deleting the test. Its job is to notice the change, not to
   defend the current numbers.
   ============================================================ */

const { test, expect } = require('@playwright/test');

const EXPECTED = {
  da: { basis: '5.400 kr.', standard: '9.800 kr.', total: '15.200 kr.' },
  en: { basis: 'DKK 5,400', standard: 'DKK 9,800', total: 'DKK 15,200' },
};

/* Both pages that load the calculator. */
const CALC_PAGES = ['index.html', 'niveauer.html'];

async function setInputs(page) {
  await page.locator('#segType button[data-v="1"]').click(); // kontor
  await page.locator('#m2').fill('1200');
  await page.locator('#freq').fill('5');
}

async function readLevels(page) {
  const out = {};
  for (const level of ['basis', 'standard', 'total']) {
    out[level] = (
      await page.locator(`.calc-level[data-level="${level}"] [data-out="amt"]`).innerText()
    ).trim();
  }
  return out;
}

for (const pagePath of CALC_PAGES) {
  test(`calculator · cleaning-works/${pagePath} · da`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/cleaning-works/${pagePath}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready.then(() => true));

    // niveauer.html may render the table without the hero calculator.
    if ((await page.locator('#segType').count()) === 0) test.skip();

    await setInputs(page);
    expect(await readLevels(page)).toEqual(EXPECTED.da);
  });

  test(`calculator · cleaning-works/${pagePath} · da→en reformat`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/cleaning-works/${pagePath}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready.then(() => true));

    if ((await page.locator('#segType').count()) === 0) test.skip();

    await setInputs(page);
    await page.locator('.lang button[data-lang="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    // Same price, different formatting: decimal comma → point, suffix → prefix.
    expect(await readLevels(page)).toEqual(EXPECTED.en);

    await page.locator('.lang button[data-lang="da"]').click();
    expect(await readLevels(page)).toEqual(EXPECTED.da);
  });
}
