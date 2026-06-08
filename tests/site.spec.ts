import { expect, test } from '@playwright/test'

test('renders the Vertex homepage and primary sections', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Vertex Infrastructure Group/)
  await expect(page.getByRole('img', { name: 'Vertex Infrastructure Group' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Vertex Infrastructure Group' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Utility paths installed cleanly/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Branded vehicles/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /A tighter path/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Send the route/i })).toBeVisible()
})

test('loads visual assets without broken images', async ({ page }) => {
  await page.goto('/')

  await expect
    .poll(async () =>
      page.locator('img').evaluateAll((images) =>
        images
          .filter(
            (image) =>
              !(image as HTMLImageElement).complete ||
              (image as HTMLImageElement).naturalWidth < 1,
          )
          .map((image) => (image as HTMLImageElement).src),
      ),
    )
    .toEqual([])
})

test('navigation and contact links are wired', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')

  await page.getByRole('link', { name: 'Capabilities' }).first().click()
  await expect(page).toHaveURL(/#capabilities$/)

  await page.getByRole('link', { name: 'Fleet' }).first().click()
  await expect(page).toHaveURL(/#fleet$/)

  await expect(page.getByRole('link', { name: /support@vertexifg.com/i })).toHaveAttribute(
    'href',
    'mailto:support@vertexifg.com',
  )
  await expect(page.getByRole('link', { name: /\(224\) 531-5731/i }).first()).toHaveAttribute(
    'href',
    'tel:+12245315731',
  )
})

test('mobile header remains usable without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.locator('.site-header')).toBeVisible()
  await expect(page.locator('.header-action')).toBeVisible()

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
})

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
})
