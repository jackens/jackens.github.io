export const serve = (port: number) => Bun.serve({
  port,

  fetch: async req => {
    const path = new URL(req.url).pathname

    return new Response(Bun.file('.' + path + (path.endsWith('/') ? 'index.html' : '')))
  }
})
