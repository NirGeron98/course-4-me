import React from "react";

// PageHero — shared full-bleed page header for the "my X" list pages
// (tracked courses/lecturers, my reviews, my contact requests). Solid
// neutral background so no single page "owns" a color; pass `action`
// for pages that need an inline button (e.g. add course/lecturer).
const PageHero = ({ icon: Icon, title, subtitle, badge, action }) => {
  const ActionIcon = action?.icon;

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 text-white py-8 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden" aria-hidden="true">
        <div className="absolute top-4 right-12 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-12 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-right gap-3">
          {Icon && (
            <div className="p-4 bg-white/15 backdrop-blur-sm rounded-full border border-white/20" aria-hidden="true">
              <Icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base md:text-lg text-slate-300 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {badge && (
            <div className="inline-flex items-center bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 text-sm">
              <span className="font-semibold">{badge}</span>
            </div>
          )}
        </div>

        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="shrink-0 bg-white text-slate-800 hover:text-slate-900 py-2.5 px-5 rounded-card font-semibold transition-all duration-ui shadow-card hover:shadow-card-hover flex items-center gap-2 group text-sm hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-slate-800"
          >
            {ActionIcon && (
              <ActionIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-ui" aria-hidden="true" />
            )}
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHero;
