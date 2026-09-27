const referencePlaceholders = Array.from({ length: 6 }, (_, index) => `reference-${index + 1}`)
const boardPlaceholders = Array.from({ length: 3 }, (_, index) => `board-${index + 1}`)

function Inspiration() {
  return (
    <main className="inspiration-page">
      <section className="inspiration-hero" aria-labelledby="inspiration-title">
        <p className="section-label">A PERSONAL REFERENCE SHELF</p>
        <h1 id="inspiration-title">Things that inspire me</h1>
        <p>Not much to see here yet, but check back soon!</p>
        <span className="inspiration-link-placeholder">Link coming soon <span aria-hidden="true">↗</span></span>
        <span className="inspiration-spark" aria-hidden="true">✳</span>
      </section>

      <section className="reference-section" aria-labelledby="people-work-title">
        <div className="reference-heading">
          <p className="section-label">OPEN TABS IN MY BRAIN</p>
          <h2 id="people-work-title">People &amp; work</h2>
        </div>
        <ul className="reference-list">
          {referencePlaceholders.map((placeholder) => (
            <li key={placeholder}>
              <span><strong>Coming soon</strong><small>A reference to add later</small></span>
              <span className="reference-arrow" aria-hidden="true">✧</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="boards-section" aria-labelledby="boards-title">
        <p className="section-label">LITTLE WINDOWS INTO MY TASTE</p>
        <h2 id="boards-title">Saved for later.</h2>
        <div className="board-links" aria-label="Saved inspiration placeholders">
          {boardPlaceholders.map((placeholder) => (
            <span className="board-placeholder" key={placeholder}>Board to add later</span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Inspiration
