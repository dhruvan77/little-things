"use client";
import { useEffect, useState } from "react";

/** True once the welcome intro has started opening (or immediately if it isn't playing). */
export function useIntroReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!window.__ltsPreloading) { // eslint-disable-next-line react-hooks/set-state-in-effect -- sync with external intro state
      setReady(true); return;
    }
    const on = () => setReady(true);
    window.addEventListener("lts-ready", on, { once: true });
    return () => window.removeEventListener("lts-ready", on);
  }, []);
  return ready;
}
