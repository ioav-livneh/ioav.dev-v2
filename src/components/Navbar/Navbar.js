import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../../images/favicon.png";

const Navbar = () => (
  <header className="Navbar">
    <a className="Navbar-logo" href="/#top" aria-label="ioav.dev home">
      {/* The link's aria-label names it, so the image itself is decorative */}
      <img
        className="Navbar-logo-img"
        src={logo}
        alt=""
        width="44"
        height="44"
      />
    </a>
    <nav className="Navbar-links" aria-label="Sections">
      <Link to="/now">Now</Link>
      <a href="/#work">Work</a>
      <a href="https://ioav.blog">Blog</a>
      <a className="Bio-resume" href="#">
        Resume
      </a>
    </nav>
  </header>
);

export default Navbar;
