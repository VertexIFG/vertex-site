import { expect, test } from '@playwright/test'

test('renders the Vertex homepage and primary sections', async ({ page }) => {
  await page.goto('/')

  await expect(page).toHaveTitle(/Vertex Infrastructure Group/)
  await expect(page.getByRole('img', { name: 'Vertex Infrastructure Group' }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: /Precision underground infrastructure/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Utility sectors supported/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Modern Vermeer equipment/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Do it right/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Bring Vertex in early/i })).toBeVisible()
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
  await page.goto('/')

  await page.getByRole('link', { name: 'Services' }).first().click()
  await expect(page).toHaveURL(/#services$/)

  await page.getByRole('link', { name: 'Equipment' }).first().click()
  await expect(page).toHaveURL(/#equipment$/)

  await expect(page.getByRole('link', { name: /Email Vertex/i })).toHaveAttribute(
    'href',
    'mailto:inquiries@directionalboring.org',
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
  await expect(page.getByRole('link', { name: 'Call' })).toBeVisible()

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
})
