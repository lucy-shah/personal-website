function Contact() {
  return (
    <main className="content-page contact-page">
      <section className="page-intro contact-intro" aria-labelledby="contact-page-title">
        <p className="section-label">A NOTE IS ALWAYS WELCOME</p>
        <h1 id="contact-page-title">Let’s talk<br /><em>about it.</em></h1>
        <p>For conversations, questions, and interesting things to figure out together.</p>
        <span className="page-spark" aria-hidden="true">✧</span>
      </section>

      <section className="contact-details" aria-label="Contact information to add">
        <p className="contact-details-intro">This page is ready for the ways you’d like people to reach you.</p>
        <div className="contact-detail-row">
          <h2>Email</h2>
          <p>Add the email address you want to share.</p>
          <span aria-hidden="true">✳</span>
        </div>
        <div className="contact-detail-row">
          <h2>Elsewhere</h2>
          <p>Add any professional or creative profiles you’d like to include.</p>
          <span aria-hidden="true">◇</span>
        </div>
      </section>
    </main>
  )
}

export default Contact
