import { expect, test } from '@playwright/test'

test('document title, meta description, and og tags are correct', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Vertex Infrastructure Group | Horizontal Directional Drilling')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /horizontal directional drilling/i,
  )
  await expect(page.locator('meta[name="keywords"]')).toHaveAttribute(
    'content',
    /trenchless utility installation/i,
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vertexifg.com/')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Vertex Infrastructure Group | Horizontal Directional Drilling',
  )
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    'content',
    /fiber, gas, electric, water, and sewer/i,
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://vertexifg.com/assets/og-image.jpg',
  )
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200')
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630')
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://vertexifg.com/')
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
    'content',
    'https://vertexifg.com/assets/og-image.jpg',
  )
  const schema = await page.locator('script[type="application/ld+json"]').textContent()
  expect(JSON.parse(schema || '{}')).toMatchObject({
    '@type': 'LocalBusiness',
    name: 'Vertex Infrastructure Group, LLC',
    url: 'https://vertexifg.com/',
    email: 'inquiries@vertexifg.com',
  })
})

test('hero renders the brand claim and primary CTA in the divot', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('heading', { level: 1, name: /Drilling the future, one line at a time/i }),
  ).toBeVisible()
  const cta = page.locator('.hero-cta').getByRole('link', { name: /Start a Project/i })
  await expect(cta).toHaveAttribute('href', '#contact')
})

test('all chapters render with their headings', async ({ page }) => {
  await page.goto('/')
  for (const name of [
    /Every line needs a path/i,
    /Engineered before we ever arrive/i,
    /Below grade, by design/i,
    /Machines that don.t stall/i,
    /We show up organized/i,
    /never wonder what happened on your project/i,
    /The safest dig is the one that never happens/i,
    /Tell us about your project/i,
  ]) {
    await expect(page.getByRole('heading', { name })).toBeVisible()
  }
})

test('equipment chapter lists the Vermeer fleet with corrected MX300 label', async ({ page }) => {
  await page.goto('/')
  const expected = [/Vermeer D24x40 S3/i, /Vermeer MX300 Mixing System/i, /Vermeer VX50 Vacuum Excavator/i]
  for (const [index, name] of expected.entries()) {
    await page.locator('.equipment-row').nth(index).scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { name })).toBeVisible()
  }
  await expect(page.locator('body')).not.toContainText(/MX150/i)
})

test('contact details are wired exactly', async ({ page }) => {
  await page.goto('/')
  const mailLinks = page.getByRole('link', { name: /inquiries@vertexifg\.com/i })
  await expect(mailLinks.first()).toHaveAttribute('href', 'mailto:inquiries@vertexifg.com')
  const telLinks = page.getByRole('link', { name: /\(224\) 531-5731/i })
  await expect(telLinks.first()).toHaveAttribute('href', 'tel:+12245315731')
  await expect(page.locator('#contact')).toContainText('14729 Spring Valley Road, Morrison IL 61270')
})

test('contact form posts natively to FormSubmit with full config', async ({ page }) => {
  await page.goto('/')
  const form = page.getByRole('form', { name: /Project inquiry/i })
  await expect(form).toHaveAttribute('action', 'https://formsubmit.co/inquiries@vertexifg.com')
  await expect(form).toHaveAttribute('method', /post/i)
  for (const label of ['Name', 'Company', 'Email', 'Phone', 'Utility type', 'Project location']) {
    await expect(form.getByLabel(label, { exact: false }).first()).toBeAttached()
  }
  await expect(form.getByRole('button', { name: /Send Inquiry/i })).toBeAttached()
  await expect(form.locator('input[name="_subject"]')).toBeAttached()
  await expect(form.locator('input[name="_captcha"]')).toHaveValue('false')
  // _next must resolve to an absolute return URL on the serving host
  await expect(form.locator('input[name="_next"]')).toHaveValue(/^http.+\?sent=1#contact$/)
})

test('contact form round-trip: POST delivers and the return URL shows confirmation', async ({
  page,
  baseURL,
}) => {
  // Intercept the delivery POST (never send real email) and answer with the
  // same redirect FormSubmit performs after processing.
  let posted = false
  await page.route('**/formsubmit.co/**', async (route) => {
    posted = route.request().method() === 'POST'
    await route.fulfill({ status: 302, headers: { location: `${baseURL}/?sent=1#contact` } })
  })
  await page.goto('/')
  const form = page.getByRole('form', { name: /Project inquiry/i })
  await form.scrollIntoViewIfNeeded()
  await form.getByLabel('Name').fill('Test Owner')
  await form.getByLabel('Email').fill('owner@example.com')
  await form.getByRole('button', { name: /Send Inquiry/i }).click()
  await expect(page.getByRole('status')).toContainText(/Request received/i)
  expect(posted).toBe(true)
  // the sent flag is cleaned from the URL after rendering the confirmation
  await expect.poll(() => page.url()).not.toContain('sent=1')
})

test('footer carries the legal name, copyright, and contact', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await expect(footer).toContainText('Vertex Infrastructure Group, LLC')
  await expect(footer).toContainText(/© 2026/)
  await expect(footer.getByRole('link', { name: /inquiries@vertexifg\.com/i })).toBeAttached()
})
