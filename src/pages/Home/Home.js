import React from "react";
import Bio from "../../components/Bio/Bio";
import FeaturedProjects from "../../components/FeaturedProjects/FeaturedProjects";
import PrinciplesList from "../../components/PrinciplesList/PrinciplesList";
import ContactSection from "../../components/ContactSection/ContactSection";
import "./Home.css";

const Home = () => (
  <div className="Home">
    <Bio />
    <FeaturedProjects />
    <PrinciplesList />
    <ContactSection />
  </div>
);

export default Home;
