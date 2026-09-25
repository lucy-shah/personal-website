import projects from '../data/projects.js'

function ProjectArtwork({ project }) {
  if (project.image) {
    return <img src={project.image} alt={project.imageAlt} />
  }

  return (
    <div className="project-artwork-note" aria-hidden="true">
      <span>✿</span>
      <small>a little corner<br />of the internet</small>
    </div>
  )
}

function Projects() {
  return (
    <main className="content-page projects-page">
      <section className="page-intro projects-intro" aria-labelledby="projects-page-title">
        <p className="section-label">THINGS I’VE BEEN MAKING</p>
        <h1 id="projects-page-title">Curiosity,<br /><em>in progress.</em></h1>
        <p>A growing collection of projects, experiments, and ideas I’m learning by making.</p>
        <span className="page-spark" aria-hidden="true">◇</span>
      </section>

      <section className="project-detail-list" aria-label="Project details">
        {projects.map((project) => (
          <article className={`project-detail-row ${project.accent}`} key={project.slug}>
            <div className="project-detail-art">
              <ProjectArtwork project={project} />
            </div>
            <div className="project-detail-copy">
              <p className="project-detail">{project.detail}</p>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
            </div>
            <span className="project-detail-mark" aria-hidden="true">✦</span>
          </article>
        ))}
        <p className="projects-signoff">More as they come together <span aria-hidden="true">✿</span></p>
      </section>
    </main>
  )
}

export default Projects
