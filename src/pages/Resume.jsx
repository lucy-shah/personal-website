const sections = [
  {
    label: 'Education',
    title: 'Northeastern University',
    detail: 'Computer science',
    note: 'Dates and additional details to add',
    accent: 'resume-pink',
  },
  {
    label: 'Experience',
    title: 'Northeastern Electric Racing',
    detail: 'Firmware',
    note: 'Dates, responsibilities, and outcomes to add',
    accent: 'resume-blue',
  },
  {
    label: 'Skills',
    title: 'Technical toolkit',
    detail: 'Add languages, tools, and areas of focus',
    note: 'This section is ready for your details',
    accent: 'resume-lilac',
  },
]

function Resume() {
  return (
    <main className="content-page resume-page">
      <section className="page-intro resume-intro" aria-labelledby="resume-page-title">
        <p className="section-label">THE PRACTICAL DETAILS</p>
        <h1 id="resume-page-title">What I’ve<br /><em>been learning.</em></h1>
        <p>A clear overview of my education, experience, and skills. I’m still filling in the details.</p>
        <span className="page-spark" aria-hidden="true">✳</span>
      </section>

      <section className="resume-document" aria-label="Résumé sections">
        {sections.map((section) => (
          <article className={`resume-entry ${section.accent}`} key={section.label}>
            <p className="resume-entry-label">{section.label}</p>
            <div>
              <h2>{section.title}</h2>
              <p className="resume-entry-detail">{section.detail}</p>
            </div>
            <p className="resume-entry-note">{section.note}</p>
          </article>
        ))}
        <p className="resume-footnote">A downloadable résumé can live here when it’s ready.</p>
      </section>
    </main>
  )
}

export default Resume
