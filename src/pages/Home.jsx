import { Link } from 'react-router-dom'
import profileImage from '../assets/profileIMG-optimized.jpg'
import projects from '../data/projects.js'
import aboutMeIMG from "../assets/aboutMeIMG.png";

function Home() {
  return (
    <main className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-photo-wrap">
          <div className="hero-photo-orbit" aria-hidden="true" />
          <figure className="hero-photo">
            <img src={profileImage} alt="In Boston at night" />
          </figure>
          <span className="hero-photo-side-note" aria-hidden="true">welcome to my corner of the internet</span>
        </div>

        <div className="hero-copy">
          <p className="hero-greeting">boston, ma </p>
          <h1 id="hero-title">Lucy <span>Shah</span></h1>
          <p className="hero-intro">
            I’m a computer science and finance student interested in software, machine learning, and how 
            technology shapes the world around us. I love thinking about complex problems that require new
            ways of thinking and creative solutions.
          </p>
          <nav className="destination-links" aria-label="Explore Lucy’s website">
            <Link className="destination-link destination-resume" to="/resume">
              <span>Resume</span><span aria-hidden="true"></span>
            </Link>
            <Link className="destination-link destination-projects" to="/projects">
              <span>Projects</span><span aria-hidden="true"></span>
            </Link>
            <Link className="destination-link destination-about" to="/about">
              <span>About</span><span aria-hidden="true"></span>
            </Link>
          </nav>
        </div>

        <span className="hero-spark hero-spark-one" aria-hidden="true">✳</span>
        <span className="hero-spark hero-spark-two" aria-hidden="true">✧</span>
        <span className="hero-spark hero-spark-three" aria-hidden="true">◇</span>
        <span className="hero-spark hero-spark-four" aria-hidden="true">✦</span>
      </section>

      <section className="about-preview" id="about" aria-labelledby="about-title">
        <p className="section-label about-preview-label">LEARN MORE ABOUT ME <span aria-hidden="true">↘</span></p>
        <div className="about-preview-copy">
          <h2 id="about-title"> The person behind<br /> the screen: <em> What I do and things that drive me </em></h2>
          <p>
            I’m studying computer science and finance at Northeastern, where I do software engineering at forge, 
            embedded software at NER, and I'm VP of finance at the Northeastern debate society. I'm curious about
            the different ways data analytics and machine learning can be used to solve different sets of problems. 
            Currently I'm on search for a spring/summer (January-July) internship where I can work towards these goals. 
          </p>
          <p className="about-signoff">Things I love: books, iced coffee, board games</p>
          <Link className="section-more-link" to="/about">A little more about me <span aria-hidden="true"></span></Link>
        </div>
        <div className="about-photo-home" role="img" aria-label="personal photo for about">
          <img className="about-photo" src={aboutMeIMG} alt="Lucy" />
        </div>
        <span className="about-preview-flower" aria-hidden="true">✿</span>
      </section>

      <section className="work-preview" id="work" aria-labelledby="work-title">
        <div className="section-preview-heading">
          <div>
            <p className="section-label">THINGS I’VE BEEN MAKING</p>
            <h2 id="work-title">A few works in progress.</h2>
          </div>
          <Link className="section-more-link" to="/projects">See all projects <span aria-hidden="true"></span></Link>
        </div>
        <div className="home-project-list">
          {projects.map((project) => (
            <article className="home-project-row" key={project.slug}>
              <div className="home-project-art" aria-hidden="true">
                {project.image ? <img src={project.image} alt="" /> : <span>✿</span>}
              </div>
              <div>
                <p className="project-detail">{project.detail}</p>
                <h3>{project.title}</h3>
                <p className="home-project-description">{project.description}</p>
              </div>
              <Link to="/projects" aria-label={`Read about ${project.title}`}>↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="resume-preview" id="resume" aria-labelledby="resume-title">
        <p className="section-label resume-preview-label">THE PRACTICAL DETAILS</p>
        <div>
          <h2 id="resume-title">Resume</h2>
          <p>CS and Finance at Northeastern, SWE at forge, ML research at NUAI and more!</p>
          <Link className="section-more-link" to="/resume">Visit my resume page <span aria-hidden="true"></span></Link>
        </div>
        <span className="resume-preview-spark" aria-hidden="true">✳</span>
      </section>

      <section className="inspiration-preview" aria-labelledby="inspiration-preview-title">
        <p className="section-label">OPEN TABS IN MY BRAIN</p>
        <div className="inspiration-preview-copy">
          <h2 id="inspiration-preview-title">Things that<br /><em>I'm still thinking about</em></h2>
          <p>People, work, media, and ideas I keep coming back to.</p>
          <Link className="section-more-link" to="/inspiration">Wander through my inspiration page <span aria-hidden="true"></span></Link>
        </div>
        <span className="inspiration-preview-flower" aria-hidden="true">✿</span>
        <span className="inspiration-preview-spark" aria-hidden="true">◇</span>
      </section>

      <section className="contact-preview" id="contact" aria-labelledby="contact-title">
        <p className="section-label">SAY HELLO</p>
        <h2 id="contact-title">Want to <br />contact me?</h2>
        <p>For chats, inquiries, and more</p>
        <Link className="section-more-link" to="/contact">Find me over here <span aria-hidden="true"></span></Link>
      </section>
    </main>
  )
}

export default Home
