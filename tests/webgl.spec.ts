import { expect, test } from '@playwright/test'

test('route chapter resolves to webgl scene or poster fallback', async ({ page }) => {
  await page.goto('/')
  const section = page.locator('#route')
  await expect(section).toHaveAttribute('data-scene-mode', /webgl|poster/)

  const mode = await section.getAttribute('data-scene-mode')
  if (mode === 'webgl') {
    await section.scrollIntoViewIfNeeded()
    const canvas = page.locator('.route3d-canvas canvas')
    await expect(canvas).toBeVisible()
    const sizeOk = await canvas.evaluate(
      (el) => (el as HTMLCanvasElement).width > 0 && (el as HTMLCanvasElement).height > 0,
    )
    expect(sizeOk).toBe(true)
  } else {
    await expect(page.locator('.route-static-svg')).toBeVisible()
  }
})

test('poster fallback always renders under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('#route')).toHaveAttribute('data-scene-mode', 'poster')
  await expect(page.locator('.route-static-svg')).toBeVisible()
})

test('three.js chunk loads lazily, never in the initial payload', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'desktop webgl only')
  const sceneRequests: string[] = []
  page.on('request', (request) => {
    if (/RouteScene3D|three/i.test(request.url())) sceneRequests.push(request.url())
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  expect(sceneRequests, 'scene chunk must not load at the hero').toEqual([])

  const mode = await page.locator('#route').getAttribute('data-scene-mode')
  test.skip(mode !== 'webgl', 'environment fell back to poster; lazy check not applicable')

  await page.locator('#capabilities').scrollIntoViewIfNeeded()
  await expect.poll(() => sceneRequests.length, { timeout: 15_000 }).toBeGreaterThan(0)
})
