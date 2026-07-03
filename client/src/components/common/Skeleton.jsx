import React from "react";

/**
 * Skeleton loader to avoid layout shift and improve perceived performance.
 * CSS-only; no extra libraries.
 */
export const SkeletonLine = ({ className = "", width = "100%" }) => (
  <div
    className={`h-4 rounded bg-gray-200 animate-pulse ${className}`}
    style={{ width }}
    aria-hidden="true"
  />
);

export const SkeletonCard = () => (
  <div
    className="rounded-card border border-gray-100 bg-white p-4 space-y-3"
    aria-hidden="true"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      <SkeletonLine width="60%" />
    </div>
    <SkeletonLine width="100%" />
    <SkeletonLine width="80%" />
    <div className="flex gap-2 pt-1">
      <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
    </div>
  </div>
);

/** Grid of skeleton cards for list/carousel loading */
export const SkeletonCardGrid = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/** Stat-card shaped skeleton (icon circle + number + label) */
export const SkeletonStatCard = () => (
  <div
    className="bg-white rounded-card-lg p-4 shadow-card border border-gray-100"
    aria-hidden="true"
  >
    <div className="flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
      <SkeletonLine width="40%" className="h-5" />
      <SkeletonLine width="60%" className="h-3" />
    </div>
  </div>
);

/** Grid of stat-card skeletons matching the dashboard stats layout */
export const SkeletonStatGrid = ({ count = 5 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonStatCard key={i} />
    ))}
  </div>
);

/** White section shell with a title placeholder and a card grid inside */
export const SkeletonSection = ({ count = 3 }) => (
  <section
    className="bg-white rounded-card-lg p-6 shadow-card border border-gray-100"
    aria-hidden="true"
  >
    <div className="h-7 w-48 rounded bg-gray-200 animate-pulse mb-6" />
    <SkeletonCardGrid count={count} />
  </section>
);

/** Result-card shaped skeleton grid matching the search results layout */
export const SkeletonResultGrid = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-card border border-gray-100 bg-white p-5 space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="70%" />
            <SkeletonLine width="40%" className="h-3" />
          </div>
        </div>
        <SkeletonLine width="100%" />
        <SkeletonLine width="85%" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-9 w-28 rounded-button bg-gray-200 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

/** Review-card shaped skeleton grid matching the my-reviews list layout */
export const SkeletonReviewList = ({ count = 4 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-card-lg shadow-card p-5 border border-gray-100 space-y-3"
      >
        <div className="flex gap-2">
          <div className="h-6 w-24 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-6 w-16 rounded-full bg-gray-200 animate-pulse" />
        </div>
        <SkeletonLine width="60%" className="h-5" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, s) => (
            <div key={s} className="w-4 h-4 rounded bg-gray-200 animate-pulse" />
          ))}
        </div>
        <SkeletonLine width="100%" />
        <SkeletonLine width="90%" />
        <SkeletonLine width="35%" className="h-3" />
      </div>
    ))}
  </div>
);

/** Form-shaped skeleton (labels + inputs + submit) for profile-style cards */
export const SkeletonForm = ({ rows = 4 }) => (
  <div
    className="bg-white rounded-card-lg shadow-card border border-gray-100 p-6 space-y-5"
    aria-hidden="true"
  >
    <SkeletonLine width="40%" className="h-6" />
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonLine width="25%" className="h-3" />
        <div className="h-12 w-full rounded-card bg-gray-200 animate-pulse" />
      </div>
    ))}
    <div className="h-12 w-full rounded-button bg-gray-200 animate-pulse" />
  </div>
);

export default SkeletonLine;
