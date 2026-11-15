import React, { useEffect, useRef, useState } from "react";
import "./Bio.css";
import { miniTerminal } from "../../commands";
import { typeOut } from "../../utils/typeOut";

// Set once the type-out has finished, so it only plays on the first page load
// and not every time you navigate back to the home page.
let hasTypedOut = false;

const BOOT_PAUSE_MS = 1000; // blank screen before the logo starts typing
const FLICKER_DELAY_MS = 400; // gap between the logo finishing and the scanlines flickering on

// Stacked copies of the frame, each a little further back, that read as a solid
// edge when the terminal tilts. More slices = smoother edge. Keep in sync with
// --term-slices in Bio.css.
const EDGE_SLICES = Array.from({ length: 12 }, (_, i) => i + 1);

const Bio = () => {
  const perspectiveRef = useRef(null);
  const terminalContentRef = useRef(null);

  // Boot sequence on first load: a short pause with a blank screen, then the
  // ASCII logo types out, then the scanlines flicker on.
  // "booting" → "typing" → "flicker"; "done" when it has already played.
  const [bootPhase, setBootPhase] = useState(hasTypedOut ? "done" : "booting");

  useEffect(() => {
    if (hasTypedOut) return;
    let finish = null;
    let flickerTimer;

    const pauseTimer = setTimeout(() => {
      // typeOut empties the text before the next paint, so revealing the
      // (now blank) text in the same tick doesn't flash the logo
      finish = typeOut(
        [terminalContentRef.current],
        (typing) => {
          if (typing) return;
          hasTypedOut = true;
          flickerTimer = setTimeout(
            () => setBootPhase("flicker"),
            FLICKER_DELAY_MS,
          );
        },
        // Don't scroll the page to follow the output; take ~1.2s in total
        { followOutput: false, maxDuration: 1200 },
      );
      setBootPhase("typing");
    }, BOOT_PAUSE_MS);

    // Restores the full text if the component unmounts mid-sequence. It doesn't
    // mark the animation as played, so React's dev-mode double mount still shows it.
    return () => {
      clearTimeout(pauseTimer);
      clearTimeout(flickerTimer);
      finish?.(false);
    };
  }, []);

  // 3D tilt effect: mini-terminal follows the cursor, eases back to center on mouseout
  useEffect(() => {
    const wrapper = perspectiveRef.current;
    const card = wrapper.querySelector(".mini-terminal-body");
    const tiltMultiplier = 0.1;

    let bounds = wrapper.getBoundingClientRect();
    let targetX = bounds.width / 2;
    let targetY = bounds.height / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frameId;

    const handleMouseMove = (e) => {
      bounds = wrapper.getBoundingClientRect();
      targetX = e.clientX - bounds.left;
      targetY = e.clientY - bounds.top;
    };

    const handleMouseOut = () => {
      targetX = bounds.width / 2;
      targetY = bounds.height / 2;
    };

    const updateTilt = () => {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const rotateY = (currentX / bounds.width - 0.5) * tiltMultiplier;
      const rotateX = -(currentY / bounds.height - 0.5) * tiltMultiplier;

      card.style.transform = `rotateY(${rotateY}turn) rotateX(${rotateX}turn)`;

      frameId = requestAnimationFrame(updateTilt);
    };

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseout", handleMouseOut);
    frameId = requestAnimationFrame(updateTilt);

    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseout", handleMouseOut);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section id="top" className="Bio">
      <div className="Bio-top">
        <div className="Bio-heading">
          <p className="Bio-kicker">
            Ioav Livneh · Developer &amp; writer · Valencia
          </p>
          <h1 className="Bio-title">
            I build things for the web, and write about what it's doing to us.
          </h1>
        </div>
        <div className="Bio-terminal">
          <div className="Bio-v1">
            <a
              className="Bio-v1-link"
              href="https://v1.ioav.dev"
              aria-label="Visit the previous version of ioav.dev"
            >
              ← Visit v1
            </a>
          </div>
          <div className="mini-terminal-perspective" ref={perspectiveRef}>
            {/* Tilts as one piece: the edge slices behind give the screen depth */}
            <div className="mini-terminal-body">
              <div className="mini-terminal-edge" aria-hidden="true">
                {EDGE_SLICES.map((i) => (
                  <div key={i} style={{ "--i": i }} />
                ))}
              </div>
              <div className={`mini-terminal is-${bootPhase}`}>
                <div className="screen-overlay">
                  <div className="terminal-wrapper-content">
                    <div className="terminal-content" ref={terminalContentRef}>
                      {miniTerminal.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            Solutions Architect at MongoDB in Barcelona, where I learned to
            present, to listen for what people actually need, and to explain
            complex things clearly.
          </p>
          <p>
            When I’m not at a screen, I’m training for a half marathon, filling
            a sketchbook with drawings, or touching grass in Turia park.
          </p>
        </div>
        <aside className="Bio-elsewhere" aria-label="Find me elsewhere">
          <p className="Bio-elsewhere-label">Elsewhere</p>
          <div className="Bio-elsewhere-links">
            <a href="https://ioav.blog">Blog →</a>
            <a href="https://github.com/ioav-livneh">GitHub →</a>
            <a href="https://www.linkedin.com/in/ioav/">LinkedIn →</a>
            <a href="mailto:ioavlivneh@gmail.com">Email →</a>
          </div>
          <a className="Bio-resume" href="#">
            View full résumé
          </a>
        </aside>
      </div>
    </section>
  );
};

export default Bio;
