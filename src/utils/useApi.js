import { useEffect, useState } from "react";

// Fetches JSON from one of the site's /api functions.
// Returns { status: "loading" | "ready" | "error", data }.
export function useApi(url) {
  const [state, setState] = useState({ status: "loading", data: null });

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((response) => {
        // Under `npm start` there is no /api, and the dev server answers with
        // the HTML page instead: treat anything that isn't JSON as a failure
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");
        if (!response.ok || !isJson) throw new Error(`${url}: ${response.status}`);
        return response.json();
      })
      .then((data) => setState({ status: "ready", data }))
      .catch((error) => {
        if (error.name === "AbortError") return; // component went away
        setState({ status: "error", data: null });
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
