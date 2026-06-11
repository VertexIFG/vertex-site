import { expect, test } from '@playwright/test'
import { overflowMetrics } from './utils'

const VIEWPORTS = [360, 390, 768, 1280, 1680]

test('no horizontal overflow at any breakpoint or scroll depth', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'viewport sweep runs once on chromium')
  for (const width of VIEWPORTS) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    for (const position of [0, 0.5, 1]) {
      await page.evaluate((p) => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo(0, max * p)
      }, position)
      await page.waitForTimeout(120)
      const metrics = await overflowMetrics(page)
      expect(metrics.scrollWidth, `width ${width} at ${position * 100}% scroll`).toBeLessThanOrEqual(
        metrics.clientWidth + 1,
      )
    }
  }
})

test('mobile header stays usable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chrome', 'mobile project only')
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Vertex Infrastructure Group/i })).toBeVisible()
  const toggle = page.getByRole('button', { name: /Menu/i })
  await expect(toggle).toBeVisible()
  await toggle.click()
  await expect(page.locator('#mobile-menu')).toBeVisible()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Contact' }).click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(page.locator('#mobile-menu')).not.toBeVisible()
})
