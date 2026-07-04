import { useEffect, useState } from "react";

// Matches the Tailwind breakpoints used by the dashboard carousel grids
// (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4) so the JS-driven
// carousel window always shows exactly as many cards as the CSS grid can fit.
const BREAKPOINTS = [
  { query: "(min-width: 1280px)", count: 4 },
  { query: "(min-width: 1024px)", count: 3 },
  { query: "(min-width: 640px)", count: 2 },
];

function computeCount() {
  if (typeof window === "undefined") return 3;
  for (const bp of BREAKPOINTS) {
    if (window.matchMedia(bp.query).matches) return bp.count;
  }
  return 1;
}

export default function useResponsiveVisibleCount() {
  const [count, setCount] = useState(computeCount);

  useEffect(() => {
    const mqls = BREAKPOINTS.map((bp) => window.matchMedia(bp.query));
    const handler = () => setCount(computeCount());
    mqls.forEach((mql) => mql.addEventListener("change", handler));
    handler();
    return () => {
      mqls.forEach((mql) => mql.removeEventListener("change", handler));
    };
  }, []);

  return count;
}
