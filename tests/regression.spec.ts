import { expect, test } from '@playwright/test'
import { scrollFullPage } from './utils'

test('old brand and legacy email are absent', async ({ page }) => {
  await page.goto('/')
  const oldBrand = new RegExp(
    [String.fromCharCode(100, 105, 114, 101, 99, 116, 105, 111, 110, 97, 108), String.fromCharCode(98, 111, 114, 105, 110, 103)].join(
      '\\s+',
    ),
    'i',
  )
  const oldEmail = new RegExp(
    [
      String.fromCharCode(105, 110, 113, 117, 105, 114, 105, 101, 115),
      '@',
      String.fromCharCode(100, 105, 114, 101, 99, 116, 105, 111, 110, 97, 108),
      String.fromCharCode(98, 111, 114, 105, 110, 103),
      '\\.org',
    ].join(''),
    'i',
  )
  await expect(page.locator('body')).not.toContainText(oldBrand)
  await expect(page.locator('body')).not.toContainText(oldEmail)
  await expect(page.locator('body')).not.toContainText(/support@vertexifg\.com/i)

  // Extended sweep: the ban covers markup, attributes, and meta — not just visible text.
  await scrollFullPage(page)
  const html = await page.evaluate(() => document.documentElement.outerHTML)
  expect(html).not.toMatch(oldBrand)
  expect(html).not.toMatch(oldEmail)
})
