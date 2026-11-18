import { useState } from 'react'
import { formatSaved, sortStars } from '../../lib/constellation.js'

const COLLAPSED_COUNT = 3

function StarGlyph({ size, color }) {
  return <span className="star-glyph" style={{ '--star-size': `${size}px`, '--star-color': color }} aria-hidden="true" />
}

function StarList({ clusters, constellation, focusId, sort }) {
  const [expanded, setExpanded] = useState({})
  const groups = clusters
    .filter((cluster) => !focusId || cluster.id === focusId)
    .map((cluster) => ({ cluster, stars: sortStars(constellation.byCluster[cluster.id].stars, sort) }))
    .filter((group) => group.stars.length > 0)

  if (groups.length === 0) {
    return <p className="star-list-empty">Nothing saved here yet. Check back soon ✧</p>
  }

  return (
    <div className="star-list">
      {groups.map(({ cluster, stars }) => {
        const isExpanded = expanded[cluster.id]
        const visible = isExpanded ? stars : stars.slice(0, COLLAPSED_COUNT)
        return (
          <section key={cluster.id} className="star-list-group" style={{ '--cluster-color': cluster.color }} aria-labelledby={`star-group-${cluster.id}`}>
            <h3 id={`star-group-${cluster.id}`} className="star-list-group-title">
              <StarGlyph size={14} color={cluster.color} />
              <span>{cluster.label}</span>
              <small>
                {visible.length} of {stars.length}
              </small>
            </h3>

            <ul>
              {visible.map((star) => (
                <li
                  key={star.id}
                  id={`star-row-${star.id}`}
                  className={`star-row${star.link ? ' has-link' : ''}`}
                >
                  <span className="star-row-glyph">
                    <StarGlyph size={15} color={cluster.color} />
                  </span>
                  <div className="star-row-title">
                    {star.link ? (
                      <a href={star.link} target="_blank" rel="noreferrer">
                        {star.title}
                      </a>
                    ) : (
                      <span>{star.title}</span>
                    )}
                    {star.subtitle && <small>{star.subtitle}</small>}
                  </div>
                  <div className="star-row-why">
                    {star.why && <p>why: {star.why}</p>}
                  </div>
                  <p className="star-row-saved">{star.saved && `saved ${formatSaved(star.saved)}`}</p>
                  <span className="star-row-arrow" aria-hidden="true">
                    →
                  </span>
                </li>
              ))}
            </ul>

            {stars.length > COLLAPSED_COUNT && (
              <button
                type="button"
                className="star-list-more"
                aria-expanded={Boolean(isExpanded)}
                onClick={() => setExpanded((current) => ({ ...current, [cluster.id]: !isExpanded }))}
              >
                {isExpanded ? `– show fewer ${cluster.label.toLowerCase()}` : `+ show all ${cluster.label.toLowerCase()}`}
              </button>
            )}
          </section>
        )
      })}
    </div>
  )
}

export default StarList
