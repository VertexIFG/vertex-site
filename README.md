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

Production deploys are currently disabled while the site is being redesigned.

Previous production hosting was Cloudflare Pages:

- Project: `vertex-site`
- Production branch: `main`
- Cloudflare Pages URL: `https://vertex-site-doh.pages.dev`
- Custom domains were detached from Cloudflare Pages on 2026-06-08.

The old deploy workflow is parked at `docs/deployment/deploy-cloudflare-pages.yml.disabled`. Move it back to `.github/workflows/deploy-cloudflare-pages.yml` only when the site is approved to go live again.

## Brand Notes

The site presents Vertex Infrastructure Group as a trenchless utility infrastructure contractor for:

- Fiber optic
- Gas
- Electric
- Water

The primary contact details retained from the existing site are:

- `support@vertexifg.com`
- `(224) 531-5731`
- `14729 Spring Valley Road, Morrison IL, 61270`
