import React from 'react';
import { Star, User, Pencil, Trash2 } from 'lucide-react';

// ReviewCard — shared card for course and lecturer reviews. The two review
// sections pass their entity-specific bits (context chip, ratings grid,
// accent) and this card owns the layout, stars, badges, and action buttons.
// Props:
//  - review: the review object (used for name/date/anonymous fields)
//  - contextLabel: chip text next to the reviewer (lecturer name / course title)
//  - overallRating: number 0-5 shown as stars + "x.x/5.0"
//  - ratings: [{ label, value, textClass }] for the per-criterion grid
//  - accent: "course" (emerald) | "lecturer" (purple)
//  - canEdit / canDelete + onEdit / onDelete: action visibility and handlers
//  - deleteTitle: tooltip/aria-label for the delete button
const ACCENTS = {
  course: {
    edit: 'text-brand hover:text-brand-strong',
    quote: 'bg-brand-tint border-brand-soft',
    quoteMark: 'text-emerald-300',
  },
  lecturer: {
    edit: 'text-accent-lecturer hover:text-accent-lecturer-strong',
    quote: 'bg-accent-lecturer-tint border-accent-lecturer-soft',
    quoteMark: 'text-purple-300',
  },
};

const getDisplayName = (review) => {
  if (review.isAnonymous === true) return 'משתמש אנונימי';
  return review.user?.fullName || 'משתמש אנונימי';
};

// Stars are decorative; the numeric rating next to them is the accessible
// value, backed by an sr-only sentence.
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />
      )}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
        <Star key={`empty-${i}`} className="w-4 h-4 text-slate-300" />
      ))}
    </span>
  );
};

const ReviewCard = ({
  review,
  contextLabel,
  overallRating = 0,
  ratings = [],
  accent = 'course',
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  deleteTitle = 'מחק ביקורת',
}) => {
  const accentClasses = ACCENTS[accent] || ACCENTS.course;
  const numericRating = Number(overallRating) || 0;

  return (
    <div className="border border-slate-200 rounded-card p-5 hover:shadow-card transition-shadow duration-ui">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-semibold text-slate-800 flex items-center gap-2">
              {getDisplayName(review)}
              {review.isAnonymous && (
                <span className="text-xs bg-accent-info-soft text-accent-info px-2 py-1 rounded-full">
                  אנונימי
                </span>
              )}
            </span>
            {contextLabel && (
              <span className="text-sm text-muted bg-slate-100 px-2 py-1 rounded-button flex items-center gap-1">
                <User className="w-3 h-3" aria-hidden="true" />
                {contextLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Stars rating={numericRating} />
            <span className="text-sm font-medium text-slate-700">
              {numericRating.toFixed(1)}/5.0
              <span className="sr-only">{`דירוג כולל ${numericRating.toFixed(1)} מתוך 5`}</span>
            </span>
            <span className="text-xs text-muted">
              {new Date(review.createdAt).toLocaleDateString('he-IL')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {canEdit && (
            <button
              onClick={onEdit}
              className={`${accentClasses.edit} rounded-button p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand`}
              title="ערוך ביקורת"
              aria-label="ערוך ביקורת"
            >
              <Pencil className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={onDelete}
              className="text-danger hover:text-danger-strong rounded-button p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
              title={deleteTitle}
              aria-label={deleteTitle}
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {ratings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {ratings.map(({ label, value, textClass }) => (
            <div key={label} className="text-center">
              <div className="text-sm font-medium text-slate-700">{label}</div>
              <div
                className={`text-sm ${textClass} font-bold`}
                aria-label={`${label}: ${value} מתוך 5`}
              >
                {value}/5
              </div>
            </div>
          ))}
        </div>
      )}

      {review.comment && (
        <div className={`relative mt-3 border rounded-card p-5 ${accentClasses.quote}`}>
          <span className={`absolute top-2 right-4 ${accentClasses.quoteMark} text-3xl leading-none select-none font-serif`} aria-hidden="true">"</span>
          <p className="text-slate-800 text-base leading-relaxed font-medium italic">
            {review.comment}
          </p>
          <span className={`absolute bottom-2 left-4 ${accentClasses.quoteMark} text-3xl leading-none select-none font-serif`} aria-hidden="true">"</span>
        </div>
      )}
    </div>
  );
};

export { getDisplayName };
export default ReviewCard;
