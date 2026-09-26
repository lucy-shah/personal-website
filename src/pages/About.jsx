import aboutMeIMG from "../assets/aboutMeIMG.png";

function About() {
  return (
    <main className="content-page about-page">
      <section className="page-intro about-intro" aria-labelledby="about-page-title">
        <p className="section-label">A GLIMPSE INTO MY WORLD </p>
        <h1 id="about-page-title">More about me <br /> <em></em></h1>
        <p>I like learning by making, following a question, and finding the human side of how things work.</p>
        <span className="page-spark" aria-hidden="true">✧</span>
      </section>

      <section className="about-story" aria-label="A little more about Lucy">
        <div className="about-story-copy">
          <p>
            I’m a second year studying computer science and business administrsation with a concentration in finance at Northeastern University.
            Recently, I've gotten involved in Forge, which is product development community where build and deploy a product throughout the entire product lifecycle. 
            Within computer science, I am interested in data analytics and the different ways data can be used an mnanipulated to
            solve problems. I've also been finding myself very interested in UI/UX design, because I think websites and app Ui's have
            gotten so generic, and I miss when sites felt unique and visually interesting, while still being intutive and easy to use. 
            As a result of this, I've been thinking a lot more about abuot how to integrate more creativity and design into the projects I create.
            
          </p>
          <p>
          Around Boston, you can usually find me trying out new coffee shops and bookstores. I grew up in southern california, so I'm
          always looking for places to go outside for a beach day or a hike. I also love baking and cooking, which means I spend a lot of time in the kitchen trying
          out new recipes. 
          </p>
          <span className="about-signoff"> — Lucy</span>
        </div>
        <div className="about-photo" role="img" aria-label="Personal photo for about me">
          <img className="about-photo" src={aboutMeIMG} alt="Lucy" />
        </div>
        <span className="about-flower" aria-hidden="true">✿</span>
      </section>
    </main>
  )
}

export default About
