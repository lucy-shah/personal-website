// Rotations / tape angles / photo tints cycle so the wall looks hand-pinned
// (values from the Figma "Talented people · Polaroids" frame).
const TILTS = [-2.5, -3, 2.5, -2, 3, -1.5, 2, -3]
const TAPE_TILTS = [4, -5, 6]
const PHOTO_TINTS = [
  'rgba(94, 116, 104, .75)',
  'rgba(201, 143, 122, .75)',
  'rgba(199, 185, 226, .75)',
  'rgba(58, 74, 66, .75)',
  'rgba(233, 163, 193, .75)',
]
// The wall is always at least two rows of four, like the design. Empty spots
// stay as blank polaroids until someone is added.
const MIN_SLOTS = 8

function slotStyle(index) {
  return {
    '--tilt': `${TILTS[index % TILTS.length]}deg`,
    '--tape-tilt': `${TAPE_TILTS[index % TAPE_TILTS.length]}deg`,
    '--photo-tint': PHOTO_TINTS[index % PHOTO_TINTS.length],
  }
}

function Polaroid({ person, index }) {
  const Tag = person.link ? 'a' : 'div'
  return (
    <Tag
      className="polaroid"
      {...(person.link ? { href: person.link, target: '_blank', rel: 'noreferrer' } : {})}
      style={slotStyle(index)}
    >
      <span className="polaroid-tape" aria-hidden="true" />
      <span className="polaroid-photo">
        {person.photo && <img src={person.photo} alt={`Photo of ${person.name}`} loading="lazy" />}
      </span>
      <span className="polaroid-caption">
        <strong>{person.name}</strong>
        {person.role && <small>{person.role}</small>}
      </span>
    </Tag>
  )
}

function TalentedPeople({ people }) {
  const blanks = Math.max(0, MIN_SLOTS - people.length)

  return (
    <section className="talented-people" aria-labelledby="talented-people-title">
      <h2 id="talented-people-title" className="inspo-title">My talented friends</h2>
      <p className="talented-people-intro">People I know whose work I love. Click to see what they’re working on.</p>

      <ul className="polaroid-wall">
        {people.map((person, index) => (
          <li key={person.id}>
            <Polaroid person={person} index={index} />
          </li>
        ))}
        {Array.from({ length: blanks }, (_, offset) => (
          <li key={`blank-${offset}`} aria-hidden="true">
            <div className="polaroid is-blank" style={slotStyle(people.length + offset)}>
              <span className="polaroid-tape" />
              <span className="polaroid-photo" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default TalentedPeople
