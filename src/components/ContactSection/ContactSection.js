import React from "react";
import "./ContactSection.css";

const ContactSection = () => (
  <section id="contact" className="ContactSection section">
    <p className="eyebrow">Contact</p>
    <h2 className="ContactSection-title">Get in touch</h2>
    <p className="ContactSection-text">
      Feel free to reach out if you’re looking for a developer, have a
      question, or just want to say hi.
    </p>
    <a className="ContactSection-email" href="mailto:ioavlivneh@gmail.com">
      ioavlivneh@gmail.com
    </a>
  </section>
);

export default ContactSection;
