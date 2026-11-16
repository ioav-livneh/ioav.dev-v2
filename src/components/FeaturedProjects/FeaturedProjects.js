import React from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import "./FeaturedProjects.css";

const projects = [
  {
    title: "Liv Ceramic",
    imageLabel: "[LIV CERAMIC SCREENSHOT]",
    description:
      "The online shop and booking site for my family’s ceramics studio, where people buy pieces and book workshops and private events.",
    stack: ["Next.js", "Supabase", "Stripe", "Resend"],
    href: "#",
  },
  {
    title: "1010!",
    imageLabel: "[1010! SCREENSHOT]",
    description:
      "[ONE OR TWO SENTENCES: WHAT IT IS, WHO IT’S FOR, AND WHAT YOU LEARNED BUILDING IT]",
    stack: ["[STACK]"],
    href: "#",
  },
];

const FeaturedProjects = () => (
  <section id="work" className="FeaturedProjects section">
    <div className="section-heading">
      <h2 className="section-title">What I’ve been working on</h2>
    </div>

    {projects.map((project) => (
      <ProjectCard key={project.title} {...project} />
    ))}

    <div className="FeaturedProjects-next">
      <p className="FeaturedProjects-next-label">Up next</p>
      <p className="FeaturedProjects-next-text">
        <strong>Syntopicon</strong>, a digital commonplace book inspired by
        Mortimer Adler.
      </p>
    </div>
  </section>
);

export default FeaturedProjects;
