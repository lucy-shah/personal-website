#!/usr/bin/env node
// Interactive helper: `npm run add` → writes a JSON file into src/content/.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
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


const compact = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value !== '' && value !== undefined))

function write(dir, slug, data) {
  mkdirSync(dir, { recursive: true })
  const target = uniquePath(dir, slug)
  writeFileSync(target.file, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`\n✧ Saved ${path.relative(root, target.file)}`)
  console.log(`  Optional image: add ${target.slug}.jpg (or .png/.webp) next to it.\n`)
}

async function addQuote() {
  const quote = await ask('Quote (paste the whole thing on one line)')
  if (!quote) throw new Error('A quote is required.')
  const by = await ask('Author / who said it')
  const link = await ask('Link')
  const saved = await ask('Saved date', today())
  const slug = slugify(by || quote.split(/\s+/).slice(0, 6).join(' '))
  write(path.join(starsDir, 'quotes'), slug, compact({ quote, by, saved, link }))
}

async function addStar(cluster) {
  const title = await ask('Title')
  if (!title) throw new Error('A title is required.')
  const kind = cluster === 'listening-watching' ? await ask('Type (Video / Podcast / Song / Album…)') : ''
  const subtitle = await ask('Subtitle (author / role / site / runtime)')
  const why = await ask('Why it inspires you (one line)')
  const description = await ask('Longer description for the popup')
  const link = await ask('Link')
  const saved = await ask('Saved date', today())

  write(path.join(starsDir, cluster), slugify(title), compact({
    title,
    kind,
    subtitle,
    why,
    description,
    saved,
    link,
  }))
}

async function addPerson() {
  const name = await ask('Name')
  if (!name) throw new Error('A name is required.')
  const role = await ask('Role (e.g. "swe @ riv")')
  const link = await ask('Link to their work')
  listWallOrder()
  const orderAnswer = await ask('Order on the wall (1 = first, blank = after everyone)')
  const order = Number.parseInt(orderAnswer, 10)
  if (orderAnswer && !(order > 0)) console.log('  Not a number above 0, so they’ll go after everyone.')
  write(peopleDir, slugify(name), compact({ name, role, link, added: today(), order: order > 0 ? order : undefined }))
}

// Prints who's already on the wall, in display order, so picking a number is easy.
function listWallOrder() {
  if (!existsSync(peopleDir)) return
  const people = readdirSync(peopleDir)
    .filter((file) => file.endsWith('.json') && !file.startsWith('_'))
    .map((file) => {
      try {
        return JSON.parse(readFileSync(path.join(peopleDir, file), 'utf8'))
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || (a.added ?? '').localeCompare(b.added ?? ''))
  if (!people.length) return
  console.log('  Currently on the wall:')
  people.forEach((person, index) => console.log(`    ${index + 1}. ${person.name}${person.order ? ` (order ${person.order})` : ''}`))
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
