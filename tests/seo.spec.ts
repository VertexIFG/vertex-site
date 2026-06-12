import { expect, test } from '@playwright/test'

// The prerendered HTML must carry full content before any JS runs — this is
// what non-JS crawlers (and most AI crawlers) read. Production build only.
test('prerendered HTML serves full content without JavaScript', async ({ request }) => {
  test.skip(process.env.PW_PREVIEW !== '1', 'prerender exists in the production build only')
  const home = await (await request.get('/')).text()
  expect(home).toContain('Drilling the future, one line at a time')
  expect(home).toContain('VX1150 Hydro Excavation Truck')
  expect(home).toContain('Vermeer D40x55 Navigator')

  const safety = await (await request.get('/safety')).text()
  expect(safety).toContain('<title>Safety Program | Vertex Infrastructure Group</title>')
  expect(safety).toContain('"https://vertexifg.com/safety"')
  expect(safety).toContain('Safety is the job')
  expect(safety).toContain('BreadcrumbList')

  const environment = await (await request.get('/environment')).text()
  expect(environment).toContain('<title>Environmental Practices | Vertex Infrastructure Group</title>')
})

test('sitemap, robots, and llms.txt are served', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain('https://vertexifg.com/safety')

  const robots = await (await request.get('/robots.txt')).text()
  expect(robots).toContain('Sitemap: https://vertexifg.com/sitemap.xml')

  expect((await request.get('/llms.txt')).status()).toBe(200)
})
