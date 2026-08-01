// Audits prerendered dist/<route>/index.html output for heading hierarchy
// problems: missing/duplicate <h1>, skipped levels, and pages with no
// headings at all. Run after `npm run build` (or `node scripts/prerender.mjs`).
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { JSDOM } from 'jsdom'

const DIST_DIR = resolve('dist')

function findIndexFiles(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const entry of entries) {
    if (entry.name === 'assets' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files = files.concat(findIndexFiles(full, join(base, entry.name)))
    } else if (entry.name === 'index.html') {
      files.push({ path: full, route: base ? `/${base}` : '/' })
    }
  }
  return files
}

const files = findIndexFiles(DIST_DIR)
const issues = []
const fakeHeadings = []

for (const { path, route } of files) {
  const html = readFileSync(path, 'utf-8')
  const dom = new JSDOM(html)
  const doc = dom.window.document
  const app = doc.querySelector('#app')
  if (!app) continue

  const headings = Array.from(app.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((el) => ({
    level: Number(el.tagName[1]),
    text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80),
  }))

  const h1Count = headings.filter((h) => h.level === 1).length
  if (h1Count === 0) issues.push({ route, type: 'missing-h1', detail: 'No <h1> found' })
  if (h1Count > 1) issues.push({ route, type: 'multiple-h1', detail: `${h1Count} <h1> tags: ${headings.filter(h=>h.level===1).map(h=>`"${h.text}"`).join(', ')}` })
  if (headings.length === 0) issues.push({ route, type: 'no-headings', detail: 'No heading tags found at all' })

  let prevLevel = 0
  for (const h of headings) {
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      issues.push({ route, type: 'skipped-level', detail: `h${prevLevel} -> h${h.level} ("${h.text}")` })
    }
    prevLevel = h.level
  }

  // Heuristic: large/bold text that isn't a real heading tag — flagged for
  // manual review only, not a definitive violation (stat callouts, hero
  // numbers, etc. can legitimately look like this without being headings).
  Array.from(app.querySelectorAll('div, p, span'))
    .filter((el) => {
      const cls = el.className || ''
      return typeof cls === 'string' && /text-(3xl|4xl|5xl|6xl)/.test(cls) && /font-(bold|extrabold|semibold)/.test(cls)
    })
    .filter((el) => !el.closest('h1,h2,h3,h4,h5,h6'))
    .forEach((el) => {
      const text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80)
      if (text) fakeHeadings.push({ route, tag: el.tagName.toLowerCase(), text })
    })
}

console.log(`Audited ${files.length} prerendered pages\n`)

const byType = {}
for (const issue of issues) {
  byType[issue.type] = byType[issue.type] || []
  byType[issue.type].push(issue)
}

for (const [type, list] of Object.entries(byType)) {
  console.log(`\n=== ${type} (${list.length}) ===`)
  for (const i of list) console.log(`  ${i.route} — ${i.detail}`)
}

console.log(`\n=== possible non-semantic heading-like text (${fakeHeadings.length}, heuristic — needs manual review) ===`)
for (const f of fakeHeadings.slice(0, 60)) console.log(`  ${f.route} — <${f.tag}> "${f.text}"`)
if (fakeHeadings.length > 60) console.log(`  ...and ${fakeHeadings.length - 60} more`)

console.log(`\nTotal: ${issues.length} structural issues across ${new Set(issues.map((i) => i.route)).size} pages, ${fakeHeadings.length} heuristic flags`)
