// End-to-end tests for the Oracle Directory (GitHub issue #2).
//
// Runs against the BUILT artifact in dist/ (build first: `npm run build`) with the
// backend mocked at the network layer. One and the same build is opened under the
// staging and the production hostnames; only the mocked backend response differs -
// exactly the property the release architecture requires.
//
//   npm run build && npm run test:oracle
//
// The oracle servers themselves (oracle-stg / oracle .purabitcoin.com) are mocked too, each with
// its own signing key, so the tests can prove which environment's oracle the page really used.
//
// No new dependencies: uses `playwright` (already a devDependency) and node:test.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const DIST = path.resolve('dist')
const PORT = Number(process.env.ORACLE_TEST_PORT || 4174)
const STAGING_HOST = 'staging.purabitcoin.com'
const PROD_HOST = 'cadenabitcoin.com'

// ---- fixtures: what the backends return (config_dlc_test.py / config_dlc.py) ----
const STAGING_PAYLOAD = [
  {
    oracle_name: 'oracle_dlcp', provider: 'Cadenabitcoin DLC Oracle',
    supported_symbols: ['BTCUSD', 'BTCEUR', 'BTCCHF', 'BTCCAD'],
    homepage_url: 'https://oracle-stg.purabitcoin.com/',
    endpoint: 'https://oracle-stg.purabitcoin.com/api/v0',
    endpoint_price: 'https://oracle-stg.purabitcoin.com/api/v0/price_info/current/',
    active: true,
  },
  {
    oracle_name: 'oracle_dfx', provider: 'DFX Swiss Oracle',
    supported_symbols: ['BTCCHF', 'BTCEUR'],
    homepage_url: null,
    endpoint: 'https://oracle.dfx.swiss',
    endpoint_price: null,
    active: true,
  },
]
const PROD_PAYLOAD = [
  {
    oracle_name: 'oracle_dlcp', provider: 'Cadenabitcoin DLC Oracle',
    supported_symbols: ['BTCUSD', 'BTCEUR'],
    homepage_url: 'https://oracle.purabitcoin.com/',
    endpoint: 'https://oracle.purabitcoin.com/api/v0',
    endpoint_price: 'https://oracle.purabitcoin.com/api/v0/price_info/current/',
    active: true,
  },
]
// what the backend returned BEFORE the metadata extension (3 fields only)
const LEGACY_PAYLOAD = [
  { oracle_name: 'oracle_dlcp', provider: 'Cadenabitcoin DLC Oracle', supported_symbols: ['BTCUSD', 'BTCEUR'] },
]
// oracle servers (what oracle(-stg).purabitcoin.com/api/v0 answers) - distinct key per environment
const ORACLE_KEYS = {
  'oracle-stg.purabitcoin.com': '03stagingkey0000000000000000000000000000000000000000000000000000aa',
  'oracle.purabitcoin.com': '02productionkey00000000000000000000000000000000000000000000000000bb',
}
function oracleServerReply(host, apiPath) {
  const now = Math.floor(Date.now() / 1000)
  if (apiPath === 'oracle/oracle_info') return { main_public_key: ORACLE_KEYS[host], public_keys: [ORACLE_KEYS[host]] }
  if (apiPath === 'oracle/oracle_status') return { future_event_count: 1, total_event_count: 2, current_time_utc: now }
  if (apiPath === 'price_info/current/BTCUSD') return { price: 70000, aggr_sources: [] }
  if (apiPath === 'event/next_event') return { event_id: `btcusd${now + 600}`, time_utc: now + 600 }
  return { detail: 'not found' }
}
const ok = (payload) => ({ status: 200, body: { payload, message: 'Oracle definitions retrieved.', timestamp: 1 } })

// ---- static server for dist/ with SPA fallback ----
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
}
let server
let browser

before(async () => {
  assert.ok(fs.existsSync(path.join(DIST, 'index.html')), 'dist/ not found - run `npm run build` first')
  server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    let file = path.join(DIST, urlPath)
    if (!file.startsWith(DIST)) { res.writeHead(403); return res.end() }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    // Always serve the SPA shell for page routes (deterministic: ignores any prerendered snapshot)
    if (!fs.existsSync(file) || file.endsWith('index.html')) file = path.join(DIST, 'index.html')
    const send = () => {
      res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' })
      fs.createReadStream(file).pipe(res)
    }
    // Timing control for the /allocate_liquidity tests only: MarketOverviewTable skips its start-up work when the
    // app-wide health check is still in flight (pre-existing race, unrelated to oracles). Delaying
    // that one route chunk lets the health check finish first, like a normal page load.
    if (/\/assets\/BTCUSD-[^/]+\.js$/.test(urlPath)) setTimeout(send, 700)
    else send()
  })
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r))
  browser = await chromium.launch({
    args: [`--host-resolver-rules=MAP ${STAGING_HOST} 127.0.0.1, MAP ${PROD_HOST} 127.0.0.1`],
  })
})
after(async () => {
  await browser?.close()
  await new Promise((r) => server?.close(r))
})

/**
 * Open `route` as `host` (same build) with the oracle-list endpoint mocked.
 * `reply` is a response object or a function(callIndex) -> response (may be async).
 * Everything that is not the local server or the oracle list is aborted (hermetic).
 */
async function open(host, reply, { route = '/oracle', viewport = { width: 1280, height: 900 } } = {}) {
  const context = await browser.newContext({ viewport })
  const oracleCalls = []      // GET /app/dlcp/v1/oracles (the platform's oracle list)
  const oracleApiCalls = []   // direct calls to an oracle server: "<host>/api/v0/<path>"
  const priceCalls = []       // GET /app/dlcp/v1/oracle-price -> the `oracle` parameter
  await context.route('**/*', async (r) => {
    const url = new URL(r.request().url())
    if (url.hostname in ORACLE_KEYS && url.pathname.startsWith('/api/v0/')) {
      const apiPath = url.pathname.slice('/api/v0/'.length)
      oracleApiCalls.push(`${url.hostname}/${apiPath}`)
      return r.fulfill({
        status: apiPath.startsWith('event/event/') ? 404 : 200,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(oracleServerReply(url.hostname, apiPath)),
      })
    }
    if (url.pathname === '/app/dlcp/v1/oracle-price') {
      priceCalls.push(url.searchParams.get('oracle'))
      return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ payload: { price: 70000 }, message: 'ok', timestamp: 1 }) })
    }
    if (url.pathname === '/app/dlcp/v0/server-status') {
      return r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ payload: { ok: true, status: 'up' }, message: 'ok', timestamp: 1 }) })
    }
    if (url.pathname === '/app/dlcp/v1/oracles') {
      oracleCalls.push(url.origin + url.pathname)
      const resp = typeof reply === 'function' ? await reply(oracleCalls.length - 1) : reply
      return r.fulfill({
        status: resp.status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify(resp.body ?? {}),
      })
    }
    if (url.hostname === host && url.port === String(PORT)) return r.continue()
    return r.abort()
  })
  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(e.message))
  await page.goto(`http://${host}:${PORT}${route}`, { waitUntil: 'domcontentloaded' })
  return { page, context, oracleCalls, oracleApiCalls, priceCalls, pageErrors }
}

const list = (page) => page.locator('[data-testid="oracle-list"]')
const details = (page) => page.locator('[data-testid="oracle-details"]')
const title = (page) => page.locator('[data-testid="oracle-details-title"]')
const symbols = (page) => page.locator('[data-testid="oracle-details-symbols"] li').allInnerTexts()

// ---------------------------------------------------------------------------

test('/oracle loads and shows the directory (existing explainer page is still there)', async () => {
  const { page, context, pageErrors } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.match(await page.locator('h1').first().innerText(), /price that settles/i)
  assert.equal(await page.locator('#directory').count(), 1)
  assert.equal(new URL(page.url()).pathname, '/oracle')
  assert.deepEqual(pageErrors, [])
  await context.close()
})

test('STAGING host: reads staging backend, shows Cadena + DFX, 4 symbols, stg homepage', async () => {
  const { page, context, oracleCalls } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')

  // data comes from the intended interface (the staging backend)
  assert.deepEqual(oracleCalls, [`https://${STAGING_HOST}/app/dlcp/v1/oracles`])

  assert.equal(await list(page).locator('input[type=radio]').count(), 2)
  assert.match(await list(page).innerText(), /Cadenabitcoin DLC Oracle/)
  assert.match(await list(page).innerText(), /DFX Swiss Oracle/)

  // first (active) oracle selected by default
  assert.equal(await page.locator('#oracle-radio-oracle_dlcp').isChecked(), true)
  assert.equal(await page.locator('#oracle-radio-oracle_dfx').isChecked(), false)
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')
  assert.deepEqual(await symbols(page), ['BTCUSD', 'BTCEUR', 'BTCCHF', 'BTCCAD'])

  // external homepage link: right URL, new tab, safe rel
  const link = page.locator('[data-testid="oracle-details-website"]')
  assert.equal(await link.getAttribute('href'), 'https://oracle-stg.purabitcoin.com/')
  assert.equal(await link.getAttribute('target'), '_blank')
  const rel = (await link.getAttribute('rel')).split(/\s+/)
  assert.ok(rel.includes('noopener') && rel.includes('noreferrer'))
  // list entry carries the same link
  const listLink = page.locator('[data-testid="oracle-item-oracle_dlcp"] a')
  assert.equal(await listLink.getAttribute('href'), 'https://oracle-stg.purabitcoin.com/')
  assert.equal(await listLink.getAttribute('target'), '_blank')

  // selecting another oracle updates the panel, without changing the route
  await page.locator('label[for="oracle-radio-oracle_dfx"]').click()
  assert.equal(await title(page).innerText(), 'DFX Swiss Oracle')
  assert.deepEqual(await symbols(page), ['BTCCHF', 'BTCEUR'])
  assert.equal(await page.locator('#oracle-radio-oracle_dfx').isChecked(), true)
  assert.equal(await page.locator('#oracle-radio-oracle_dlcp').isChecked(), false)
  assert.match(await details(page).innerText(), /Not published/)          // no verified homepage -> no link
  assert.equal(await page.locator('[data-testid="oracle-details-website"]').count(), 0)
  assert.match(await details(page).innerText(), /https:\/\/oracle\.dfx\.swiss/) // endpoint shown as text
  assert.equal(await details(page).locator('a[href="https://oracle.dfx.swiss"]').count(), 0) // ...never as a homepage link
  assert.equal(new URL(page.url()).pathname, '/oracle')

  // selected item is visually distinct
  const cls = (id) => page.locator(`[data-testid="oracle-item-${id}"]`).getAttribute('class')
  assert.match(await cls('oracle_dfx'), /border-secondary\/70/)
  assert.doesNotMatch(await cls('oracle_dlcp'), /border-secondary\/70/)
  await context.close()
})

test('PRODUCTION host: same build, reads production backend, shows Cadena only, 2 symbols, prod homepage', async () => {
  const { page, context, oracleCalls } = await open(PROD_HOST, ok(PROD_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.deepEqual(oracleCalls, [`https://${PROD_HOST}/app/dlcp/v1/oracles`])
  assert.equal(await list(page).locator('input[type=radio]').count(), 1)
  assert.doesNotMatch(await list(page).innerText(), /DFX/)               // nothing fabricated
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')
  assert.deepEqual(await symbols(page), ['BTCUSD', 'BTCEUR'])
  assert.equal(await page.locator('[data-testid="oracle-details-website"]').getAttribute('href'), 'https://oracle.purabitcoin.com/')
  await context.close()
})

test('keyboard: arrow keys move the selection and update the details', async () => {
  const { page, context } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  await page.locator('#oracle-radio-oracle_dlcp').focus()
  await page.keyboard.press('ArrowDown')
  assert.equal(await title(page).innerText(), 'DFX Swiss Oracle')
  assert.equal(await page.locator('#oracle-radio-oracle_dfx').isChecked(), true)
  await page.keyboard.press('ArrowUp')
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')
  // the section is a labelled landmark and the group has an accessible name
  assert.equal(await page.locator('#directory').getAttribute('aria-labelledby'), 'oracle-directory-title')
  assert.equal(await page.locator('fieldset legend').innerText(), 'Select an oracle')
  await context.close()
})

test('API failure: error state with retry, page stays usable, NO hardcoded fallback inventory', async () => {
  const { page, context, pageErrors } = await open(STAGING_HOST, (i) => (i === 0 ? { status: 500, body: { detail: 'boom' } } : ok(STAGING_PAYLOAD)))
  await page.waitForSelector('[data-testid="oracle-dir-error"]')
  const section = await page.locator('#directory').innerText()
  assert.doesNotMatch(section, /Cadenabitcoin DLC Oracle|DFX|BTCUSD/)     // nothing silently substituted
  assert.equal(await page.locator('[data-testid="oracle-list"]').count(), 0)
  assert.match(await page.locator('h1').first().innerText(), /price that settles/i) // rest of page fine
  await page.locator('#directory').getByRole('button', { name: 'Retry' }).click()
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')
  assert.deepEqual(pageErrors, [])
  await context.close()
})

test('malformed response is an error state, not a crash', async () => {
  const { page, context, pageErrors } = await open(STAGING_HOST, { status: 200, body: { payload: { not: 'a list' } } })
  await page.waitForSelector('[data-testid="oracle-dir-error"]')
  assert.deepEqual(pageErrors, [])
  await context.close()
})

test('empty list: empty state', async () => {
  const { page, context } = await open(STAGING_HOST, ok([]))
  await page.waitForSelector('[data-testid="oracle-dir-empty"]')
  assert.match(await page.locator('#directory').innerText(), /No oracles are configured/)
  await context.close()
})

test('loading state is shown while the request is pending', async () => {
  let release
  const gate = new Promise((r) => { release = r })
  const { page, context } = await open(STAGING_HOST, async () => { await gate; return ok(STAGING_PAYLOAD) })
  await page.waitForSelector('[data-testid="oracle-dir-loading"]')
  release()
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(await page.locator('[data-testid="oracle-dir-loading"]').count(), 0)
  await context.close()
})

test('inactive oracles are explicit and never the default selection', async () => {
  const payload = [
    { ...STAGING_PAYLOAD[1], oracle_name: 'oracle_off', provider: 'Retired Oracle', active: false },
    STAGING_PAYLOAD[0],
  ]
  const { page, context } = await open(STAGING_HOST, ok(payload))
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')   // first ACTIVE one
  assert.match(await page.locator('[data-testid="oracle-item-oracle_off"]').innerText(), /Inactive/)
  await page.locator('label[for="oracle-radio-oracle_off"]').click()
  assert.match(await details(page).innerText(), /Inactive/)
  assert.doesNotMatch(await details(page).innerText(), /\bActive\b/)
  await context.close()
})

test('older backend without the new metadata fields still renders (graceful degradation)', async () => {
  const { page, context, pageErrors } = await open(PROD_HOST, ok(LEGACY_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')
  assert.deepEqual(await symbols(page), ['BTCUSD', 'BTCEUR'])
  assert.match(await details(page).innerText(), /Status unavailable|Not published/)
  assert.equal(await page.locator('#directory a[href]').count(), 0)         // no link invented
  assert.deepEqual(pageErrors, [])
  await context.close()
})

test('non-http(s) homepage values are never rendered as links', async () => {
  const bad = [{ ...STAGING_PAYLOAD[0], homepage_url: 'javascript:alert(1)' }]
  const { page, context } = await open(STAGING_HOST, ok(bad))
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(await page.locator('#directory a[href]').count(), 0)
  await context.close()
})

test('mobile (375px): stacked layout, no horizontal overflow, tap selection works', async () => {
  const { page, context } = await open(STAGING_HOST, ok(STAGING_PAYLOAD), { viewport: { width: 375, height: 812 } })
  await page.waitForSelector('[data-testid="oracle-list"]')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  assert.ok(overflow <= 0, `horizontal overflow of ${overflow}px`)
  const l = await list(page).boundingBox()
  const d = await details(page).boundingBox()
  assert.ok(d.y >= l.y + l.height - 1, 'details panel should sit below the list on mobile')
  assert.ok(d.width > 300 && l.width > 300, 'both blocks use the full width')
  await page.locator('label[for="oracle-radio-oracle_dfx"]').tap().catch(() => page.locator('label[for="oracle-radio-oracle_dfx"]').click())
  assert.equal(await title(page).innerText(), 'DFX Swiss Oracle')
  await context.close()
})

test('desktop (1280px): two columns side by side', async () => {
  const { page, context } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  const l = await list(page).boundingBox()
  const d = await details(page).boundingBox()
  assert.ok(d.x >= l.x + l.width - 1, 'details should be right of the list')
  assert.ok(Math.abs(d.y - l.y) < 40, 'columns start at the same height')
  await context.close()
})

test('landing page footer "The Oracle" link opens /oracle with the directory', async () => {
  const { page, context } = await open(STAGING_HOST, ok(STAGING_PAYLOAD), { route: '/' })
  const link = page.locator('footer a[href="/oracle"]')
  await link.waitFor({ state: 'attached' })
  assert.match(await link.innerText(), /The Oracle/)
  // the Navbar Resources menu (same siteMenu.js source) points to the same page
  assert.equal(await page.locator('nav a[href="/oracle"]').first().getAttribute('href'), '/oracle')
  await link.scrollIntoViewIfNeeded()
  await link.click()
  await page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(new URL(page.url()).pathname, '/oracle')
  assert.equal(await title(page).innerText(), 'Cadenabitcoin DLC Oracle')
  await context.close()
})

// ---------------------------------------------------------------------------
// Environment-specific oracle servers (Oracle page widgets) - same build, different backend metadata
// ---------------------------------------------------------------------------

const settle = (page) => page.waitForTimeout(600) // let the page's own requests finish

test('STAGING: Oracle page widgets use the staging oracle (oracle-stg), never production', async () => {
  const { page, context, oracleApiCalls } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  await page.waitForFunction((k) => document.body.innerText.includes(k), ORACLE_KEYS['oracle-stg.purabitcoin.com'])
  await settle(page)
  assert.ok(oracleApiCalls.length >= 3, `expected oracle API calls, got ${oracleApiCalls.length}`)
  assert.ok(oracleApiCalls.every((c) => c.startsWith('oracle-stg.purabitcoin.com/')), `unexpected hosts: ${oracleApiCalls}`)
  const body = await page.locator('body').innerText()
  assert.ok(body.includes(ORACLE_KEYS['oracle-stg.purabitcoin.com']), 'staging signing key displayed')
  assert.ok(!body.includes(ORACLE_KEYS['oracle.purabitcoin.com']), 'production key must not be displayed on staging')
  assert.match(body, /GET https:\/\/oracle-stg\.purabitcoin\.com\/api\/v0\/oracle\/oracle_info/)
  await context.close()
})

test('PRODUCTION: Oracle page widgets use the production oracle, never staging', async () => {
  const { page, context, oracleApiCalls } = await open(PROD_HOST, ok(PROD_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  await page.waitForFunction((k) => document.body.innerText.includes(k), ORACLE_KEYS['oracle.purabitcoin.com'])
  await settle(page)
  assert.ok(oracleApiCalls.length >= 3)
  assert.ok(oracleApiCalls.every((c) => c.startsWith('oracle.purabitcoin.com/')), `unexpected hosts: ${oracleApiCalls}`)
  const body = await page.locator('body').innerText()
  assert.ok(!body.includes(ORACLE_KEYS['oracle-stg.purabitcoin.com']))
  assert.match(body, /GET https:\/\/oracle\.purabitcoin\.com\/api\/v0\/oracle\/oracle_info/)
  await context.close()
})

test('backend without oracle endpoint metadata: widgets show "-", NO fallback to any oracle server', async () => {
  const { page, context, oracleApiCalls, pageErrors } = await open(STAGING_HOST, ok(LEGACY_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  await settle(page)
  assert.deepEqual(oracleApiCalls, [], 'must not guess an oracle server')
  assert.match(await page.locator('body').innerText(), /\[oracle API base unavailable\]/)
  assert.match(await page.locator('h1').first().innerText(), /price that settles/i)
  assert.deepEqual(pageErrors, [])
  await context.close()
})

test('platform oracle list is requested once per page view (shared by directory and widgets)', async () => {
  const { page, context, oracleCalls } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  await settle(page)
  assert.equal(oracleCalls.length, 1)
  await context.close()
})

test('existing event lookup tool still works and queries the environment\'s oracle', async () => {
  const { page, context, oracleApiCalls } = await open(STAGING_HOST, ok(STAGING_PAYLOAD))
  await page.waitForSelector('[data-testid="oracle-list"]')
  await page.getByPlaceholder(/btcusd1793993400/).fill('btcusd1794229800')
  await page.getByRole('button', { name: 'Look up' }).click()
  await page.waitForFunction(() => document.body.innerText.includes('Not found (404)'))   // mocked 404 -> existing error path
  assert.ok(oracleApiCalls.includes('oracle-stg.purabitcoin.com/event/event/btcusd1794229800'), oracleApiCalls.join(', '))
  assert.ok(oracleApiCalls.every((c) => c.startsWith('oracle-stg.purabitcoin.com/')))
  await context.close()
})

// ---------------------------------------------------------------------------
// Identifier compatibility: backend contract is `oracle_name`
// ---------------------------------------------------------------------------

/** Deep-link /allocate_liquidity (BTCUSD.vue): MarketOverviewTable calls fetchOracles() and prices via the selected oracle. */
async function openBtcusd(reply) {
  const h = await open(STAGING_HOST, reply, { route: '/allocate_liquidity' })
  await h.page.waitForTimeout(2800)
  return h
}

test('oracle selection reads the backend `oracle_name` (/allocate_liquidity price oracle)', async () => {
  // only DFX configured -> the app must switch to it. Code reading the non-existent `oracle_id`
  // would silently keep the hardcoded default "oracle_dlcp".
  const h = await openBtcusd(ok([STAGING_PAYLOAD[1]]))
  assert.ok(h.oracleCalls.length >= 1, 'oracle list was requested by /allocate_liquidity')
  assert.ok(h.priceCalls.includes('oracle_dfx'), `price oracle calls: ${h.priceCalls}`)
  await h.context.close()
})

test('backend row order does not change the default oracle (DFX listed first, Cadena still default)', async () => {
  const reversed = [STAGING_PAYLOAD[1], STAGING_PAYLOAD[0]]
  const h = await openBtcusd(ok(reversed))
  assert.ok(h.oracleCalls.length >= 1, 'oracle list was requested by /allocate_liquidity')
  assert.ok(h.priceCalls.includes('oracle_dlcp'), `price oracle calls: ${h.priceCalls}`)
  assert.ok(!h.priceCalls.includes('oracle_dfx'), `price oracle calls: ${h.priceCalls}`)
  await h.context.close()
  // ...and the directory lists / preselects the platform default first
  const d = await open(STAGING_HOST, ok(reversed))
  await d.page.waitForSelector('[data-testid="oracle-list"]')
  assert.equal(await title(d.page).innerText(), 'Cadenabitcoin DLC Oracle')
  assert.match(await d.page.locator('[data-testid="oracle-list"] input[type=radio]').first().getAttribute('id'), /oracle_dlcp/)
  await d.context.close()
})
