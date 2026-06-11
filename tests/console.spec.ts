import { expect, test } from '@playwright/test'
import { scrollFullPage } from './utils'

test('full load and scroll round-trip produce zero console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  page.on('pageerror', (error) => {
    errors.push(String(error))
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  await scrollFullPage(page)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(400)

  expect(errors).toEqual([])
})
