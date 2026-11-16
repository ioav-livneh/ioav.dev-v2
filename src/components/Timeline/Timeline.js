import React, { useRef } from "react";
import { eras, EGG_URL } from "../../pages/Now/nowData";
import { buildTimeline } from "./timelineLayout";
import { useTimelineScroll } from "./useTimelineScroll";
import TimelineHud from "./TimelineHud";
import "./Timeline.css";

// Worked out once: the data never changes while the page is open
const timeline = buildTimeline(eras);
const lastEra = timeline[timeline.length - 1];
const lastItem = lastEra.items[lastEra.items.length - 1];

// The stretch of time after an entry. Its height grows with the time that
// passed. Purely visual, so it's hidden from screen readers.
const TimelineGap = ({ gap }) => (
  <div
    className="Timeline-gap"
    style={{ height: `${gap.height}px` }}
    aria-hidden="true"
  >
    {gap.glyphs.map((glyph, index) => (
      <span
        key={index}
        className={`Timeline-glyph${glyph.tinted ? " is-tinted" : ""}`}
        style={glyph.style}
      >
        {glyph.symbol}
      </span>
    ))}
    {/* Sticks to the middle of the window while you scroll through the gap */}
    <p className="Timeline-gap-label">↓ {gap.label}</p>
  </div>
);

// A very long scroll back through time: jobs, childhood, computing, human
// history, life on Earth, the Big Bang… and an egg alone in the dark below it.
// The scroll-driven effects live in useTimelineScroll.
const Timeline = () => {
  const sectionRef = useRef(null);
  const hud = useTimelineScroll(sectionRef);

  return (
    <section
      className="Timeline section"
      aria-labelledby="timeline-title"
      ref={sectionRef}
    >
      {/* Fixed star field that fades in the deeper you scroll */}
      <div className="Timeline-stars" aria-hidden="true" />
      <div className="section-heading">
        <h2 className="section-title" id="timeline-title">
          How I got here
        </h2>
        <p className="Timeline-hint">Keep scrolling. It goes back a while.</p>
      </div>
      <div className="Timeline-track">
        {timeline.map((era, eraIndex) => (
          <div className="Timeline-era" key={era.label}>
            {/* Chapter heading */}
            <div className="Timeline-card">
              <span className="Timeline-card-number" aria-hidden="true">
                {String(eraIndex + 1).padStart(2, "0")}
              </span>
              <div className="Timeline-card-text">
                <h3 className="Timeline-card-title">{era.label}</h3>
                <p className="Timeline-card-subtitle">{era.subtitle}</p>
              </div>
            </div>
            <ol className="Timeline-items">
              {era.items.map((item) => {
                const isBang = item === lastItem;
                return (
                  <li key={item.when}>
                    <div
                      className={`Timeline-row${isBang ? " is-bang" : ""}`}
                      data-ago={item.yearsAgo}
                    >
                      {/* The burst of light the line ends in */}
                      {isBang && (
                        <span className="Timeline-bang" aria-hidden="true" />
                      )}
                      <span className="Timeline-when">{item.when}</span>
                      <span className="Timeline-what">
                        {item.what}
                        {item.detail && (
                          <span className="Timeline-detail">{item.detail}</span>
                        )}
                      </span>
                    </div>
                    {item.gap && <TimelineGap gap={item.gap} />}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
      {/* Past the beginning of time: nothing but darkness and the egg */}
      <div className="Timeline-void">
        <a className="Timeline-egg" href={EGG_URL} aria-label="The Egg">
          <span className="Timeline-egg-shape" aria-hidden="true" />
          <span className="Timeline-egg-label" aria-hidden="true">
            The Egg
          </span>
        </a>
      </div>
      <TimelineHud eras={timeline} hud={hud} sectionRef={sectionRef} />
    </section>
  );
};

export default Timeline;
