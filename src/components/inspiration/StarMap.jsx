import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { STAGE, clusterMode, clusterTargets, isNewThisWeek, toStagePoint } from '../../lib/constellation.js'
import { StarPopup } from './StarCards.jsx'
import useTweenedLayout from './useTweenedLayout.js'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 1.4 // each +/– click multiplies or divides the zoom by this
// How far past the edge of the sky you can drag, as a share of the viewport.
const OVERSCROLL = 0.5
const MIN_FIT = 0.55
const PINK = '#e9a3c1'
const DIM = 'rgba(242, 238, 228, .35)'
const CREAM = '#f2eee4'
const POPUP_WIDTH = 380 // widest card (quotes); keeps placement on-screen for all

// Background dust is a repeating tile painted behind the map, so the sky never
// runs out however far you drag. Two layers with different tile sizes hide the
// repeat; the far one drifts slower for a little depth. Seeded so it's stable.
function dustTile({ width, height, count, seed, radius, opacity }) {
  let state = seed
  const random = () => {
    state = (state * 16807) % 2147483647
    return state / 2147483647
  }
  const dots = Array.from({ length: count }, () => {
    const x = (random() * width).toFixed(1)
    const y = (random() * height).toFixed(1)
    const r = (radius[0] + random() * (radius[1] - radius[0])).toFixed(2)
    const o = (opacity[0] + random() * (opacity[1] - opacity[0])).toFixed(2)
    return `<circle cx='${x}' cy='${y}' r='${r}' fill='%23f2eee4' fill-opacity='${o}'/>`
  }).join('')
  return { width, height, url: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>${dots}</svg>")` }
}

const NEAR_DUST = dustTile({ width: STAGE.width, height: STAGE.height, count: 140, seed: 7, radius: [0.5, 1.3], opacity: [0.15, 0.45] })
const FAR_DUST = dustTile({ width: 530, height: 410, count: 46, seed: 31, radius: [0.4, 0.9], opacity: [0.08, 0.22] })
const FAR_DRIFT = 0.55 // far layer moves at this fraction of your drag

function skyStyle(pan, scale) {
  const far = scale * 0.85
  return {
    backgroundImage: `${NEAR_DUST.url}, ${FAR_DUST.url}`,
    backgroundSize: `${NEAR_DUST.width * scale}px ${NEAR_DUST.height * scale}px, ${FAR_DUST.width * far}px ${FAR_DUST.height * far}px`,
    backgroundPosition: `${pan.x}px ${pan.y}px, ${pan.x * FAR_DRIFT}px ${pan.y * FAR_DRIFT}px`,
  }
}

// Keeps the sky mostly in view while letting you drag a little past its edges.
function clampAxis(value, content, viewport) {
  const centred = (viewport - content) / 2
  const slack = viewport * OVERSCROLL
  const low = Math.min(viewport - content, centred) - slack
  const high = Math.max(0, centred) + slack
  return Math.min(high, Math.max(low, value))
}

function clampPan(pan, scale, size) {
  return {
    x: clampAxis(pan.x, STAGE.width * scale, size.width),
    y: clampAxis(pan.y, STAGE.height * scale, size.height),
  }
}

const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

function starColor(mode, cluster) {
  if (mode === 'focus') return PINK
  if (mode === 'dim') return DIM
  return cluster.color
}

// Glow colour must be opaque, so dim stars glow cream rather than see-through.
function glowColor(mode, cluster) {
  if (mode === 'focus') return PINK
  if (mode === 'dim') return CREAM
  return cluster.color
}

const ms = (value) => `${Math.round(value)}ms`

function StarMap({ clusters, constellation, focusId, selectedId, onSelect, onFocusCluster }) {
  const viewportRef = useRef(null)
  const pointersRef = useRef(new Map())
  const gestureRef = useRef(null)
  const zoomAtRef = useRef(null)
  const [width, setWidth] = useState(STAGE.width)
  const [zoom, setZoom] = useState(1)
  const [rawPan, setRawPan] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [prevFocus, setPrevFocus] = useState(focusId)
  const [introDone, setIntroDone] = useState(false)

  if (prevFocus !== focusId) {
    setPrevFocus(focusId)
    setZoom(1)
    setRawPan(null)
    setHoveredId(null)
  }

  // After the opening draw-in, anything that mounts later (labels on a chip click)
  // should appear immediately rather than wait on its load-time delay.
  const introLength = constellation.timeline.endsAt + 900
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), introLength)
    return () => clearTimeout(timer)
  }, [introLength])

  useEffect(() => {
    const element = viewportRef.current
    if (!element) return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const fit = Math.max(width / STAGE.width, MIN_FIT)
  const scale = fit * zoom
  const size = { width, height: STAGE.height * Math.min(fit, 1) }
  const centeredPan = { x: (size.width - STAGE.width * scale) / 2, y: (size.height - STAGE.height * scale) / 2 }
  const effectivePan = clampPan(rawPan ?? centeredPan, scale, size)
  const isDefaultView = zoom === 1 && rawPan === null

  const targets = useMemo(() => clusterTargets(clusters, focusId, constellation.byCluster), [clusters, focusId, constellation])
  const positions = useTweenedLayout(targets)

  const placedStars = clusters.flatMap((cluster) => {
    const position = positions[cluster.id]
    const mode = clusterMode(cluster.id, focusId)
    return constellation.byCluster[cluster.id].stars.map((star) => ({
      star,
      cluster,
      mode,
      point: toStagePoint(star, position),
      size: Math.max(5, star.size * position.s),
      // Names shrink with their constellation (13px at full focus size) so they
      // keep the spacing the layout reserved for them, but never below legible.
      labelSize: Math.max(9, (13 * position.s) / 1.3),
    }))
  })
  const placedById = Object.fromEntries(placedStars.map((placed) => [placed.star.id, placed]))

  const toScreen = (point) => ({ x: effectivePan.x + point.x * scale, y: effectivePan.y + point.y * scale })

  // Zoom so the point under `anchor` (viewport px) stays put — like a real map.
  const zoomAt = (nextZoom, anchor = { x: size.width / 2, y: size.height / 2 }, fromZoom = zoom, fromPan = effectivePan) => {
    const target = clampZoom(nextZoom)
    const ratio = target / fromZoom
    setRawPan(
      clampPan({ x: anchor.x - (anchor.x - fromPan.x) * ratio, y: anchor.y - (anchor.y - fromPan.y) * ratio }, fit * target, size),
    )
    setZoom(target)
  }

  const resetView = () => {
    setZoom(1)
    setRawPan(null)
  }

  const localPoint = (event) => {
    const rect = viewportRef.current.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  // Trackpad pinch and ⌘/Ctrl + scroll zoom the map. Plain scrolling still
  // scrolls the page. Needs a native listener so it can preventDefault.
  useEffect(() => {
    zoomAtRef.current = { zoomAt, zoom }
  })
  useEffect(() => {
    const element = viewportRef.current
    if (!element) return undefined
    const handleWheel = (event) => {
      if (!event.ctrlKey && !event.metaKey) return
      event.preventDefault()
      const rect = element.getBoundingClientRect()
      const { zoomAt: zoomAtLatest, zoom: current } = zoomAtRef.current
      // Trackpad pinches send many small deltas, mouse wheels a few big ones —
      // capping each step keeps both smooth (≤ ~1.3× per event).
      const step = Math.max(-25, Math.min(25, event.deltaY))
      zoomAtLatest(current * Math.exp(-step * 0.01), { x: event.clientX - rect.left, y: event.clientY - rect.top })
    }
    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [])

  // One pointer drags the map; two (touch) pinch-zoom it.
  const startGesture = () => {
    const points = [...pointersRef.current.values()]
    if (points.length === 1) gestureRef.current = { type: 'drag', start: points[0], pan: effectivePan }
    else if (points.length === 2) {
      gestureRef.current = { type: 'pinch', distance: distance(...points), mid: midpoint(...points), zoom, pan: effectivePan }
    } else gestureRef.current = null
  }

  const handlePointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('button, a, .star-popup')) return
    pointersRef.current.set(event.pointerId, localPoint(event))
    event.currentTarget.setPointerCapture(event.pointerId)
    startGesture()
  }

  const handlePointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) return
    pointersRef.current.set(event.pointerId, localPoint(event))
    const gesture = gestureRef.current
    if (!gesture) return
    const points = [...pointersRef.current.values()]
    if (gesture.type === 'drag') {
      setRawPan(clampPan({ x: gesture.pan.x + points[0].x - gesture.start.x, y: gesture.pan.y + points[0].y - gesture.start.y }, scale, size))
    } else if (points.length === 2) {
      const mid = midpoint(...points)
      const nextZoom = clampZoom((gesture.zoom * distance(...points)) / gesture.distance)
      const ratio = nextZoom / gesture.zoom
      setRawPan(
        clampPan({ x: mid.x - (gesture.mid.x - gesture.pan.x) * ratio, y: mid.y - (gesture.mid.y - gesture.pan.y) * ratio }, fit * nextZoom, size),
      )
      setZoom(nextZoom)
    }
  }

  const endPointer = (event) => {
    if (!pointersRef.current.delete(event.pointerId)) return
    startGesture()
  }

  const handleDoubleClick = (event) => {
    if (event.target.closest('button, a, .star-popup')) return
    zoomAt(zoom * 1.8, localPoint(event))
  }

  const handleClose = useCallback(
    (reason) => {
      const id = selectedId
      onSelect(null)
      if (reason === 'outside') return
      requestAnimationFrame(() => {
        viewportRef.current?.querySelector(`[data-star-id="${CSS.escape(id)}"]`)?.focus({ preventScroll: true })
        // Returning focus would re-open the hover preview; the card was just closed.
        setHoveredId(null)
      })
    },
    [onSelect, selectedId],
  )

  const selected = selectedId ? placedById[selectedId] : null
  const hovered = hoveredId && hoveredId !== selectedId && !selected ? placedById[hoveredId] : null
  const compact = size.width < 640
  const totalStars = placedStars.length
  const { timeline } = constellation
  const delay = (value) => ms(introDone ? 0 : value)

  // Where a card sits next to a star: to the right if it fits, else the left,
  // else (narrow screens) centred as a modal.
  const cardLayout = (placed) => {
    const screen = toScreen(placed.point)
    const fitsRight = screen.x + 60 + POPUP_WIDTH <= size.width - 12
    const fitsLeft = screen.x - 60 - POPUP_WIDTH >= 12
    const side = fitsRight ? 'right' : fitsLeft ? 'left' : null
    const vertical = screen.y < size.height / 2
      ? { top: Math.max(16, screen.y - 120) }
      : { bottom: Math.max(16, size.height - screen.y - 120) }
    return {
      screen,
      side: compact ? null : side,
      style: compact || !side
        ? undefined
        : { ...vertical, left: side === 'right' ? screen.x + 60 : screen.x - 60 - POPUP_WIDTH },
    }
  }

  const popupLayout = selected ? cardLayout(selected) : null
  // Hover previews only where there's room to anchor them (not on phones).
  const previewLayout = hovered && !compact ? cardLayout(hovered) : null

  return (
    <div className="star-map">
      <div
        ref={viewportRef}
        className={`star-map-viewport${zoom > 1 ? ' is-zoomed' : ''}`}
        style={{ height: size.height, ...skyStyle(effectivePan, scale) }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="star-stage"
          style={{ transform: `translate(${effectivePan.x}px, ${effectivePan.y}px) scale(${scale})` }}
        >
          <svg className="star-stage-sky" viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} width={STAGE.width} height={STAGE.height} aria-hidden="true">
            {clusters.map((cluster) => {
              const mode = clusterMode(cluster.id, focusId)
              return (
                <g key={cluster.id} className={`star-lines mode-${mode}`} style={{ '--line-color': cluster.color }}>
                  {constellation.byCluster[cluster.id].lines.map(([fromId, toId]) => {
                    const from = placedById[fromId].point
                    const to = placedById[toId].point
                    return (
                      <line
                        key={`${fromId}-${toId}`}
                        className="star-line"
                        pathLength="1"
                        style={{ animationDelay: delay(timeline.lineDelay[toId] ?? 0), animationDuration: ms(timeline.lineDuration) }}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                      />
                    )
                  })}
                </g>
              )
            })}
          </svg>

          {clusters.map((cluster) => {
            const position = positions[cluster.id]
            const mode = clusterMode(cluster.id, focusId)
            const firstStar = constellation.byCluster[cluster.id].stars[0]
            return (
              <button
                type="button"
                key={cluster.id}
                className={`star-cluster-label mode-${mode}`}
                style={{
                  left: position.x,
                  top: position.y + constellation.byCluster[cluster.id].labelY * position.s,
                  '--label-color': cluster.color,
                  animationDelay: delay(firstStar ? timeline.starDelay[firstStar.id] - 150 : 0),
                }}
                aria-pressed={focusId === cluster.id}
                aria-label={focusId === cluster.id ? `Show everything` : `Centre ${cluster.label}`}
                onClick={() => onFocusCluster(cluster.id)}
              >
                {cluster.label}
              </button>
            )
          })}

          {placedStars.map(({ star, cluster, mode, point, size: glyphSize, labelSize }) => {
            const isSelected = star.id === selectedId
            const isLit = star.id === hoveredId || isSelected
            return (
              <div
                key={star.id}
                className={`star-node-wrap mode-${mode}`}
                style={{ left: point.x, top: point.y, '--delay': delay(timeline.starDelay[star.id] ?? 0) }}
              >
                <button
                  type="button"
                  className={`star-node${isLit ? ' is-lit' : ''}${isSelected ? ' is-selected' : ''}`}
                  data-star-id={star.id}
                  style={{
                    '--star-size': `${isSelected ? Math.max(glyphSize * 1.6, 26) : glyphSize}px`,
                    '--star-color': isSelected ? PINK : starColor(mode, cluster),
                    '--glow': isSelected ? PINK : glowColor(mode, cluster),
                  }}
                  aria-label={`${star.title}, ${cluster.label}`}
                  aria-expanded={isSelected}
                  onClick={() => onSelect(isSelected ? null : star.id)}
                  onPointerEnter={() => setHoveredId(star.id)}
                  onPointerLeave={() => setHoveredId((current) => (current === star.id ? null : current))}
                  onFocus={() => setHoveredId(star.id)}
                  onBlur={() => setHoveredId((current) => (current === star.id ? null : current))}
                >
                  <span className="star-glyph" />
                </button>
                <span
                  className={`star-node-label mode-${mode}${point.x > STAGE.width * 0.72 ? ' to-left' : ''}`}
                  style={{ '--label-gap': `${glyphSize / 2 + 6}px`, fontSize: labelSize }}
                >
                  {star.title}
                  {mode === 'normal' && isNewThisWeek(star.saved) && <span className="star-node-new">← new this week</span>}
                </span>
              </div>
            )
          })}
        </div>

        {totalStars === 0 && <p className="star-map-empty">The sky’s still filling in. Check back soon ✧</p>}

        {selected && popupLayout && (
          <>
            <div className="star-map-dim" aria-hidden="true" />
            <div
              className="star-selected-overlay"
              style={{ left: popupLayout.screen.x, top: popupLayout.screen.y }}
              aria-hidden="true"
            >
              <span className="star-selected-glow" style={{ '--glow': PINK }}>
                <span className="star-glyph" style={{ '--star-size': `${Math.max(selected.size * 1.6, 26) * scale}px`, '--star-color': PINK }} />
              </span>
              {popupLayout.side && <span className={`star-connector to-${popupLayout.side}`} />}
            </div>
            <StarPopup
              key={selected.star.id}
              star={selected.star}
              cluster={selected.cluster}
              style={popupLayout.style}
              className={popupLayout.style ? 'is-anchored' : 'is-centered'}
              onClose={handleClose}
            />
          </>
        )}

        {hovered && previewLayout?.style && (
          <>
            <div className="star-selected-overlay" style={{ left: previewLayout.screen.x, top: previewLayout.screen.y }} aria-hidden="true">
              <span className={`star-connector to-${previewLayout.side}`} />
            </div>
            <StarPopup
              key={`preview-${hovered.star.id}`}
              star={hovered.star}
              cluster={hovered.cluster}
              style={previewLayout.style}
              className="is-anchored"
              preview
              onClose={handleClose}
            />
          </>
        )}

        <div className="star-zoom" role="group" aria-label="Zoom">
          <button type="button" onClick={() => zoomAt(zoom * ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomAt(zoom / ZOOM_STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
            –
          </button>
          {!isDefaultView && (
            <button type="button" className="star-zoom-reset" onClick={resetView} aria-label="Reset view" title="Reset view">
              ⟲
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StarMap
