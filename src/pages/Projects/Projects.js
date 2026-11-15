import React from "react";
import ProjectsGrid from "../../components/ProjectsGrid/ProjectsGrid";
import FeaturedProject from "../../components/FeaturedProjects/FeaturedProjects";
import "./Projects.css";

const Projects = () => (
  <div className="Projects">
    <ProjectsGrid />
    <FeaturedProject />
  </div>
);

export default Projects;
