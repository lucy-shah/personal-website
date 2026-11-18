import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { STAGE, clusterMode, clusterTargets, isNewThisWeek, toStagePoint } from '../../lib/constellation.js'
import { StarPopup } from './StarCards.jsx'
import useTweenedLayout from './useTweenedLayout.js'

const MIN_ZOOM = 1
const MAX_ZOOM = 2.5
const ZOOM_STEP = 0.35
const MIN_FIT = 0.55
const PINK = '#e9a3c1'
const DIM = 'rgba(242, 238, 228, .35)'
const CREAM = '#f2eee4'
const POPUP_WIDTH = 380 // widest card (quotes); keeps placement on-screen for all

// Deterministic background dust so the sky doesn't shimmer between renders.
const DUST = (() => {
  let seed = 7
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  return Array.from({ length: 140 }, () => ({
    x: random() * STAGE.width,
    y: random() * STAGE.height,
    r: 0.5 + random() * 0.8,
    o: 0.15 + random() * 0.3,
  }))
})()

function clampPan(pan, scale, size) {
  const width = STAGE.width * scale
  const height = STAGE.height * scale
  return {
    x: width <= size.width ? (size.width - width) / 2 : Math.min(0, Math.max(size.width - width, pan.x)),
    y: height <= size.height ? (size.height - height) / 2 : Math.min(0, Math.max(size.height - height, pan.y)),
  }
}

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
  const dragRef = useRef(null)
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
  const introLength = constellation.timeline.ledToDelay + 900
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
  const canPan = STAGE.width * scale > size.width + 1 || STAGE.height * scale > size.height + 1

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

  const zoomBy = (delta) => {
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta))
    if (nextZoom === zoom) return
    const ratio = nextZoom / zoom
    const centerX = size.width / 2
    const centerY = size.height / 2
    setRawPan(
      clampPan(
        { x: centerX - (centerX - effectivePan.x) * ratio, y: centerY - (centerY - effectivePan.y) * ratio },
        fit * nextZoom,
        size,
      ),
    )
    setZoom(nextZoom)
  }

  const handlePointerDown = (event) => {
    if (!canPan || event.target.closest('button, a, .star-popup')) return
    dragRef.current = { x: event.clientX, y: event.clientY, pan: effectivePan }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return
    setRawPan(clampPan({ x: drag.pan.x + event.clientX - drag.x, y: drag.pan.y + event.clientY - drag.y }, scale, size))
  }

  const endDrag = () => {
    dragRef.current = null
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
        className={`star-map-viewport${canPan ? ' can-pan' : ''}`}
        style={{ height: size.height }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className="star-stage"
          style={{ transform: `translate(${effectivePan.x}px, ${effectivePan.y}px) scale(${scale})` }}
        >
          <svg className="star-stage-sky" viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} width={STAGE.width} height={STAGE.height} aria-hidden="true">
            {DUST.map((dust, index) => (
              <circle key={index} cx={dust.x} cy={dust.y} r={dust.r} fill="#f2eee4" fillOpacity={dust.o} />
            ))}
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
            <g className="star-led-to" style={{ animationDelay: delay(timeline.ledToDelay) }}>
              {constellation.ledToLinks.map(({ from, to }) => {
                const start = placedById[from]
                const end = placedById[to]
                const visible = !focusId || start.cluster.id === focusId || end.cluster.id === focusId
                return (
                  <line
                    key={`${from}->${to}`}
                    className={visible ? '' : 'is-hidden'}
                    x1={start.point.x}
                    y1={start.point.y}
                    x2={end.point.x}
                    y2={end.point.y}
                  />
                )
              })}
            </g>
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
          <button type="button" onClick={() => zoomBy(ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
            +
          </button>
          <button type="button" onClick={() => zoomBy(-ZOOM_STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
            –
          </button>
        </div>
      </div>
    </div>
  )
}

export default StarMap
