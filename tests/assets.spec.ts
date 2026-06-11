import { expect, test } from '@playwright/test'
import { scrollFullPage } from './utils'

test('no broken images after a full-page scroll', async ({ page }) => {
  await page.goto('/')
  await scrollFullPage(page)
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

test('every img declares explicit width and height', async ({ page }) => {
  await page.goto('/')
  const offenders = await page.locator('img').evaluateAll((images) =>
    images
      .filter((image) => !image.getAttribute('width') || !image.getAttribute('height'))
      .map((image) => (image as HTMLImageElement).src),
  )
  expect(offenders).toEqual([])
})

test('hero is image-free (pure type + vector field)', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero img')).toHaveCount(0)
  await expect(page.locator('.hero-field')).toBeVisible()
})

test('no served image exceeds 250KB', async ({ page }) => {
  const oversized: string[] = []
  page.on('response', async (response) => {
    if (!/image\/(webp|png|jpeg|jpg)/.test(response.headers()['content-type'] ?? '')) return
    try {
      const body = await response.body()
      if (body.byteLength > 250_000) oversized.push(`${response.url()} ${body.byteLength}`)
    } catch {
      // response bodies for cancelled requests are unavailable; ignore
    }
  })
  await page.goto('/')
  await scrollFullPage(page)
  expect(oversized).toEqual([])
})

test('initial JS payload stays under budget on the production build', async ({ page }) => {
  test.skip(process.env.PW_PREVIEW !== '1', 'budget measured against the built output only')
  let jsBytes = 0
  page.on('response', async (response) => {
    if (!/javascript/.test(response.headers()['content-type'] ?? '')) return
    try {
      jsBytes += (await response.body()).byteLength
    } catch {
      /* ignore */
    }
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  // Uncompressed initial JS < 700KB ≈ < 200KB gzip for this stack.
  expect(jsBytes).toBeLessThan(700_000)
})
