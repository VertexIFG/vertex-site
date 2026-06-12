// Prerender every route into static HTML. Runs after the client build:
//   vite build && vite build --ssr src/entry-server.tsx --outDir dist-server && node scripts/prerender.mjs
// Each route gets its rendered markup inside #root (hydrated by main.tsx),
// route-specific head tags, and — for subpages — WebPage/Breadcrumb JSON-LD.
// Also emits dist/404.html, which switches Cloudflare Pages from SPA
// fallback to real 404 statuses for unknown paths.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const { render, ROUTE_HEAD } = await import(path.join(ROOT, 'dist-server/entry-server.js'))

const ORIGIN = 'https://vertexifg.com'
const template = await readFile(path.join(ROOT, 'dist/index.html'), 'utf8')

const swapHead = (html, { title, description, url }) =>
  html
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${description}$2`)

const breadcrumbLd = (name, url) =>
  `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name,
        isPartOf: { '@id': `${ORIGIN}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name, item: url },
        ],
      },
    ],
  })}</script>`

// flat `name.html` files: Cloudflare Pages serves them at /name, and vite
// preview (sirv) resolves them the same way for the local test suite
const ROUTES = [
  { path: '', out: 'index.html' },
  { path: '/safety', out: 'safety.html' },
  { path: '/environment', out: 'environment.html' },
]

for (const route of ROUTES) {
  const markup = render(route.path)
  let html = template.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
  const head = ROUTE_HEAD[route.path]
  if (head) {
    const url = `${ORIGIN}${route.path}`
    html = swapHead(html, { ...head, url })
    html = html.replace('</head>', `${breadcrumbLd(head.title.split(' | ')[0], url)}\n</head>`)
  }
  const outPath = path.join(ROOT, 'dist', route.out)
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  console.log(`prerendered ${route.path || '/'} -> dist/${route.out} (${Math.round(html.length / 1024)}KB)`)
}

// Real 404 page: standalone (no app JS), noindex, brand-styled.
const notFound = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Page Not Found | Vertex Infrastructure Group</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0a0b0d; color: #f4f3f0; font-family: system-ui, -apple-system, sans-serif; }
      main { text-align: center; padding: 24px; }
      h1 { font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 8px; letter-spacing: -0.02em; }
      p { color: #7d8791; margin: 0 0 28px; }
      a { display: inline-block; padding: 14px 28px; background: #e5091b; color: #fff; text-decoration: none; font-weight: 600; }
    </style>
  </head>
  <body>
    <main>
      <h1>404</h1>
      <p>That path was never bored. The page you're looking for doesn't exist.</p>
      <a href="/">Back to vertexifg.com</a>
    </main>
  </body>
</html>
`
await writeFile(path.join(ROOT, 'dist/404.html'), notFound)
console.log('wrote dist/404.html')

await rm(path.join(ROOT, 'dist-server'), { recursive: true, force: true })
