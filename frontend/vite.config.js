import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Mirror Cloudflare Pages routing locally:
//  - clean URLs: /about -> /about.html when that static file exists
//  - SPA app routes -> the clean app.html shell (preview only, where it exists),
//    matching public/_redirects so /dashboard never flashes the prerendered home
// Without this the SPA fallback hijacks these paths and React Router redirects to "/".
const APP_ROUTES = ['/dashboard', '/login', '/profile']

function cleanUrlStaticPages() {
  const makeMiddleware = ({ publicDir, outDir }) => (req, _res, next) => {
    const url = req.url || ''
    const [urlPath, query] = url.split('?')
    const q = query ? `?${query}` : ''
    if (urlPath !== '/' && !urlPath.includes('.')) {
      const clean = urlPath.replace(/\/+$/, '')
      // App routes -> app.html (only if the built shell exists, i.e. preview).
      if (APP_ROUTES.includes(clean) && outDir && fs.existsSync(path.join(outDir, 'app.html'))) {
        req.url = `/app.html${q}`
      } else if (clean) {
        // Static content pages (privacy, terms, about, contact) via clean URL.
        const file = path.join(publicDir, `${clean.slice(1)}.html`)
        if (fs.existsSync(file)) req.url = `${clean}.html${q}`
      }
    }
    next()
  }
  return {
    name: 'clean-url-static-pages',
    configureServer(server) {
      server.middlewares.use(makeMiddleware({ publicDir: server.config.publicDir }))
    },
    configurePreviewServer(server) {
      const cfg = server.config
      const outDir = path.resolve(cfg.root, cfg.build.outDir)
      server.middlewares.use(makeMiddleware({ publicDir: cfg.publicDir, outDir }))
    },
  }
}

export default defineConfig({
  plugins: [react(), cleanUrlStaticPages()],
  // For the build-time SSR pass (scripts/prerender.mjs) bundle the router so
  // its named exports resolve cleanly instead of hitting CJS interop errors.
  ssr: {
    noExternal: ['react-router-dom', 'react-router'],
  },
})
