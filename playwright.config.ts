import { defineConfig, devices } from '@playwright/test'

// PW_PREVIEW=1 runs the suite against the production build (vite preview)
// instead of the dev server. The final QA gate uses the preview path.
const preview = process.env.PW_PREVIEW === '1'
const port = preview ? 4173 : 5173
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  expect: { timeout: 10_000 },
  webServer: {
    command: preview
      ? `npm run build && npm run preview -- --host 127.0.0.1 --port ${port} --strictPort`
      : `npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI && !preview,
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Headless Chromium needs SwiftShader allowed for software WebGL.
        launchOptions: { args: ['--enable-unsafe-swiftshader'] },
      },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
})
