import React from "react";
import "./Navbar.css";

const Navbar = () => (
  <header className="Navbar">
    <a className="Navbar-logo" href="/#top" aria-label="ioav.dev home">
      <span className="Navbar-logo-name">ioav</span>
      <span className="Navbar-logo-tld">.dev</span>
    </a>
    <nav className="Navbar-links" aria-label="Sections">
      <a href="/#work">Work</a>
      <a href="/#ideas">Ideas</a>
      <a href="https://ioav.blog">Blog</a>
      <a href="/#contact">Contact</a>
    </nav>
  </header>
);

export default Navbar;
