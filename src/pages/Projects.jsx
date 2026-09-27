import projects from '../data/projects.js'

function ProjectPlaceholder({ project }) {
  return (
    <div className="project-image-placeholder" role="img" aria-label={project.imagePlaceholder}>
      <span aria-hidden="true">✧</span>
      <p>{project.imagePlaceholder}</p>
    </div>
  )
}

function Projects() {
  return (
    <main className="content-page projects-page">
      <section className="page-intro projects-intro" aria-labelledby="projects-page-title">
        <p className="section-label">THINGS I’VE BEEN MAKING</p>
        <h1 id="projects-page-title">My projects</h1>
        <p>A growing collection of projects I’ve built, and how they came together.</p>
        <span className="page-spark" aria-hidden="true">◇</span>
      </section>

      <section className="project-accordion-list" aria-label="Projects">
        {projects.map((project) => (
          <details className={`project-accordion ${project.accent}`} key={project.slug}>
            <summary className="project-accordion-summary">
              <div>
                <p className="project-detail">{project.detail}</p>
                <h2>{project.title}</h2>
                <p className="project-accordion-teaser">{project.description}</p>
              </div>
              <span className="project-accordion-toggle" aria-hidden="true">+</span>
            </summary>
            <div className="project-accordion-body">
              <ProjectPlaceholder project={project} />
              <div className="project-accordion-content">
                <p>{project.overview}</p>
                <ul>
                  {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
                <p className="project-stack"><span>Built with</span> {project.stack}</p>
                {project.link && (
                  <a className="project-live-link" href={project.link} target="_blank" rel="noreferrer">
                    View the homepage <span aria-hidden="true"></span>
                  </a>
                )}
              </div>
            </div>
          </details>
        ))}
        <p className="projects-signoff">More coming soon... <span aria-hidden="true">✿</span></p>
      </section>
    </main>
  )
}

export default Projects
