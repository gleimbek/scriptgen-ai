import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In development, serve api/generate.js from the Vite dev server so
// `npm run dev` works without the Vercel CLI. In production, Vercel runs
// the same file as a serverless function.
function localApi() {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const request = new Request(`http://localhost${req.originalUrl}`, {
            method: req.method,
            headers: req.headers,
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : Buffer.concat(chunks),
          })

          const mod = await server.ssrLoadModule('/api/generate.js')
          const handler = mod[req.method]
          const response = handler
            ? await handler(request)
            : new Response(JSON.stringify({ error: 'Use POST.' }), { status: 405 })

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (err) {
          console.error(err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Local API crashed. See the terminal.' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load every variable from .env (not only VITE_ ones) for the local API.
  // None of these reach the browser bundle.
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of ['ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL']) {
    if (env[key] && !process.env[key]) process.env[key] = env[key]
  }

  return {
    plugins: [react(), localApi()],
    base: '/',
  }
})
