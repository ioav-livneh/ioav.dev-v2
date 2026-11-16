// Content for the Now page. Edit freely: nothing else needs to change.

// TODO(ioav): draft goals based on the home page bio. Replace with your own.
export const goals = {
  quarter: [
    "Launch ioav.dev v2",
    "Ship one small site, app or extension from the list",
    "Publish regularly on ioav.blog",
  ],
  longTerm: [
    "Run a half marathon",
    "Make a living from things I build and write",
    "Fill a sketchbook from cover to cover",
  ],
};

// The timeline, newest first. Each era is one group.
// `when` is the text shown. `year` (negative for BC) or `yearsAgo` is the
// number behind it: the page uses it to size the gap after each entry, so
// longer stretches of time take longer to scroll through.
// `subtitle` is the line under each era's chapter heading.
// `glyphs` are the small symbols that drift in the gaps of that era.
export const eras = [
  {
    label: "Experience",
    subtitle: "The last few years, one job at a time.",
    glyphs: ["</>", "{ }", "=>", ";", "git", "npm"],
    items: [
      { when: "2026", year: 2026, what: "Freelance Web Developer" },
      { when: "2024", year: 2024, what: "Solution Architect at MongoDB" },
      { when: "2022", year: 2022, what: "Software Engineer at Itlize" },
      {
        when: "2021",
        year: 2021,
        what: "Graduated from NYIT with a B.S. in Computer Science",
      },
      {
        when: "2018",
        year: 2018,
        what: "Academic Tutor at New York Institute of Technology",
      },
    ],
  },
  {
    label: "Before that",
    subtitle: "Growing up between Israel and Costa Rica.",
    glyphs: ["A", "B", "C", "+", "=", "?"],
    items: [
      { when: "2017", year: 2017, what: "Graduated high school in Costa Rica" },
      { when: "2015", year: 2015, what: "First steps in C++" },
      { when: "2013", year: 2013, what: "First steps in Java" },
      { when: "2003", year: 2003, what: "Moved to Costa Rica" },
      { when: "1999", year: 1999, what: "Born in Israel" },
    ],
  },
  {
    label: "Computing",
    subtitle: "The people who made my job possible.",
    glyphs: ["0", "1"],
    items: [
      { when: "1995", year: 1995, what: "Brendan Eich invents JavaScript" },
      { when: "1983", year: 1983, what: "Internet is born" },
      { when: "1945", year: 1945, what: "Von Neumann designs computer architecture" },
      { when: "1936", year: 1936, what: "Alan Turing invents the Turing machine" },
      { when: "1843", year: 1843, what: "Ada Lovelace invents the first algorithm" },
    ],
  },
  {
    label: "Human history",
    subtitle: "From here on, we count in centuries.",
    glyphs: ["⚙", "☼", "△", "⌂", "✎"],
    items: [
      { when: "1760 AD – 1840 AD", year: 1760, what: "Industrial Revolution" },
      { when: "1543 AD – 1687 AD", year: 1543, what: "Scientific Revolution" },
      { when: "2000 BC – 620 AD", year: -2000, what: "Major world religions founded" },
      { when: "12,000 years ago", yearsAgo: 12_000, what: "Agricultural Revolution" },
      { when: "70,000 years ago", yearsAgo: 70_000, what: "Cognitive Revolution" },
    ],
  },
  {
    label: "Life on Earth",
    subtitle: "From here on, we count in millions of years.",
    glyphs: ["◦", "○", "∿", "❋", "⁘"],
    items: [
      {
        when: "7 million years ago",
        yearsAgo: 7e6,
        what: "Humans diverged from chimps, our closest living biological relatives",
      },
      { when: "85 million years ago", yearsAgo: 85e6, what: "Primates diverged from mammals" },
      { when: "325 million years ago", yearsAgo: 325e6, what: "Mammals diverged from reptiles" },
      {
        when: "1.5 billion years ago",
        yearsAgo: 1.5e9,
        what: "Animals diverged from plants and fungi",
      },
      {
        when: "3.9 billion years ago",
        yearsAgo: 3.9e9,
        what: "The first life.",
        detail:
          "Everything alive today — every person, animal, and blade of grass — descends from a single common ancestor.",
      },
    ],
  },
  {
    label: "The beginning of time",
    subtitle: "As far back as it goes.",
    glyphs: ["✦", "·", "⋆", "∗"],
    items: [{ when: "13.8 billion years ago", yearsAgo: 13.8e9, what: "The Big Bang" }],
  },
];

// Where the egg at the very bottom leads: Andy Weir's "The Egg"
export const EGG_URL = "https://www.youtube.com/watch?v=h6fcK_fRYaI";
