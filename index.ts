import homepage from './index.html'

const server = Bun.serve({
  routes: {
    '/': homepage,
  },
  development: true,
})

console.log(`Basecoat dev server running at ${server.url}`)
