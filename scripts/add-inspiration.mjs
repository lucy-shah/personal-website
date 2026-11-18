#!/usr/bin/env node
// Interactive helper: `npm run add` → writes a JSON file into src/content/.
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const starsDir = path.join(root, 'src/content/inspiration')
const peopleDir = path.join(root, 'src/content/talented-people')

// A small line queue so answers work both typed and piped in.
const rl = readline.createInterface({ input, terminal: false })
const queued = []
const waiting = []
rl.on('line', (line) => (waiting.length ? waiting.shift()(line) : queued.push(line)))
let closed = false
rl.on('close', () => {
  closed = true
  waiting.splice(0).forEach((resolve) => resolve(''))
})
const nextLine = () => {
  if (queued.length) return Promise.resolve(queued.shift())
  if (closed) return Promise.resolve('')
  return new Promise((resolve) => waiting.push(resolve))
}

const ask = async (question, fallback = '') => {
  output.write(fallback ? `${question} (${fallback}): ` : `${question}: `)
  const answer = (await nextLine()).trim()
  return answer || fallback
}

const today = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local time

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'untitled'

function uniquePath(dir, slug) {
  let candidate = slug
  for (let index = 2; existsSync(path.join(dir, `${candidate}.json`)); index += 1) candidate = `${slug}-${index}`
  return { slug: candidate, file: path.join(dir, `${candidate}.json`) }
}

function existingStarIds() {
  return readdirSync(starsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((dir) => readdirSync(path.join(starsDir, dir.name)).filter((file) => file.endsWith('.json') && !file.startsWith('_')))
    .map((file) => file.replace(/\.json$/, ''))
}

const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== '' && value !== undefined))

function write(dir, slug, data) {
  mkdirSync(dir, { recursive: true })
  const target = uniquePath(dir, slug)
  writeFileSync(target.file, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`\n✧ Saved ${path.relative(root, target.file)}`)
  console.log(`  Optional image: add ${target.slug}.jpg (or .png/.webp) next to it.\n`)
}

function askLedTo() {
  const ids = existingStarIds()
  if (ids.length) console.log(`  Existing stars: ${ids.join(', ')}`)
  return ask('Led to (comma-separated file names, optional)').then((answer) => {
    const ledTo = answer.split(',').map((id) => id.trim()).filter(Boolean)
    const unknown = ledTo.filter((id) => !ids.includes(id))
    if (unknown.length) console.log(`  Heads up — not found yet: ${unknown.join(', ')}`)
    return ledTo.length ? ledTo : undefined
  })
}

async function addQuote() {
  const quote = await ask('Quote (paste the whole thing on one line)')
  if (!quote) throw new Error('A quote is required.')
  const by = await ask('Author / who said it')
  const link = await ask('Link')
  const ledTo = await askLedTo()
  const saved = await ask('Saved date', today())
  const slug = slugify(by || quote.split(/\s+/).slice(0, 6).join(' '))
  write(path.join(starsDir, 'quotes'), slug, compact({ quote, by, saved, link, ledTo }))
}

async function addStar(cluster) {
  const title = await ask('Title')
  if (!title) throw new Error('A title is required.')
  const subtitle = await ask('Subtitle (author / role / site / runtime)')
  const why = await ask('Why it inspires you (one line)')
  const description = await ask('Longer description for the popup')
  const link = await ask('Link')
  const ledTo = await askLedTo()
  const saved = await ask('Saved date', today())

  write(path.join(starsDir, cluster), slugify(title), compact({
    title,
    subtitle,
    why,
    description,
    saved,
    link,
    ledTo,
  }))
}

async function addPerson() {
  const name = await ask('Name')
  if (!name) throw new Error('A name is required.')
  const role = await ask('Role (e.g. "swe @ riv")')
  const link = await ask('Link to their work')
  write(peopleDir, slugify(name), compact({ name, role, link, added: today() }))
}

try {
  const clusters = readdirSync(starsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  const options = [...clusters, 'talented-people']
  console.log('\nWhat are you adding?')
  options.forEach((option, index) => console.log(`  ${index + 1}. ${option}`))
  const choice = options[Number(await ask('Number')) - 1]
  if (!choice) throw new Error('Pick one of the numbers above.')
  if (choice === 'talented-people') await addPerson()
  else if (choice === 'quotes') await addQuote()
  else await addStar(choice)
} catch (error) {
  console.error(`\n${error.message}\n`)
  process.exitCode = 1
} finally {
  rl.close()
}
