import React from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";

// PageLayout — shared page shell: full-height gradient background, RTL root,
// and a centered responsive content column. Codifies the pattern every page
// used to hand-roll independently (see UI_REFINEMENTS.md).
// Props:
//  - accent: "emerald" | "purple" | "indigo" | "amber" — picks the background gradient.
//  - width: max-width utility for the content column (default "max-w-6xl").
//  - header: optional element rendered full-bleed above the padded column
//    (e.g. a sticky/gradient hero that should span edge-to-edge).
//  - title / subtitle: optional page heading rendered at the top of the
//    content column (skip when the page supplies its own hero via `header`).
//  - className: extra utility classes appended to the inner content column.
// The content column renders as <main> so every page gets a landmark.
const ACCENT_GRADIENTS = {
  emerald: "from-emerald-50 via-white to-blue-50",
  purple: "from-purple-50 via-white to-indigo-50",
  indigo: "from-indigo-50 via-white to-blue-50",
  amber: "from-amber-50 via-white to-orange-50",
};

const PageLayout = ({
  accent = "emerald",
  width = "max-w-6xl",
  header = null,
  title = null,
  subtitle = null,
  className = "",
  children,
}) => {
  const gradientClass = ACCENT_GRADIENTS[accent] || ACCENT_GRADIENTS.emerald;
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass}`}
      dir="rtl"
    >
      {header}
      <LazyMotion features={domAnimation}>
        <m.main
          className={`${width} mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 ${className}`.trim()}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {title && (
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1.5 text-sm sm:text-base text-muted">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </m.main>
      </LazyMotion>
    </div>
  );
};

export default PageLayout;
