// Image optimization pipeline. Originals live in assets-src/ (the design
// source of truth); optimized derivatives are written to public/assets/.
// Run: npm run optimize:images
import { copyFile, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC = path.join(ROOT, 'assets-src')
const OUT = path.join(ROOT, 'public', 'assets')

const ORIGINALS = [
  'dbc-field-truck.jpg',
  'dbc-mixing-system.png',
  'dbc-service-truck.jpeg',
  'dbc-vac-excavator.png',
  'dbc-vermeer-drill.png',
  'vertex-logo-wide.png',
  'vertex-logo-wordmark.png',
  'vertex-logo.png',
  'vertex-truck-1.webp',
  'vertex-truck-2.webp',
  'vertex-truck-3.webp',
  'vertex-truck-4.webp',
]

// Park originals in assets-src (first run only; public copies get pruned later).
await mkdir(SRC, { recursive: true })
for (const name of ORIGINALS) {
  const parked = path.join(SRC, name)
  const live = path.join(OUT, name)
  if (!existsSync(parked) && existsSync(live)) await copyFile(live, parked)
}

const KB = (bytes) => `${Math.round(bytes / 1024)}KB`
const results = []

// Nav wordmark from the real brand lockup (trimmed, white ground)
for (const width of [320, 480]) {
  const out = path.join(OUT, `vertex-wordmark-${width}.webp`)
  await sharp(path.join(SRC, 'vertex-logo-wordmark.png'))
    .trim()
    .resize({ width })
    .webp({ quality: 90, effort: 6 })
    .toFile(out)
  results.push([path.basename(out), (await stat(out)).size])
}

// Equipment cutouts (small studio images; keep native size, high quality)
for (const name of ['dbc-vermeer-drill', 'dbc-mixing-system', 'dbc-vac-excavator']) {
  const out = path.join(OUT, `${name}.webp`)
  await sharp(path.join(SRC, `${name}.png`)).webp({ quality: 88, effort: 6 }).toFile(out)
  results.push([path.basename(out), (await stat(out)).size])
}

// Favicons from the red V mark (square crop of the 2048px logo lockup)
const V_MARK = { left: 610, top: 350, width: 820, height: 820 }
for (const [name, size] of [
  ['favicon-32.png', 32],
  ['favicon-64.png', 64],
  ['apple-touch-icon.png', 180],
]) {
  const out = path.join(OUT, name)
  await sharp(path.join(SRC, 'vertex-logo.png'))
    .extract(V_MARK)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(out)
  results.push([name, (await stat(out)).size])
}

// Social card: 1200x630 cover crop of the dusk hero, slightly darkened
{
  const out = path.join(OUT, 'og-image.jpg')
  await sharp(path.join(SRC, 'vertex-truck-2.webp'))
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .modulate({ brightness: 0.92 })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out)
  results.push(['og-image.jpg', (await stat(out)).size])
}

let failed = false
const BUDGETS = [
  [/^vertex-truck-2-1800/, 190_000],
  [/^vertex-truck-4-1600/, 160_000],
  [/\.webp$/, 250_000],
  [/og-image/, 160_000],
  [/favicon|apple-touch/, 40_000],
]
for (const [name, size] of results) {
  const budget = BUDGETS.find(([re]) => re.test(name))?.[1] ?? 250_000
  const over = size > budget
  if (over) failed = true
  console.log(`${over ? 'OVER ' : 'ok   '}${name.padEnd(34)}${KB(size)}${over ? ` > budget ${KB(budget)}` : ''}`)
}
if (failed) {
  console.error('\nOne or more outputs exceed budget.')
  process.exit(1)
}
