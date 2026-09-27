function Contact() {
  return (
    <main className="content-page contact-page">
      <section className="page-intro contact-intro" aria-labelledby="contact-page-title">
        <p className="section-label">A NOTE IS ALWAYS WELCOME</p>
        <h1 id="contact-page-title">Contact me</h1>
        <p>I’d love to hear from you and I’m always up for a coffee chat or a call!</p>
        <span className="page-spark" aria-hidden="true">✧</span>
      </section>

      <section className="contact-details" aria-label="Ways to get in touch">
        <ul className="contact-orb-list">
          <li>
            <a className="contact-orb contact-orb-pink contact-orb-email" href="mailto:shah.lu@northeastern.edu">
              <span className="contact-orb-label">EMAIL</span>
              <strong>shah.lu@northeastern.edu</strong>
              <span className="contact-orb-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a className="contact-orb contact-orb-blue" href="https://www.linkedin.com/in/lucy-shah" target="_blank" rel="noreferrer">
              <span className="contact-orb-label">LINKEDIN</span>
              <strong>lucy-shah</strong>
              <span className="contact-orb-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a className="contact-orb contact-orb-lilac" href="https://github.com/lucy-shah" target="_blank" rel="noreferrer">
              <span className="contact-orb-label">GITHUB</span>
              <strong>lucy-shah</strong>
              <span className="contact-orb-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a className="contact-orb contact-orb-gold" href="tel:+18057957086">
              <span className="contact-orb-label">PHONE</span>
              <strong>(805) 795-7086</strong>
              <span className="contact-orb-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a className="contact-orb contact-orb-pink" href={`${import.meta.env.BASE_URL}Lucy-Shah-Resume.pdf?v=2`} download>
              <span className="contact-orb-label">RESUME</span>
              <strong>A little more about my work</strong>
              <span className="contact-orb-arrow" aria-hidden="true">↓</span>
            </a>
          </li>
        </ul>
      </section>
    </main>
  )
}

export default Contact
