import { useEffect, useRef } from 'react'
import { formatSaved, ledToCount, pluralStars } from '../../lib/constellation.js'

function metaLine(star, cluster) {
  const saved = formatSaved(star.saved)
  return [cluster.kind.toUpperCase(), saved && `saved ${saved}`].filter(Boolean).join(' · ')
}

const stripQuotes = (text) => text.replace(/^[“"]+|[”"]+$/g, '').trim()

// Longer quotes get a smaller size so the card stays a reasonable shape.
function quoteSize(quote) {
  if (quote.length > 180) return 'is-long'
  if (quote.length > 90) return 'is-medium'
  return ''
}

function linkLabel(star) {
  return star.cluster === 'people' || star.cluster === 'websites' ? 'Visit' : 'Read more'
}

// The same card is used two ways: as a preview while hovering a star
// (`preview`: not interactive, no focus change) and pinned open after a click.
export function StarPopup({ star, cluster, style, className = '', preview = false, onClose }) {
  const cardRef = useRef(null)
  const closeRef = useRef(null)
  const count = ledToCount(star)
  const body = star.description || (star.why && `why: ${star.why}`)

  useEffect(() => {
    if (preview) return undefined
    closeRef.current?.focus({ preventScroll: true })

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose('escape')
    }
    const handlePointer = (event) => {
      if (cardRef.current?.contains(event.target)) return
      if (event.target.closest?.('[data-star-id]')) return
      onClose('outside')
    }

    document.addEventListener('keydown', handleKey)
    document.addEventListener('pointerdown', handlePointer)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('pointerdown', handlePointer)
    }
  }, [onClose, preview])

  return (
    <div
      ref={cardRef}
      className={`star-popup${star.image ? ' has-image' : ''}${preview ? ' is-preview' : ''} ${className}`}
      style={style}
      {...(preview
        ? { 'aria-hidden': true }
        : { role: 'dialog', 'aria-modal': false, 'aria-labelledby': 'star-popup-title' })}
    >
      {!preview && (
        <button ref={closeRef} type="button" className="star-popup-close" onClick={() => onClose('button')} aria-label="Close">
          ×
        </button>
      )}
      {star.image && <img className="star-popup-image" src={star.image} alt="" />}
      <div className="star-popup-body">
        <p className="star-card-meta">{metaLine(star, cluster)}</p>
        {star.quote ? (
          <blockquote className="star-popup-quote">
            <p id="star-popup-title" className={quoteSize(star.quote)}>“{stripQuotes(star.quote)}”</p>
            {star.by && <footer>— {star.by}</footer>}
          </blockquote>
        ) : (
          <>
            <h3 id="star-popup-title" className="star-popup-title">{star.title}</h3>
            {star.subtitle && <p className="star-popup-subtitle">{star.subtitle}</p>}
            {body && <p className="star-popup-text">{body}</p>}
          </>
        )}
        {(star.link || count > 0) && (
          <div className="star-popup-footer">
            {star.link ? (
              <a href={star.link} target="_blank" rel="noreferrer">
                {linkLabel(star)} →
              </a>
            ) : (
              <span />
            )}
            {count > 0 && <span className="star-popup-led">led to {pluralStars(count)}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
