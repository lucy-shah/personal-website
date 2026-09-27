const experience = [
  {
    organization: 'Northeastern University Electric Racing Team',
    role: 'Embedded Software Developer',
    dates: 'Aug 2025 – Present',
    accent: 'resume-blue',
    highlights: [
      'Developed an SHT30 temperature sensor driver over I²C on STM32 HAL, with custom read, write, and blocking-read abstractions for a Formula SAE race car.',
      'Refactored shutdown-circuit sensing across fault pins with interrupt-driven and timer-based polling, improving fault detection response time and reducing false-positive shutdowns by 50%.',
      'Collaborated with firmware and electrical subteams of 15–20 members, completing 3+ tickets per week.',
    ],
  },
  {
    organization: 'The Northeastern University Debate Society',
    role: 'VP of Finance',
    dates: 'Aug 2025 – Present',
    accent: 'resume-pink',
    highlights: [
      'Managed an annual budget of more than $14,000, allocating funds for tournament travel, payments, and hosting costs.',
      'Built and maintained an Excel cash-flow tracker to monitor club finances, increasing savings by 12%.',
      'Processed, reconciled, and recorded reimbursements for 15+ tournament trips per semester.',
      'Presented quarterly financial reports on spending trends and budget reallocations.',
    ],
  },
  {
    organization: 'Northeastern AI Club',
    role: 'Machine Learning Researcher',
    dates: 'Aug 2025 – May 2026',
    accent: 'resume-lilac',
    highlights: [
      'Collaborated to develop machine-learning algorithms for accurately mapping and modeling neutron reflectometry data.',
      'Analyzed model performance across datasets with 1,000+ rows, investigating overfitting, bias–variance tradeoffs, evaluation metrics, vanishing gradients, and convergence.',
    ],
  },
  {
    organization: 'Conejo Parks and Recreation',
    role: 'Summer Camp Counselor',
    dates: 'May–Aug 2025 · May–Aug 2026',
    accent: 'resume-blue',
    highlights: [
      'Supervised and mentored groups of 15–30 children ages 6–16 through daily activities and educational programs.',
      'Resolved conflicts and adapted programming to changing conditions and resource constraints.',
      'Collaborated with fellow counselors to create an inclusive and supportive camp environment.',
    ],
  },
]

const skillGroups = [
  {
    label: 'Languages',
    skills: 'Python, JavaScript, TypeScript, HTML, CSS, C, C++, Java, SQL',
  },
  {
    label: 'Frameworks and tools',
    skills: 'React, FastAPI, NumPy, Pandas, Docker, Git, Bash, Supabase, STM32CubeMX, FreeRTOS',
  },
]

function Resume() {
  return (
    <main className="content-page resume-page">
      <section className="page-intro resume-intro" aria-labelledby="resume-page-title">
        <p className="section-label">THE PRACTICAL DETAILS</p>
        <h1 id="resume-page-title">My resume</h1>
        <p>Second year studying computer science and finance at Northeastern. Available for internships January–August 2027.</p>
        <span className="page-spark" aria-hidden="true">✳</span>
      </section>

      <div className="resume-document">
        <div className="resume-contact-line">
          <a href={`${import.meta.env.BASE_URL}Lucy-Shah-Resume.pdf?v=2`} download>
            Download a copy of my resume here <span aria-hidden="true"></span>
          </a>
        </div>

        <section className="resume-section resume-education-section" aria-labelledby="resume-education-title">
          <div className="resume-section-heading">
            <h2 id="resume-education-title">Education</h2>
          </div>
          <article className="resume-education">
            <div className="resume-education-topline">
              <div>
                <h3>Northeastern University</h3>
                <p>Boston, Massachusetts</p>
              </div>
              <p className="resume-date">Expected May 2029</p>
            </div>
            <p className="resume-degree">Candidate for Bachelor of Science in Computer Science and Finance</p>
            <div className="resume-education-details">
              <p><strong>GPA:</strong> 4.0</p>
              <p><strong>Relevant coursework:</strong> Programming Fundamentals I &amp; II, Discrete Structures, Algorithms and Data, Accounting I &amp; II</p>
            </div>
          </article>
        </section>

        <section className="resume-section resume-experience-section" aria-labelledby="resume-experience-title">
          <div className="resume-section-heading">
            <h2 id="resume-experience-title">Experience</h2>
          </div>
          <div className="resume-role-list">
            {experience.map((item) => (
              <article className={`resume-role ${item.accent}`} key={`${item.organization}-${item.role}`}>
                <div className="resume-role-meta">
                  <p className="resume-role-organization">{item.organization}</p>
                  <p className="resume-date">{item.dates}</p>
                </div>
                <div className="resume-role-content">
                  <h3>{item.role}</h3>
                  <ul>
                    {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="resume-section resume-projects-section" aria-labelledby="resume-projects-title">
          <div className="resume-section-heading">
            <h2 id="resume-projects-title">Projects</h2>
          </div>
          <article className="resume-project resume-blue">
            <div className="resume-project-meta">
              <h3>Husky Club Quest</h3>
              <p className="resume-date">Jan–May 2026</p>
            </div>
            <div>
              <p className="resume-project-summary">Northeastern Boston · Jan–May 2026</p>
              <ul>
                <li>Scraped, built, and maintained a Supabase PostgreSQL database of 600+ Northeastern student organizations.</li>
                <li>Developed FastAPI backend endpoints for club search, filtering, and student rating functionality.</li>
                <li>Designed the database schema and wrote SQL queries to manage club metadata and aggregate user-submitted ratings.</li>
              </ul>
            </div>
          </article>
        </section>

        <section className="resume-section resume-skills-section" aria-labelledby="resume-skills-title">
          <div className="resume-section-heading">
            <h2 id="resume-skills-title">Skills</h2>
          </div>
          <div className="resume-skills-list">
            {skillGroups.map((group) => (
              <div className="resume-skill-group" key={group.label}>
                <h3>{group.label}</h3>
                <p>{group.skills}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section resume-skills-section" aria-labelledby="resume-interests-title">
          <div className="resume-section-heading">
            <h2 id="resume-interests-title">Interests</h2>
          </div>
          <p className="resume-project-summary">Reading, cooking, running, debate, and French</p>
        </section>
      </div>
    </main>
  )
}

export default Resume
