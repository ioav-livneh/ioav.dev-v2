// Vercel serverless function: GET /api/spotify-top-tracks
// Returns my most played Spotify tracks of roughly the last month.
//
// Spotify needs a client secret and a refresh token, which must never reach
// the browser, so this runs on the server. Set these environment variables in
// Vercel (see .env.example; `node scripts/spotify-refresh-token.js` prints the
// refresh token):
//   SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN

const TOKEN_URL = "https://accounts.spotify.com/api/token";
// short_term is Spotify's "about the last 4 weeks" window
const TOP_TRACKS_URL =
  "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=5";

// Trades the long-lived refresh token for a short-lived access token
async function getAccessToken({ clientId, clientSecret, refreshToken }) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!response.ok)
    throw new Error(`Spotify token request: ${response.status}`);
  return (await response.json()).access_token;
}

// Keeps only what the page shows
function simplifyTrack(track) {
  const images = track.album?.images ?? [];
  return {
    id: track.id,
    name: track.name,
    artists: (track.artists ?? []).map((artist) => artist.name).join(", "),
    album: track.album?.name ?? "",
    // Images come largest first; the smallest (64px) is plenty for a list row
    image: images[images.length - 1]?.url ?? null,
    url: track.external_urls?.spotify ?? null,
    durationMs: track.duration_ms,
  };
}

module.exports = async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return res.status(500).json({ error: "not_configured" });
  }

  try {
    const accessToken = await getAccessToken({
      clientId,
      clientSecret,
      refreshToken,
    });
    const response = await fetch(TOP_TRACKS_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error(`Spotify top tracks: ${response.status}`);
    const data = await response.json();

    // Top tracks change slowly: let Vercel's CDN serve this for an hour, and
    // keep serving the old copy while it refreshes in the background
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400",
    );
    return res
      .status(200)
      .json({ tracks: (data.items ?? []).map(simplifyTrack) });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "spotify_unavailable" });
  }
};
