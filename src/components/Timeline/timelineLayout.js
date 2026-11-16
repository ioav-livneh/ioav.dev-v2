// Turns the eras in nowData.js into what the timeline draws: every entry plus
// the gap that follows it (how tall, what it says, what drifts through it),
// and formats moments in time for the scroll readout.

const THIS_YEAR = new Date().getFullYear();

// Gap height in px for a stretch of `years`. Logarithmic, because the page
// covers 2 years and 10 billion years alike: 2 years ≈ 250px, a century ≈
// 350px, 60,000 years ≈ 900px, 2 billion years ≈ 2,700px.
const GAP_BASE = 240;
const GAP_GROWTH = 28;
const gapHeight = (years) =>
  Math.round(GAP_BASE + GAP_GROWTH * Math.log10(1 + years) ** 2);

const GLYPH_SPACING = 70; // roughly one drifting glyph per this many px
const CLUSTER_SIZE = 320; // px height of a cluster of glyphs

const yearsAgoOf = (item) => item.yearsAgo ?? THIS_YEAR - item.year;

// 2 significant figures: 7974 → 8000, 1.175e9 → 1.2e9
const round2 = (n) => Number(n.toPrecision(2));

// A length of time: "3 years", "58,000 years", "1.2 billion years"
export function formatSpan(years) {
  if (years < 1000) return `${years} ${years === 1 ? "year" : "years"}`;
  if (years < 1e6) return `${round2(years).toLocaleString("en-US")} years`;
  if (years < 1e9) return `${round2(years / 1e6)} million years`;
  return `${round2(years / 1e9)} billion years`;
}

const roundTo = (n, step) => Math.round(n / step) * step;

// A point in time for the "you are here" readout, rounded so it doesn't look
// more exact than it is: "1987", "1540", "30 AD", "3800 BC",
// "40 million years ago"
export function formatMoment(yearsAgo) {
  if (yearsAgo >= 10000) return `${formatSpan(yearsAgo)} ago`;
  const year = THIS_YEAR - yearsAgo;
  if (yearsAgo < 300) return `${Math.round(year)}`;
  if (year >= 1000) return `${roundTo(year, 10)}`;
  if (year >= 1) return `${Math.max(roundTo(year, 10), 10)} AD`;
  const bc = 1 - year;
  return `${Math.max(roundTo(bc, bc >= 1000 ? 100 : 50), 50)} BC`;
}

// The moment part-way (0–1) between two entries. Short hops count evenly;
// long ones are interpolated on a log scale, to match the gap heights.
export function momentBetween(fromAgo, toAgo, progress) {
  const from = Math.max(fromAgo, 1);
  if (toAgo / from < 10) return fromAgo + (toAgo - fromAgo) * progress;
  return 10 ** (Math.log10(from) + (Math.log10(toAgo) - Math.log10(from)) * progress);
}

// Small seeded random generator, so the glyphs land in the same places on
// every render instead of jumping around
function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Symbols scattered through a gap. They gather in loose clusters with empty
// space between, and each has its own size, opacity, drift and parallax
// (how much it slides against the page as you scroll).
function buildGlyphs(symbols, height, seed) {
  const random = seededRandom(seed);
  const count = Math.max(2, Math.round(height / GLYPH_SPACING));
  const clusters = Array.from(
    { length: Math.max(1, Math.round(count / 6)) },
    () => ({ x: 10 + random() * 80, y: 6 + random() * 88 }),
  );
  // Clusters are about CLUSTER_SIZE px tall whatever the gap's height
  const spreadY = Math.min(60, (CLUSTER_SIZE / height) * 100);
  const clamp = (n) => Math.min(98, Math.max(1, n));

  return Array.from({ length: count }, () => {
    const cluster = clusters[Math.floor(random() * clusters.length)];
    const size = 11 + random() * 9;
    return {
      symbol: symbols[Math.floor(random() * symbols.length)],
      style: {
        left: `${clamp(cluster.x + (random() - 0.5) * 34).toFixed(1)}%`,
        top: `${clamp(cluster.y + (random() - 0.5) * spreadY).toFixed(1)}%`,
        fontSize: `${size.toFixed(0)}px`,
        "--glyph-opacity": (0.14 + random() * 0.3).toFixed(2),
        "--glyph-drift": `${(8 + random() * 16).toFixed(0)}px`,
        // Bigger glyphs feel closer, so they slide further
        "--parallax": (((size - 10) / 10) * (random() < 0.5 ? -0.14 : 0.14)).toFixed(3),
        animationDuration: `${(7 + random() * 9).toFixed(1)}s`,
        animationDelay: `${(-random() * 12).toFixed(1)}s`,
      },
      // About one in four takes the accent colour
      tinted: random() < 0.25,
    };
  });
}

// → [{ label, subtitle, items: [{ ...item, yearsAgo, gap }] }]
// gap is { height, label, glyphs }, or null after the very last entry.
export function buildTimeline(eras) {
  const all = eras.flatMap((era) => era.items);
  let index = 0;

  return eras.map((era) => ({
    label: era.label,
    subtitle: era.subtitle,
    items: era.items.map((item) => {
      const next = all[index + 1];
      const yearsAgo = yearsAgoOf(item);
      let gap = null;
      if (next) {
        const years = yearsAgoOf(next) - yearsAgo;
        const height = gapHeight(years);
        gap = {
          height,
          label: `${formatSpan(years)} earlier`,
          glyphs: buildGlyphs(era.glyphs, height, index + 1),
        };
      }
      index += 1;
      return { ...item, yearsAgo, gap };
    }),
  }));
}
