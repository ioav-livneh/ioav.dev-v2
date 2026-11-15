import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => (
  <nav className="Navbar">
    <Link to="/">Home</Link>
    <Link to="/projects">Projects</Link>
    <Link to="/contact">Contact</Link>
  </nav>
);

export default Navbar;
