"use client";

import { useEffect, useState } from "react";

/** lg breakpoint — mobil/tablette video yüklenmez */
const DESKTOP_VIDEO_QUERY = "(min-width: 1024px)";

export function useDesktopVideo() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_VIDEO_QUERY);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return enabled;
}
