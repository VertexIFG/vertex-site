import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop navigation only')
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
})

test('header anchors scroll to their sections and update the hash', async ({ page }) => {
  await page.getByRole('link', { name: 'Services' }).first().click()
  await expect(page).toHaveURL(/#capabilities$/)
  await expect
    .poll(async () => page.locator('#capabilities').evaluate((el) => el.getBoundingClientRect().top))
    .toBeLessThan(400)

  await page.getByRole('link', { name: /Start a Project/i }).first().click()
  await expect(page).toHaveURL(/#contact$/)
})

test('safety nav link opens the /safety page and links back home', async ({ page }) => {
  await page.getByRole('link', { name: 'Safety', exact: true }).first().click()
  await expect(page).toHaveURL(/\/safety$/)
  await expect(page.getByRole('heading', { level: 1, name: /Safety is the job/i })).toBeVisible()
  await expect(page.getByText(/Weekly tailgate meetings/i)).toBeAttached()
  // anchors resolve back to the home page from here
  await expect(page.getByRole('link', { name: 'Services' }).first()).toHaveAttribute(
    'href',
    '/#capabilities',
  )
})

test('environment nav link opens the /environment page', async ({ page }) => {
  await page.getByRole('link', { name: 'Environment', exact: true }).first().click()
  await expect(page).toHaveURL(/\/environment$/)
  await expect(page.getByRole('heading', { level: 1, name: /Light on the land/i })).toBeVisible()
  await expect(page.getByText(/inadvertent returns/i)).toBeAttached()
})

test('skip link appears on focus and jumps to main content', async ({ page }) => {
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: /Skip to content/i })
  await expect(skip).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('keyboard order reaches brand, nav links, and CTA in sequence', async ({ page }) => {
  const expected = [
    /Skip to content/i,
    /Vertex Infrastructure Group/i,
    /Services/i,
    /Equipment/i,
    /Safety/i,
    /Environment/i,
    /Start a Project/i,
  ]
  for (const name of expected) {
    await page.keyboard.press('Tab')
    const label = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null
      return el?.getAttribute('aria-label') ?? el?.textContent ?? ''
    })
    expect(label).toMatch(name)
  }
})
