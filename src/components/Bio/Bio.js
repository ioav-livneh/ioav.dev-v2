import React, { useEffect, useRef } from "react";
import "./Bio.css";
import { miniTerminal } from "../../commands";

const Bio = () => {
  const perspectiveRef = useRef(null);

  // 3D tilt effect: mini-terminal follows the cursor, eases back to center on mouseout
  useEffect(() => {
    const wrapper = perspectiveRef.current;
    const card = wrapper.querySelector(".mini-terminal");
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
    <section className="Bio">
      <div className="mini-terminal-perspective" ref={perspectiveRef}>
        <div className="mini-terminal">
          <div className="screen-overlay">
            <div className="terminal-wrapper-content">
              <div className="terminal-content">
                {miniTerminal.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bio-text">
        <p>
          Hi there! I’m Ioav, and I love building things with code. My coding
          journey began by being my dad's rubber duck while he debugged,
          followed by a couple of Java and C++ bootcamps that taught me the joy
          of squashing bugs of my own.
        </p>
        <p>
          Currently, I'm building for the web full-time: an e-commerce and
          booking site for a ceramics studio, my own experiments, and a running
          catch-up with how much AI has changed the way people write and ship
          code.
        </p>
        <p>
          Previously, I've done a CS degree in New York, a summer at Ironhack
          Web Development bootcamp in Amsterdam, a few years of legacy .NET
          contracting, and a Solutions Architect role at MongoDB in Barcelona —
          where I learned to present, to listen for what a customer actually
          needs, and to explain complex things clearly.
        </p>
        <p>
          In my spare time I play chess badly, run along the Barceloneta beach,
          and read old books that make me look smart.
        </p>
      </div>
    </section>
  );
};

export default Bio;
