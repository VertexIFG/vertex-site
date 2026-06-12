/**
 * Current route path, normalized (no trailing slash; home is '').
 * Works in the browser and during prerendering, where the server entry
 * sets __SSR_PATH__ before each renderToString pass.
 */
export function currentPath(): string {
  if (typeof window !== 'undefined') return window.location.pathname.replace(/\/$/, '')
  return ((globalThis as Record<string, unknown>).__SSR_PATH__ as string | undefined) ?? ''
}
