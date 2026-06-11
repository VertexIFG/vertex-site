import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { scrollFullPage } from './utils'

test('axe reports no serious or critical violations', async ({ page }) => {
  await page.goto('/')
  await scrollFullPage(page)
  const results = await new AxeBuilder({ page }).analyze()
  const blocking = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  )
  expect(
    blocking.map((violation) => `${violation.id}: ${violation.nodes.map((n) => n.target).join(' | ')}`),
  ).toEqual([])
})

test('heading hierarchy has no skipped levels', async ({ page }) => {
  await page.goto('/')
  const levels = await page.evaluate(() =>
    [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((el) => Number(el.tagName[1])),
  )
  expect(levels[0]).toBe(1)
  expect(levels.filter((level) => level === 1)).toHaveLength(1)
  for (let i = 1; i < levels.length; i += 1) {
    expect(levels[i] - levels[i - 1], `heading #${i} jumps from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1)
  }
})

test('landmarks: one main, one banner header, one contentinfo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('main')).toHaveCount(1)
  await expect(page.getByRole('banner')).toHaveCount(1)
  await expect(page.getByRole('contentinfo')).toHaveCount(1)
})
