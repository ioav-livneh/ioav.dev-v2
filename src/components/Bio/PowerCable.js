import React, { useLayoutEffect, useRef } from "react";
import CablePlug from "./CablePlug";

// Cable length limits (px) and the plug's drawn height (matches .Bio-cable-plug)
const CABLE_MIN = 120;
const CABLE_MAX = 560;
const CABLE_PLUG_HEIGHT = 36;

// The winding path, in a 0–100 box that stretches to the measured length
const CABLE_PATH =
  "M 25 0 C 25 18, 88 20, 82 36 S 28 52, 42 66 S 90 76, 78 90 L 78 100";

// Unplugged power cable. It doesn't tilt with the monitor: its top end hides
// behind the case, so it reads as coming out the back. `endRef` is the
// element the plug should end level with (the "Elsewhere" links).
const PowerCable = ({ endRef }) => {
  const cableRef = useRef(null);

  // Size the cable so its plug ends level with the bottom of `endRef`,
  // re-measuring whenever the layout changes (resize, fonts loading).
  useLayoutEffect(() => {
    const cable = cableRef.current;
    const section = cable.closest(".Bio");

    const measure = () => {
      // The "Elsewhere" links come after this component in the page, so on the
      // first render their ref isn't attached yet when this effect runs. Read
      // it lazily and skip until it exists.
      const end = endRef.current;
      if (!end) return;
      const length =
        end.getBoundingClientRect().bottom -
        cable.getBoundingClientRect().top -
        CABLE_PLUG_HEIGHT;
      cable.style.setProperty(
        "--cable-length",
        `${Math.min(Math.max(length, CABLE_MIN), CABLE_MAX)}px`,
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(section);
    // Runs once React has finished attaching every ref, but still before the
    // browser paints, so the cable never shows at the wrong length
    let active = true;
    queueMicrotask(() => active && measure());
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [endRef]);

  return (
    <div className="Bio-cable" ref={cableRef} aria-hidden="true">
      <svg
        className="Bio-cable-wire"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path d={CABLE_PATH} />
        <path className="cable-sheen" d={CABLE_PATH} />
      </svg>
      <CablePlug />
    </div>
  );
};

export default PowerCable;
