import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, X, Star } from 'lucide-react';

// TrackedEntityCard — shared shell for the tracked-courses / tracked-lecturers
// grid cards. Renders as a real react-router <Link> so navigation is
// client-side and keyboard accessible (the old cards were clickable <div>s
// doing window.location.href). Inner interactive elements (the remove button)
// stop propagation AND prevent default so they never trigger navigation.
// Props:
//  - to: router destination
//  - accent: "course" | "lecturer" — picks the token family
//  - icon: lucide icon component for the header puck
//  - title: entity display name
//  - meta: node rendered under the title (chips, lecturer/department lines)
//  - onRemove: called with no args when the remove button is clicked
//  - removeLabel: aria-label / title for the remove button
//  - footerNote: small trailing text (e.g. institution name)
//  - children: card body (rating block, description, etc.)
const ACCENTS = {
  course: {
    border: 'border-emerald-100',
    puck: 'bg-gradient-to-br from-brand to-brand-strong',
    view: 'text-brand hover:text-brand-strong',
    ring: 'focus-visible:ring-brand',
  },
  lecturer: {
    border: 'border-purple-100',
    puck: 'bg-gradient-to-br from-accent-lecturer to-accent-lecturer-strong',
    view: 'text-accent-lecturer hover:text-accent-lecturer-strong',
    ring: 'focus-visible:ring-accent-lecturer',
  },
};

const TrackedEntityCard = ({
  to,
  accent = 'course',
  icon: Icon,
  title,
  meta,
  onRemove,
  removeLabel,
  footerNote,
  children,
}) => {
  const tokens = ACCENTS[accent] || ACCENTS.course;

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
    <Link
      to={to}
      className={`block bg-white rounded-card-lg shadow-card p-6 hover:shadow-card-hover transition-all duration-ui transform hover:-translate-y-1 border ${tokens.border} focus:outline-none focus-visible:ring-2 ${tokens.ring}`}
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`${tokens.puck} rounded-full p-3 shadow-card shrink-0`} aria-hidden="true">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{title}</h3>
          {meta}
        </div>

        <button
          type="button"
          onClick={handleRemove}
          className="text-slate-400 hover:text-danger p-1 rounded-full hover:bg-danger-soft transition-colors duration-ui focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
          title={removeLabel}
          aria-label={removeLabel}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {children}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`${tokens.view} font-medium text-sm flex items-center gap-2 transition-colors duration-ui`}>
          <Eye className="w-4 h-4" aria-hidden="true" />
          צפה בפרטים
        </span>
        {footerNote && <span className="text-xs text-muted">{footerNote}</span>}
      </div>
    </Link>
  );
};

// Shared 5-star row for tracked cards. Visually decorative — callers should
// pair it with visible numeric text or an sr-only alternative.
export const TrackedCardStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && <Star className="w-4 h-4 fill-yellow-200 text-yellow-400" />}
      {Array.from({ length: Math.max(0, emptyStars) }).map((_, i) => (
        <Star key={`e-${i}`} className="w-4 h-4 text-slate-300" />
      ))}
    </div>
  );
};

export default TrackedEntityCard;
