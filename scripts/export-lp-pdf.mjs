/**
 * Exports the homepage as a single long PDF.
 * Usage: npm run dev (in another terminal), then node scripts/export-lp-pdf.mjs
 * Options:
 *   --url  <url>    default: http://localhost:5173
 *   --out  <path>   default: cadena-lp.pdf
 *   --width <px>    default: 1440
 */
import puppeteer from 'puppeteer'
import { writeFileSync } from 'fs'

const args = process.argv.slice(2)
const get = (flag, fallback) => {
  const i = args.indexOf(flag)
  return i !== -1 ? args[i + 1] : fallback
}

const url   = get('--url',   'http://localhost:5173')
const out   = get('--out',   'cadena-lp.pdf')
const width = Number(get('--width', '1440'))

console.log(`→ Opening ${url} at ${width}px wide…`)

const browser = await puppeteer.launch({ headless: 'new' })
const page    = await browser.newPage()

await page.setViewport({ width, height: 900, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30_000 })

// Let scroll animations settle
await new Promise(r => setTimeout(r, 1500))

// Scroll through to trigger any lazy-loaded content
await page.evaluate(async () => {
  await new Promise(resolve => {
    let total = 0
    const step = () => {
      window.scrollBy(0, 300)
      total += 300
      if (total < document.body.scrollHeight) requestAnimationFrame(step)
      else { window.scrollTo(0, 0); resolve() }
    }
    requestAnimationFrame(step)
  })
})
await new Promise(r => setTimeout(r, 800))

const fullHeight = await page.evaluate(() => document.body.scrollHeight)
console.log(`→ Page height: ${fullHeight}px`)

const pdf = await page.pdf({
  width:           `${width}px`,
  height:          `${fullHeight}px`,
  printBackground: true,
  margin:          { top: 0, right: 0, bottom: 0, left: 0 },
})

await browser.close()

writeFileSync(out, pdf)
console.log(`✓ Saved to ${out}`)
