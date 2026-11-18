import { useMemo, useState } from 'react'
import StarList from '../components/inspiration/StarList.jsx'
import StarMap from '../components/inspiration/StarMap.jsx'
import TalentedPeople from '../components/inspiration/TalentedPeople.jsx'
import { clusters, stars, talentedPeople } from '../data/inspiration.js'
import { SORTS, buildConstellation, mostRecentClusterId } from '../lib/constellation.js'
import '../styles/inspiration.css'

const prefersList = () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches

function Inspiration() {
  const constellation = useMemo(() => buildConstellation(clusters, stars), [])
  const [view, setView] = useState(() => (prefersList() ? 'list' : 'map'))
  // Opens centred on whichever constellation was updated most recently.
  const [focusId, setFocusId] = useState(() => mostRecentClusterId(stars))
  const [selectedId, setSelectedId] = useState(null)
  const [sort, setSort] = useState('newest')


  const chooseCluster = (clusterId) => {
    setSelectedId(null)
    setFocusId((current) => (clusterId === null || current === clusterId ? null : clusterId))
  }

  const switchView = (nextView) => {
    setSelectedId(null)
    setView(nextView)
  }

  return (
    <main className="inspiration-page">
      <section className="brain-map" aria-labelledby="brain-map-title">
        <header className="brain-map-header">
          <div>
            <h1 id="brain-map-title" className="inspo-title">Things that inspire me</h1>
            <p className="brain-map-subtitle">A map of my brain</p>
          </div>
          {view === 'list' && (
            <div className="view-toggle" role="group" aria-label="View">
              <button type="button" aria-pressed={false} onClick={() => switchView('map')}>✧ Map</button>
              <button type="button" aria-pressed className="is-active">List</button>
            </div>
          )}
        </header>

        <div className="brain-map-controls">
          <div className="cluster-chips" role="group" aria-label="Filter by cluster">
            <button type="button" className={!focusId ? 'is-active' : ''} aria-pressed={!focusId} onClick={() => chooseCluster(null)}>
              Everything
            </button>
            {clusters.map((cluster) => (
              <button
                key={cluster.id}
                type="button"
                className={focusId === cluster.id ? 'is-active' : ''}
                aria-pressed={focusId === cluster.id}
                onClick={() => chooseCluster(cluster.id)}
              >
                {cluster.label}
              </button>
            ))}
          </div>

          {view === 'map' ? (
            <button type="button" className="view-as-list" onClick={() => switchView('list')}>
              view as list <span aria-hidden="true">☰</span>
            </button>
          ) : (
            <div className="list-sort" role="group" aria-label="Sort">
              <span>sort:</span>
              {SORTS.map((option) => (
                <button key={option.id} type="button" className={sort === option.id ? 'is-active' : ''} aria-pressed={sort === option.id} onClick={() => setSort(option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {view === 'map' ? (
          <>
            <StarMap
              clusters={clusters}
              constellation={constellation}
              focusId={focusId}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onFocusCluster={chooseCluster}
            />
            <p className="brain-map-legend">tap a star to open it</p>
          </>
        ) : (
          <StarList clusters={clusters} constellation={constellation} focusId={focusId} sort={sort} />
        )}
      </section>

      <TalentedPeople people={talentedPeople} />
    </main>
  )
}

export default Inspiration
