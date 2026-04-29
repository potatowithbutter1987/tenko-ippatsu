"use client";

import { useEffect } from "react";

const VIEWPORT_BREAKPOINT = 370;
const NARROW_VIEWPORT = `width=${VIEWPORT_BREAKPOINT}`;
const RESPONSIVE_VIEWPORT = "width=device-width,initial-scale=1";

const resolveViewport = (outerWidth: number): string =>
  outerWidth > VIEWPORT_BREAKPOINT ? RESPONSIVE_VIEWPORT : NARROW_VIEWPORT;

export const ViewportSwitcher = () => {
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;

    const sync = () => {
      const next = resolveViewport(window.outerWidth);
      if (meta.getAttribute("content") !== next) {
        meta.setAttribute("content", next);
      }
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return null;
};
