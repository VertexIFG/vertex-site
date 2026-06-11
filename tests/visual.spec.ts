import { expect, test } from '@playwright/test'

// Visual baselines are captured under reduced motion so every animated
// surface (Lenis, reveals, pins, WebGL) resolves to its deterministic
// static state. They are pinned to the PRODUCTION build (sub-pixel layout
// differs slightly under the dev server, which makes cross-env comparisons
// flaky). Update intentionally with:
//   PW_PREVIEW=1 npx playwright test tests/visual.spec.ts --update-snapshots
test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'visual baselines are desktop chromium only')
  test.skip(process.env.PW_PREVIEW !== '1', 'visual baselines compare against the production build')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
})

const SECTIONS = [
  ['hero', '#top'],
  ['capabilities', '#capabilities'],
  ['route-poster', '#route'],
  ['bore-static', '#bore'],
  ['equipment', '#equipment'],
  ['contact', '#contact'],
  ['footer', '.site-footer'],
] as const

for (const [name, selector] of SECTIONS) {
  test(`visual: ${name}`, async ({ page }) => {
    const section = page.locator(selector)
    await section.scrollIntoViewIfNeeded()
    await page.waitForTimeout(350)
    // Element screenshots are scroll-position independent — page-level shots
    // flake by a few pixels under parallel-worker CPU contention.
    await expect(section).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    })
  })
}
