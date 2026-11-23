// Pure helpers that turn the inspiration data into a drawable star map.
// Nothing here touches React or the DOM.

import { skyShape } from './skyCatalog.js'

export const STAGE = { width: 1200, height: 640 }

const STAR_SIZE = 13
const FOCUS_TARGET = { x: 600, y: 350, s: 1.3 }
const DIM_SCALE = 0.6
// Where the other clusters drift when one is focused (in cluster order).
const PERIPHERY_SLOTS = [
  { x: 190, y: 110 },
  { x: 1010, y: 110 },
  { x: 190, y: 500 },
  { x: 1010, y: 500 },
]

function compareBySaved(a, b) {
  return (a.saved ?? '').localeCompare(b.saved ?? '') || a.id.localeCompare(b.id)
}

// Where each constellation in a category sits relative to the first one.
// Two columns, growing downward; the second column is nudged so it doesn't read as a grid.
const CELL = { x: 280, y: 250 }
const slotOffset = (slot) => ({ x: (slot % 2) * CELL.x, y: Math.floor(slot / 2) * CELL.y + (slot % 2) * 50 })

// Each category fills real constellations in order (see src/lib/skyCatalog.js):
// the oldest item lights the first star, each newer one the next star in the
// figure. When a constellation is full the next one starts beside it, so adding
// an item never moves the stars already there. If the whole list fills up it
// starts over, mirrored, so repeats don't look identical.
function placeClusterStars(cluster, clusterStars) {
  const names = cluster.constellations?.length ? cluster.constellations : ['cassiopeia']
  const placed = []
  const lines = []
  const ordered = [...clusterStars].sort(compareBySaved)
  let slot = 0
  let cursor = 0
  while (cursor < ordered.length) {
    const lap = Math.floor(slot / names.length)
    const shape = skyShape(names[slot % names.length])
    const mirror = lap % 2 === 1 ? -1 : 1
    const origin = slotOffset(slot)
    const ids = []
    shape.points.forEach((point, index) => {
      const star = ordered[cursor]
      if (!star) return
      cursor += 1
      ids[index] = star.id
      placed.push({
        ...star,
        lx: origin.x + point.x * mirror + (star.offset?.x ?? 0),
        ly: origin.y + point.y + (star.offset?.y ?? 0),
        size: STAR_SIZE,
      })
    })
    shape.edges.forEach(([from, to]) => {
      if (ids[from] && ids[to]) lines.push([ids[from], ids[to]])
    })
    slot += 1
  }

  // Centre the lit stars on the cluster's spot on the map.
  if (placed.length) {
    const xs = placed.map((star) => star.lx)
    const ys = placed.map((star) => star.ly)
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2
    placed.forEach((star) => { star.lx -= cx; star.ly -= cy })
  }

  const minY = placed.reduce((lowest, star) => Math.min(lowest, star.ly), 0)
  // How far the constellation reaches from its centre — used to shrink big
  // clusters so they keep growing without running into their neighbours.
  const extent = placed.reduce(
    (reach, star) => ({ x: Math.max(reach.x, Math.abs(star.lx)), y: Math.max(reach.y, Math.abs(star.ly)) }),
    { x: 0, y: 0 },
  )
  return { stars: placed, lines, extent, labelY: placed.length ? minY - 34 : -8 }
}

// ── Draw-in timeline ──────────────────────────────────────────────────────
// Stars appear in the order they were added; each line draws toward its newer
// star just before that star pops in. The whole sequence stays under ~3s.
const DRAW_START = 250
const DRAW_TOTAL = 2600
const LINE_DURATION = 420

function buildTimeline(stars, byCluster) {
  const ordered = [...stars].sort(compareBySaved)
  const step = Math.min(160, DRAW_TOTAL / Math.max(ordered.length, 1))
  const starDelay = {}
  const lineDelay = {}
  const childIds = new Set(Object.values(byCluster).flatMap((layout) => layout.lines.map(([, toId]) => toId)))

  ordered.forEach((star, index) => {
    const start = DRAW_START + index * step
    if (childIds.has(star.id)) {
      lineDelay[star.id] = start
      starDelay[star.id] = start + LINE_DURATION * 0.8
    } else {
      starDelay[star.id] = start
    }
  })

  const lastStar = Math.max(DRAW_START, ...Object.values(starDelay))
  return { starDelay, lineDelay, endsAt: lastStar + 300, lineDuration: LINE_DURATION }
}

export function buildConstellation(clusters, stars) {
  const clusterIds = new Set(clusters.map((cluster) => cluster.id))
  const starIds = new Set(stars.map((star) => star.id))

  if (import.meta.env?.DEV) {
    stars.forEach((star) => {
      if (!clusterIds.has(star.cluster)) console.warn(`[inspiration] "${star.id}" has unknown cluster "${star.cluster}"`)
    })
    if (starIds.size !== stars.length) console.warn('[inspiration] duplicate star ids found')
  }

  const byCluster = {}
  const starsById = {}
  clusters.forEach((cluster) => {
    const layout = placeClusterStars(cluster, stars.filter((star) => star.cluster === cluster.id))
    byCluster[cluster.id] = layout
    layout.stars.forEach((star) => { starsById[star.id] = star })
  })

  return { byCluster, starsById, timeline: buildTimeline(stars, byCluster) }
}

// Room each cluster gets (half-width × half-height, in stage px) per mode.
const ROOM = {
  normal: { x: 175, y: 115, max: 1 },
  focus: { x: 400, y: 210, max: FOCUS_TARGET.s },
  dim: { x: 120, y: 80, max: DIM_SCALE },
}

function fitScale(extent, room) {
  return Math.min(room.max, room.x / (extent.x + 12), room.y / (extent.y + 12))
}

export function clusterTargets(clusters, focusId, byCluster) {
  const targets = {}
  let slot = 0
  clusters.forEach((cluster) => {
    const { extent } = byCluster[cluster.id]
    if (!focusId) targets[cluster.id] = { ...cluster.home, s: fitScale(extent, ROOM.normal) }
    else if (cluster.id === focusId) targets[cluster.id] = { x: FOCUS_TARGET.x, y: FOCUS_TARGET.y, s: fitScale(extent, ROOM.focus) }
    else targets[cluster.id] = { ...PERIPHERY_SLOTS[slot++ % PERIPHERY_SLOTS.length], s: fitScale(extent, ROOM.dim) }
  })
  return targets
}


export function clusterMode(clusterId, focusId) {
  if (!focusId) return 'normal'
  return clusterId === focusId ? 'focus' : 'dim'
}

export function toStagePoint(star, clusterPosition) {
  return {
    x: clusterPosition.x + star.lx * clusterPosition.s,
    y: clusterPosition.y + star.ly * clusterPosition.s,
  }
}

function parseSaved(saved) {
  if (!saved) return null
  const [year, month, day] = saved.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatSaved(saved) {
  const date = parseSaved(saved)
  if (!date) return ''
  return `${date.toLocaleString('en-US', { month: 'short' }).toLowerCase()} ${date.getDate()}`
}


export const SORTS = [
  { id: 'newest', label: 'newest' },
  { id: 'alpha', label: 'A–Z' },
]

export function sortStars(list, sortId) {
  const sorted = [...list]
  if (sortId === 'alpha') return sorted.sort((a, b) => a.title.localeCompare(b.title))
  return sorted.sort((a, b) => compareBySaved(b, a))
}
