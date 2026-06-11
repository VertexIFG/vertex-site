import { expect, test } from '@playwright/test'
import { scrollFullPage } from './utils'

test('smooth scroll engine is active when motion is allowed', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop motion only')
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/lenis/)
})

test('reduced motion: no smooth-scroll engine, all content readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('html')).not.toHaveClass(/lenis/)

  await scrollFullPage(page)
  // The classic failure mode: reveal animations never run and leave content
  // hidden. Every heading must be fully opaque and visible.
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('main h2, main h3, [data-reveal]')]
      .map((el) => ({
        text: (el.textContent ?? '').slice(0, 40),
        opacity: getComputedStyle(el).opacity,
        visibility: getComputedStyle(el).visibility,
      }))
      .filter((item) => Number(item.opacity) < 0.99 || item.visibility === 'hidden'),
  )
  expect(hidden).toEqual([])
})

test('bore chapter scrubs while pinned on desktop: line draws with scroll', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'pin runs on desktop only')
  await page.goto('/')
  await expect(page.locator('#bore')).toHaveAttribute('data-static', 'false')

  // pin-spacer wraps the section once ScrollTrigger initializes
  await expect(page.locator('.pin-spacer:has(#bore)')).toHaveCount(1)

  const drawnFraction = async (selector: string) =>
    page.locator(selector).evaluate((el) => {
      const path = el as SVGPathElement
      const total = path.getTotalLength()
      const offset = Number.parseFloat(getComputedStyle(path).strokeDashoffset) || 0
      return 1 - Math.abs(offset) / total
    })

  // before the pin: nothing is drilled
  expect(await drawnFraction('.bore-pilot')).toBeLessThan(0.05)

  // mid pass 1: the pilot bore is partially drilled and the head is out front
  await page.evaluate(() => {
    const spacer = document.querySelector('.pin-spacer:has(.bore-section)') as HTMLElement
    const top = spacer.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top + window.innerHeight * 0.9)
  })
  await page.waitForTimeout(700)
  const mid = await drawnFraction('.bore-pilot')
  expect(mid).toBeGreaterThan(0.1)
  expect(mid).toBeLessThan(0.98)
  await expect(page.locator('.bore-head')).toBeVisible()

  // end of pin: fully drilled, closeout stamp shown
  await page.evaluate(() => {
    const spacer = document.querySelector('.pin-spacer:has(.bore-section)') as HTMLElement
    const top = spacer.getBoundingClientRect().top + window.scrollY
    window.scrollTo(0, top + window.innerHeight * 2.62)
  })
  await page.waitForTimeout(700)
  expect(await drawnFraction('.bore-line:not(.bore-line-glow)')).toBeGreaterThan(0.97)
  await expect.poll(() => page.locator('.bore-stamp').evaluate((el) => getComputedStyle(el).opacity)).not.toBe('0')
})

test('bore chapter is static on mobile with the full scene drawn', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chrome', 'mobile fallback only')
  await page.goto('/')
  await expect(page.locator('#bore')).toHaveAttribute('data-static', 'true')
  await page.locator('#bore').scrollIntoViewIfNeeded()
  await page.waitForTimeout(300)
  const drawn = await page.locator('.bore-line:not(.bore-line-glow)').evaluate((el) => {
    const path = el as SVGPathElement
    const offset = Number.parseFloat(getComputedStyle(path).strokeDashoffset) || 0
    return 1 - Math.abs(offset) / path.getTotalLength()
  })
  expect(drawn).toBeGreaterThan(0.97)
  await expect(page.locator('.bore-stamp')).toBeVisible()
})

test('bore chapter is static under reduced motion with no pin', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'one project is enough')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('#bore')).toHaveAttribute('data-static', 'true')
  await expect(page.locator('.pin-spacer')).toHaveCount(0)
})

test('motion path: revealed content reaches full opacity after scroll', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop motion only')
  await page.goto('/')
  await scrollFullPage(page)
  await page.waitForTimeout(900)
  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')]
      .map((el) => ({
        cls: el.className,
        opacity: getComputedStyle(el).opacity,
      }))
      .filter((item) => Number(item.opacity) < 0.99),
  )
  expect(hidden).toEqual([])
})
