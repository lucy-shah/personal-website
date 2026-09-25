import aboutMeIMG from "../assets/aboutMeIMG.png";

function About() {
  return (
    <main className="content-page about-page">
      <section className="page-intro about-intro" aria-labelledby="about-page-title">
        <p className="section-label">A LITTLE ABOUT ME</p>
        <h1 id="about-page-title">Part problem solver,<br />part <em>“wait, that’s interesting.”</em></h1>
        <p>I like learning by making, following a question, and finding the human side of how things work.</p>
        <span className="page-spark" aria-hidden="true">✧</span>
      </section>

      <section className="about-story" aria-label="A little more about Lucy">
        <div className="about-story-copy">
          <p>
            I’m studying computer science at Northeastern, where I get to explore
            the place software meets the physical world. Lately that means firmware
            with Northeastern Electric Racing; the rest of the time, it means
            following a question until it turns into something worth making.
          </p>
          <p>
            I also like keeping a little archive of the people, images, and ideas
            that stick with me. This site is where those parts of my life get to
            sit next to the things I build.
          </p>
          <span className="about-signoff">learning by making</span>
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
