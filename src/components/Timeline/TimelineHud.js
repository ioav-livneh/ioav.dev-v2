import React from "react";

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const scrollBehavior = () => (prefersReducedMotion() ? "auto" : "smooth");

// The fixed controls that travel with you down the timeline: a readout of
// where you are in time, a progress bar of the eras (click one to jump to
// it), and a button back to the top. `hud` comes from useTimelineScroll,
// which also fills in the readout text and the progress bars directly.
const TimelineHud = ({ eras, hud, sectionRef }) => {
  const jumpToEra = (index) => {
    sectionRef.current
      .querySelectorAll(".Timeline-card")
      [index]?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
  };

  const classes = ["Timeline-hud"];
  if (hud.active) classes.push("is-active");
  if (hud.deep) classes.push("is-deep");

  return (
    <div className={classes.join(" ")}>
      {/* Decorative: screen readers get the dates from the entries themselves */}
      <p className="Timeline-readout" aria-hidden="true">
        <span className="Timeline-readout-label">You are here</span>
        <span className="Timeline-readout-value" />
      </p>
      <nav className="Timeline-progress" aria-label="Timeline eras">
        {eras.map((era, index) => (
          <button
            key={era.label}
            type="button"
            className={`Timeline-progress-era${index === hud.era ? " is-current" : ""}`}
            onClick={() => jumpToEra(index)}
            aria-label={`Jump to ${era.label}`}
            aria-current={index === hud.era ? "true" : undefined}
            // Out of the tab order while the bar is hidden
            tabIndex={hud.active ? 0 : -1}
          >
            <span className="Timeline-progress-bar" aria-hidden="true">
              <span className="Timeline-progress-fill" />
            </span>
            <span className="Timeline-progress-name" aria-hidden="true">
              {era.label}
            </span>
          </button>
        ))}
      </nav>
      <button
        type="button"
        className="Timeline-top"
        onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
        tabIndex={hud.active && hud.deep ? 0 : -1}
      >
        ↑ Back to now
      </button>
    </div>
  );
};

export default TimelineHud;
