/* eslint-disable react-refresh/only-export-components -- build-time SSR entry, not a component module */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

export { ROUTE_HEAD } from './lib/routeHead'

/** Render one route to static HTML. `path` is normalized (home is ''). */
export function render(path: string): string {
  ;(globalThis as Record<string, unknown>).__SSR_PATH__ = path
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
