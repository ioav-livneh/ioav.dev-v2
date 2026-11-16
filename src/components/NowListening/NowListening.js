import React from "react";
import { useApi } from "../../utils/useApi";
import { useSpotifyPlayer } from "./useSpotifyPlayer";

// 215000 → "3:35"
const formatDuration = (ms) => {
  const totalSeconds = Math.round(ms / 1000);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${Math.floor(totalSeconds / 60)}:${seconds}`;
};

// Column 3: my top Spotify tracks of the last month (via /api/spotify-top-tracks).
// Clicking a track plays it in a Spotify player above the list.
const NowListening = () => {
  const { status, data } = useApi("/api/spotify-top-tracks");
  const { slotRef, play, currentId, isPlaying, failed } = useSpotifyPlayer();
  const tracks = data?.tracks ?? [];
  const currentTrack = tracks.find((track) => track.id === currentId);

  return (
    <section className="Now-column" aria-labelledby="now-listening">
      <h2 className="Now-column-title" id="now-listening">
        Listening
      </h2>
      <p className="Now-subtitle">Top tracks, last 4 weeks</p>
      {status === "loading" && <p className="Now-note">Loading…</p>}
      {status === "error" && (
        <p className="Now-note">Couldn’t reach Spotify right now.</p>
      )}
      {status === "ready" && tracks.length === 0 && (
        <p className="Now-note">Nothing on repeat lately.</p>
      )}
      {/* The Spotify player is added inside the inner div on the first play.
          The wrapper stays collapsed until then. */}
      {failed && currentTrack && (
        <p className="Now-note">
          Couldn’t load Spotify’s player.{" "}
          <a href={currentTrack.url}>Listen on Spotify instead</a>.
        </p>
      )}
      <div className={`Now-player${currentId && !failed ? " is-open" : ""}`}>
        <div ref={slotRef} />
      </div>
      {tracks.length > 0 && (
        <ol className="Now-tracks">
          {tracks.map((track) => {
            const isCurrent = track.id === currentId;
            const playing = isCurrent && isPlaying;
            return (
              <li key={track.id}>
                <button
                  type="button"
                  className={`Now-track${isCurrent ? " is-current" : ""}`}
                  onClick={() => play(track.id)}
                  aria-pressed={playing}
                  aria-label={`${playing ? "Pause" : "Play"} ${track.name} by ${track.artists}`}
                >
                  <span className="Now-track-art-wrap">
                    {track.image ? (
                      <img
                        className="Now-track-art"
                        src={track.image}
                        alt=""
                        loading="lazy"
                      />
                    ) : (
                      <span className="Now-track-art" />
                    )}
                    <span className="Now-track-icon" aria-hidden="true">
                      {playing ? "❚❚" : "▶"}
                    </span>
                  </span>
                  <span className="Now-track-text">
                    <span className="Now-item-title">{track.name}</span>
                    <span className="Now-item-meta">
                      {track.artists}
                      {track.album && ` · ${track.album}`}
                    </span>
                  </span>
                  <span className="Now-track-time">
                    {formatDuration(track.durationMs)}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
      <p className="Now-source">Pulled live from the <a href="https://developer.spotify.com/documentation/web-api">Spotify API</a>.</p>
    </section>
  );
};

export default NowListening;
