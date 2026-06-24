import './Home.css'
import profileIMG from '../assets/profileIMG.png'; 


function Home() {
  return (
    <section className="landing">
      {/* Doodles */}
      <div className="doodle doodle-star">✦</div>
      <div className="doodle doodle-sparkle">✧</div>
      <div className="doodle doodle-heart">♡</div>
      <div className="doodle doodle-flower-text">✿</div>
      <div className="doodle doodle-cloud">☁</div>
      <div className="doodle doodle-wave">~</div>

      {/* Pressed flower illustration */}
      <div className="pressed-flower">
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="25" rx="8" ry="15" fill="#b89b7a" opacity="0.7" transform="rotate(0 40 40)"/>
          <ellipse cx="55" cy="40" rx="8" ry="15" fill="#b89b7a" opacity="0.7" transform="rotate(90 40 40)"/>
          <ellipse cx="40" cy="55" rx="8" ry="15" fill="#b89b7a" opacity="0.7" transform="rotate(180 40 40)"/>
          <ellipse cx="25" cy="40" rx="8" ry="15" fill="#b89b7a" opacity="0.7" transform="rotate(270 40 40)"/>
          <circle cx="40" cy="40" r="6" fill="#8b7355"/>
          <line x1="40" y1="55" x2="40" y2="75" stroke="#7a9b76" strokeWidth="2"/>
        </svg>
      </div>

      {/* Photo strip with projects */}
      <div className="photo-strip">
        <div className="film-perf film-perf-left"></div>
        <div className="film-perf film-perf-right"></div>
        
        <div className="film-photo">
          <span className="film-emoji">💻</span>
          <span className="film-label">Web</span>
        </div>
        <div className="film-photo">
          <span className="film-emoji">🏎️</span>
          <span className="film-label">NER</span>
        </div>
        <div className="film-photo">
          <span className="film-emoji">🎤</span>
          <span className="film-label">Debate</span>
        </div>
        <div className="film-photo">
          <span className="film-emoji">⚡</span>
          <span className="film-label">PCB</span>
        </div>
      </div>

      {/* Polaroid with green washi tape */}
      <div className="polaroid-main">
        <div className="polaroid-img">
          <img src={profileIMG} alt="A photo of me"></img>
        </div>
        <div className="polaroid-caption">me, INSERT CAPTION HERE </div>
      </div>

      {/* Green sticky note */}
      <div className="sticky-status">
        <strong>currently:</strong>
        <br />☑ open to summer '26 internships!
        <br />☑ building this site
        <br />☑ firmware @ NER
        <br />☑ IDK
      </div>

      {/* Notebook paper text box */}
      <div className="text-content">
        <h1 className="text-title">HEADER it</h1>
        <p className="text-bio">
          CS student at Northeastern who does stuff.
        </p>
        <p className="text-bio">
          I work on embedded systems for NER ANDDDDDDD.
        </p>
      </div>

      {/* Greeting tag - overlaying top left */}
      <div className="greeting-tag">
        hi, i'm lucy ~
      </div>
    </section>
  )
}

export default Home