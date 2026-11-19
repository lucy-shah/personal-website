// Pure helpers that turn the inspiration data into a drawable star map.
// Nothing here touches React or the DOM.

export const STAGE = { width: 1200, height: 640 }

const STAR_SIZE = 13
const GOLDEN_ANGLE = 2.39996
const MIN_STAR_GAP = 46
const FOCUS_TARGET = { x: 600, y: 350, s: 1.3 }
const DIM_SCALE = 0.6
// Where the other clusters drift when one is focused (in cluster order).
const PERIPHERY_SLOTS = [
  { x: 190, y: 110 },
  { x: 1010, y: 110 },
  { x: 190, y: 500 },
  { x: 600, y: 580 },
  { x: 1010, y: 500 },
]

function hashString(value) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function compareBySaved(a, b) {
  return (a.saved ?? '').localeCompare(b.saved ?? '') || a.id.localeCompare(b.id)
}

// Rough width of a focus-mode label (13px Fira at the 1.3× focus scale), in local units.
const labelWidth = (title) => (title.length * 6.4 + 24) / 1.3

function isClear(candidate, star, other) {
  const dx = candidate.lx - other.lx
  const dy = candidate.ly - other.ly
  if (Math.hypot(dx, dy * 2.2) < MIN_STAR_GAP) return false
  if (Math.abs(dy) >= 16) return true
  // Same row: the left star's label must end before the right star starts.
  const leftTitle = dx > 0 ? other.title : star.title
  return Math.abs(dx) >= labelWidth(leftTitle)
}

// Positions are local to the cluster centre. The oldest star sits in the middle
// and every newer one spirals outward, so adding a star never reshuffles the rest.
function placeClusterStars(clusterId, clusterStars) {
  const seedAngle = (hashString(clusterId) % 360) * (Math.PI / 180)
  const placed = []
  // Walk outward along a golden-angle spiral until the spot is clear of the
  // existing stars. Vertical gaps count double so focus-mode labels don't collide.
  let cursor = 0
  ;[...clusterStars].sort(compareBySaved).forEach((star) => {
    const jitter = hashString(star.id)
    let candidate
    for (let attempt = 0; attempt < 240; attempt += 1, cursor += 0.35) {
      const radius = cursor === 0 ? 0 : 38 * Math.sqrt(cursor) + (jitter % 10)
      const angle = cursor * GOLDEN_ANGLE + seedAngle + ((jitter >> 8) % 40) / 100
      candidate = { lx: radius * Math.cos(angle) * 1.3, ly: radius * Math.sin(angle) * 0.85 }
      const clear = placed.every((other) => isClear(candidate, star, other))
      if (clear) break
    }
    cursor += 1
    placed.push({
      ...star,
      lx: candidate.lx + (star.offset?.x ?? 0),
      ly: candidate.ly + (star.offset?.y ?? 0),
      size: STAR_SIZE,
    })
  })

  // Each star links to its nearest older neighbour → a tree-shaped constellation.
  const lines = []
  for (let index = 1; index < placed.length; index += 1) {
    let nearest = 0
    let nearestDistance = Infinity
    for (let other = 0; other < index; other += 1) {
      const distance = Math.hypot(placed[index].lx - placed[other].lx, placed[index].ly - placed[other].ly)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = other
      }
    }
    lines.push([placed[nearest].id, placed[index].id])
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

  if (import.meta.env.DEV) {
    stars.forEach((star) => {
      if (!clusterIds.has(star.cluster)) console.warn(`[inspiration] "${star.id}" has unknown cluster "${star.cluster}"`)
    })
    if (starIds.size !== stars.length) console.warn('[inspiration] duplicate star ids found')
  }

  const byCluster = {}
  const starsById = {}
  clusters.forEach((cluster) => {
    const layout = placeClusterStars(cluster.id, stars.filter((star) => star.cluster === cluster.id))
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
