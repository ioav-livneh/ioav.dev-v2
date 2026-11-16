import React, { useEffect, useRef, useState } from "react";
import { terminalLogo } from "./terminalLogo";
import { typeOut } from "../../utils/typeOut";

// Set once the type-out has finished, so it only plays on the first page load
// and not every time you navigate back to the home page.
let hasTypedOut = false;

const BOOT_PAUSE_MS = 1000; // blank screen before the scanlines flicker on
const FLICKER_MS = 700; // length of the flicker (matches scanlines-flicker in Bio.css)
const TYPE_DELAY_MS = 300; // gap between the flicker ending and the logo typing out

// Stacked slices that fill the monitor case's rounded corners between its
// front and back. More slices = smoother curve. Keep in sync with --slices
// in Bio.css.
// Resting angle (in turns) the monitor sits at before any pointer movement:
// turned slightly to the left and tipped slightly down. The pointer tilt is
// added on top of this. Negative Y faces left, negative X faces down.
const BASE_TILT_Y = -0.04;
const BASE_TILT_X = 0.005;

const MONITOR_CORNER_SLICES = Array.from({ length: 16 }, (_, i) => i + 1);

// The 3D monitor: screen with the ASCII logo, case, and stand. Tilts towards
// the pointer and plays a boot sequence on first load.
const MiniTerminal = () => {
  const perspectiveRef = useRef(null);
  const bodyRef = useRef(null);
  const terminalContentRef = useRef(null);

  // Boot sequence on first load: a short pause with a blank screen, then the
  // scanlines flicker on, then the ASCII logo types out.
  // "booting" → "flicker" → "typing"; "done" when it has already played.
  const [bootPhase, setBootPhase] = useState(hasTypedOut ? "done" : "booting");

  useEffect(() => {
    if (hasTypedOut) return;
    let finish = null;
    let typeTimer;

    const pauseTimer = setTimeout(() => {
      setBootPhase("flicker");

      typeTimer = setTimeout(() => {
        // typeOut empties the text before the next paint, so revealing the
        // (now blank) text in the same tick doesn't flash the logo
        finish = typeOut(
          [terminalContentRef.current],
          (typing) => {
            if (!typing) hasTypedOut = true;
          },
          // Don't scroll the page to follow the output; take ~1.2s in total
          { followOutput: false, maxDuration: 1200 },
        );
        setBootPhase("typing");
      }, FLICKER_MS + TYPE_DELAY_MS);
    }, BOOT_PAUSE_MS);

    // Restores the full text if the component unmounts mid-sequence. It doesn't
    // mark the animation as played, so React's dev-mode double mount still shows it.
    return () => {
      clearTimeout(pauseTimer);
      clearTimeout(typeTimer);
      finish?.(false);
    };
  }, []);

  // 3D tilt effect: mini-terminal follows the cursor from its resting angle,
  // and eases back to that angle on mouseout
  useEffect(() => {
    const wrapper = perspectiveRef.current;
    const card = bodyRef.current;
    const tiltMultiplier = 0.1;

    let bounds = wrapper.getBoundingClientRect();
    let targetX = bounds.width / 2;
    let targetY = bounds.height / 2;
    let currentX = targetX;
    let currentY = targetY;
    let frameId;

    const applyTilt = (rotateY, rotateX) => {
      card.style.transform = `rotateY(${BASE_TILT_Y + rotateY}turn) rotateX(${BASE_TILT_X + rotateX}turn)`;
    };

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

      applyTilt(rotateY, rotateX);

      frameId = requestAnimationFrame(updateTilt);
    };

    // Start at the resting angle straight away, before the first frame
    applyTilt(0, 0);
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
    <div className="mini-terminal-perspective" ref={perspectiveRef}>
      {/* Tilts as one piece: the screen, the monitor case around and
          behind it, and its stand */}
      <div className="mini-terminal-body" ref={bodyRef}>
        <div className="monitor" aria-hidden="true">
          <div className="monitor-face monitor-front" />
          <div className="monitor-face monitor-back" />
          <div className="monitor-face monitor-left" />
          <div className="monitor-face monitor-right" />
          <div className="monitor-face monitor-top" />
          <div className="monitor-face monitor-bottom" />
          <div className="monitor-corners">
            {MONITOR_CORNER_SLICES.map((i) => (
              <div key={i} style={{ "--i": i }} />
            ))}
          </div>
        </div>
        <div className="monitor-stand" aria-hidden="true">
          <div className="monitor-neck" />
          <div className="monitor-base" />
        </div>
        <div className={`mini-terminal is-${bootPhase}`}>
          <div className="screen-overlay">
            <div className="terminal-wrapper-content">
              <div className="terminal-content" ref={terminalContentRef}>
                {terminalLogo.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniTerminal;
