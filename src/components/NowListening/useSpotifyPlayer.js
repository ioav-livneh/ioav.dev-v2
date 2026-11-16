import { useCallback, useEffect, useRef, useState } from "react";

// Spotify's embed player, driven from the page through its iFrame API:
// https://developer.spotify.com/documentation/embeds/references/iframe-api
//
// Spotify no longer gives new apps 30-second preview MP3s, so the embed is
// the only way to play a track on the site. Visitors who aren't logged in to
// Spotify in their browser hear a 30-second preview; logged-in visitors hear
// the full track.
const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";

const SCRIPT_ID = "spotify-iframe-api";
const LOAD_TIMEOUT_MS = 10000;

// Spotify's script only initialises once per page and calls its ready
// callback once. The API is kept on window (not just in this module) so it
// survives this file being re-run, e.g. by the dev server's hot reload, which
// otherwise left clicks waiting for a callback that never came.
let apiPromise = null;
function loadSpotifyApi() {
  if (window.__spotifyIframeApi) return Promise.resolve(window.__spotifyIframeApi);
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = (IFrameAPI) => {
        window.__spotifyIframeApi = IFrameAPI;
        resolve(IFrameAPI);
      };
      if (!document.getElementById(SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = API_SRC;
        script.async = true;
        script.onerror = () => {
          script.remove(); // so a retry adds it afresh
          reject(new Error("Spotify player script failed"));
        };
        document.body.appendChild(script);
      }
      // Blocked by a content blocker, offline, etc.
      setTimeout(() => reject(new Error("Spotify player timed out")), LOAD_TIMEOUT_MS);
    });
    // Let a later click try again
    apiPromise.catch(() => {
      apiPromise = null;
    });
  }
  return apiPromise;
}

// Returns { slotRef, play, currentId, isPlaying, failed }. `failed` is true
// when Spotify's player couldn't load. Put slotRef on an empty
// element with no React children: the player is added inside it on the
// first play().
export function useSpotifyPlayer() {
  const slotRef = useRef(null);
  const controllerRef = useRef(null);
  const [currentId, setCurrentId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  // Start fetching the API straight away, so the first click plays promptly
  useEffect(() => {
    loadSpotifyApi().catch(() => {}); // a click retries and reports it
  }, []);

  // Clicking the playing track pauses or resumes it; any other track loads it
  const play = useCallback(
    async (trackId) => {
      const uri = `spotify:track:${trackId}`;
      const controller = controllerRef.current;

      if (controller) {
        if (trackId === currentId) {
          controller.togglePlay();
        } else {
          controller.loadUri(uri);
          controller.play();
        }
        setCurrentId(trackId);
        return;
      }

      // First play: create the player, then start it once it has loaded
      setCurrentId(trackId);
      setFailed(false);
      let IFrameAPI;
      try {
        IFrameAPI = await loadSpotifyApi();
      } catch (error) {
        console.error(error);
        setFailed(true);
        return;
      }
      if (!slotRef.current) return; // left the page while loading
      // Spotify replaces the element it's given with its iframe. Give it one
      // React doesn't know about, or React would fail removing it later.
      const target = document.createElement("div");
      slotRef.current.appendChild(target);
      IFrameAPI.createController(
        target,
        { uri, width: "100%", height: 80 },
        (newController) => {
          controllerRef.current = newController;
          newController.addListener("ready", () => newController.play());
          newController.addListener("error", (event) => {
            console.error("Spotify player error", event?.data);
          });
          newController.addListener("playback_update", (event) =>
            setIsPlaying(!event.data.isPaused),
          );
        },
      );
    },
    [currentId],
  );

  // Stop and remove the player when the page goes away
  useEffect(
    () => () => {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    },
    [],
  );

  return { slotRef, play, currentId, isPlaying, failed };
}
