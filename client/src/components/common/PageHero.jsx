import React from "react";

// PageHero — shared, compact page header used across the app's "my X" and
// detail pages (tracked courses/lecturers, my reviews, my contact requests,
// search, profile, course/lecturer pages, admin). Icon sits beside the
// title/subtitle block (not above it) and the whole group is centered as
// one unit; pass `action` for pages that need an inline button (e.g. add
// course/lecturer), `aside` for arbitrary non-button content on the
// opposite side (e.g. a date widget), and `children` for extra content
// below the title block (e.g. a type toggle).
//
// `color` picks the background gradient: "neutral" (default, generic pages
// that aren't course/lecturer specific — reviews, contact requests,
// dashboard, profile, admin), "course" (emerald, matches accent.course /
// CourseHeader), "lecturer" (purple, matches accent.lecturer /
// LecturerHeader), or "search" (blue, matches the search page's existing
// blue accents).
const COLOR_GRADIENTS = {
  neutral: "from-slate-600 via-slate-700 to-slate-800",
  course: "from-emerald-600 via-emerald-700 to-teal-800",
  lecturer: "from-purple-600 via-purple-700 to-purple-800",
  search: "from-blue-600 via-blue-700 to-blue-800",
};

const ACTION_TEXT_COLORS = {
  neutral: "text-slate-700 hover:text-slate-800 focus-visible:ring-offset-slate-700",
  course: "text-emerald-700 hover:text-emerald-800 focus-visible:ring-offset-emerald-700",
  lecturer: "text-purple-700 hover:text-purple-800 focus-visible:ring-offset-purple-700",
  search: "text-blue-700 hover:text-blue-800 focus-visible:ring-offset-blue-700",
};

const PageHero = ({ icon: Icon, title, subtitle, badge, action, aside, children, color = "neutral", className = "" }) => {
  const ActionIcon = action?.icon;
  const hasSideContent = Boolean(action || aside);
  const gradient = COLOR_GRADIENTS[color] || COLOR_GRADIENTS.neutral;
  const actionTextColor = ACTION_TEXT_COLORS[color] || ACTION_TEXT_COLORS.neutral;

  return (
    <div
      className={`relative bg-gradient-to-br ${gradient} text-white py-5 sm:py-6 px-6 overflow-hidden ${className}`.trim()}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden" aria-hidden="true">
        <div className="absolute top-2 right-12 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-2 left-12 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div
        className={`relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-4 ${
          hasSideContent ? "sm:justify-between" : "sm:justify-center"
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {Icon && (
            <div className="shrink-0 p-2.5 sm:p-3 bg-white/15 backdrop-blur-sm rounded-full border border-white/20" aria-hidden="true">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          )}
          <div className="text-center sm:text-right">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
            {badge && (
              <div className="mt-2 inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20 text-xs sm:text-sm">
                <span className="font-semibold">{badge}</span>
              </div>
            )}
          </div>
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`shrink-0 bg-white py-2 px-4 rounded-card font-semibold transition-all duration-ui shadow-card hover:shadow-card-hover flex items-center gap-2 group text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white ${actionTextColor}`}
          >
            {ActionIcon && (
              <ActionIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-ui" aria-hidden="true" />
            )}
            {action.label}
          </button>
        )}

        {aside && <div className="shrink-0 hidden md:block">{aside}</div>}
      </div>

      {children && (
        <div className="relative z-10 max-w-5xl mx-auto mt-4">{children}</div>
      )}
    </div>
  );
};

export default PageHero;
