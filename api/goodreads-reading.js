// Vercel serverless function: GET /api/goodreads-reading
// Returns the books on my Goodreads "currently-reading" shelf.
//
// Goodreads shut down its public API in 2020 and its shelf RSS feeds now
// return 404, so this reads the "Currently Reading" box on my public profile
// page instead. If Goodreads changes that page's markup, this returns an empty
// list rather than failing. The browser can't fetch Goodreads directly (it
// doesn't allow cross-site requests), which is why this runs on the server.
// Set GOODREADS_USER_ID in Vercel: the number in your profile URL,
// goodreads.com/user/show/<number>-your-name. The profile must be public.

const profileUrl = (userId) =>
  `https://www.goodreads.com/user/show/${encodeURIComponent(userId)}`;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'" };
const decode = (text) =>
  text
    .replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, name) => ENTITIES[name])
    .replace(/\s+/g, " ")
    .trim();

// Covers come as ..._SX98_.jpg (98px wide); ask for a sharper one
const largerCover = (src) => src.replace(/\._S[XY]\d+_\./, "._SX200_.");

// Pulls the books out of the profile's "Currently Reading" box
function parseProfile(html) {
  const start = html.indexOf('id="currentlyReadingReviews"');
  if (start === -1) return [];
  // The box ends where the next box on the profile begins
  const end = html.indexOf("clearFloats bigBox", start);
  const box = html.slice(start, end === -1 ? undefined : end);

  return box
    .split('<div class="Updates')
    .slice(1)
    .map((update) => {
      const link = update.match(/<a class="bookTitle" href="([^"]+)">([\s\S]*?)<\/a>/);
      if (!link) return null;
      const author = update.match(/<a class="authorName"[^>]*>([\s\S]*?)<\/a>/);
      const cover = update.match(/<img[^>]*src="([^"]+)"/);
      return {
        id: link[1].match(/\d+/)?.[0] ?? link[1],
        title: decode(link[2]),
        author: author ? decode(author[1]) : "",
        image: cover ? largerCover(cover[1]) : null,
        url: `https://www.goodreads.com${link[1]}`,
      };
    })
    .filter(Boolean);
}

module.exports = async function handler(req, res) {
  const userId = process.env.GOODREADS_USER_ID;
  if (!userId) return res.status(500).json({ error: "not_configured" });

  try {
    const response = await fetch(profileUrl(userId), {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; personal-site)" },
    });
    if (!response.ok) throw new Error(`Goodreads profile: ${response.status}`);

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400",
    );
    return res.status(200).json({ books: parseProfile(await response.text()) });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "goodreads_unavailable" });
  }
};

module.exports.parseProfile = parseProfile;
