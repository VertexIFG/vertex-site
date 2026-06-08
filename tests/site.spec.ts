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

  await expect(page.getByRole('link', { name: /inquiries@vertexifg.com/i })).toHaveAttribute(
    'href',
    'mailto:inquiries@vertexifg.com',
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
  await expect(page.locator('body')).not.toContainText(/support@vertexifg\.com/i)
})

test('local test page renders as a design workbench', async ({ page }) => {
  await page.goto('/test')

  await expect(page.locator('.vertex-nav')).toBeVisible()
  await expect(page.locator('.vertex-mark img')).toHaveAttribute(
    'src',
    '/assets/vertex-logo-wordmark.png',
  )
  await expect(
    page.getByRole('heading', { name: /Utility infrastructure, installed with field precision/i }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: /Underground utility work is won/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Equipment depth for utility work/i })).toBeVisible()
  await expect(page.locator('.bore-hero-section')).toBeVisible()
  await expect(page.locator('.bore-hero-canvas')).toBeVisible()
  await expect(page.locator('.bore-hero-beats')).toHaveCount(0)
  await expect(page.getByText('Below-grade utility infrastructure')).toHaveCount(0)
  await expect(page.getByText('Plan the route before the first cut.')).toHaveCount(0)
  await expect(page.locator('.test-command-panel')).toHaveCount(0)
  await expect(page.locator('.hero-photo')).toHaveCount(0)
  await expect(page.getByRole('img', { name: /Field crew installing/i })).toBeVisible()
  await expect(page.locator('img[src="/assets/dbc-service-truck.jpeg"]')).toBeVisible()
  await expect(page.locator('.equipment-runway img')).toHaveCount(3)
  const inquiryLinks = page.getByRole('link', { name: /inquiries@vertexifg.com/i })
  await expect(inquiryLinks).toHaveCount(2)
  await expect(inquiryLinks.first()).toHaveAttribute('href', 'mailto:inquiries@vertexifg.com')
  await expect(inquiryLinks.nth(1)).toHaveAttribute('href', 'mailto:inquiries@vertexifg.com')
  await expect(page.getByRole('contentinfo')).toContainText('Vertex Infrastructure Group, LLC')
  await expect(page.getByRole('contentinfo')).toContainText('Copyright 2026')
})

test('local test page loads assets and avoids mobile overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/test')

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

  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1)
})

test('below-grade boring animation scrubs on desktop and falls back on mobile motion settings', async ({
  browser,
}) => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto('/test')

  const sectionMetrics = await page.locator('.bore-hero-section').evaluate((section) => {
    const rect = section.getBoundingClientRect()
    return {
      y: rect.top + window.scrollY,
      height: rect.height,
      viewport: window.innerHeight,
    }
  })

  await page.evaluate(
    ({ y, height, viewport }) => window.scrollTo(0, y + (height - viewport) * 0.5),
    sectionMetrics,
  )
  await expect(page.locator('.bore-hero-sticky')).toBeInViewport()

  const canvasHasPixels = await page.locator('.bore-hero-canvas').evaluate((canvas) => {
    const htmlCanvas = canvas as HTMLCanvasElement
    const context = htmlCanvas.getContext('2d')
    if (!context) return false
    const pixels = context.getImageData(
      Math.floor(htmlCanvas.width / 2),
      Math.floor(htmlCanvas.height / 2),
      4,
      4,
    ).data
    return Array.from(pixels).some((value, index) => index % 4 !== 3 && value > 0)
  })
  expect(canvasHasPixels).toBe(true)
  await page.close()

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  })
  await mobile.goto('/test')
  await expect(mobile.locator('.bore-hero-section')).toHaveAttribute('data-static', 'true')
  const mobileMetrics = await mobile.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(mobileMetrics.scrollWidth).toBeLessThanOrEqual(mobileMetrics.clientWidth + 1)
  await mobile.close()
})
