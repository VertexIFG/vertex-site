// Canonical host: 301 www -> apex. Runs on Cloudflare Pages Functions.
export async function onRequest({ request, next }) {
  const url = new URL(request.url)
  if (url.hostname === 'www.vertexifg.com') {
    url.hostname = 'vertexifg.com'
    return Response.redirect(url.toString(), 301)
  }
  return next()
}
