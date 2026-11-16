import React, { useEffect, useRef, useState } from "react";
import "./Bio.css";
import MiniTerminal from "./MiniTerminal";
import PowerCable from "./PowerCable";
import V1Button from "./V1Button";

const V1_SHOW_DELAY_MS = 500; // hover this long before the "Visit v1" button appears
const V1_HIDE_DELAY_MS = 600; // it stays this long after the pointer leaves

const Bio = () => {
  const elsewhereRef = useRef(null);

  // "Visit v1" button: appears only after the pointer has rested on the
  // terminal for a moment, and lingers briefly after it leaves. While it
  // lingers it stays clickable, so you can move across to it.
  const [v1Visible, setV1Visible] = useState(false);
  const v1TimerRef = useRef(null);
  const scheduleV1 = (visible, delay) => {
    clearTimeout(v1TimerRef.current);
    v1TimerRef.current = setTimeout(() => setV1Visible(visible), delay);
  };
  useEffect(() => () => clearTimeout(v1TimerRef.current), []);

  return (
    <section id="top" className="Bio">
      <div className="Bio-top">
        <div className="Bio-heading">
          <h1 className="Bio-title">
            I <a href="https://ioav.video">build</a> things for the web and{" "}
            <a href="https://ioav.blog">write</a> about what it's doing to us.
          </h1>
        </div>
        <div
          className="Bio-terminal"
          onMouseEnter={() => scheduleV1(true, V1_SHOW_DELAY_MS)}
          onMouseLeave={() => scheduleV1(false, V1_HIDE_DELAY_MS)}
        >
          <V1Button visible={v1Visible} />
          <PowerCable endRef={elsewhereRef} />
          <MiniTerminal />
        </div>
      </div>
      <div className="Bio-body">
        <div className="bio-text">
          <p>
            Hi there! I’m Ioav. These days, building mostly means directing AI
            agents and editing their work, and I’ve got a long list of sites,
            apps and extensions I want to make.
          </p>
          <p>
            I’m just as curious about what all this is doing to us, so I write
            about how technology shapes the way we think, want and pay
            attention, and how to stay grounded anyway, on{" "}
            <a className="bio-text-strong" href="https://ioav.blog">
              my blog
            </a>
            .
          </p>
          <p>
            Before this, I studied computer science in New York and worked as a
            Solutions Architect at <strong className="Bio-mongodb">MongoDB</strong>{" "}
            in Barcelona, where I learned to
            present, to listen for what people actually need, and to explain
            complex things clearly.
          </p>
          <p>
            When I’m not at a screen, I’m training for a half marathon, filling
            a sketchbook with drawings, or touching grass in Turia park.
          </p>
        </div>
        <aside
          className="Bio-elsewhere"
          aria-label="Find me elsewhere"
          ref={elsewhereRef}
        >
          <div className="Bio-id">
            <h2 className="Bio-name">Ioav Livneh</h2>
            <p className="Bio-role">Developer &amp; writer</p>
            <p className="Bio-location">📍 Based in Valencia, Spain</p>
          </div>
          <p className="Bio-elsewhere-label">Elsewhere</p>
          <div className="Bio-elsewhere-links">
            <a href="https://ioav.blog">Blog →</a>
            <a href="https://github.com/ioav-livneh">GitHub →</a>
            <a href="https://www.linkedin.com/in/ioav/">LinkedIn →</a>
            <a href="mailto:ioavlivneh@gmail.com">Email →</a>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Bio;
