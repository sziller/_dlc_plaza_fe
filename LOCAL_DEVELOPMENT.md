# Local development against a local DLCPlaza backend

`npm run dev` serves the site at **http://localhost:3000** and forwards backend calls to a
DLCPlaza FastAPI backend running on the same machine. Nothing is built or deployed, and the
dev server never talks to a deployed DLCPlaza backend and never feeds production analytics or
CRM/notification services.

## Quick start

```bash
# Node 22 (22.23.4 on the reference workstation). If `node` is not on PATH:
export PATH="$HOME/.local/opt/node-v22.23.4-linux-x64/bin:$PATH"

npm install            # first time only (also runs `playwright install chromium`)
# start the backend first (own terminal, its own repo) -> http://127.0.0.1:8000
npm run dev            # http://localhost:3000 - HMR, source maps, in-browser error overlay
```

Stop with `Ctrl-C` in the terminal that runs it. Frontend and backend are independent: stop
either without touching the other.

## How requests are routed

| Path prefix                | Forwarded to (default)  | What it is                                    |
|----------------------------|-------------------------|-----------------------------------------------|
| `/app/...`                 | `http://127.0.0.1:8000` | DLCPlaza FastAPI backend (auth, oracles, …)   |
| `/api/...`, `/webhook/...` | `http://127.0.0.1:3001` | Vercel-style functions in `api/` (see below)  |

The browser only talks to `localhost:3000`; the Vite proxy (`vite.config.mjs`) forwards, so no
CORS changes are needed and path, method, headers (`Authorization`) and cookies are preserved.
In dev, `src/config.ts` keeps `API_URL` empty for **every** hostname (LAN names included), so
there is no route to staging or production.

**No fallback.** With the backend down, the proxy answers `502` with
`{"detail":"DLCPlaza backend unreachable at http://127.0.0.1:8000 …"}`, prints the same in red in
the dev-server terminal, and the site shows its "servers are currently down" state. A non-loopback
target is refused at startup unless `DLCP_ALLOW_REMOTE_BACKEND=1` is set deliberately.

## Isolation of the dev server (on by default)

| Concern | In `npm run dev` | Opt back in |
|---|---|---|
| Umami, Google Tag Manager / Analytics, X (Twitter) pixel (`index.html`), Amplitude + session replay (`main.js`) | removed / never initialised, even if cookie consent is granted | `DLCP_ENABLE_ANALYTICS=1` |
| Attio CRM write (`SimpleHero.vue`), Slack alerts, collateral e-mail, Kit newsletter subscribe, book checkout calls to the deployed Vercel project (`VITE_BOOK_API`, `VITE_SLACK_COLLATERAL_WEBHOOK_URL`) | disabled: the two env values are forced empty and `__EXTERNAL_WRITES__` is false, whatever your `.env` contains | `DLCP_ALLOW_EXTERNAL_WRITES=1` |

This lives in `vite.config.mjs` (`localDevOptions`) and applies **only** to the dev server.
`vite build` and `vite preview` (used by `scripts/prerender.mjs`) are unchanged: both flags are
true in every build, no HTML is rewritten, and the preview proxy is exactly as before. The start-up
line `[dev-isolation] analytics off, external writes off` confirms the state.

## Configuration (git-ignored, all optional)

Create `.env.development.local` next to `package.json`. It is read **only** by `npm run dev`
(deliberately not `.env.local`, which Vite also loads for `build:staging` / `build:prod`).
Variables have no `VITE_` prefix on purpose, so they are never exposed to browser code.

| Variable | Default | Meaning |
|---|---|---|
| `DLCP_BACKEND_URL` | `http://127.0.0.1:8000` | Backend for `/app` |
| `DLCP_FUNCTIONS_URL` | `http://127.0.0.1:3001` | Server for `/api` and `/webhook` |
| `DLCP_ALLOW_REMOTE_BACKEND` | unset | `1` permits non-loopback targets (avoid) |
| `DLCP_ENABLE_ANALYTICS` | unset | `1` re-enables the analytics scripts |
| `DLCP_ALLOW_EXTERNAL_WRITES` | unset | `1` re-enables CRM / Slack / Kit / e-mail / checkout calls |

`.env`, `.env.staging`, `.env.production` stay out of Git (`.gitignore: .env*`). Secret values are
never documented here. Do not put a local-only setting into `.env.local` or `.env` — those reach
release builds.

## Test accounts

Log in with an account that exists in your **local** backend database. Do not use staging or
production credentials. Do not use the Register form for testing unless the backend's SMTP is
set up for local use: registration sends a confirmation e-mail through the backend.

## Tests

```bash
npx vite build && npm run test:oracle   # Playwright, mocked backend, runs against dist/
```

A full `npm run build` additionally runs `prerender`, which needs port 3000 free (stop
`npm run dev`) and, unchanged from before, renders against the staging proxy of `vite preview`.
Local development does not require building a release.

## External services

Intentionally still live in dev (read-only or user-initiated, and not part of the DLCPlaza API):

- **Oracle lookups** on the Oracle page: read-only GETs to the oracle URL that the *backend*
  reports in `GET /app/dlcp/v1/oracles` (`endpoint`). If the local backend's oracle table points at
  `oracle-stg.purabitcoin.com`, the browser contacts that host. Change the backend's oracle config
  to isolate it.
- BTC spot prices in the calculators (Coinbase / CoinGecko), Google Fonts, flag images, YouTube
  embeds.
- The chatbot (`ChatBot.vue`, hosted on Railway): sends the text a developer types into the chat.
- The blog CMS (`blog.cadenabitcoin.dev`, hardcoded in `src/blogApi/client.ts`): visitor pages read
  from it; the admin login and editor talk to the **production** CMS. Do not use them from dev.

## Known limitations

- **`/api` and `/webhook`** are Vercel serverless functions (`api/*.js`: book checkout, Stripe,
  Lulu, shipping, Kit, collateral e-mail). Nothing listens on :3001 by default, so these calls
  return the visible 502. To run them: `vercel dev --listen 3001` (Vercel login) plus real
  `STRIPE_*`, `RESEND_API_KEY`, `KIT_API_KEY`, `LULU_*` values. They have real side effects; use
  test-mode keys only.
- **Wallet signing / transactions** need the external signer app and the backend's Bitcoin
  infrastructure. Exercise only on signet; nothing here broadcasts.
- **`npm run preview`** serves a *build* and keeps its previous staging proxy (it exists for the
  prerender step). Use `npm run dev` for local-backend work.
- Oracle Directory (`/oracle/#directory`) has no frontend inventory: it renders whatever
  `GET /app/dlcp/v1/oracles` returns from the backend's Reference database.
