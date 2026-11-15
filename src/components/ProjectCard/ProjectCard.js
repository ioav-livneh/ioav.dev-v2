import React from "react";
import "./ProjectCard.css";

const ProjectCard = ({ title, description, stack = [], href = "#", imageLabel }) => (
  <article className="ProjectCard">
    <div
      className="ProjectCard-image"
      role="img"
      aria-label={`Placeholder for a ${title} screenshot`}
    >
      {imageLabel}
    </div>
    <div className="ProjectCard-body">
      <h3 className="ProjectCard-title">{title}</h3>
      <p className="ProjectCard-description">{description}</p>
      <ul className="ProjectCard-stack" aria-label="Built with">
        {stack.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a className="ProjectCard-link" href={href}>
        Read how I built it →
      </a>
    </div>
  </article>
);

export default ProjectCard;
