import { useEffect, useState } from "react";
import { formatMoment, momentBetween } from "./timelineLayout";

// Everything on the timeline that reacts to scrolling, driven by one
// measurement per frame of where the middle of the window is:
//   - the "you are here" readout counting back through time
//   - the page getting darker (and the glow smaller) the deeper you go
//   - entries fading in as they arrive, and their dots lighting up
//   - the era progress bar, and when the "back to now" button shows
//   - glyphs sliding against the page (parallax)
// Most of it is written straight to the DOM and to CSS variables rather than
// through React state, so scrolling doesn't re-render the component.

const DOT_OFFSET = 14; // px from the top of a row to the centre of its dot
const REVEAL_AT = 0.86; // entries appear once they're this far up the window

// Page background at each depth (0 = today, 1 = the Big Bang)
const BG_STOPS = [
  [0, [11, 28, 32]], // the site's usual teal (--bg)
  [0.12, [11, 28, 32]],
  [0.3, [8, 20, 38]], // deeper and bluer through human history
  [0.6, [5, 10, 24]],
  [1, [2, 3, 8]], // near-black at the beginning of time
];

const clamp01 = (n) => Math.min(1, Math.max(0, n));

function colorAt(depth) {
  let i = 1;
  while (i < BG_STOPS.length - 1 && BG_STOPS[i][0] < depth) i++;
  const [fromAt, from] = BG_STOPS[i - 1];
  const [toAt, to] = BG_STOPS[i];
  const t = clamp01((depth - fromAt) / (toAt - fromAt));
  return from.map((channel, c) => Math.round(channel + (to[c] - channel) * t));
}

// The variables set on <html> while the timeline is on screen. Layout.css and
// Timeline.css read them; they're removed when you leave the page.
const ROOT_VARS = ["--bg", "--blob-size", "--blob-opacity", "--star-opacity"];

// Returns { active, deep, era }: whether the middle of the window is inside
// the timeline, whether it's far enough down to offer a way back, and the
// index of the era it's in.
export function useTimelineScroll(sectionRef) {
  const [hud, setHud] = useState({ active: false, deep: false, era: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const root = document.documentElement;
    const track = section.querySelector(".Timeline-track");
    const rows = [...section.querySelectorAll(".Timeline-row")];
    const yearsAgo = rows.map((row) => Number(row.dataset.ago));
    const cards = [...section.querySelectorAll(".Timeline-card")];
    const gaps = [...section.querySelectorAll(".Timeline-gap")];
    const fills = [...section.querySelectorAll(".Timeline-progress-fill")];
    const readout = section.querySelector(".Timeline-readout-value");
    const theVoid = section.querySelector(".Timeline-void");
    const lastWhen = rows[rows.length - 1].querySelector(".Timeline-when").textContent;

    // From here on, entries start hidden and are revealed by scrolling
    track.classList.add("is-animated");

    // Skip DOM writes whose value hasn't changed since the last frame
    const written = new Map();
    const write = (key, value, apply) => {
      if (written.get(key) === value) return;
      written.set(key, value);
      apply(value);
    };
    const setRootVar = (name, value) =>
      write(name, value, (v) => root.style.setProperty(name, v));

    let frame = null;
    const update = () => {
      frame = null;
      const viewport = window.innerHeight;
      const middle = viewport / 2;

      // 1. Measure everything first…
      const rowTops = rows.map((row) => row.getBoundingClientRect().top + DOT_OFFSET);
      const cardTops = cards.map((card) => card.getBoundingClientRect().top);
      const gapRects = gaps.map((gap) => gap.getBoundingClientRect());
      const voidRect = theVoid.getBoundingClientRect();
      const first = rowTops[0];
      const last = rowTops[rowTops.length - 1];

      // 2. …then write.
      // How deep into time the middle of the window is (0–1), and how far
      // into the darkness after the Big Bang (0–1)
      const depth = clamp01((middle - first) / (last - first));
      const beyond = clamp01((middle - last) / (viewport * 0.9));
      const quantisedDepth = Math.round(depth * 250) / 250;
      const quantisedBeyond = Math.round(beyond * 50) / 50;

      // Background: era colour, then fading to pure black past the Big Bang
      const [r, g, b] = colorAt(quantisedDepth).map((channel) =>
        Math.round(channel * (1 - quantisedBeyond)),
      );
      setRootVar("--bg", `rgb(${r} ${g} ${b})`);
      // The glow shrinks and dims with depth, and is gone in the darkness
      setRootVar("--blob-size", (1 - 0.65 * quantisedDepth).toFixed(3));
      setRootVar(
        "--blob-opacity",
        ((0.5 - 0.42 * quantisedDepth) * (1 - quantisedBeyond)).toFixed(3),
      );
      // Stars come out from human history onwards, and thin out again at the end
      setRootVar(
        "--star-opacity",
        (clamp01((quantisedDepth - 0.15) / 0.6) * (1 - 0.85 * quantisedBeyond)).toFixed(3),
      );

      // Entries fade in as they arrive; dots light up once they pass the middle
      rows.forEach((row, i) => {
        if (rowTops[i] < viewport * REVEAL_AT) row.classList.add("is-visible");
        row.classList.toggle("is-lit", rowTops[i] <= middle);
      });
      cards.forEach((card, i) => {
        if (cardTops[i] < viewport * REVEAL_AT) card.classList.add("is-visible");
      });

      // Readout: the moment in time at the middle of the window
      let current = -1;
      while (current < rows.length - 1 && rowTops[current + 1] <= middle) current++;
      let moment = "";
      if (current === rows.length - 1) {
        // On the last entry, show its own date rather than a rounded one
        moment = beyond > 0.15 ? "Before time" : lastWhen;
      } else if (current >= 0) {
        const progress =
          (middle - rowTops[current]) / (rowTops[current + 1] - rowTops[current]);
        moment = formatMoment(
          momentBetween(yearsAgo[current], yearsAgo[current + 1], progress),
        );
      }
      write("readout", moment, (text) => {
        readout.textContent = text;
      });

      // Progress bar: how much of each era is above the middle of the window
      let era = 0;
      fills.forEach((fill, i) => {
        const start = cardTops[i];
        const end = i < cardTops.length - 1 ? cardTops[i + 1] : last;
        if (start <= middle) era = i;
        write(`fill-${i}`, clamp01((middle - start) / (end - start)).toFixed(3), (v) =>
          fill.style.setProperty("--fill", v),
        );
      });

      // Parallax: tell each gap on screen how far its centre is from the
      // middle of the window; its glyphs offset themselves from that
      gaps.forEach((gap, i) => {
        const rect = gapRects[i];
        if (rect.bottom < -200 || rect.top > viewport + 200) return;
        const offset = Math.round(middle - (rect.top + rect.height / 2));
        write(`gap-${i}`, offset, (v) => gap.style.setProperty("--gap-scroll", v));
      });

      const next = {
        active: first <= middle && voidRect.bottom > viewport * 0.25,
        deep: cardTops.length > 1 && cardTops[1] <= middle,
        era,
      };
      setHud((previous) =>
        previous.active === next.active &&
        previous.deep === next.deep &&
        previous.era === next.era
          ? previous
          : next,
      );
    };

    const requestUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      cancelAnimationFrame(frame);
      // Hand the page back as it was for the rest of the site
      ROOT_VARS.forEach((name) => root.style.removeProperty(name));
    };
  }, [sectionRef]);

  return hud;
}
