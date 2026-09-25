import { Link } from 'react-router-dom'

const references = [
  { title: 'Jillian Weise', note: 'poet, writer, and cyborg', href: 'https://jillianweise.com/' },
  { title: 'Why I Own a Gun', note: 'Jillian Weise · essay', href: 'https://www.scribd.com/document/516375940/Why-I-Own-a-Gun-1' },
  { title: 'Summer Lee', note: 'public service and politics', href: 'https://www.youtube.com/@repsummerlee' },
  { title: 'breq.dev/directory', note: 'a corner of the internet I keep returning to', href: 'https://breq.dev/directory' },
  { title: 'Catalyst', note: 'feminism, theory, technoscience', href: 'https://catalystjournal.org/index.php/catalyst' },
  { title: 'Lost Women of Science', note: 'stories from the history of science', href: 'https://www.lostwomenofscience.org/' },
]

const boards = [
  { title: 'fuck em if they can’t take a joke', href: 'https://www.pinterest.com/lucyshah25/fuck-em-if-they-cant-take-a-joke/' },
  { title: '2025 vision board', href: 'https://www.pinterest.com/lucyshah25/2025-vision-board/' },
  { title: 'me, for me', href: 'https://www.pinterest.com/lucyshah25/me-fr/' },
]

function Inspiration() {
  return (
    <main className="inspiration-page">
      <section className="inspiration-hero" aria-labelledby="inspiration-title">
        <p className="section-label">A PERSONAL REFERENCE SHELF</p>
        <h1 id="inspiration-title">Things that<br /><em>stay with me.</em></h1>
        <p>People, work, and ideas I’ve saved because something in them caught hold.</p>
        <Link className="inspiration-back" to="/#home">Back to my little corner <span aria-hidden="true">↗</span></Link>
        <span className="inspiration-spark" aria-hidden="true">✳</span>
      </section>

      <section className="reference-section" aria-labelledby="people-work-title">
        <div className="reference-heading">
          <p className="section-label">OPEN TABS IN MY BRAIN</p>
          <h2 id="people-work-title">People &amp; work</h2>
        </div>
        <ul className="reference-list">
          {references.map((reference) => (
            <li key={reference.href}>
              <a href={reference.href} target="_blank" rel="noreferrer">
                <span><strong>{reference.title}</strong><small>{reference.note}</small></span>
                <span className="reference-arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="boards-section" aria-labelledby="boards-title">
        <p className="section-label">LITTLE WINDOWS INTO MY TASTE</p>
        <h2 id="boards-title">Saved for later.</h2>
        <div className="board-links">
          {boards.map((board) => (
            <a key={board.href} href={board.href} target="_blank" rel="noreferrer">{board.title}<span aria-hidden="true">↗</span></a>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Inspiration
