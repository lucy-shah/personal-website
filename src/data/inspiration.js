/*
 * Inspiration page data loader.
 *
 * You don't edit this file to add things — drop files into src/content/ instead
 * (or run `npm run add`). See src/content/README.md for the format.
 *
 *   src/content/inspiration/<cluster>/<slug>.json   → one star
 *   src/content/inspiration/<cluster>/<slug>.jpg    → its image (optional, same name)
 *   src/content/talented-people/<slug>.json         → one polaroid
 *   src/content/talented-people/<slug>.jpg          → their photo (optional, same name)
 */

// `home` is where each cluster sits on the 1200 × 640 map in the Everything view.
// Each id must match a folder name in src/content/inspiration/.
// `constellations` are the real constellations that category fills, in order —
// ids from src/lib/skyCatalog.js. Items light them star by star, oldest first.
// `kind` is the label on each card; an item can override it with its own "kind"
// (e.g. "Podcast" or "Song" in listening-watching).
export const clusters = [
  { id: 'reading', label: 'Reading', kind: 'Reading', color: '#ede6d6', home: { x: 235, y: 190 },
    constellations: ['ursa-major', 'bootes', 'leo'] },
  { id: 'people', label: 'People', kind: 'Person', color: '#9db5a6', home: { x: 600, y: 150 },
    constellations: ['orion', 'perseus', 'gemini', 'cassiopeia'] },
  { id: 'websites', label: 'Websites', kind: 'Website', color: '#c7b9e2', home: { x: 965, y: 190 },
    constellations: ['pleiades', 'delphinus', 'pegasus', 'andromeda'] },
  { id: 'listening-watching', label: 'Listening & Watching', kind: 'Media', color: '#e9a3c1', home: { x: 400, y: 455 },
    constellations: ['lyra', 'cygnus', 'aquila', 'sagittarius', 'taurus', 'scorpius'] },
  { id: 'quotes', label: 'Quotes', kind: 'Quote', color: '#aeb3aa', home: { x: 820, y: 470 },
    constellations: ['libra', 'corona-borealis', 'canis-major'] },
]

const starFiles = import.meta.glob('../content/inspiration/*/*.json', { eager: true, import: 'default' })
const starImages = import.meta.glob('../content/inspiration/*/*.{jpg,jpeg,png,webp,gif,avif}', { eager: true, import: 'default' })
const personFiles = import.meta.glob('../content/talented-people/*.json', { eager: true, import: 'default' })
const personPhotos = import.meta.glob('../content/talented-people/*.{jpg,jpeg,png,webp,gif,avif}', { eager: true, import: 'default' })

// '../content/inspiration/reading/my-book.json' → { folder: 'reading', slug: 'my-book' }
function parsePath(path) {
  const [, folder, slug] = path.match(/([^/]+)\/([^/]+)\.[^.]+$/)
  return { folder, slug }
}

function bySlug(modules) {
  return Object.fromEntries(
    Object.entries(modules).map(([path, value]) => {
      const { folder, slug } = parsePath(path)
      return [`${folder}/${slug}`, value]
    }),
  )
}

// Files starting with "_" (like _example.json) are ignored.
function entries(files) {
  return Object.entries(bySlug(files))
    .map(([key, data]) => ({ key, data, ...parsePath(`${key}.json`) }))
    .filter(({ slug }) => !slug.startsWith('_'))
}

// Quotes are written as { quote, by }. The map label and list row use a
// shortened version of the quote; the popup shows the whole thing.
function shortenQuote(quote = '', limit = 48) {
  const clean = quote.replace(/^[“"]+|[”"]+$/g, '').trim()
  if (clean.length <= limit) return clean
  return `${clean.slice(0, limit).replace(/\s+\S*$/, '').replace(/[\s.,;:!?]+$/, '')}…`
}

const starImageMap = bySlug(starImages)
export const stars = entries(starFiles).map(({ key, data, folder, slug }) => ({
  ...data,
  ...(data.quote && {
    title: data.title ?? shortenQuote(data.quote),
    subtitle: data.subtitle ?? data.by,
  }),
  id: slug,
  cluster: folder,
  image: starImageMap[key],
}))

const personPhotoMap = bySlug(personPhotos)
export const talentedPeople = entries(personFiles)
  .map(({ key, data, slug }) => ({ ...data, id: slug, photo: personPhotoMap[key] }))
  .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || (a.added ?? '').localeCompare(b.added ?? ''))
