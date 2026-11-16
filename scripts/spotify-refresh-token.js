// One-off helper: prints the SPOTIFY_REFRESH_TOKEN that
// api/spotify-top-tracks.js needs. Run it once on your own machine.
//
// 1. In your app at https://developer.spotify.com/dashboard, open Settings
//    and add this exact Redirect URI: http://127.0.0.1:8888/callback
// 2. Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local, then run:
//    npm run spotify-token
// 3. Open the printed link, approve, and copy the token from the terminal
//    into .env.local (and into Vercel's environment variables).

const http = require("http");
const crypto = require("crypto");

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPE = "user-top-read"; // read-only access to top tracks

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
if (!clientId || !clientSecret) {
  console.error("Put SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

// Random value echoed back by Spotify, so we know the callback is ours
const state = crypto.randomBytes(16).toString("hex");

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get("code");
  if (!code || url.searchParams.get("state") !== state) {
    res.writeHead(400).end("Authorisation failed. Check the terminal.");
    console.error("Authorisation failed:", url.searchParams.get("error") ?? "state mismatch");
    server.close();
    return;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await response.json();

  if (data.refresh_token) {
    res.end("Done. You can close this tab and go back to the terminal.");
    console.log(`\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
  } else {
    res.writeHead(500).end("Token exchange failed. Check the terminal.");
    console.error("Token exchange failed:", data);
  }
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.search = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    state,
  });
  console.log(`Open this link and approve access:\n\n${authUrl}\n`);
});
