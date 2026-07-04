import React from "react";

// PageLayout — shared page shell: full-height gradient background, RTL root,
// and a centered responsive content column. Codifies the pattern every page
// used to hand-roll independently (see UI_REFINEMENTS.md).
// Props:
//  - accent: "emerald" | "purple" | "indigo" — picks the background gradient.
//  - width: max-width utility for the content column (default "max-w-6xl").
//  - header: optional element rendered full-bleed above the padded column
//    (e.g. a sticky/gradient hero that should span edge-to-edge).
//  - className: extra utility classes appended to the inner content column.
const ACCENT_GRADIENTS = {
  emerald: "from-emerald-50 via-white to-blue-50",
  purple: "from-purple-50 via-white to-indigo-50",
  indigo: "from-indigo-50 via-white to-blue-50",
};

const PageLayout = ({
  accent = "emerald",
  width = "max-w-6xl",
  header = null,
  className = "",
  children,
}) => {
  const gradientClass = ACCENT_GRADIENTS[accent] || ACCENT_GRADIENTS.emerald;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientClass}`}
      dir="rtl"
    >
      {header}
      <div
        className={`${width} mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 ${className}`.trim()}
      >
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
