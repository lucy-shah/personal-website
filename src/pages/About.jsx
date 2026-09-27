import aboutMeIMG from '../assets/aboutMeIMG.png'

function About() {
  return (
    <main className="content-page about-page">
      <section className="page-intro about-intro" aria-labelledby="about-page-title">
        <p className="section-label">A GLIMPSE INTO MY WORLD</p>
        <h1 id="about-page-title">More about me</h1>
        <span className="page-spark" aria-hidden="true">✧</span>
      </section>

      <section className="about-story" aria-label="A little more about Lucy">
        <div className="about-story-copy">
          <p>
            I’m a second-year student studying computer science and business administration, with a concentration in finance, at Northeastern University. Recently, I’ve gotten involved in Forge, a product development community where we build and deploy a product throughout its entire life cycle. Within computer science, I’m interested in data analytics and the different ways data can be used and manipulated to solve problems. I’ve also found myself becoming more interested in UI/UX design. Websites and apps have gotten so generic, and I miss when sites felt unique and visually interesting while still being intuitive and easy to use. Because of that, I’ve been thinking more about how to bring creativity and design into the projects I create.
          </p>
          <p>
            Around Boston, you can usually find me trying out new coffee shops and bookstores. I grew up in Southern California, so I’m always looking for places to go outside for a beach day or a hike. I also love baking and cooking, which means I spend a lot of time in the kitchen trying out new recipes.
          </p>
          <span className="about-signoff">— Lucy</span>
        </div>
        <figure className="about-photo-frame">
          <img className="about-photo" src={aboutMeIMG} alt="Lucy smiling in front of a colorful garden trellis" />
        </figure>
        <span className="about-flower" aria-hidden="true">✿</span>
      </section>
    </main>
  )
}

export default About
