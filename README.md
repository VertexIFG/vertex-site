# Vertex Infrastructure Group Site

Modern static React site for `vertexifg.com`.

## Stack

- Vite
- React
- TypeScript
- Playwright regression tests

## Local Development

```bash
npm install
npm run dev
```

## QA

```bash
npm run lint
npm run build
npm run test:e2e
```

## Production Build

```bash
npm run build
```

The production output is generated in `dist/` and can be deployed to any static host.

## Deployment

Production is hosted on Cloudflare Pages:

- Project: `vertex-site`
- Production branch: `main`
- Cloudflare Pages URL: `https://vertex-site-doh.pages.dev`
- Custom domains: `https://vertexifg.com`, `https://www.vertexifg.com`

Pushes to `main` run `.github/workflows/deploy-cloudflare-pages.yml`, which installs dependencies, lints, builds, and deploys `dist/` to Cloudflare Pages using GitHub Actions secrets.

## Brand Notes

The site presents Vertex Infrastructure Group as a horizontal directional drilling contractor for:

- Fiber optic
- Gas
- Electric
- Water

The primary contact details retained from the existing site are:

- `inquiries@directionalboring.org`
- `(224) 531-5731`
- `14729 Spring Valley Road, Morrison IL, 61270`
