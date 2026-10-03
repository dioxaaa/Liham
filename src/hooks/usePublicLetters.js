import { useCallback, useEffect, useState } from "react";

import { fetchPublicLetters } from "../lib/letters.js";

/**
 * Loads the public wall. Three explicit states: loading, ready, unavailable.
 * Bump `refreshKey` to refetch after a letter is published.
 */
export function usePublicLetters(refreshKey = 0) {
  const [letters, setLetters] = useState([]);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await fetchPublicLetters();
      setLetters(result);
      setStatus("ready");
    } catch (error) {
      console.error(error);
      setLetters([]);
      setStatus("unavailable");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { letters, status, reload: load };
}