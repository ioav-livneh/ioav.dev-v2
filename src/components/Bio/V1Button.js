import React, { useState } from "react";
import PowerIcon from "./PowerIcon";

// Set once the button has grown out of the monitor, so that entrance only
// plays the first time (per page load); after that it just fades in.
let hasEmerged = false;

// Round power button beside the terminal that links to the previous site.
// `visible` is driven by the hover delay in Bio.js; keyboard focus shows it
// regardless (see .Bio-terminal:focus-within in Bio.css).
const V1Button = ({ visible }) => {
  const [firstReveal, setFirstReveal] = useState(!hasEmerged);

  const classes = ["Bio-v1"];
  if (visible) classes.push("is-visible");
  if (firstReveal) classes.push("is-first");

  return (
    <div
      className={classes.join(" ")}
      onAnimationEnd={(e) => {
        if (!e.animationName.startsWith("v1-")) return;
        hasEmerged = true;
        setFirstReveal(false);
      }}
    >
      <a
        className="Bio-v1-link"
        href="https://v1.ioav.dev"
        aria-label="Visit the previous version of ioav.dev"
        title="Visit v1"
      >
        <PowerIcon className="Bio-v1-icon" />
      </a>
    </div>
  );
};

export default V1Button;
