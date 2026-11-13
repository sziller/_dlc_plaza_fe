// vite.config.mjs
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import pkg from './package.json'

// ---------------------------------------------------------------------------
// Dev-server backend routing (applies to `npm run dev` only; never to builds).
//
// The browser always talks to http://localhost:3000 (config.ts keeps API_URL empty in
// dev), and this proxy forwards to the backend named below. Settings are read from
// .env.development.local (git-ignored) or the shell. They have no VITE_ prefix on
// purpose, so they are never exposed to browser code. See LOCAL_DEVELOPMENT.md.
//
//   DLCP_BACKEND_URL    FastAPI backend for /app        (default http://127.0.0.1:8000)
//   DLCP_FUNCTIONS_URL  Vercel-style /api + /webhook    (default http://127.0.0.1:3001)
//
// Safety: there is NO fallback. A non-loopback target is refused unless
// DLCP_ALLOW_REMOTE_BACKEND=1 is set explicitly, and an unreachable target answers 502
// with a message naming it - it never reroutes to another backend.
// ---------------------------------------------------------------------------
const LOOPBACK = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

function resolveTarget(name, value, allowRemote) {
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error(`[dev-proxy] ${name}="${value}" is not a valid URL`)
  }
  if (!LOOPBACK.has(url.hostname) && !allowRemote) {
    throw new Error(
      `[dev-proxy] ${name} points to non-local host "${url.hostname}". ` +
        'Refusing: local development must not use a deployed backend. ' +
        'Set DLCP_ALLOW_REMOTE_BACKEND=1 only if that is really intended.'
    )
  }
  return url.origin
}

function devProxy(target, label) {
  return {
    target,
    changeOrigin: true,
    ws: true,
    configure(proxy) {
      proxy.on('error', (err, req, res) => {
        const msg = `${label} unreachable at ${target} (${err.code || err.message}) for ${req.method} ${req.url}`
        console.error(`\x1b[31m[dev-proxy] ${msg}\x1b[0m`)
        if (res && typeof res.writeHead === 'function' && !res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ detail: msg }))
        }
      })
    },
  }
}

// ---------------------------------------------------------------------------
// Local-development isolation (applies to `npm run dev` ONLY - `vite build` is untouched:
// there every constant below is true and no HTML is rewritten).
//
// A developer machine must not feed production analytics or fire production CRM / Slack /
// newsletter / e-mail / checkout calls, regardless of which git-ignored .env files exist.
//   - Analytics (Umami, GTM/GA, X pixel in index.html; Amplitude in main.js) are removed.
//     Opt back in with DLCP_ENABLE_ANALYTICS=1.
//   - External WRITES (Attio CRM, Slack alerts, collateral e-mail, Kit subscribe, book
//     checkout via the deployed Vercel project) are neutralised: VITE_BOOK_API and the Slack
//     webhook are forced empty, and `__EXTERNAL_WRITES__` is false. Opt back in with
//     DLCP_ALLOW_EXTERNAL_WRITES=1 (uses the values from your .env files).
// Read-only third-party fetches (price feeds, fonts, oracle lookups) and the chatbot stay on.
// ---------------------------------------------------------------------------
const ANALYTICS_MARKERS = [
  'cloud.umami.is',               // Umami
  'googletagmanager.com/gtag/js', // GTM / GA loader
  'window.dataLayer',             // GA inline config
  'static.ads-twitter.com/uwt.js', // X / Twitter pixel
]

function stripAnalytics(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (tag) =>
      ANALYTICS_MARKERS.some((m) => tag.includes(m)) ? '' : tag
    )
    // connection hints to the same vendors would still open sockets to them
    .replace(
      /<link\b[^>]*\bhref="https:\/\/(?:www\.googletagmanager\.com|plausible\.io|static\.ads-twitter\.com)\/?"[^>]*>/g,
      ''
    )
}

function localDevOptions(isDevServer, env) {
  const isServe = isDevServer
  const analytics = !isServe || env.DLCP_ENABLE_ANALYTICS === '1'
  const externalWrites = !isServe || env.DLCP_ALLOW_EXTERNAL_WRITES === '1'
  const define = {
    __ANALYTICS_ENABLED__: JSON.stringify(analytics),
    __EXTERNAL_WRITES__: JSON.stringify(externalWrites),
  }
  if (!externalWrites) {
    define['import.meta.env.VITE_BOOK_API'] = '""'
    define['import.meta.env.VITE_SLACK_COLLATERAL_WEBHOOK_URL'] = '""'
  }
  const plugins = analytics
    ? []
    : [{ name: 'dev-strip-analytics', apply: 'serve', transformIndexHtml: stripAnalytics }]
  if (isServe) {
    console.log(
      `[dev-isolation] analytics ${analytics ? 'ENABLED' : 'off'}, external writes ${externalWrites ? 'ENABLED' : 'off'}`
    )
  }
  return { define, plugins }
}

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // The dev server only. `vite preview` (used by scripts/prerender.mjs during release builds)
  // and `vite build` keep their previous behaviour byte for byte.
  const isDevServer = command === 'serve' && !isPreview
  const dev = localDevOptions(isDevServer, env)
  const allowRemote = env.DLCP_ALLOW_REMOTE_BACKEND === '1'
  let proxy
  if (isPreview) {
    // Unchanged from before: scripts/prerender.mjs renders against `vite preview`, whose proxy
    // defaults to this one. Do not repoint it without re-validating the release prerender.
    proxy = {
      '/app': { target: 'https://staging.purabitcoin.com', changeOrigin: true },
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/webhook': { target: 'http://localhost:3001', changeOrigin: true },
    }
  } else if (isDevServer) {
    const backend = resolveTarget('DLCP_BACKEND_URL', env.DLCP_BACKEND_URL || 'http://127.0.0.1:8000', allowRemote)
    const functions = resolveTarget('DLCP_FUNCTIONS_URL', env.DLCP_FUNCTIONS_URL || 'http://127.0.0.1:3001', allowRemote)
    console.log(`[dev-proxy] /app -> ${backend}   /api,/webhook -> ${functions}`)
    if (allowRemote) console.warn('\x1b[33m[dev-proxy] DLCP_ALLOW_REMOTE_BACKEND=1: remote targets allowed\x1b[0m')
    proxy = {
      '/app': devProxy(backend, 'DLCPlaza backend'),
      '/api': devProxy(functions, 'Local /api functions server'),
      '/webhook': devProxy(functions, 'Local /webhook functions server'),
    }
  }
  return {
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      ...dev.define,
    },
    server: {
      port: 3000,
      proxy,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes('/node_modules/vue/') ||
              id.includes('/node_modules/vue-router/') ||
              id.includes('/node_modules/@vue/')
            ) {
              return 'vendor-vue'
            }
            if (id.includes('/node_modules/@fullcalendar/')) {
              return 'vendor-calendar'
            }
            if (id.includes('/node_modules/marked/')) {
              return 'vendor-markdown'
            }
            if (id.includes('/node_modules/@vuepic/')) {
              return 'vendor-datepicker'
            }
            if (id.includes('/node_modules/axios/')) {
              return 'vendor-http'
            }
            // Only chunk base analytics — session-replay + rrweb stay as separate
            // dynamic-import chunks so they're never loaded on mobile
            if (
              id.includes('/node_modules/@amplitude/') &&
              !id.includes('session-replay') &&
              !id.includes('rrweb')
            ) {
              return 'vendor-amplitude'
            }
          },
        },
      },
    },
    plugins: [
      {
        name: 'non-blocking-css',
        transformIndexHtml(html) {
          // Convert Vite-injected app CSS to non-blocking so the inline fallback
          // content paints immediately (fixes render-blocking 73KB stylesheet).
          // The stylesheet loads async; Vue mounts once CSS is ready.
          return html.replace(
            /<link rel="stylesheet" crossorigin href="(\/assets\/index[^"]+\.css)">/g,
            (_, href) =>
              `<link rel="preload" as="style" href="${href}" onload="this.rel='stylesheet'">` +
              `<noscript><link rel="stylesheet" href="${href}"></noscript>`
          )
        },
      },
      vue({
        template: {
          compilerOptions: {
            // 👇 Tell Vue to ignore <lite-youtube> as a native custom element
            isCustomElement: (tag) => tag === 'lite-youtube',
          },
        },
      }),
      Components({
        // Auto-register components like <i-simple-icons-x />
        resolvers: [IconsResolver({ componentPrefix: 'i' })],
        dts: 'src/components.d.ts',
      }),
      Icons(),
      ...dev.plugins,
    ],

  }
})
