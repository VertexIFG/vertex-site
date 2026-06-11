import type { Page } from '@playwright/test'

/** Scroll the full page in viewport-sized steps so lazy images load, then settle. */
export async function scrollFullPage(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8
    const max = () => document.documentElement.scrollHeight - window.innerHeight
    for (let y = 0; y <= max(); y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, max())
    await new Promise((resolve) => setTimeout(resolve, 200))
  })
}

export async function overflowMetrics(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
}
